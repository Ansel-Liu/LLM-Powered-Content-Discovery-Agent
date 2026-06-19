from pydantic import BaseModel, Field
from typing import List

class RecommendationRequest(BaseModel):
    query: str = Field(
        ..., 
        json_schema_extra={"example": "I want a dark sci-fi movie about AI like Blade Runner."}
    )
    top_k: int = Field(default=3, description="Number of movies to recommend")

class MovieRecommendation(BaseModel):
    title: str
    overview: str
    relevance_score: float

class RecommendationResponse(BaseModel):
    llm_summary: str
    recommendations: List[MovieRecommendation]