import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // Importuj Link iz react-router-dom
import "../styles/home.css";

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        <h1>Recenzije restorana</h1>
        <p>Pronadji svoj savrseni ukus</p>

        <Link to="/restaurants">
          <button className = 'nekohome'>Pogledaj restorane</button>
        </Link>
        <Link to="/critics">
          <button className = 'nekohome'>Nastavi kao kritičar</button>
        </Link>
        <Link to="/users">
          <button className = 'nekohome'>Nastavi kao korisnik</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
