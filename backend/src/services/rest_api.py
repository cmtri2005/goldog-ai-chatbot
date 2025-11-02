from langchain_core.messages import BaseMessage, ToolMessage, SystemMessage
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from src.services.base import BaseGenService
from src.services.chat_history import save_message, get_session_history
from src.utils.logger import logger
from typing import List


def build_context(messages: List[BaseMessage]) -> str:
    tool_chunks = []
    for m in messages:
        if isinstance(m, ToolMessage):
            tool_chunks.append(str(m.content))

    context_str = "\n\n--- Retrieved Documents ---\n\n".join(tool_chunks)
    return context_str


class RestAPIGenService(BaseGenService):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._session_store: dict[str, ChatMessageHistory] = {}

        self.chat_chain = RunnableWithMessageHistory(
            self.llm_with_tools,
            get_session_history,
        )

    async def _initial_llm_call(
        self,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        chat_hist_str = "\n".join(
            f"{msg['role'].capitalize()}: {msg['content']}" for msg in chat_history
        )
        messages = self.prompt_userinput.format_messages(
            question=question, chat_history=chat_hist_str
        )
        ai_msg = await self.chat_chain.ainvoke(
            messages,
            config={"configurable": {"session_id": session_id or "default"}},
        )

        return ai_msg, messages

    async def _create_message(
        self,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        ai_msg, messages = await self._initial_llm_call(
            question, chat_history, session_id, user_id
        )
        messages.append(ai_msg)

        # Save to db
        save_message(session_id, "human", question)
        save_message(session_id, "ai", ai_msg.content)

        tool_calls = ai_msg.additional_kwargs.get("tool_calls", [])

        if not tool_calls:
            answer = self.clear_think.sub("", ai_msg.content).strip()
            return False, answer

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
        context = build_context(messages)

        prompt = self.prompt_rag.format(
            chat_history="\n".join(
                f"{msg['role'].capitalize()}: {msg['content']}" for msg in chat_history
            ),
            question=question,
            context=context,
        )
        rag_messages = [SystemMessage(content=prompt)]
        raw_msg = await self.chat_chain.ainvoke(
            rag_messages,
            config={"configurable": {"session_id": session_id or "default"}},
        )
        content = (
            raw_msg.content
            if isinstance(raw_msg.content, str)
            else str(raw_msg.content)
        )
        answer = self.clear_think.sub("", content).strip()

        save_message(session_id, "ai", answer)

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
                # Không có tools - trả về answer trực tiếp
                return result

            # Có tools - tiếp tục với RAG prompt
            messages = result
            answer = await self._rag_generation(
                messages=messages,
                question=question,
                chat_history=chat_history,
                session_id=session_id,
                user_id=user_id,
            )

            return answer

        except Exception as e:
            logger.error(f"Error in generate_rest_api(): {e}")
            raise
