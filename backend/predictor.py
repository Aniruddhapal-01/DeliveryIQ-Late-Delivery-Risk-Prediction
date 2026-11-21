
import pickle
from pathlib import Path


# Locate the project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Locate the saved model
MODEL_PATH = BASE_DIR / "model" / "olist_late_delivery_model.pkl"


# Load the model bundle
with open(MODEL_PATH, "rb") as file:
    model_bundle = pickle.load(file)



import pandas as pd


# Extract required objects from the bundle
model = model_bundle["model"]
threshold = float(model_bundle["threshold"])
feature_names = model_bundle["feature_names"]


def predict_late_risk(features: dict) -> dict:
    """
    Predict whether an order is likely to be delivered late.
    """

    # Check that all required features are present
    missing_features = [
        feature for feature in feature_names
        if feature not in features
    ]

    if missing_features:
        raise ValueError(
            f"Missing features: {missing_features}"
        )

    # Create a DataFrame in the exact training feature order
    input_df = pd.DataFrame(
        [features],
        columns=feature_names
    )

    # Get probability of late delivery (class 1)
    probabilities = model.predict_proba(input_df)[0]

    class_index = list(model.classes_).index(1)
    late_probability = float(probabilities[class_index])

    # Apply the saved threshold
    prediction = int(late_probability >= threshold)

    return {
        "prediction": prediction,
        "late_probability": round(late_probability, 4),
        "threshold": threshold,
        "status": (
            "Late delivery risk"
            if prediction == 1
            else "Likely on time"
        )
    }


if __name__ == "__main__":

    sample_features = {
        "customer_state": "SP",
        "total_items": 2,
        "total_price": 150.0,
        "total_freight": 25.0,
        "payment_count": 1,
        "avg_installments": 1,
        "total_product_weight": 1000.0,
        "avg_product_weight": 500.0,
        "avg_product_length": 20.0,
        "avg_product_height": 15.0,
        "seller_state_count": 1,
        "seller_city_count": 1,
        "unique_product_categories": 1,
        "customer_lat": -23.55,
        "customer_lng": -46.63,
        "avg_seller_lat": -23.60,
        "avg_seller_lng": -46.65,
        "customer_seller_distance_km": 6.0,
        "purchase_hour": 14,
        "purchase_month": 5,
        "approval_hour": 15,
        "approval_time_hours": 1.0,
        "estimated_delivery_days": 20,
        "estimated_delivery_dayofweek": 2
    }

    result = predict_late_risk(sample_features)

    print("\nPrediction Result:")
    print(result)
