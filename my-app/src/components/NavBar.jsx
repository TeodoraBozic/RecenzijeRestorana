import React, { useState } from 'react';
import LogoReact from '../assets/react.svg';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import ReorderIcon from '@mui/icons-material/Reorder';

function NavBar() {
  const [openLinks, setOpenLinks] = useState(false); // Stanje za otvaranje/sakrivanje menija

  const toggleNavBar = () => {
    setOpenLinks(!openLinks); // Prebacivanje stanja
  };

  return (
    <div className="navbar">
      <div className="leftSide">
        {/* Prikazivanje loga samo kada meni nije otvoren */}
        {!openLinks && <img src={LogoReact} alt="React Logo" />}
      </div>
      {/* Korišćenje klase za menadžment prikaza menija */}
      <div className={`rightSide ${openLinks ? 'open' : ''}`}>
        <button onClick={toggleNavBar} className="reorderButton">
          <ReorderIcon />
        </button>
        {/* Meni koji se prikazuje kada je openLinks true */}
        <div className={`menuLinks ${openLinks ? 'open' : ''}`}>
          <Link to="/" className={openLinks ? 'active' : ''}>Home</Link>
          <Link to="/menu" className={openLinks ? 'active' : ''}>Menu</Link>
          <Link to="/Restaurants" className={openLinks ? 'active' : ''}>Restorani</Link>
          <Link to="/Critics" className={openLinks ? 'active' : ''}>Kriticari</Link>
          <Link to="/Users" className={openLinks ? 'active' : ''}>Korisnici</Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
