import os
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.models import MovieRecommendation

# Initialize the embedding model and vector database
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

def generate_recommendation(query: str, top_k: int):
    # Retrieve semantically similar movies from the vector database
    results = vector_db.similarity_search_with_score(query, k=top_k)

    movies = []
    context_text = ""
    
    for i, (doc, score) in enumerate(results):
        title = doc.metadata.get('title', 'Unknown Title')
        overview = doc.page_content
        
        # Convert distance score to a normalized relevance percentage
        relevance = round((1.0 - (score / 2.0)) * 100, 1)

        movies.append(MovieRecommendation(
            title=title,
            overview=overview,
            relevance_score=relevance
        ))
        context_text += f"\nMovie {i+1}: {title}\nPlot: {overview}\n"

    # Generate a contextual summary using a Large Language Model
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert streaming content recommendation engine. Based on the user's request and the provided movie plots, write a short, engaging 2-3 sentence response explaining why these specific movies are a great fit. Do not list the movies, just provide the summary intro."),
            ("user", "User Request: {query}\n\nMovies Found:\n{context}")
        ])
        chain = prompt | llm
        response = chain.invoke({"query": query, "context": context_text})
        llm_summary = response.content
    except Exception as e:
        # Provide a fallback summary in the event of an API failure
        llm_summary = "Here are the best matching movies found in the database based on the search criteria."

    return llm_summary, movies