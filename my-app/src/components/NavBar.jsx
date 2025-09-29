import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-logo">
          <Link to="/">🍴 GastroGuide</Link>
        </div>
        <nav className="nav-links">
          <Link to="/restaurants">Restorani</Link>
          <Link to="/critics">Kritičari</Link>
          <Link to="/users">Korisnici</Link>
          <Link to="/menu">Meni</Link>
        </nav>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: linear-gradient(135deg, #a3b18a, #d6a57c);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 10px 20px;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }
        .nav-logo a {
          font-size: 20px;
          font-weight: bold;
          color: #2d2a26;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: 18px;
        }
        .nav-links a {
          text-decoration: none;
          font-weight: 500;
          color: #2d2a26;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .nav-links a:hover {
          background: rgba(255,255,255,0.35);
          color: #000;
        }
      `}</style>
    </header>
  );
}
