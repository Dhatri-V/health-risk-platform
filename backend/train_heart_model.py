import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load Dataset
df = pd.read_csv("datasets/heart.csv")

print("Dataset Shape:", df.shape)

# Features and Target
X = df.drop("target", axis=1)
y = df["target"]

# Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print(f"Heart Disease Model Accuracy: {accuracy:.4f}")

# Save Model
joblib.dump(model, "models/heart_model.pkl")

print("Model saved as models/heart_model.pkl")