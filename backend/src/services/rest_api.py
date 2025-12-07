from langchain_core.messages import BaseMessage, ToolMessage
from src.services.base import BaseGenService
from src.services.chat_history.chat_history import save_message
from src.utils.logger import LoggerConfig
from typing import List

logger = LoggerConfig(__name__).get()


def build_context(messages: List[BaseMessage]) -> str:
    tool_chunks = []
    for m in messages:
        if isinstance(m, ToolMessage):
            tool_chunks.append(str(m.content))

    context_str = "\n\n--- Retrieved Documents ---\n\n".join(tool_chunks)
    return context_str


class RestAPIGenService(BaseGenService):
    """Generator service for REST API"""

    async def _initial_llm_call(
        self,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        # Format chat history to be included in the prompt
        formatted_history = "\n".join(
            f"{msg['role'].capitalize()}: {msg['content']}" for msg in chat_history
        )
        # Build chat messages from the prompt template
        messages = self.prompt_userinput.format_messages(
            question=question, chat_history=formatted_history
        )
        logger.info(f"Messages: {messages}")
        ai_msg = await self.llm_with_tools.ainvoke(
            messages,
        )
        logger.info(f"AI Message: {ai_msg}")

        return ai_msg, messages

    async def _create_message(
        self,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        # Phase 1: Initial LLM call with chat history
        ai_msg, messages = await self._initial_llm_call(
            question, chat_history, session_id, user_id
        )
        messages.append(ai_msg)
        tool_calls = ai_msg.additional_kwargs.get("tool_calls", [])
        logger.info(f"Tool calls: {tool_calls}")
        if not tool_calls:
            # No tool calls, return respone directly
            answer = self.clear_think.sub("", ai_msg.content).strip()
            return False, answer

        # Phase 2: Executed tools
        messages = await self._execute_tools(tool_calls, messages, session_id, user_id)

        return True, messages

    async def _rag_generation(
        self,
        messages: list,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        """Phase 3: RAG generation with context from tools"""
        context_str = build_context(messages)

        # RAG prompt với context
        prompt = self.prompt_rag.format(
            chat_history="\n".join(
                f"{msg['role'].capitalize()}: {msg['content']}" for msg in chat_history
            ),
            question=question,
            context=context_str,
        )

        raw = await self.llm_with_tools.ainvoke(prompt)

        content = raw.content if isinstance(raw.content, str) else str(raw.content)
        answer = self.clear_think.sub("", content).strip()
        logger.info(f"Answer: {answer}")

        return answer

    async def generate_rest_api(
        self,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        try:
            has_tools, result = await self._create_message(
                question, chat_history, session_id, user_id
            )

            if not has_tools:
                return result

            # Tools exist
            messages = result
            answer = await self._rag_generation(
                messages=messages,
                question=question,
                chat_history=chat_history,
                session_id=session_id,
                user_id=user_id,
            )
            # Save to db
            save_message(session_id, "human", question)
            save_message(session_id, "ai", answer)

            return answer

        except Exception as e:
            logger.error(f"Error to generate REST api: {e}")
            raise
