import json
import re
from langchain.tools import StructuredTool
from langchain_core.runnables import Runnable
from langchain_core.messages import BaseMessage
from langchain_core.language_models.base import LanguageModelInput
from langchain_core.messages import ToolMessage
from abc import ABC, abstractmethod
from src.constants.prompt import temp_userinput, temp_rag


class BaseGenService(ABC):
    """Base class for REST API"""

    def __init__(
        self,
        llm_with_tools: Runnable[LanguageModelInput, BaseMessage],
        tools: dict[str, StructuredTool],
        base_llm: Runnable[LanguageModelInput, BaseMessage] | None = None,
    ):
        self.llm_with_tools = llm_with_tools
        self.tools = tools
        self.llm = base_llm or llm_with_tools
        self.prompt_userinput = temp_userinput
        self.prompt_rag = temp_rag
        self.clear_think = re.compile(r"<think>[\s\S]*?</think>", re.MULTILINE)

    @abstractmethod
    async def _initial_llm_call(
        self,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        pass

    @abstractmethod
    async def _create_message(
        self,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        pass

    async def _execute_tools(
        self,
        tool_calls: list,
        messages: list,
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        executed_tools = []

        for tool_call in tool_calls:
            name = tool_call["name"].lower()
            if name not in self.tools:
                raise ValueError(f"Unknown tool: {name}")

            tool_inst = self.tools[name]
            payload = tool_call["args"]

            if "tool_calls" in payload:
                for call_args in payload["tool_calls"]:
                    try:
                        output = await tool_inst.ainvoke(call_args)
                        executed_tools.append((name, call_args, output))
                    except Exception as e:
                        output = f"[Error executing {name}: {e}]"

                    messages.append(
                        ToolMessage(content=output, tool_call_id=tool_call.get("id"))
                    )
            else:
                try:
                    output = await tool_inst.ainvoke(payload)
                    executed_tools.append((name, payload, output))
                except Exception as e:
                    output = f"[Error executing {name}: {e}]"

                messages.append(
                    ToolMessage(content=output, tool_call_id=tool_call.get("id"))
                )

        return messages

    @abstractmethod
    async def _rag_generation(
        self,
        messages: list,
        question: str,
        chat_history: list[dict],
        session_id: str | None = None,
        user_id: str | None = None,
    ):
        pass
