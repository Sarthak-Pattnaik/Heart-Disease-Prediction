from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    model: str
    features: list[float]

# Load models
models = {
    "knn": joblib.load("models/knn.pkl"),
    "svm": joblib.load("models/svm.pkl"),
    "logistic": joblib.load("models/logistic.pkl"),
    "naive_bayes": joblib.load("models/naivebayes.pkl"),
    "decision_tree": joblib.load("models/decisiontree.pkl"),
    "random_forest": joblib.load("models/randomforest.pkl"),
    "xgboost": joblib.load("models/xgboost.pkl"),
    "catboost": joblib.load("models/catboost.pkl"),
}

# Try loading scalers (optional per model)
scalers = {}

for name in models.keys():
    scaler_path = f"models/{name}_scaler.pkl"
    if os.path.exists(scaler_path):
        scalers[name] = joblib.load(scaler_path)

# Optional global scaler
global_scaler = None
if os.path.exists("models/scaler.pkl"):
    global_scaler = joblib.load("models/scaler.pkl")


@app.get("/")
def home():
    return {"message": "ML API running with scaling support"}


@app.post("/predict")
def predict(request: PredictionRequest):
    model_name = request.model.lower()

    if model_name not in models:
        raise HTTPException(status_code=400, detail="Invalid model")

    model = models[model_name]

    try:
        features = np.array(request.features).reshape(1, -1)

        # ✅ Apply scaling if exists
        if model_name in scalers:
            features = scalers[model_name].transform(features)
        elif global_scaler:
            features = global_scaler.transform(features)
        
        prediction = model.predict(features)[0]

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)[0].tolist()
        else:
            probabilities = None

        return {
            "model": model_name,
            "prediction": int(prediction),
            "probabilities": probabilities
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))