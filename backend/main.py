from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import joblib
import shap
import numpy as np

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from datetime import datetime

app = FastAPI()

# Enable CORS
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

# Load model
model = joblib.load("models/diabetes.pkl")

# SHAP
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

# Store latest prediction
latest_prediction = {}


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

    global latest_prediction

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

    latest_prediction = {
        "prediction": int(prediction),
        "risk": "High Diabetes Risk" if prediction == 1 else "Low Diabetes Risk",
        "confidence": round(probability * 100, 2),
        "top_factors": top_factors,
        "timestamp": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    }

    return latest_prediction


@app.get("/download-report")
def download_report():

    if not latest_prediction:
        return {"error": "No prediction available"}

    pdf_file = "diabetes_report.pdf"

    doc = SimpleDocTemplate(pdf_file)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph("Diabetes Risk Assessment Report", styles["Title"])
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            f"Generated On: {latest_prediction['timestamp']}",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            f"Prediction: {latest_prediction['prediction']}",
            styles["Heading2"]
        )
    )

    content.append(
        Paragraph(
            f"Risk Level: {latest_prediction['risk']}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Confidence: {latest_prediction['confidence']}%",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "Top Risk Factors",
            styles["Heading2"]
        )
    )

    for factor in latest_prediction["top_factors"]:
        content.append(
            Paragraph(
                f"{factor['feature']} : {factor['impact']}",
                styles["Normal"]
            )
        )

    doc.build(content)

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename="diabetes_report.pdf"
    )