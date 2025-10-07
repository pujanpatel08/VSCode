# TODO: define FastAPI app with /interpret and /answer
from fastapi import FastAPI

# Create the FastAPI app
app = FastAPI(title="NBA Stats LLM API", version="0.1.0")

@app.get("/")
def root():
    return {"message": "FastAPI LLM Wrapper is running 🚀"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "python-llm"}
