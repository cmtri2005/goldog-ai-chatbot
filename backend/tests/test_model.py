from langchain_aws import ChatBedrockConverse
from langchain_core.messages import HumanMessage

model_id = "meta.llama3-70b-instruct-v1:0"  # hoặc 8b
region = "us-east-1"  # đặt đúng region có model

llm = ChatBedrockConverse(model=model_id, region_name=region)
print(llm.invoke([HumanMessage(content="ping")]).content)