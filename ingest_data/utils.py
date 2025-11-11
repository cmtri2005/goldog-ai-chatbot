import logging
from langchain_aws import BedrockEmbeddings


model_name = "amazon.titan-embed-text-v2:0"


def get_logger():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )
    return logging.getLogger(__name__)


logger = get_logger()


def get_embeddings():
    """Get embeddings configuration"""
    print(f"Initializing Bedrock embeddings: {model_name}")
    return BedrockEmbeddings(model_id=model_name, region_name="us-east-1")
