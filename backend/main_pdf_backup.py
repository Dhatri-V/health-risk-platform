from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import shap
import numpy as np

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("models/diabetes.pkl")

# Create SHAP explainer
explainer = shap.TreeExplainer(model)

feature_names = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]


class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: int
    BloodPressure: int
    SkinThickness: int
    Insulin: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int


@app.get("/")
def home():
    return {"message": "API is working"}


@app.post("/predict")
def predict(data: DiabetesInput):

    features = np.array([[
        data.Pregnancies,
        data.Glucose,
        data.BloodPressure,
        data.SkinThickness,
        data.Insulin,
        data.BMI,
        data.DiabetesPedigreeFunction,
        data.Age,
    ]])

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0][1]

    # SHAP Explanation
    shap_values = explainer.shap_values(features)

    class1_shap = shap_values[0, :, 1]

    feature_impacts = []

    for name, impact in zip(feature_names, class1_shap):
        feature_impacts.append({
            "feature": name,
            "impact": round(float(abs(impact)), 4)
        })

    feature_impacts = sorted(
        feature_impacts,
        key=lambda x: x["impact"],
        reverse=True
    )

    top_factors = feature_impacts[:3]

    return {
        "prediction": int(prediction),
        "risk": "High Diabetes Risk" if prediction == 1 else "Low Diabetes Risk",
        "confidence": round(probability * 100, 2),
        "top_factors": top_factors
    }
