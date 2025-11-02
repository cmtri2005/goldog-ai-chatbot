import sys
import traceback
from pathlib import Path
from load_and_chunk import LoadAndChunk
from embed_and_store import DocumentEmbedder


DATA_PATH = "data.json"
COLLECTION_NAME = "rag-pipeline-goldog-ai"
PERSIST_DIRECTORY = "../backend/infra/vector_stores/storage"


def main():
    print("=" * 80)
    print("Starting Data Ingestion Pipeline")
    print("=" * 80)

    print("\nLoading and chunking documents...")
    loader = LoadAndChunk()
    chunked_docs = loader.read_and_chunk(path=DATA_PATH)
    print(f"Successfully created {len(chunked_docs)} document chunks")

    print("\nCreating embeddings and storing in vector database...")
    embedder = DocumentEmbedder()

    persist_path = Path(PERSIST_DIRECTORY)
    persist_path.mkdir(parents=True, exist_ok=True)
    vectordb = embedder.document_embedding_vectorstore(
        split_docs=chunked_docs,
        collection_name=COLLECTION_NAME,
        persist_directory=str(persist_path),
    )

    print(f"Successfully stored documents in Chroma collection: {COLLECTION_NAME}")
    print(f"Persist directory: {persist_path.absolute()}")

    print("\nChecking vector store...")
    doc_count = vectordb._collection.count()
    print(f"Total documents in vector store: {doc_count}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\nError during ingestion: {str(e)}", file=sys.stderr)
        traceback.print_exc()
        sys.exit(1)
