import os
import pandas as pd
import ast
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Helper function to extract names from TMDB's JSON-like string columns
def extract_names(item_str):
    try:
        items = ast.literal_eval(item_str)
        return ", ".join([item['name'] for item in items])
    except (ValueError, SyntaxError):
        return "Unknown"

def build_db():
    print("[INFO] Loading movie dataset...")
    df = pd.read_csv("data/tmdb_5000_movies.csv")
    
    # Extract more columns: title, overview, genres, production_countries, release_date
    df = df[['title', 'overview', 'genres', 'production_countries', 'release_date']].dropna()

    print("[INFO] Cleaning metadata and building Rich Text...")
    docs = []
    
    for index, row in df.iterrows():
        # Clean the JSON strings into readable text (e.g., "Action, Thriller")
        genres_text = extract_names(row['genres'])
        countries_text = extract_names(row['production_countries'])
        
        # Extract just the year from the release_date (e.g., "2009-12-10" -> "2009")
        year = str(row['release_date']).split('-')[0] if pd.notna(row['release_date']) else "Unknown"
        
        # THE SECRET SAUCE: The Super String
        rich_content = (
            f"Movie Title: {row['title']}. "
            f"Genres: {genres_text}. "
            f"Production Countries: {countries_text}. "
            f"Release Year: {year}. "
            f"Plot Overview: {row['overview']}"
        )
        
        # Create the LangChain Document
        doc = Document(
            page_content=rich_content,
            metadata={
                "title": row['title'],
                "genres": genres_text,
                "country": countries_text,
                "year": year
            }
        )
        docs.append(doc)

    print(f"[INFO] Converted {len(docs)} movies into Rich Documents.")

    print("[INFO] Initializing embedding model...")
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