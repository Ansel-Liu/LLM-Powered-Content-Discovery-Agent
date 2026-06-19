import json
import pytest
from fastapi.testclient import TestClient
from app.main import app

# Initialize the test client for FastAPI
client = TestClient(app)

def test_recommendation_accuracy():
    # Load the evaluation dataset
    with open("evaluation/golden_dataset.json", "r", encoding="utf-8") as f:
        golden_data = json.load(f)

    passed = 0
    total = len(golden_data)

    print("\n--- Starting Evaluation Pipeline ---\n")
    
    for item in golden_data:
        query = item["query"]
        expected_movie = item["expected_movie"]

        # Simulate a POST request to the recommendation endpoint
        response = client.post("/recommend", json={"query": query, "top_k": 3})
        
        # Assert the API responds with success
        assert response.status_code == 200
        
        data = response.json()

        # Extract the titles of the recommended movies
        titles = [movie["title"] for movie in data["recommendations"]]
        
        # Verify if the expected movie is in the recommendation list
        if expected_movie in titles:
            print(f"[PASS] Query: '{query}' -> Found: '{expected_movie}'")
            passed += 1
        else:
            print(f"[FAIL] Query: '{query}' -> Expected: '{expected_movie}', Actual: {titles}")

    print(f"\n--- Evaluation Complete: {passed}/{total} Tests Passed ---\n")
    
    # Enforce a 100% pass rate for the pipeline to succeed
    assert passed == total, "Pipeline failed: Accuracy threshold not met."