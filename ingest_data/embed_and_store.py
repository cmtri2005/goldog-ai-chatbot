from langchain_core.documents import Document
from langchain_chroma import Chroma
from utils import get_embeddings, model_name
from langchain_community.vectorstores.utils import filter_complex_metadata
from uuid import uuid4


class DocumentEmbedder:
    def __init__(self):
        print(f"Initializing embeddings for model: {model_name}")
        self.embeddings = get_embeddings()

    def document_embedding_vectorstore(
        self, split_docs: list[Document], collection_name: str, persist_directory: str
    ):
        """
        Generate embeddings for the documents and store them in a vector store.

        Args:
            split (list[Document]): List of Document objects with content.
            collection_name (str): Name of the Chroma collection.
            persist_directory (str): Directory to persist the vector store.
        """
        print("---Initializing Chroma vector store---")

        # 1. Load the Chroma collection
        vectordb = Chroma(
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=persist_directory,
        )
        # 2. Generate unique ID for each document chunk
        uuids = [str(uuid4()) for _ in split_docs]

        # 3. Filter complex metadata before storing
        print("---Filtering complex metadata before storing---")
        filtered_split_docs = filter_complex_metadata(split_docs)

        # 4. Add documents to the vector store
        print(f"Adding {len(filtered_split_docs)} documents to the vector store")
        vectordb.add_documents(
            documents=filtered_split_docs,
            ids=uuids,
        )
        return vectordb
