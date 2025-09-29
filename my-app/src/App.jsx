import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Critics from './pages/Critics';
import Restaurants from './pages/Restaurants';
import Users from './pages/Users';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="layout">
          <NavBar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/critics" element={<Critics />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>

      {/* Scoped styles */}
      <style>{`
        :root {
          --bg1: #f5f3ef;   /* bež */
          --bg2: #eae6df;   /* peščana */
          --text: #2d2a26;  /* tamno-siva braonkasta */
        }

        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, var(--bg1), var(--bg2));
          color: var(--text);
          font-family: 'Segoe UI', sans-serif;
        }

        .content {
          flex: 1;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export default App;
