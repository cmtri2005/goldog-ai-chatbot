import logging
from transformers import AutoTokenizer
from langchain_community.embeddings import HuggingFaceEmbeddings
import torch


model_name = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"

def get_logger():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )
    return logging.getLogger(__name__)

logger = get_logger()

def get_tokenizer():
    print(f"Loading tokenizer: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    return tokenizer


def get_embeddings():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"--- Using device: {device} ---")
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={"device": device},
        encode_kwargs={"normalize_embeddings": True}, 
    )
    return embeddings
