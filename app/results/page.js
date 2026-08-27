"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/model-results")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch model results");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <span className="code-snippet" style={{ color: "var(--primary-container)" }}>
              &gt; LOADING_MODEL_ANALYTICS<span className="animate-blink">_</span>
            </span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 600, textAlign: "center", padding: 32 }}>
            <div className="headline-sm" style={{ color: "var(--error)", marginBottom: 16 }}>&gt; MODEL_CONNECTION_ERROR</div>
            <p className="body-md" style={{ color: "var(--on-surface-variant)", marginBottom: 8 }}>Unable to connect to the prediction model.</p>
            <p className="code-snippet" style={{ color: "var(--on-surface-variant)" }}>
              Please make sure the Python backend is running:
              <br />cd backend &amp;&amp; uvicorn main:app --reload --port 8000
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const cm = data.confusion_matrix;
  const totalTest = cm.tn + cm.fp + cm.fn + cm.tp;
  const report = data.classification_report;

  // Build K comparison data for chart
  const kExperiment = data.k_experiment;
  const kEntries = Object.entries(kExperiment)
    .map(([k, acc]) => ({ k: parseInt(k), acc }))
    .sort((a, b) => a.k - b.k);

  // Add best_k if not already in the list
  const bestK = data.best_k;
  const tunedAccuracy = data.tuned_accuracy;
  if (!kEntries.find((e) => e.k === bestK)) {
    kEntries.push({ k: bestK, acc: tunedAccuracy });
    kEntries.sort((a, b) => a.k - b.k);
  }

  const chartMinAcc = Math.max(0, Math.floor(Math.min(...kEntries.map((e) => e.acc)) - 5));
  const chartMaxAcc = Math.ceil(Math.max(...kEntries.map((e) => e.acc)) + 3);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--background)" }}>
        <section style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: 20 }}>terminal</span>
            <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>SYS_LOG_V2.0.4</span>
          </div>
          <h1 className="headline-lg" style={{ textTransform: "uppercase", marginBottom: 12 }}>
            <span style={{ color: "var(--primary-container)" }}>&gt; </span>
            MODEL_ANALYTICS
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <p className="body-md" style={{ color: "var(--on-surface-variant)", maxWidth: 500 }}>
              Performance diagnostics and evaluation metrics for the K-Nearest Neighbors predictive kernel. Target parameter optimization successful.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              <div style={{ textAlign: "right" }}>
                <div className="label-md" style={{ color: "var(--on-surface-variant)", marginBottom: 4 }}>TRAINING SPLIT</div>
                <div className="headline-sm">{data.training_split}/{data.testing_split}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="label-md" style={{ color: "var(--on-surface-variant)", marginBottom: 4 }}>DATASET SIZE</div>
                <div className="headline-sm">N={data.dataset_size}</div>
              </div>
            </div>
          </div>

          {/* Accuracy + Chart Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "340px 1fr",
              gap: 0,
              marginTop: 48,
              border: "1px solid var(--outline-variant)",
            }}
          >
            {/* Model Accuracy */}
            <div
              style={{
                background: "var(--surface)",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRight: "1px solid var(--outline-variant)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h3 className="headline-sm" style={{ textTransform: "uppercase" }}>MODEL ACCURACY</h3>
                <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: 20 }}>terminal</span>
              </div>
              <div className="accuracy-value">
                {tunedAccuracy}<span className="accuracy-percent">%</span>
              </div>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="animate-pulse-green" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary-container)" }} />
                <span className="body-sm" style={{ color: "var(--on-surface-variant)" }}>
                  Best K={bestK} (GridSearchCV, cv=5)
                </span>
              </div>
            </div>

            {/* K-Value Chart */}
            <div style={{ background: "var(--surface)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 className="headline-sm" style={{ textTransform: "uppercase" }}>ACCURACY VS K-VALUE</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 2, background: "var(--primary-container)" }} />
                  <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>Test Accuracy</span>
                </div>
              </div>

              {/* Best K tooltip */}
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                <div style={{ padding: "4px 12px", border: "1px solid var(--outline-variant)", background: "var(--surface-container-high)" }}>
                  <span className="label-md" style={{ color: "var(--on-surface)" }}>K={bestK} (Best)</span>
                  {" "}
                  <span className="label-md" style={{ color: "var(--primary-container)" }}>{tunedAccuracy}%</span>
                </div>
              </div>

              {/* SVG Chart */}
              <svg viewBox="0 0 600 200" style={{ width: "100%", height: 200 }}>
                {/* Horizontal grid lines */}
                {Array.from({ length: 4 }, (_, i) => {
                  const val = chartMinAcc + ((chartMaxAcc - chartMinAcc) / 3) * i;
                  const y = 200 - ((val - chartMinAcc) / (chartMaxAcc - chartMinAcc)) * 180 - 10;
                  return (
                    <g key={i}>
                      <line x1="40" y1={y} x2="580" y2={y} stroke="#222" strokeWidth="1" />
                      <text x="585" y={y + 4} fill="var(--on-surface-variant)" fontSize="10" fontFamily="var(--font-mono)">{val.toFixed(0)}%</text>
                    </g>
                  );
                })}

                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="var(--primary-container)"
                  strokeWidth="2"
                  points={kEntries
                    .map((entry, i) => {
                      const x = kEntries.length > 1 ? 40 + (i / (kEntries.length - 1)) * 540 : 300;
                      const y = 200 - ((entry.acc - chartMinAcc) / (chartMaxAcc - chartMinAcc)) * 180 - 10;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* Data dots */}
                {kEntries.map((entry, i) => {
                  const x = kEntries.length > 1 ? 40 + (i / (kEntries.length - 1)) * 540 : 300;
                  const y = 200 - ((entry.acc - chartMinAcc) / (chartMaxAcc - chartMinAcc)) * 180 - 10;
                  const isBest = entry.k === bestK;
                  return (
                    <g key={`d-${i}`}>
                      <circle cx={x} cy={y} r={isBest ? 7 : 5} fill={isBest ? "var(--primary-container)" : "var(--surface)"} stroke={isBest ? "var(--primary-container)" : "var(--on-surface-variant)"} strokeWidth="2" />
                      {isBest && <circle cx={x} cy={y} r="12" fill="none" stroke="var(--primary-container)" strokeWidth="1" opacity="0.4" />}
                    </g>
                  );
                })}

                {/* K labels */}
                {kEntries.map((entry, i) => {
                  const x = kEntries.length > 1 ? 40 + (i / (kEntries.length - 1)) * 540 : 300;
                  const isBest = entry.k === bestK;
                  return (
                    <text
                      key={`k-${entry.k}`}
                      x={x}
                      y={198}
                      textAnchor="middle"
                      fill={isBest ? "var(--primary-container)" : "var(--on-surface-variant)"}
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fontWeight={isBest ? "700" : "400"}
                    >
                      K={entry.k}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Confusion Matrix + Classification Report Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              border: "1px solid var(--outline-variant)",
              borderTop: "none",
            }}
          >
            {/* Confusion Matrix */}
            <div style={{ background: "var(--surface)", padding: "24px", borderRight: "1px solid var(--outline-variant)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 className="headline-sm" style={{ textTransform: "uppercase" }}>CONFUSION MATRIX</h3>
                <div style={{ padding: "4px 12px", border: "1px solid var(--outline-variant)" }}>
                  <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>TEST SET N={totalTest}</span>
                </div>
              </div>

              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>PREDICTED CLASS</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gridTemplateRows: "auto 1fr 1fr", gap: 0 }}>
                <div />
                <div style={{ textAlign: "center", padding: 8 }}>
                  <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>Rejected (0)</span>
                </div>
                <div style={{ textAlign: "center", padding: 8 }}>
                  <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>Approved (1)</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", padding: 8, gridRow: "2 / 4" }}>
                  <span className="label-md" style={{ color: "var(--on-surface-variant)", letterSpacing: "0.1em" }}>ACTUAL CLASS</span>
                </div>
                <div className="cm-cell" style={{ background: "var(--surface-container-high)" }}>
                  <span className="cm-label" style={{ color: "var(--primary-container)" }}>TRUE NEGATIVE</span>
                  <span className="cm-value" style={{ color: "var(--on-surface)" }}>{cm.tn}</span>
                </div>
                <div className="cm-cell">
                  <span className="cm-label" style={{ color: "var(--error)" }}>FALSE POSITIVE</span>
                  <span className="cm-value" style={{ color: "var(--error)" }}>{cm.fp}</span>
                </div>

                <div className="cm-cell">
                  <span className="cm-label" style={{ color: "var(--error)" }}>FALSE NEGATIVE</span>
                  <span className="cm-value" style={{ color: "var(--error)" }}>{cm.fn}</span>
                </div>
                <div className="cm-cell" style={{ background: "var(--surface-container-high)" }}>
                  <span className="cm-label" style={{ color: "var(--primary-container)" }}>TRUE POSITIVE</span>
                  <span className="cm-value" style={{ color: "var(--on-surface)" }}>{cm.tp}</span>
                </div>
              </div>
            </div>

            {/* Classification Report */}
            <div style={{ background: "var(--surface)", padding: "24px" }}>
              <h3 className="headline-sm" style={{ textTransform: "uppercase", marginBottom: 24 }}>CLASSIFICATION REPORT</h3>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>METRIC</th>
                    <th style={{ textAlign: "right" }}>REJECTED (0)</th>
                    <th style={{ textAlign: "right" }}>APPROVED (1)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Precision</td>
                    <td style={{ textAlign: "right" }}>{report.Rejected.precision.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>{report.Approved.precision.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Recall</td>
                    <td style={{ textAlign: "right" }}>{report.Rejected.recall.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>{report.Approved.recall.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>F1-Score</td>
                    <td style={{ textAlign: "right" }}>{report.Rejected.f1_score.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>{report.Approved.f1_score.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Support</td>
                    <td style={{ textAlign: "right" }}>{report.Rejected.support}</td>
                    <td style={{ textAlign: "right" }}>{report.Approved.support}</td>
                  </tr>
                </tbody>
              </table>

              {/* Export section */}
              <div
                style={{
                  marginTop: 32,
                  padding: 16,
                  background: "var(--surface-container-high)",
                  border: "1px solid var(--outline-variant)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: 20 }}>download</span>
                  <div>
                    <div className="label-lg" style={{ color: "var(--on-surface)" }}>EXPORT METRICS REPORT</div>
                    <div className="label-md" style={{ color: "var(--on-surface-variant)", marginTop: 2 }}>JSON / CSV Format available</div>
                  </div>
                </div>
                <button className="btn-primary" style={{ fontSize: 12, padding: "6px 16px" }}>EXPORT DATA</button>
              </div>
            </div>
          </div>

          {/* Bottom info bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
              padding: "24px 0",
              borderTop: "1px solid var(--outline-variant)",
              marginTop: 48,
            }}
          >
            <div>
              <span className="code-snippet" style={{ color: "var(--primary-container)" }}>&gt; ANALYTICS_GENERATED</span>
              <br />
              <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>BEST_K: {bestK}</span>
            </div>
            <div>
              <span className="code-snippet" style={{ color: "var(--primary-container)" }}>&gt; CV_FOLDS: 5</span>
              <br />
              <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>CROSS_VALIDATION_ACCURACY: {data.best_cv_accuracy}%</span>
            </div>
            <div>
              <span className="code-snippet" style={{ color: "var(--primary-container)" }}>&gt; DISTANCE_METRIC: {data.distance_metric}</span>
              <br />
              <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>P=2 (EUCLIDEAN)</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
