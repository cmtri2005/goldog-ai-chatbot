from langchain.embeddings.base import Embeddings
from langchain_aws import BedrockEmbeddings
from typing import List


class EmbeddingService(Embeddings):
    def __init__(
        self, model_id="amazon.titan-embed-text-v2:0", region_name="us-east-1"
    ):
        self.embedding_model = BedrockEmbeddings(
            model_id=model_id, region_name=region_name
        )

    def embed_query(self, text: str) -> List[float]:
        """Embed a single text (normalized vector) and return as list."""
        return self.embedding_model.embed_query(text)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of texts (normalized vector) and return as list of lists."""
        return self.embedding_model.embed_documents(texts)


embedding_service = EmbeddingService()
