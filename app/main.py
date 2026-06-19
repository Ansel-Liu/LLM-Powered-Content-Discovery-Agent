from dotenv import load_dotenv
load_dotenv() 

from fastapi import FastAPI
from app.models import RecommendationRequest, RecommendationResponse
from app.llm_agent import generate_recommendation

app = FastAPI(
    title="Content Discovery Agent",
    description="LLM-powered semantic search and recommendation engine for streaming media.",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    """Endpoint for infrastructure observability and health tracking."""
    return {"status": "healthy", "service": "content-discovery-agent"}

@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    """
    Accepts a natural language query, searches the vector database, 
    and returns LLM-curated movie recommendations.
    """
    # Execute retrieval and recommendation generation
    summary, recommended_movies = generate_recommendation(
        query=request.query, 
        top_k=request.top_k
    )
    
    return {
        "llm_summary": summary,
        "recommendations": recommended_movies
    }