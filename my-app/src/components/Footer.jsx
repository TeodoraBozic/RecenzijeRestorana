import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} GastroGuide • Teodora & Jana</p>

      <style>{`
        .footer {
          background: #eae6df;
          color: #2d2a26;
          text-align: center;
          padding: 12px 16px;
          font-size: 14px;
          border-top: 1px solid rgba(0,0,0,0.1);
          margin-top: auto;
        }
        .footer p {
          margin: 0;
          opacity: 0.85;
        }
      `}</style>
    </footer>
  );
}
