from langchain_chroma import Chroma
from src.infra.embeddings.embeddings import embedding_service
from src.config.config import ConfigSingleton
from langchain.schema.document import Document
from typing import List, Tuple, Dict, Any, Optional

config = ConfigSingleton()


def _format_docs(docs: List[Document], scores: List[float] | None = None) -> str:
    formatted = []
    for idx, doc in enumerate(docs):
        content = doc.page_content.strip()
        if scores:
            content += f" [score={scores[idx]:.4f}]"
        formatted.append(content)
    return "\n\n".join(formatted)


class ChromaClientService:
    def __init__(self):
        self.client = None
        self.connection = None
        self.embedding_service = embedding_service

    def connect(self):
        persist_dir = config.CHROMA_PERSIST_DIR
        self.client = Chroma(
            collection_name=config.CHROMA_COLLECTION_NAME,
            persist_directory=str(persist_dir),
            embedding_function=embedding_service,
        )

    def retrieve_vector(
        self,
        query: str,
        top_k: int = 3,
        with_score: bool = False,
        metadata_filter: Optional[Dict[str, Any]] = None,
    ) -> str:
        if self.client is None:
            self.connect()

        if with_score:
            docs_with_scores: List[Tuple[Document, float]] = (
                self.client.similarity_search_with_score(
                    query, k=top_k, filter=(metadata_filter or None)
                )
            )
            try:
                docs, scores = zip(*docs_with_scores)
                return _format_docs(list(docs), list(scores))
            except ValueError:
                return "Không tìm thấy tài liệu phù hợp."
        else:
            docs: List[Document] = self.client.similarity_search(
                query, k=top_k, filter=(metadata_filter or None)
            )
            return _format_docs(docs)
