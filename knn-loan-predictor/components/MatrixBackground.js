"use client";

import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    let text = "";

    for (let i = 0; i < 2000; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
      if (Math.random() > 0.95) text += " ";
    }

    el.textContent = text;

    const interval = setInterval(() => {
      const str = el.textContent;
      if (!str || str.length === 0) return;
      let newStr = str.split("");
      for (let j = 0; j < 30; j++) {
        const idx = Math.floor(Math.random() * newStr.length);
        newStr[idx] = chars.charAt(Math.floor(Math.random() * chars.length));
      }
      el.textContent = newStr.join("");
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.03,
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        lineHeight: "20px",
        color: "var(--primary-container)",
        overflow: "hidden",
        wordBreak: "break-all",
        userSelect: "none",
      }}
    />
  );
}
