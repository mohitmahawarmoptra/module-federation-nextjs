import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light");
      }
    } catch (e) {
      console.warn("localStorage not available");
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="layout-shell">
      <header className="layout-header">
        <div className="layout-brand">
          <Link href="/">Module Federation Host</Link>
        </div>

        <nav className="layout-nav" aria-label="Primary navigation" style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <button 
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--foreground)',
              padding: '4px 12px',
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              marginLeft: '8px'
            }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <a href="https://dummyjson.com/products?limit=12" target="_blank" rel="noreferrer">
            API
          </a>
        </nav>
      </header>

      <main className="layout-main">{children}</main>

      <footer className="layout-footer">
        <p>© 2026 Module federation demo · Powered by Next.js and remote products</p>
      </footer>
    </div>
  );
}
