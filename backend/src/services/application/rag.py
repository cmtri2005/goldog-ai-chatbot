from dotenv import load_dotenv
from src.services.rest_api import RestAPIGenService
from src.infra.vector_stores.chroma_client import ChromaClientService
from src.schema.retrieval import SearchArgs
from src.constants.llm_factory import LLMFactory
from src.config.config import config
from src.utils.logger import LoggerConfig
from src.services.chat_history.summarize import SummarizeChatService
from src.services.chat_history.chat_history import get_session_history
from langchain.tools import StructuredTool

logger = LoggerConfig(__name__).get()

load_dotenv()


class RagPipeline:
    def __init__(self):
        MODEL_NAME = config.GROQ_MODEL
        API_KEY = config.GROQ_API_KEY
        self.llm = LLMFactory.create_llm(
            llm_provider=LLMFactory.Provider.GROQ,
            config=LLMFactory.Config(model_name=MODEL_NAME, api_key=API_KEY),
        )
        self.chroma_client = ChromaClientService()

        # Search tool
        self.search_tool = StructuredTool.from_function(
            name="search_docs",
            description=(
                "Retrieve documents from Chroma. \n"
                "Args:\n"
                "    query (str): the query.\n"
                "    top_k (int): the number of documents to retrieve.\n"
                "    with_score (bool): whether to include similarity scores.\n"
                "    metadata_filter (dict): filter by metadata.\n"
            ),
            func=self.chroma_client.retrieve_vector,
            args_schema=SearchArgs,
        )

        # Enable tool calling with GROQ
        self.tools = {"search_docs": self.search_tool}
        self.llm_with_tools = self.llm.bind_tools(list(self.tools.values()))

        self.rest_generator_service = RestAPIGenService(
            llm_with_tools=self.llm_with_tools,
            tools=self.tools,
        )
        self.summarize_chat_service = SummarizeChatService()

    def get_chat_history(self, session_id: str | None = None) -> list[dict]:
        """
        Return chat history as a list of {role, content} dicts.

        The underlying `get_session_history` returns a LangChain ChatMessageHistory,
        but `RestAPIGenService` expects a plain list of dicts.
        """
        if not session_id:
            return []

        history = get_session_history(session_id)

        messages: list[dict] = []
        for msg in getattr(history, "messages", []):
            # LangChain BaseMessage typically has `.type` and `.content`
            role = getattr(msg, "type", None) or getattr(msg, "role", "")
            content = getattr(msg, "content", "")
            messages.append({"role": role, "content": content})

        return messages

    async def get_response(
        self,
        question: str,
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        # get_chat_history is synchronous; do NOT await it
        chat_history = self.get_chat_history(session_id)
        response = await self.rest_generator_service.generate_rest_api(
            question=question,
            chat_history=chat_history,
            session_id=session_id,
            user_id=user_id,
        )
        logger.info(f"RAG Response: {response}")
        return response


rag_service = RagPipeline()
