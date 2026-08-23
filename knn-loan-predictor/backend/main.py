# ============================================
# KNN Loan Prediction — FastAPI Backend
# Mirrors the exact preprocessing from the
# Jupyter notebook (LoanPredictorProject.ipynb)
# ============================================

import os
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
)

app = FastAPI(title="KNN Loan Predictor API")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# Pydantic model for prediction input
# ============================================

class LoanInput(BaseModel):
    Gender: str = "Male"
    Married: str = "Yes"
    Dependents: str = "0"
    Education: str = "Graduate"
    Self_Employed: str = "No"
    ApplicantIncome: float = 0
    CoapplicantIncome: float = 0
    LoanAmount: float = 0
    Loan_Amount_Term: float = 360
    Credit_History: float = 1
    Property_Area: str = "Urban"


# ============================================
# Global model store — trained once at startup
# ============================================

class ModelStore:
    def __init__(self):
        self.tuned_model = None
        self.scaler = None
        self.feature_columns = None
        self.best_k = None
        self.best_cv_accuracy = None
        self.tuned_accuracy = None
        self.default_accuracy = None
        self.k_experiment = {}  # {k: accuracy}
        self.tuned_cm = None
        self.default_cm = None
        self.tuned_report = None
        self.dataset_size = 0
        self.train_size = 0
        self.test_size = 0
        # For preprocessing new inputs
        self.median_values = {}
        self.mode_values = {}

store = ModelStore()


# ============================================
# Train the model at startup
# ============================================

def train_model():
    """
    Exactly mirrors the notebook:
    1. Load CSV
    2. Drop Loan_ID
    3. Fill missing (median for numeric, mode for categorical)
    4. Dependents 3+ -> 3
    5. One-hot encode (drop_first=True)
    6. Map Loan_Status Y->1, N->0
    7. Train/test split 80/20, random_state=42, stratify
    8. StandardScaler
    9. Default KNN (k=5)
    10. Test k=3,5,7
    11. GridSearchCV k=1..20
    12. Final tuned model
    """
    # Find train.csv
    csv_path = os.path.join(os.path.dirname(__file__), "train.csv")
    if not os.path.exists(csv_path):
        # Try parent directory
        csv_path = os.path.join(os.path.dirname(__file__), "..", "train.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"train.csv not found")

    df = pd.read_csv(csv_path)
    store.dataset_size = len(df)

    # Drop Loan_ID
    df = df.drop("Loan_ID", axis=1)

    # Identify columns
    categorical_columns = [
        "Gender", "Married", "Dependents",
        "Education", "Self_Employed", "Property_Area"
    ]
    numerical_columns = [
        "ApplicantIncome", "CoapplicantIncome",
        "LoanAmount", "Loan_Amount_Term", "Credit_History"
    ]

    # Compute and store medians/modes for later use in prediction
    for col in numerical_columns:
        store.median_values[col] = df[col].median()
    for col in categorical_columns:
        store.mode_values[col] = df[col].mode()[0]

    # Fill missing values
    for col in numerical_columns:
        df[col] = df[col].fillna(store.median_values[col])
    for col in categorical_columns:
        df[col] = df[col].fillna(store.mode_values[col])

    # Handle Dependents 3+ -> 3
    df["Dependents"] = df["Dependents"].replace("3+", "3")
    df["Dependents"] = df["Dependents"].astype(int)

    # One-hot encode
    df = pd.get_dummies(
        df,
        columns=["Gender", "Married", "Education", "Self_Employed", "Property_Area"],
        drop_first=True,
    )

    # Encode target
    df["Loan_Status"] = df["Loan_Status"].map({"Y": 1, "N": 0})

    # Separate features and target
    X = df.drop("Loan_Status", axis=1)
    y = df["Loan_Status"]

    store.feature_columns = X.columns.tolist()

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    store.train_size = len(X_train)
    store.test_size = len(X_test)

    # Scale
    store.scaler = StandardScaler()
    X_train_scaled = store.scaler.fit_transform(X_train)
    X_test_scaled = store.scaler.transform(X_test)

    # --- Default KNN (k=5) ---
    default_knn = KNeighborsClassifier()
    default_knn.fit(X_train_scaled, y_train)
    default_predictions = default_knn.predict(X_test_scaled)
    store.default_accuracy = round(
        accuracy_score(y_test, default_predictions) * 100, 2
    )
    store.default_cm = confusion_matrix(y_test, default_predictions).tolist()

    # --- K Experiment (k=3, 5, 7) ---
    for k in [3, 5, 7]:
        model = KNeighborsClassifier(n_neighbors=k)
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        acc = round(accuracy_score(y_test, preds) * 100, 2)
        store.k_experiment[k] = acc

    # --- Hyperparameter tuning (GridSearchCV, k=1..20) ---
    grid_search = GridSearchCV(
        KNeighborsClassifier(),
        {"n_neighbors": range(1, 21)},
        cv=5,
        scoring="accuracy",
    )
    grid_search.fit(X_train_scaled, y_train)

    store.best_k = grid_search.best_params_["n_neighbors"]
    store.best_cv_accuracy = round(grid_search.best_score_ * 100, 2)

    # --- Final tuned model ---
    store.tuned_model = KNeighborsClassifier(n_neighbors=store.best_k)
    store.tuned_model.fit(X_train_scaled, y_train)

    tuned_predictions = store.tuned_model.predict(X_test_scaled)
    store.tuned_accuracy = round(
        accuracy_score(y_test, tuned_predictions) * 100, 2
    )
    store.tuned_cm = confusion_matrix(y_test, tuned_predictions).tolist()

    # Classification report as dict
    report = classification_report(
        y_test, tuned_predictions,
        target_names=["Rejected", "Approved"],
        output_dict=True,
    )
    store.tuned_report = {
        "Rejected": {
            "precision": round(report["Rejected"]["precision"], 4),
            "recall": round(report["Rejected"]["recall"], 4),
            "f1_score": round(report["Rejected"]["f1-score"], 4),
            "support": int(report["Rejected"]["support"]),
        },
        "Approved": {
            "precision": round(report["Approved"]["precision"], 4),
            "recall": round(report["Approved"]["recall"], 4),
            "f1_score": round(report["Approved"]["f1-score"], 4),
            "support": int(report["Approved"]["support"]),
        },
    }

    print(f"✓ Model trained — Best K={store.best_k}, "
          f"Test Accuracy={store.tuned_accuracy}%")


# Train on startup
@app.on_event("startup")
async def startup_event():
    train_model()


# ============================================
# POST /predict
# ============================================

@app.post("/predict")
async def predict(data: LoanInput):
    if store.tuned_model is None:
        raise HTTPException(status_code=503, detail="Model not trained yet")

    # Build a DataFrame row matching the training features
    row = {
        "Dependents": int(data.Dependents.replace("3+", "3")),
        "ApplicantIncome": data.ApplicantIncome,
        "CoapplicantIncome": data.CoapplicantIncome,
        "LoanAmount": data.LoanAmount,
        "Loan_Amount_Term": data.Loan_Amount_Term,
        "Credit_History": data.Credit_History,
        # One-hot encoded columns (drop_first=True)
        "Gender_Male": 1 if data.Gender == "Male" else 0,
        "Married_Yes": 1 if data.Married == "Yes" else 0,
        "Education_Not Graduate": 1 if data.Education == "Not Graduate" else 0,
        "Self_Employed_Yes": 1 if data.Self_Employed == "Yes" else 0,
        "Property_Area_Semiurban": 1 if data.Property_Area == "Semiurban" else 0,
        "Property_Area_Urban": 1 if data.Property_Area == "Urban" else 0,
    }

    # Create DataFrame with correct column order
    input_df = pd.DataFrame([row])[store.feature_columns]

    # Scale using the same scaler fitted on training data
    input_scaled = store.scaler.transform(input_df)

    # Predict
    prediction = store.tuned_model.predict(input_scaled)[0]
    probabilities = store.tuned_model.predict_proba(input_scaled)[0]

    # probabilities[0] = P(Rejected/0), probabilities[1] = P(Approved/1)
    approval_score = round(float(probabilities[1]) * 100, 1)
    rejection_score = round(float(probabilities[0]) * 100, 1)

    return {
        "prediction": "Approved" if prediction == 1 else "Rejected",
        "approval_score": approval_score,
        "rejection_score": rejection_score,
        "k_value": store.best_k,
        "model": "K-Nearest Neighbors",
        "distance_metric": "Euclidean (L2)",
    }


# ============================================
# GET /model-results
# ============================================

@app.get("/model-results")
async def model_results():
    if store.tuned_model is None:
        raise HTTPException(status_code=503, detail="Model not trained yet")

    return {
        "algorithm": "K-Nearest Neighbors",
        "task": "Binary Classification",
        "training_split": 80,
        "testing_split": 20,
        "scaling": "StandardScaler",
        "distance_metric": "Euclidean (L2)",
        "dataset_size": store.dataset_size,
        "train_size": store.train_size,
        "test_size": store.test_size,
        "features": store.feature_columns,
        "best_k": store.best_k,
        "best_cv_accuracy": store.best_cv_accuracy,
        "tuned_accuracy": store.tuned_accuracy,
        "default_accuracy": store.default_accuracy,
        "k_experiment": store.k_experiment,
        "confusion_matrix": {
            "tn": store.tuned_cm[0][0],
            "fp": store.tuned_cm[0][1],
            "fn": store.tuned_cm[1][0],
            "tp": store.tuned_cm[1][1],
        },
        "classification_report": store.tuned_report,
    }
