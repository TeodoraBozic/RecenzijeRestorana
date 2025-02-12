import React from 'react';
import InstagramIcon from "@mui/icons-material/Instagram"; // Uvezi ispravno ikonu
import "../styles/footer.css"
function Footer() {
  return (
    <div className="footer">
        <div className="socialmedias"> 
            <InstagramIcon />  {/* Koristi ispravno ime komponente */}
        </div> 
        <span>&copy; Pronadjite nas na instagramu:</span>  {/* Ispravno prikazivanje copyright simbola */}
    </div>
  );
}

export default Footer;
