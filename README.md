#  Full-Stack AI Content Discovery Platform

A production-ready, full-stack movie recommendation engine leveraging **Retrieval-Augmented Generation (RAG)**, hybrid semantic vector search, and Large Language Models to deliver highly accurate, contextual content discovery.

This project demonstrates a complete end-to-end engineering lifecycle, from data pipeline construction and automated evaluation to full-stack integration and multi-stage containerized deployment.

##  Product Preview

*(Note to hiring managers: Below is the UI demonstration of the content discovery engine in action.)*

### 1. User Interface & Search History
![Platform UI](assets/ui-screenshot.png) 
### 2. AI Reasoning & Hybrid Retrieval Results
![Recommendation Results](assets/results-screenshot.png)
---

##  System Architecture

This project decouples a modern interactive frontend from an AI-powered analytical backend:

1. **Frontend (Client Layer):** Built with **React.js** and **Vite**, offering a responsive, dark-mode streaming-app interface with client-side state management (LocalStorage for search history) and seamless REST API integration.
2. **Backend (API Layer):** A robust **FastAPI** application handling asynchronous data routing, CORS middleware, and strict request/response validation using **Pydantic**.
3. **Data Ingestion & Vector DB:** Utilizes **ChromaDB** for local semantic similarity search. Raw TMDB datasets are parsed using **Pandas**, where metadata (genres, country, release year) is dynamically merged into dense "Super String" embeddings to overcome the limitations of pure semantic search.
4. **LLM Agentic Logic:** Integrates OpenAI's GPT models via **LangChain** to synthesize vector search results into highly personalized, conversational recommendations.
5. **DevOps & Deployment:** Fully containerized using **Docker** and **Docker Compose**, implementing multi-stage builds (serving static React assets via Nginx) for reliable, isolated local deployment.

##  Tech Stack

* **Frontend:** React, JavaScript (ES6+), Vite, CSS3
* **Backend:** FastAPI, Python 3.11, Pydantic, Uvicorn
* **AI & Machine Learning:** LangChain, OpenAI API, HuggingFace (`all-MiniLM-L6-v2`)
* **Database:** ChromaDB (Vector Store), SQLite
* **DevOps:** Docker, Docker Compose, Nginx
* **Testing:** PyTest

##  Project Structure

```text
LLM-MOVIE-RECOMMENDATION/
├── frontend/                   # React/Vite Frontend Application
│   ├── src/                    # UI Components and API fetch logic
│   ├── Dockerfile              # Multi-stage Docker build (Node.js -> Nginx)
│   └── package.json
│
├── app/                        # Core API and application logic (Backend)
│   ├── llm_agent.py            # RAG logic, hybrid search, and LLM integration
│   ├── main.py                 # FastAPI application entry point and routing
│   └── models.py               # Pydantic schemas for strict data validation
│
├── chroma_db/                  # Local vector database storage (Generated)
├── data/                       # Raw datasets (TMDB 5000 Movies)
│
├── evaluation/                 # Automated testing and evaluation pipeline
│   ├── golden_dataset.json     # Ground truth Q&A pairs for regression testing
│   └── test_pipeline.py        # PyTest script to evaluate LLM accuracy/recall
│
├── build_database.py           # Script to vectorize CSV data with rich metadata
├── docker-compose.yml          # Orchestration for Frontend and Backend services
├── Dockerfile                  # Backend containerization specifications
└── requirements.txt            # Python dependencies
```

## Evaluation-Driven Development (Testing Pipeline)

To ensure system reliability and mitigate LLM hallucinations, this repository includes an automated regression testing pipeline.

Located in the `/evaluation` directory, the pipeline uses FastAPI's `TestClient` to run queries against a predefined `golden_dataset.json`. It strictly evaluates if the expected contextual targets are retrieved and included in the final LLM output, ensuring high recall and system observability.

Run the evaluation pipeline:

```bash
pytest evaluation/test_pipeline.py -s
```

## Local Setup & Execution

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/LLM-movie-recommendation.git
cd LLM-movie-recommendation
pip install -r requirements.txt
```

*(Note: Replace `your-username` with your actual GitHub username.)*

### 2. Environment Variables

Create a `.env` file in the root directory and add your OpenAI API Key:

```text
OPENAI_API_KEY=sk-your-secret-key-here
```

### 3. Build the Vector Database

```bash
python build_database.py
```

### 4. Start the FastAPI Server

```bash
python -m uvicorn app.main:app --reload
```

Navigate to `http://127.0.0.1:8000/docs` to interact with the Swagger UI and test the API endpoints.

## Docker Deployment

To run this microservice in an isolated, containerized environment:

### 1. Build the Docker Image

```bash
docker build -t content-discovery-agent .
```

### 2. Run the Container

```bash
docker run -p 8000:8000 --env-file .env content-discovery-agent
```
