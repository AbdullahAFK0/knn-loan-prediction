"use client";

import Link from "next/link";
import MatrixBackground from "@/components/MatrixBackground";

export default function HomeClient() {
  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid var(--outline-variant)",
          background: "var(--surface)",
          padding: "96px 32px",
          overflow: "hidden",
        }}
      >
        <MatrixBackground />

        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            background: "rgba(0, 255, 65, 0.05)",
            borderRadius: "50%",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 800,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
          }}
        >
          {/* Status badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 16px",
              background: "var(--surface-container-high)",
              border: "1px solid var(--outline-variant)",
              marginBottom: 16,
            }}
          >
            <span
              className="animate-pulse-green"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--primary-container)",
              }}
            />
            <span className="code-snippet" style={{ color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              &gt; MACHINE_LEARNING_SYSTEM_INITIALIZED
            </span>
          </div>

          {/* Title */}
          <h1
            className="headline-lg"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: "clamp(40px, 5.5vw, 64px)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            LOAN APPROVAL
            <br />
            PREDICTION{" "}
            <span className="animate-blink" style={{ color: "var(--primary)" }}>
              _
            </span>
          </h1>

          {/* Description */}
          <p
            className="body-lg"
            style={{
              color: "var(--on-surface-variant)",
              maxWidth: 640,
            }}
          >
            Use a K-Nearest Neighbors machine learning model to predict whether a
            loan application is likely to be approved or rejected. High-stakes
            financial modeling meets kernel-level precision.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              paddingTop: 32,
              justifyContent: "center",
            }}
          >
            <Link href="/prediction">
              <button className="btn-cta-primary">
                [ START PREDICTION ]
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </button>
            </Link>
            <Link href="/model">
              <button className="btn-cta-secondary">
                [ VIEW MODEL ]
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  terminal
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section
        style={{
          width: "100%",
          background: "var(--background)",
          padding: "64px 32px",
          borderBottom: "1px solid var(--outline-variant)",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* Section Header */}
          <div className="section-header">
            <div className="section-title">
              <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>
                monitoring
              </span>
              <h2 className="headline-sm" style={{ textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                SYSTEM STATUS
              </h2>
            </div>
            <span className="code-snippet" style={{ color: "var(--on-surface-variant)" }}>
              UPDATE: T-MINUS 0.00ms
            </span>
          </div>

          {/* Status Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              borderTop: "1px solid var(--outline-variant)",
              borderLeft: "1px solid var(--outline-variant)",
            }}
          >
            {/* Engine */}
            <div className="status-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>ENGINE</span>
                <span className="material-symbols-outlined" style={{ color: "var(--primary)", opacity: 0.5 }}>memory</span>
              </div>
              <div className="headline-md" style={{ marginBottom: 8 }}>KNN</div>
              <div className="code-snippet" style={{ color: "var(--on-surface-variant)" }}>K-Nearest Neighbors Algorithm</div>
            </div>

            {/* Dataset */}
            <div className="status-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>DATASET</span>
                <span className="material-symbols-outlined" style={{ color: "var(--primary)", opacity: 0.5 }}>database</span>
              </div>
              <div className="headline-md" style={{ marginBottom: 8 }}>
                614 <span style={{ color: "var(--on-surface-variant)", fontSize: 14, fontWeight: 400 }}>RECORDS</span>
              </div>
              <div className="code-snippet" style={{ color: "var(--on-surface-variant)" }}>Training &amp; Validation Split</div>
            </div>

            {/* Features */}
            <div className="status-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>FEATURES</span>
                <span className="material-symbols-outlined" style={{ color: "var(--primary)", opacity: 0.5 }}>account_tree</span>
              </div>
              <div className="headline-md" style={{ marginBottom: 8 }}>
                11 <span style={{ color: "var(--on-surface-variant)", fontSize: 14, fontWeight: 400 }}>VARIABLES</span>
              </div>
              <div className="code-snippet" style={{ color: "var(--on-surface-variant)" }}>Income, Credit History, etc.</div>
            </div>

            {/* Status */}
            <div className="status-card active" style={{ background: "var(--surface-container)" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0, 255, 65, 0.03)" }} />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <span className="label-md" style={{ color: "var(--on-surface-variant)" }}>STATUS</span>
                <span className="material-symbols-outlined animate-pulse-green" style={{ color: "var(--primary)" }}>check_circle</span>
              </div>
              <div className="headline-md" style={{ color: "var(--primary)", marginBottom: 8, position: "relative" }}>ONLINE</div>
              <div className="code-snippet" style={{ color: "var(--on-surface-variant)", position: "relative" }}>Ready for Input</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
