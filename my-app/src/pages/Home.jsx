import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="noise" />
      <div className="card">
        <div className="logo">🥗</div>
        <h1>Recenzije restorana</h1>
        <p className="subtitle">Pronađi svoj savršeni ukus</p>

        <div className="actions">
          <Link to="/restaurants" className="btn primary">
            Pogledaj restorane
          </Link>
          <Link to="/critics" className="btn ghost">
            Nastavi kao kritičar
          </Link>
          <Link to="/users" className="btn ghost">
            Nastavi kao korisnik
          </Link>
        </div>
      </div>

      <footer className="foot">
        <span>© {new Date().getFullYear()} GastroGuide</span>
      </footer>

      {/* Scoped styles */}
      <style>{`
        :root{
          --bg1: #f5f3ef; /* topla bež */
          --bg2: #eae6df; /* svetlo peščana */
          --acc: #a3b18a; /* maslinasto-zelena */
          --acc-2: #d6a57c; /* terakota-akcenat */
          --text: #2d2a26; /* tamno-siva braonkasta */
          --muted: #6c675f; /* prigušena taupe */
          --glass: rgba(255,255,255,0.6);
          --glass-border: rgba(0,0,0,0.05);
          --shadow: 0 10px 25px rgba(0,0,0,0.12);
          --radius: 22px;
        }

        *{ box-sizing: border-box; }
        body { margin: 0; }

        .home{
          position: relative;
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 16px;
          color: var(--text);
          background:
            radial-gradient(1000px 700px at 80% 0%, rgba(163,177,138,0.15), transparent 70%),
            radial-gradient(900px 700px at 0% 90%, rgba(214,165,124,0.18), transparent 70%),
            linear-gradient(135deg, var(--bg1), var(--bg2));
          overflow: hidden;
        }

        .noise{
          position: absolute;
          inset: 0;
          opacity: .04;
          background-image: url("data:image/svg+xml;utf8,\
            <svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 100 100'>\
              <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter>\
              <rect width='100' height='100' filter='url(%23n)' />\
            </svg>");
          pointer-events: none;
        }

        .card{
          position: relative;
          width: min(720px, 92vw);
          padding: 36px 28px;
          border-radius: var(--radius);
          backdrop-filter: blur(14px);
          background: var(--glass);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          text-align: center;
          animation: pop .5s ease both;
        }

        .logo{
          width: 68px; height: 68px;
          display: grid; place-items: center;
          margin: 0 auto 12px;
          font-size: 34px;
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(163,177,138,0.25), rgba(214,165,124,0.25));
          border: 1px solid var(--glass-border);
        }

        h1{
          margin: 6px 0 6px;
          letter-spacing: 0.4px;
          font-size: clamp(26px, 3.6vw, 40px);
        }

        .subtitle{
          margin: 0 auto 22px;
          max-width: 40ch;
          color: var(--muted);
          font-size: clamp(14px, 1.8vw, 16px);
        }

        .actions{
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
          margin-top: 10px;
        }

        @media (min-width: 640px){
          .actions{
            grid-template-columns: 1.2fr 1fr 1fr;
          }
        }

        .btn{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 18px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.2px;
          border: 1px solid var(--glass-border);
          transition: transform .15s ease, box-shadow .2s ease, background .2s ease, color .2s ease, border-color .2s ease;
          will-change: transform;
          backdrop-filter: blur(6px);
        }

        .btn:hover{ transform: translateY(-1.5px); }

        .primary{
          background: linear-gradient(135deg, rgba(163,177,138,0.25), rgba(214,165,124,0.25));
          color: var(--text);
          box-shadow: 0 8px 18px rgba(163,177,138,0.15);
          border-color: rgba(163,177,138,0.4);
        }
        .primary:hover{
          background: linear-gradient(135deg, rgba(163,177,138,0.32), rgba(214,165,124,0.35));
          box-shadow: 0 12px 26px rgba(214,165,124,0.22);
        }

        .ghost{
          background: rgba(255,255,255,0.35);
          color: var(--text);
        }
        .ghost:hover{
          background: rgba(255,255,255,0.5);
          border-color: rgba(0,0,0,0.1);
        }

        .foot{
          position: absolute;
          bottom: 16px;
          inset-inline: 0;
          display: grid;
          place-items: center;
          color: var(--muted);
          font-size: 12px;
          opacity: .9;
          pointer-events: none;
        }

        @keyframes pop{
          from{ transform: translateY(6px); opacity: 0; }
          to{ transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
