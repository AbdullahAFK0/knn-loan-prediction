"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PredictionResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/prediction");
    }
  }, [router]);

  if (!result) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="code-snippet" style={{ color: "var(--on-surface-variant)" }}>LOADING RESULTS...</span>
        </main>
        <Footer />
      </>
    );
  }

  const isApproved = result.prediction === "Approved";
  const approvalScore = result.approval_score;
  const rejectionScore = result.rejection_score;
  const kValue = result.k_value;
  const distanceMetric = result.distance_metric || "Euclidean (L2)";
  const modelName = result.model || "K-Nearest Neighbors";

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--background)" }}>
        <section style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 32px" }}>
          {/* Title */}
          <h1
            className="headline-lg"
            style={{
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <span style={{ color: "var(--primary-container)" }}>&gt; </span>
            MODEL_EXECUTION_COMPLETE
          </h1>
          <div style={{ width: 60, height: 3, background: "var(--primary-container)", marginBottom: 48 }} />

          {/* Main Content Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
            {/* Left: Result Card */}
            <div className="panel">
              <div className="panel-header">
                <span>OUTPUT // LOAN_STATUS</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="animate-pulse-green"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isApproved ? "var(--primary-container)" : "var(--error)",
                    }}
                  />
                  <span style={{ color: isApproved ? "var(--primary-container)" : "var(--error)" }}>
                    SCORE: {approvalScore}%
                  </span>
                </div>
              </div>
              <div
                className="panel-body"
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                }}
              >
                <div className="label-lg" style={{ color: "var(--on-surface-variant)", marginBottom: 24 }}>
                  PREDICTION RESULT
                </div>
                <h2
                  className={isApproved ? "result-approved" : "result-rejected"}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(48px, 8vw, 80px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: 48,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {isApproved ? "APPROVED" : "REJECTED"}
                </h2>

                {/* Approval Score bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>APPROVAL_SCORE</span>
                  <span className="headline-md" style={{ color: "var(--on-surface)" }}>{approvalScore}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${approvalScore}%` }} />
                </div>

                {/* Rejection score */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 16 }}>
                  <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>REJECTION_SCORE</span>
                  <span className="headline-md" style={{ color: "var(--on-surface-variant)" }}>{rejectionScore}%</span>
                </div>
                <div className="progress-bar">
                  <div style={{ height: "100%", background: "var(--error)", width: `${rejectionScore}%`, transition: "width 1s ease-out" }} />
                </div>
              </div>
            </div>

            {/* Right: Execution Parameters + Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Parameters Panel */}
              <div className="panel">
                <div className="panel-header">EXECUTION_PARAMETERS</div>
                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <div className="label-md" style={{ color: "var(--on-surface-variant)", marginBottom: 4 }}>ALGORITHM</div>
                    <div className="body-md">{modelName}</div>
                  </div>
                  <div>
                    <div className="label-md" style={{ color: "var(--on-surface-variant)", marginBottom: 4 }}>K_VALUE (NEIGHBORS)</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="headline-md">{kValue}</span>
                      <span className="label-md" style={{ color: "var(--primary-container)" }}>TUNED</span>
                    </div>
                  </div>
                  <div>
                    <div className="label-md" style={{ color: "var(--on-surface-variant)", marginBottom: 4 }}>DISTANCE_METRIC</div>
                    <div className="body-md">{distanceMetric}</div>
                  </div>
                </div>
              </div>

              {/* Actions Panel */}
              <div className="panel">
                <div className="panel-header">AVAILABLE_ACTIONS</div>
                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Link href="/prediction">
                    <button className="btn-cta-primary" style={{ width: "100%", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
                      [ NEW PREDICTION ]
                    </button>
                  </Link>
                  <Link href="/model">
                    <button className="btn-cta-secondary" style={{ width: "100%", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>terminal</span>
                      [ VIEW MODEL ]
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Log */}
          <div className="terminal-log" style={{ marginTop: 48 }}>
            <div className="terminal-line">
              <span>&gt; INITIALIZING_KERNEL...</span>
              <span className="status">[OK]</span>
            </div>
            <div className="terminal-line">
              <span>&gt; MODEL_LOADED: KNN (k={kValue})</span>
              <span className="status">[OK]</span>
            </div>
            <div className="terminal-line">
              <span>&gt; FEATURES_SCALED: StandardScaler applied (mean=0, std=1)</span>
              <span className="status">[OK]</span>
            </div>
            <div className="terminal-line">
              <span>&gt; PREDICTION_COMPLETE: {isApproved ? "APPROVED" : "REJECTED"} (score={approvalScore}%)</span>
              <span className="status">[OK]</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
