"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "HOME" },
    { href: "/prediction", label: "PREDICTION" },
    { href: "/model", label: "MODEL" },
    { href: "/results", label: "RESULTS" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="navbar-brand">
            KNN_LOAN_PREDICTOR
          </Link>
          <div className="system-badge">
            <span className="system-dot"></span>
            <span className="system-badge-text">System Online</span>
          </div>
        </div>

        <nav className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          <Link href="/prediction">
            <button className="btn-primary">[ RUN PREDICTION ]</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
