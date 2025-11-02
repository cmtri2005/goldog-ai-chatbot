from langchain.embeddings.base import Embeddings
from sentence_transformers import SentenceTransformer
from typing import List
import torch
import numpy as np


class EmbeddingService(Embeddings):
    def __init__(
        self,
        model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
    ):
        device = "cuda" if torch.cuda.is_available() else "cpu"
        self.embedding_model = SentenceTransformer(model_name).to(device)

    def embed_query(self, text: str) -> List[float]:
        """Embed a single text (normalized vector) and return as list."""
        vector = self.embedding_model.encode(text, normalize_embeddings=True)
        return np.array(vector).tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of texts (normalized vector) and return as list of lists."""
        vectors = self.embedding_model.encode(texts, normalize_embeddings=True)
        return np.array(vectors).tolist()


embedding_service = EmbeddingService()
