from typing import TypedDict
from typing_extensions import Required, NotRequired
from enum import Enum
from langchain_core.language_models.chat_models import BaseChatModel


class LLMFactory:
    class Config(TypedDict):
        model_name: Required[str]
        embedding_model: Required[str]
        api_key: NotRequired[str]
        region_name: NotRequired[str]
        api_endpoint: NotRequired[str]
        max_completion_tokens: NotRequired[int]
        temperature: NotRequired[float]
        max_retries: NotRequired[int]
        timeout: NotRequired[float]

    class Provider(Enum):
        BEDROCK = "bedrock"
        GROQ = "groq"
        OPENAI = "openai"

    @staticmethod
    def create_llm(llm_provider: Provider, config: Config) -> BaseChatModel:
        if llm_provider == LLMFactory.Provider.BEDROCK:
            from langchain_aws import ChatBedrockConverse

            kwargs = {
                "model": config["model_name"],
                "region_name": config["region_name"],
            }

            if "api_endpoint" in config:
                kwargs["base_url"] = config["api_endpoint"]
            if "max_completion_tokens" in config:
                kwargs["max_tokens"] = config["max_completion_tokens"]
            if "temperature" in config:
                kwargs["temperature"] = config["temperature"]
            if "max_retries" in config:
                kwargs["max_retries"] = config["max_retries"]
            if "timeout" in config:
                kwargs["timeout"] = config["timeout"]

            return ChatBedrockConverse(**kwargs)

        elif llm_provider == LLMFactory.Provider.GROQ:
            from langchain_groq import ChatGroq

            kwargs = {
                "model": config["model_name"],
                "api_key": config["api_key"],
            }
            if "api_endpoint" in config:
                kwargs["base_url"] = config["api_endpoint"]
            if "max_completion_tokens" in config:
                kwargs["max_tokens"] = config["max_completion_tokens"]
            if "temperature" in config:
                kwargs["temperature"] = config["temperature"]
            if "max_retries" in config:
                kwargs["max_retries"] = config["max_retries"]
            if "timeout" in config:
                kwargs["timeout"] = config["timeout"]
            return ChatGroq(**kwargs)

        elif llm_provider == LLMFactory.Provider.OPENAI:
            from langchain_openai import ChatOpenAI

            kwargs = {
                "model": config["model_name"],
                "api_key": config["api_key"],
            }

            if "api_endpoint" in config:
                kwargs["base_url"] = config["api_endpoint"]
            if "max_completion_tokens" in config:
                kwargs["max_tokens"] = config["max_completion_tokens"]
            if "temperature" in config:
                kwargs["temperature"] = config["temperature"]
            if "max_retries" in config:
                kwargs["max_retries"] = config["max_retries"]
            if "timeout" in config:
                kwargs["timeout"] = config["timeout"]

            return ChatOpenAI(**kwargs)

        if llm_provider not in LLMFactory.Provider:
            raise ValueError(
                f"Unsupported LLM provider: {llm_provider}. Supported providers are: {list(LLMFactory.Provider)}"
            )
