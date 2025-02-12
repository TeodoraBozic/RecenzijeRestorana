import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Critics from './pages/Critics';
import Restaurants from './pages/Restaurants';
import Users from './pages/Users';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/critics" element={<Critics />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/users" element={<Users />} />
          

        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
