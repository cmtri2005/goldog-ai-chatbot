from src.config.config import config
from src.constants.llm_factory import LLMFactory
from src.utils.logger import LoggerConfig

logger = LoggerConfig(__name__).get()


class SummarizeChatService:
    def __init__(self):
        MODEL_NAME = config.GROQ_MODEL
        API_KEY = config.GROQ_API_KEY
        self.llm = LLMFactory.create_llm(
            llm_provider=LLMFactory.Provider.GROQ,
            config=LLMFactory.Config(model_name=MODEL_NAME, api_key=API_KEY),
        )

    def summarize_and_truncate_history(
        self,
        chat_history: list[dict],
        keep_last_msgs: int = 5,
        session_id: str | None = None,
        user_id: str | None = None,
    ) -> list[dict]:
        """Summarize old messages and keep recent ones for context"""
        if len(chat_history) <= keep_last_msgs:
            return chat_history
        else:
            try:
                old_msgs = chat_history[:-keep_last_msgs]
                recent_msgs = chat_history[-keep_last_msgs:]

                # Summarize old messages
                old_conversation = "\n".join(
                    [
                        f"{msg['role'].capitalize()}: {msg['content']}"
                        for msg in old_msgs
                    ]
                )

                summary_prompt = f"""Summarize this conversation, keeping key information and context (in 2-3 sentences):
                                     {old_conversation}"""

                summary_msg = self.llm.invoke(summary_prompt)
                logger.info(f"Summary message: {summary_msg}")

                # Create summary message and combine with recent messages
                summary_message = {
                    "role": "system",
                    "content": f"Previous conversation summary: {summary_msg.content if hasattr(summary_msg, 'content') else summary_msg}",
                }

                summarized_history = [summary_message] + recent_msgs
                logger.info(
                    f"Summarized {len(old_msgs)} messages into a summary and kept {len(recent_msgs)} recent messages"
                )

                return summarized_history
            except Exception as e:
                logger.error(f"Error to summarize and truncate chat history: {e}")
                return chat_history[-keep_last_msgs:]
