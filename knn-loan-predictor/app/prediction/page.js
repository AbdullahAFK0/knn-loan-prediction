"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PredictionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [form, setForm] = useState({
    Gender: "Male",
    Married: "Yes",
    Dependents: "0",
    Education: "Graduate",
    Self_Employed: "No",
    ApplicantIncome: "",
    CoapplicantIncome: "",
    LoanAmount: "",
    Loan_Amount_Term: "360",
    Credit_History: "1",
    Property_Area: "Urban",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
    setError(null);
  };

  const validate = () => {
    const errors = {};

    if (!form.ApplicantIncome || form.ApplicantIncome === "") {
      errors.ApplicantIncome = "REQUIRED: ENTER APPLICANT INCOME";
    } else if (parseFloat(form.ApplicantIncome) < 0) {
      errors.ApplicantIncome = "ERROR: VALUE MUST BE >= 0";
    }

    if (!form.CoapplicantIncome && form.CoapplicantIncome !== "0" && form.CoapplicantIncome !== 0) {
      if (form.CoapplicantIncome === "") {
        errors.CoapplicantIncome = "REQUIRED: ENTER CO-APPLICANT INCOME";
      }
    } else if (parseFloat(form.CoapplicantIncome) < 0) {
      errors.CoapplicantIncome = "ERROR: VALUE MUST BE >= 0";
    }

    if (!form.LoanAmount || form.LoanAmount === "") {
      errors.LoanAmount = "REQUIRED: ENTER LOAN AMOUNT";
    } else if (parseFloat(form.LoanAmount) <= 0) {
      errors.LoanAmount = "ERROR: VALUE MUST BE > 0";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      setLoadingStep("> CONNECTING_TO_MODEL");
      await delay(400);

      setLoadingStep("> PREPROCESSING_INPUT");
      await delay(300);

      setLoadingStep("> RUNNING_KNN");

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ApplicantIncome: parseFloat(form.ApplicantIncome),
          CoapplicantIncome: parseFloat(form.CoapplicantIncome || 0),
          LoanAmount: parseFloat(form.LoanAmount),
          Loan_Amount_Term: parseFloat(form.Loan_Amount_Term),
          Credit_History: parseFloat(form.Credit_History),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Server error: ${res.status}`);
      }

      setLoadingStep("> GENERATING_PREDICTION");
      const data = await res.json();
      await delay(300);

      // Store result in sessionStorage and navigate
      sessionStorage.setItem(
        "predictionResult",
        JSON.stringify({ ...data, input: form })
      );
      router.push("/prediction/result");
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("fetch")) {
        setError("MODEL_CONNECTION_ERROR");
      } else {
        setError(err.message || "PREDICTION_FAILED");
      }
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: 64,
          minHeight: "100vh",
          background: "var(--background)",
        }}
      >
        {/* Preprocessing status */}
        <div style={{ padding: "16px 32px" }}>
          <span
            className="code-snippet"
            style={{ color: "var(--on-surface-variant)" }}
          >
            &gt; PREPROCESSING_READY_
          </span>
        </div>

        <section
          style={{ maxWidth: 800, margin: "0 auto", padding: "24px 32px 80px" }}
        >
          {/* Title */}
          <h1
            className="headline-lg"
            style={{
              textTransform: "uppercase",
              marginBottom: 8,
              fontSize: "clamp(28px, 4vw, 40px)",
            }}
          >
            <span style={{ color: "var(--primary-container)" }}>&gt; </span>
            LOAN_PREDICTION
          </h1>
          <div
            style={{
              borderLeft: "3px solid var(--primary-container)",
              paddingLeft: 16,
              marginBottom: 32,
            }}
          >
            <span
              className="label-md"
              style={{ color: "var(--on-surface-variant)" }}
            >
              ENTER APPLICANT INFORMATION TO EXECUTE THE PREDICTION MODEL.
            </span>
          </div>

          {/* Connection Error */}
          {error === "MODEL_CONNECTION_ERROR" && (
            <div
              style={{
                border: "1px solid var(--error)",
                padding: 24,
                marginBottom: 24,
                background: "rgba(147, 0, 10, 0.1)",
              }}
            >
              <div
                className="headline-sm"
                style={{ color: "var(--error)", marginBottom: 12 }}
              >
                &gt; MODEL_CONNECTION_ERROR
              </div>
              <p
                className="body-md"
                style={{ color: "var(--on-error-container)", marginBottom: 8 }}
              >
                Unable to connect to the prediction model.
              </p>
              <p
                className="code-snippet"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Please make sure the Python backend is running:
                <br />
                cd backend &amp;&amp; uvicorn main:app --reload --port 8000
              </p>
            </div>
          )}

          {error && error !== "MODEL_CONNECTION_ERROR" && (
            <div
              style={{
                border: "1px solid var(--error)",
                padding: 16,
                marginBottom: 24,
                background: "rgba(147, 0, 10, 0.1)",
              }}
            >
              <span
                className="code-snippet"
                style={{ color: "var(--error)" }}
              >
                &gt; ERROR: {error}
              </span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div
              style={{
                border: "1px solid var(--outline-variant)",
                padding: 24,
                marginBottom: 24,
                background: "var(--surface-container-lowest)",
              }}
            >
              <div
                className="code-snippet"
                style={{ color: "var(--primary-container)", marginBottom: 8 }}
              >
                {loadingStep}
                <span className="animate-blink">_</span>
              </div>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div
                  className="progress-fill"
                  style={{
                    width:
                      loadingStep.includes("CONNECTING") ? "25%" :
                      loadingStep.includes("PREPROCESSING") ? "50%" :
                      loadingStep.includes("RUNNING") ? "75%" :
                      loadingStep.includes("GENERATING") ? "95%" : "0%",
                    transition: "width 0.4s ease-out",
                  }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Panel wrapper */}
            <div className="panel" style={{ marginBottom: 32 }}>
              {/* [01] APPLICANT_INFORMATION */}
              <div
                className="form-section"
                style={{
                  border: "none",
                  borderBottom: "1px solid var(--outline-variant)",
                }}
              >
                <div className="form-section-header">
                  <div className="form-section-dot" />
                  <span className="form-section-title">
                    [01] APPLICANT_INFORMATION
                  </span>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">GENDER</label>
                    <select
                      name="Gender"
                      value={form.Gender}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Male">MALE</option>
                      <option value="Female">FEMALE</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">MARRIED</label>
                    <select
                      name="Married"
                      value={form.Married}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Yes">YES</option>
                      <option value="No">NO</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">DEPENDENTS</label>
                    <select
                      name="Dependents"
                      value={form.Dependents}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3+">3+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">EDUCATION</label>
                    <select
                      name="Education"
                      value={form.Education}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Graduate">GRADUATE</option>
                      <option value="Not Graduate">NOT GRADUATE</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">SELF_EMPLOYED</label>
                    <select
                      name="Self_Employed"
                      value={form.Self_Employed}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="No">NO</option>
                      <option value="Yes">YES</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* [02] FINANCIAL_DATA */}
              <div
                className="form-section"
                style={{
                  border: "none",
                  borderBottom: "1px solid var(--outline-variant)",
                }}
              >
                <div className="form-section-header">
                  <div className="form-section-dot" />
                  <span className="form-section-title">
                    [02] FINANCIAL_DATA
                  </span>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">APPLICANT_INCOME ($)</label>
                    <input
                      type="number"
                      name="ApplicantIncome"
                      value={form.ApplicantIncome}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="any"
                      style={
                        validationErrors.ApplicantIncome
                          ? { borderColor: "var(--error)" }
                          : {}
                      }
                    />
                    {validationErrors.ApplicantIncome && (
                      <span
                        className="label-md"
                        style={{ color: "var(--error)", marginTop: 4 }}
                      >
                        {validationErrors.ApplicantIncome}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      CO_APPLICANT_INCOME ($)
                    </label>
                    <input
                      type="number"
                      name="CoapplicantIncome"
                      value={form.CoapplicantIncome}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="any"
                      style={
                        validationErrors.CoapplicantIncome
                          ? { borderColor: "var(--error)" }
                          : {}
                      }
                    />
                    {validationErrors.CoapplicantIncome && (
                      <span
                        className="label-md"
                        style={{ color: "var(--error)", marginTop: 4 }}
                      >
                        {validationErrors.CoapplicantIncome}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">LOAN_AMOUNT ($K)</label>
                    <input
                      type="number"
                      name="LoanAmount"
                      value={form.LoanAmount}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="any"
                      style={
                        validationErrors.LoanAmount
                          ? { borderColor: "var(--error)" }
                          : {}
                      }
                    />
                    {validationErrors.LoanAmount && (
                      <span
                        className="label-md"
                        style={{ color: "var(--error)", marginTop: 4 }}
                      >
                        {validationErrors.LoanAmount}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">LOAN_AMOUNT_TERM (MOS)</label>
                    <select
                      name="Loan_Amount_Term"
                      value={form.Loan_Amount_Term}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="360">360</option>
                      <option value="180">180</option>
                      <option value="480">480</option>
                      <option value="300">300</option>
                      <option value="240">240</option>
                      <option value="120">120</option>
                      <option value="84">84</option>
                      <option value="60">60</option>
                      <option value="36">36</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* [03] CREDIT_AND_PROPERTY */}
              <div className="form-section" style={{ border: "none" }}>
                <div className="form-section-header">
                  <div className="form-section-dot" />
                  <span className="form-section-title">
                    [03] CREDIT_AND_PROPERTY
                  </span>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">CREDIT_HISTORY</label>
                    <select
                      name="Credit_History"
                      value={form.Credit_History}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="1">1.0 (MEETS_GUIDELINES)</option>
                      <option value="0">0.0 (NO_HISTORY)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">PROPERTY_AREA</label>
                    <select
                      name="Property_Area"
                      value={form.Property_Area}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Urban">URBAN</option>
                      <option value="Semiurban">SEMIURBAN</option>
                      <option value="Rural">RURAL</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-execute" disabled={loading}>
                {loading
                  ? "PROCESSING..."
                  : "[ EXECUTE PREDICTION ]"}
              </button>
            </div>
          </form>

          {/* System status footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 32 }}>
            <span
              className="code-snippet"
              style={{ color: "var(--on-surface-variant)" }}
            >
              &gt; WAITING_FOR_INPUT
            </span>
            <span
              className="code-snippet"
              style={{ color: "var(--on-surface-variant)" }}
            >
              SYS.MEM: OK
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
