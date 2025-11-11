from typing import Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import json


class LoadAndChunk:
    def __init__(
        self,
        embed_model_id: str = "amazon.titan-embed-text-v2:0",
        chunk_size: int = 512,
        chunk_overlap: int = 50,
        split_kwargs: Optional[dict] = None,
    ) -> None:
        """
        Args:
            embed_model_id: Model embedding
            chunk_size: Number of characters per chunk (fixed)
            chunk_overlap: Overlap between chunks (characters)
            split_kwargs: Additional kwargs for splitter
        """
        self.embed_model_id = embed_model_id
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.split_kwargs = split_kwargs
        self.recursive_splitter = None

    def _initialize_splitter(self):
        if self.recursive_splitter is None:
            print(f"Initializing splitter for {self.embed_model_id}")
            self.recursive_splitter = RecursiveCharacterTextSplitter(
                chunk_size=self.chunk_size,
                chunk_overlap=self.chunk_overlap,
                **(self.split_kwargs or {}),
            )

    def read_and_chunk(self, path: str = "data.json") -> list[Document]:
        self._initialize_splitter()

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        chunk_docs = []
        for idx, value in enumerate(data):
            content = value.get("content", "")
            if not content.strip():
                continue
            metadata = value.get("metadata", {})
            chunks = self.recursive_splitter.split_text(content)
            for chunk in chunks:
                chunk_docs.append(Document(page_content=chunk, metadata=metadata))

            if (idx + 1) % 100 == 0:
                print(f"Processed {idx + 1} documents, total chunks: {len(chunk_docs)}")

        print(f"Total chunks created: {len(chunk_docs)}")
        return chunk_docs


if __name__ == "__main__":
    loader = LoadAndChunk()
    chunk_docs = loader.read_and_chunk()
    print(chunk_docs)
