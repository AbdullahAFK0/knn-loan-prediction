"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pipelineSteps = [
  "DATASET",
  "CLEAN DATA",
  "IMPUTATION",
  "ENCODING",
  "TRAIN/TEST SPLIT",
  "STANDARD SCALER",
];

export default function ModelPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/model-results")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => setError(err.message));
  }, []);

  // Build info cards from fetched data or show loading
  const infoCards = data
    ? [
        { label: "ALGORITHM", value: "KNN" },
        { label: "TASK", value: "CLASSIFICATION" },
        { label: "BEST_K", value: String(data.best_k) },
        { label: "TRAINING_SPLIT", value: `${data.training_split}%` },
        { label: "TEST_SPLIT", value: `${data.testing_split}%` },
        { label: "SCALING", value: "STANDARD_SCALER" },
        { label: "DISTANCE_METRIC", value: "EUCLIDEAN (L2)" },
      ]
    : [
        { label: "ALGORITHM", value: "KNN" },
        { label: "TASK", value: "CLASSIFICATION" },
        { label: "BEST_K", value: "..." },
        { label: "TRAINING_SPLIT", value: "..." },
        { label: "TEST_SPLIT", value: "..." },
        { label: "SCALING", value: "..." },
        { label: "DISTANCE_METRIC", value: "..." },
      ];

  // Feature names from backend or fallback
  const features = data
    ? data.features.map((f) => f.toUpperCase().replace(/ /g, "_"))
    : [
        "DEPENDENTS", "APPLICANT_INCOME", "COAPPLICANT_INCOME",
        "LOAN_AMOUNT", "LOAN_AMOUNT_TERM", "CREDIT_HISTORY",
        "GENDER_MALE", "MARRIED_YES", "EDUCATION_NOT_GRADUATE",
        "SELF_EMPLOYED_YES", "PROPERTY_AREA_SEMIURBAN", "PROPERTY_AREA_URBAN",
      ];

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
        {/* Model Information Header */}
        <section
          style={{
            padding: "48px 32px 0",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h1
              className="headline-lg"
              style={{ textTransform: "uppercase" }}
            >
              <span
                style={{
                  color: "var(--primary-container)",
                  marginRight: 12,
                }}
              >
                &gt;
              </span>
              MODEL_INFORMATION
            </h1>
          </div>
          <p
            className="label-md"
            style={{
              color: "var(--on-surface-variant)",
              marginBottom: 32,
            }}
          >
            [SYS.INFO] DETAILED SPECIFICATIONS FOR THE ACTIVE PREDICTIVE
            MODEL. K-NEAREST NEIGHBORS KERNEL INITIALIZED.
          </p>

          {error && (
            <div
              style={{
                border: "1px solid var(--error)",
                padding: 16,
                marginBottom: 24,
                background: "rgba(147, 0, 10, 0.1)",
              }}
            >
              <span className="code-snippet" style={{ color: "var(--error)" }}>
                &gt; MODEL_CONNECTION_ERROR: Unable to connect to the prediction model.
              </span>
              <br />
              <span className="code-snippet" style={{ color: "var(--on-surface-variant)" }}>
                Please make sure the Python backend is running.
              </span>
            </div>
          )}

          <div
            style={{
              borderBottom: "1px solid var(--outline-variant)",
              marginBottom: 48,
            }}
          />

          {/* Info Cards Row */}
          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 16,
              marginBottom: 48,
              flexWrap: "wrap",
            }}
          >
            {infoCards.map((card) => (
              <div key={card.label} className="info-card">
                <div className="info-card-label">{card.label}</div>
                <div className="info-card-value">{card.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline Architecture */}
        <section
          style={{
            padding: "0 32px 48px",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <div className="section-header">
            <div className="section-title">
              <span
                className="material-symbols-outlined"
                style={{ color: "var(--primary)" }}
              >
                account_tree
              </span>
              <h2
                className="headline-sm"
                style={{ textTransform: "uppercase" }}
              >
                PIPELINE_ARCHITECTURE
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              overflowX: "auto",
              padding: "24px 0",
            }}
          >
            {pipelineSteps.map((step, i) => (
              <div
                key={step}
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="pipeline-step">{step}</div>
                {i < pipelineSteps.length - 1 && (
                  <span className="pipeline-arrow">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Feature Vector */}
        <section
          style={{
            padding: "0 32px 80px",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <div className="section-header">
            <div className="section-title">
              <span
                className="material-symbols-outlined"
                style={{ color: "var(--primary)" }}
              >
                data_object
              </span>
              <h2
                className="headline-sm"
                style={{ textTransform: "uppercase" }}
              >
                FEATURE_VECTOR
              </h2>
            </div>
            {data && (
              <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>
                {features.length} FEATURES
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {features.map((feat, i) => (
              <div key={feat} className="feature-card">
                <div className="feature-card-header">
                  <span className="feature-card-id">
                    ID:{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="feature-card-dot" />
                </div>
                <div className="feature-card-name">{feat}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
