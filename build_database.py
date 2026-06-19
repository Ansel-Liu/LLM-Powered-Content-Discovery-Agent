import os
import pandas as pd
from langchain_community.document_loaders import DataFrameLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

def build_db():
    print("[INFO] Loading movie dataset...")
    # Load dataset and extract necessary columns
    df = pd.read_csv("data/tmdb_5000_movies.csv")
    df = df[['title', 'overview']].dropna()

    print("[INFO] Converting data to Document objects...")
    loader = DataFrameLoader(df, page_content_column="overview")
    docs = loader.load()

    print("[INFO] Initializing embedding model...")
    # Generate semantic embeddings for the documents
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    print("[INFO] Building and persisting vector database...")
    # Store embeddings locally using ChromaDB
    vector_db = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory="./chroma_db"
    )

    print("[INFO] Database successfully built and saved to ./chroma_db")

if __name__ == "__main__":
    build_db()