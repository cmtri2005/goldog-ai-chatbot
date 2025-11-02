from typing import Optional
from utils import get_tokenizer
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import json


class LoadAndChunk:
    def __init__(
        self,
        embed_model_id: str = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
        max_tokens: int = 512,
        chunk_overlap: int = 50,
        split_kwargs: Optional[dict] = None,
    ) -> None:
        """
        Args:
            embed_model_id: Model embedding
            max_tokens: Maximum number of tokens per chunk
            chunk_overlap: Overlap between chunks
            split_kwargs: Keyword arguments for the split method
        """
        self.embed_model_id = embed_model_id
        self.max_tokens = max_tokens
        self.chunk_overlap = chunk_overlap
        self.split_kwargs = split_kwargs

        self.tokenizer = None
        self.recursive_splitter = None

    def _initialize_tokenizer_and_splitter(self):
        """Lazy initialization of tokenizer and splitter"""
        if self.tokenizer is None:
            print(f"Initializing tokenizer and splitter for {self.embed_model_id}")
            self.tokenizer = get_tokenizer()

            self.recursive_splitter = (
                RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
                    tokenizer=self.tokenizer,
                    chunk_size=self.max_tokens,
                    chunk_overlap=self.chunk_overlap,
                )
            )

    def read_and_chunk(self, path: str = "data.json"):
        """Read and chunk the text"""

        self._initialize_tokenizer_and_splitter()

        # Load data.json
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        chunk_docs = []
        for idx, value in enumerate(data):
            content = value.get("content", "")
            metadata = value.get("metadata", {})
            chunks = self.recursive_splitter.split_text(content)
            for chunk in chunks:
                chunk_docs.append(Document(page_content=chunk, metadata=metadata))
            print(f" => Length of chunks after chunking: {len(chunk_docs)}")
        return chunk_docs


if __name__ == "__main__":
    loader = LoadAndChunk()
    chunk_docs = loader.read_and_chunk()
    print(chunk_docs)
