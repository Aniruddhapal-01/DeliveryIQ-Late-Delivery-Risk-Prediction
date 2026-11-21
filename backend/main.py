
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.predictor import predict_late_risk, feature_names


# Create the FastAPI application
app = FastAPI(
    title="DeliveryIQ API",
    description="Olist Late Delivery Risk Prediction API",
    version="1.0.0"
)


# Allow frontend requests during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "DeliveryIQ API is running",
        "status": "success"
    }


# Model information endpoint
@app.get("/model-info")
def model_info():
    return {
        "project": "Olist Late Delivery Risk Prediction",
        "model_features": len(feature_names),
        "features": feature_names
    }


# Prediction endpoint
@app.post("/predict")
def predict(features: dict):

    try:
        result = predict_late_risk(features)
        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
