# LLM-Powered Content Discovery Agent

An end-to-end Machine Learning microservice designed to handle semantic search and personalized streaming media recommendations using Large Language Models and Vector Databases.

This project demonstrates production-grade **MLOps practices**, including architecture design, data pipeline engineering, and **evaluation-driven development**.

## System Architecture

1. **Data Pipeline:** Ingests raw movie metadata (TMDB dataset) and converts natural language overviews into dense mathematical representations (Embeddings) using HuggingFace `sentence-transformers`.

2. **Vector Database:** Utilizes ChromaDB for efficient, local semantic similarity search (retrieval-augmented generation / RAG).

3. **LLM Agentic Logic:** Integrates OpenAI's GPT models via `langchain` to synthesize vector search results into highly personalized, user-friendly recommendations.

4. **API Layer:** Exposes the functionality through a robust, asynchronous **FastAPI** interface with strict data validation using Pydantic.

## Tech Stack

* **Framework:** FastAPI, Pydantic, Uvicorn
* **AI & Machine Learning:** LangChain, OpenAI API, HuggingFace (`all-MiniLM-L6-v2`)
* **Vector Store:** ChromaDB
* **Data Processing:** Pandas
* **Testing & Evaluation:** PyTest
* **Deployment:** Docker

##  Project Structure

```text
LLM-MOVIE-RECOMMENDATION/
├── app/                        # Core API and application logic
│   ├── llm_agent.py            # RAG logic, semantic search, and LLM integration
│   ├── main.py                 # FastAPI application entry point and routing
│   └── models.py               # Pydantic schemas for strict data validation
│
├── chroma_db/                  # Local vector database storage (auto-generated)
│
├── data/                       # Raw datasets
│   └── tmdb_5000_movies.csv    # Source movie metadata（https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata）
│
├── evaluation/                 # Automated testing and evaluation pipeline
│   ├── golden_dataset.json     # Ground truth Q&A pairs for regression testing
│   └── test_pipeline.py        # PyTest script to evaluate LLM accuracy/recall
│
├── build_database.py           # Script to vectorize CSV data and populate ChromaDB
├── Dockerfile                  # Containerization specifications
├── requirements.txt            # Python dependencies
└── .gitignore                  # Security and cache exclusion rules
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
