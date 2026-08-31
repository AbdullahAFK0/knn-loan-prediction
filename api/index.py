# ============================================
# KNN Loan Prediction — FastAPI Backend
# Uses sklearn Pipeline with SimpleImputer,
# OneHotEncoder, and ColumnTransformer.
# Mirrors the new notebook approach exactly.
# ============================================

import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
)

app = FastAPI(title="KNN Loan Predictor API")

# CORS — open for all origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
# Global model store — trained lazily
# ============================================

class ModelStore:
    def __init__(self):
        self.model = None          # Full sklearn Pipeline
        self.accuracy = None
        self.tuned_cm = None
        self.tuned_report = None
        self.dataset_size = 0
        self.train_size = 0
        self.test_size = 0
        self.classes_ = None       # ["N", "Y"]

store = ModelStore()


# ============================================
# Train the model (lazy — called on first request)
# ============================================

def train_model():
    """
    Mirrors the new notebook exactly:
    1. Load CSV
    2. Drop Loan_ID
    3. Define categorical & numeric columns
    4. Numeric pipeline: SimpleImputer(median) + StandardScaler
    5. Categorical pipeline: SimpleImputer(most_frequent) + OneHotEncoder
    6. ColumnTransformer combines both pipelines
    7. KNN (n_neighbors=7, weights=distance) wrapped in final Pipeline
    8. Train/test split 80/20, random_state=42, stratify
    9. Fit and evaluate
    """
    csv_path = os.path.join(os.path.dirname(__file__), "train.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(os.path.dirname(__file__), "..", "train.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError("train.csv not found")

    df = pd.read_csv(csv_path)
    store.dataset_size = len(df)

    # ==========================================
    # 2. REMOVE UNNECESSARY COLUMN
    # ==========================================
    X = df.drop(columns=["Loan_Status", "Loan_ID"])
    y = df["Loan_Status"]

    # ==========================================
    # 3. DEFINE COLUMNS
    # ==========================================
    categorical_columns = [
        "Gender",
        "Married",
        "Dependents",
        "Education",
        "Self_Employed",
        "Property_Area",
    ]
    numeric_columns = [
        "ApplicantIncome",
        "CoapplicantIncome",
        "LoanAmount",
        "Loan_Amount_Term",
        "Credit_History",
    ]

    # ==========================================
    # 4. PREPROCESS NUMERICAL DATA
    # ==========================================
    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    # ==========================================
    # 5. PREPROCESS CATEGORICAL DATA
    # ==========================================
    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ])

    # ==========================================
    # 6. COMBINE PREPROCESSING
    # ==========================================
    preprocessor = ColumnTransformer([
        ("numeric", numeric_pipeline, numeric_columns),
        ("categorical", categorical_pipeline, categorical_columns),
    ])

    # ==========================================
    # 7 & 8. CREATE COMPLETE PIPELINE
    # ==========================================
    knn = KNeighborsClassifier(n_neighbors=7, weights="distance")
    model = Pipeline([
        ("preprocessor", preprocessor),
        ("knn", knn),
    ])

    # ==========================================
    # 9. SPLIT DATA
    # ==========================================
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    store.train_size = len(X_train)
    store.test_size = len(X_test)

    # ==========================================
    # 10. TRAIN MODEL
    # ==========================================
    model.fit(X_train, y_train)

    # ==========================================
    # 11 & 12. EVALUATE
    # ==========================================
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    store.accuracy = round(accuracy * 100, 2)
    store.tuned_cm = confusion_matrix(y_test, y_pred).tolist()

    report = classification_report(
        y_test, y_pred,
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

    store.model = model
    store.classes_ = model.classes_.tolist()  # ["N", "Y"]

    print(f"✓ Model trained — Accuracy={store.accuracy}%")


def ensure_model():
    """Lazily train the model on first request."""
    if store.model is None:
        try:
            train_model()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to train model: {e}")


# ============================================
# POST /api/predict
# ============================================

@app.post("/api/predict")
async def predict(data: LoanInput):
    ensure_model()

    # Build input DataFrame exactly matching notebook's new_applicant format
    input_df = pd.DataFrame([{
        "Gender": data.Gender,
        "Married": data.Married,
        "Dependents": data.Dependents,
        "Education": data.Education,
        "Self_Employed": data.Self_Employed,
        "ApplicantIncome": data.ApplicantIncome,
        "CoapplicantIncome": data.CoapplicantIncome,
        "LoanAmount": data.LoanAmount,
        "Loan_Amount_Term": data.Loan_Amount_Term,
        "Credit_History": data.Credit_History,
        "Property_Area": data.Property_Area,
    }])

    # The pipeline handles imputation, encoding, and scaling internally
    prediction = store.model.predict(input_df)[0]          # "Y" or "N"
    probabilities = store.model.predict_proba(input_df)[0]  # [P(N), P(Y)]

    # classes_ = ["N", "Y"] — index 1 is Approved ("Y")
    y_index = store.classes_.index("Y")
    n_index = store.classes_.index("N")

    approval_score = round(float(probabilities[y_index]) * 100, 1)
    rejection_score = round(float(probabilities[n_index]) * 100, 1)

    return {
        "prediction": "Approved" if prediction == "Y" else "Rejected",
        "approval_score": approval_score,
        "rejection_score": rejection_score,
        "k_value": 7,
        "model": "K-Nearest Neighbors",
        "distance_metric": "Euclidean (L2)",
    }


# ============================================
# GET /api/model-results
# ============================================

@app.get("/api/model-results")
async def model_results():
    ensure_model()

    return {
        "algorithm": "K-Nearest Neighbors",
        "task": "Binary Classification",
        "training_split": 80,
        "testing_split": 20,
        "scaling": "StandardScaler (inside Pipeline)",
        "distance_metric": "Euclidean (L2)",
        "dataset_size": store.dataset_size,
        "train_size": store.train_size,
        "test_size": store.test_size,
        "best_k": 7,
        "best_cv_accuracy": None,
        "tuned_accuracy": store.accuracy,
        "default_accuracy": store.accuracy,
        "k_experiment": {7: store.accuracy},
        "confusion_matrix": {
            "tn": store.tuned_cm[0][0],
            "fp": store.tuned_cm[0][1],
            "fn": store.tuned_cm[1][0],
            "tp": store.tuned_cm[1][1],
        },
        "classification_report": store.tuned_report,
    }
