from typing import Dict, Any, List, Optional

import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# =========================
# Constants
# =========================
MODEL_DIR = "models"

MODEL_FILES = {
    "knn": "knn.pkl",
    "svm": "svm.pkl",
    "logistic": "logistic.pkl",
    "naive_bayes": "naivebayes.pkl",
    "decision_tree": "decisiontree.pkl",
    "random_forest": "randomforest.pkl",
    "xgboost": "xgboost.pkl",
    "catboost": "catboost.pkl",
}

GLOBAL_SCALER_FILE = "scaler.pkl"


# =========================
# FastAPI App Initialization
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Request Schema
# =========================
class PredictionRequest(BaseModel):
    """
    Request schema for prediction endpoint.
    """
    model: str
    features: List[float]


# =========================
# Model Loading Functions
# =========================
def load_models() -> Dict[str, Any]:
    """
    Load all trained models from disk.

    Returns
    -------
    dict
        Dictionary mapping model names to loaded models.
    """
    loaded_models = {}

    for name, filename in MODEL_FILES.items():
        path = os.path.join(MODEL_DIR, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found: {path}")

        loaded_models[name] = joblib.load(path)

    return loaded_models


def load_scalers(model_names: List[str]) -> Dict[str, Any]:
    """
    Load model-specific scalers if available.

    Parameters
    ----------
    model_names : list
        List of model names.

    Returns
    -------
    dict
        Dictionary of scalers.
    """
    scaler_dict = {}

    for name in model_names:
        scaler_path = os.path.join(MODEL_DIR, f"{name}_scaler.pkl")
        if os.path.exists(scaler_path):
            scaler_dict[name] = joblib.load(scaler_path)

    return scaler_dict


def load_global_scaler() -> Optional[Any]:
    """
    Load global scaler if available.

    Returns
    -------
    object or None
    """
    path = os.path.join(MODEL_DIR, GLOBAL_SCALER_FILE)
    if os.path.exists(path):
        return joblib.load(path)
    return None


# =========================
# Load Resources (Startup)
# =========================
models = load_models()
scalers = load_scalers(list(models.keys()))
global_scaler = load_global_scaler()


# =========================
# Routes
# =========================
@app.get("/")
def home() -> Dict[str, str]:
    """
    Health check endpoint.

    Returns
    -------
    dict
        API status message.
    """
    return {"message": "ML API running with scaling support"}


@app.post("/predict")
def predict(request: PredictionRequest) -> Dict[str, Any]:
    """
    Generate prediction using selected model.

    Parameters
    ----------
    request : PredictionRequest
        Input request containing model name and features.

    Returns
    -------
    dict
        Prediction result and probabilities.

    Raises
    ------
    HTTPException
        If model is invalid or prediction fails.
    """
    model_name = request.model.lower()

    if model_name not in models:
        raise HTTPException(status_code=400, detail="Invalid model name.")

    model = models[model_name]

    try:
        # Convert input features to numpy array
        features = np.array(request.features).reshape(1, -1)

        # Apply appropriate scaling
        if model_name in scalers:
            features = scalers[model_name].transform(features)
        elif global_scaler is not None:
            features = global_scaler.transform(features)

        # Generate prediction
        prediction = model.predict(features)[0]

        # Generate probabilities if supported
        probabilities = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)[0].tolist()

        return {
            "model": model_name,
            "prediction": int(prediction),
            "probabilities": probabilities,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}"
        ) from exc