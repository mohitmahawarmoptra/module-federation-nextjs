import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-shell">
      <header className="layout-header">
        <div className="layout-brand">
          <Link href="/">Module Federation Host</Link>
        </div>

        <nav className="layout-nav" aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
          <a href="https://dummyjson.com/products?limit=10" target="_blank" rel="noreferrer">
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
