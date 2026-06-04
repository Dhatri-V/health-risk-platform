from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib

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

    features = [[
        data.Pregnancies,
        data.Glucose,
        data.BloodPressure,
        data.SkinThickness,
        data.Insulin,
        data.BMI,
        data.DiabetesPedigreeFunction,
        data.Age,
    ]]

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0][1]

    return {
        "prediction": int(prediction),
        "risk": "High Diabetes Risk" if prediction == 1 else "Low Diabetes Risk",
        "confidence": round(probability * 100, 2),
    }