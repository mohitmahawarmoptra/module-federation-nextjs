import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <div className="shell" style={{ textAlign: "center", paddingTop: "80px" }}>
        <section className="intro">
          <p className="eyebrow">Welcome to</p>
          <h1 className="app-name-header" style={{ fontSize: "64px", marginBottom: "24px" }}>Module Federation Store</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "20px", color: "var(--muted)" }}>
            A state-of-the-art micro-frontend e-commerce platform built with Next.js Pages Router and Module Federation.
          </p>
          <div style={{ marginTop: "48px", display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link 
              href="/products" 
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)",
                color: "var(--btn-text-color)",
                padding: "16px 32px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 8px 24px var(--accent-glow)",
                transition: "transform 200ms ease"
              }}
            >
              Browse Products
            </Link>
            <Link 
              href="/cart" 
              style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                backdropFilter: "blur(12px)",
                color: "var(--foreground)",
                padding: "16px 32px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "var(--shadow-panel)",
                transition: "transform 200ms ease"
              }}
            >
              View Cart
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
