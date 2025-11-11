from dotenv import load_dotenv
from src.services.rest_api import RestAPIGenService
from src.infra.vector_stores.chroma_client import ChromaClientService
from src.schema.retrieval import SearchArgs
from src.constants.llm_factory import LLMFactory
from src.config.config import config
from langchain.tools import StructuredTool


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

    def get_chat_history(self, session_id: str | None = None) -> list[dict]:
        return []

    async def get_response(
        self,
        question: str,
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        chat_history = self.get_chat_history(session_id)
        output = await self.rest_generator_service.generate_rest_api(
            question=question,
            chat_history=chat_history,
            session_id=session_id,
            user_id=user_id,
        )
        return output


rag_service = RagPipeline()
