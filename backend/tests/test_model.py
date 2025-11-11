from langchain_aws import ChatBedrockConverse
from langchain_core.messages import HumanMessage

model_id = "meta.llama3-70b-instruct-v1:0"  
region = "us-east-1" 

llm = ChatBedrockConverse(model=model_id, region_name=region)
print(llm.invoke([HumanMessage(content="Tôi muốn mua nhà ở chợ Bình Chánh")]).content)