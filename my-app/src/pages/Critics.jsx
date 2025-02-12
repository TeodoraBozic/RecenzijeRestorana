import React, { useState, useEffect } from "react";
import "../styles/critics.css";
import { fetchCritics } from "../services/ApiService";
import { deleteCritic } from "../services/ApiService";
import { updateCritic } from "../services/ApiService";
import { createCritic } from "../services/ApiService";
import { OceniRestoran } from "../services/ApiService";



function Critics() {
  const [selectedForm, setSelectedForm] = useState(null);

  return (
    <div className="kriticari">
      <h1>Kritičari</h1>
      <div className="formaKontejner">
        <AddCriticForm />
      </div>
      <div className="dugmadContainer">
        <button onClick={() => setSelectedForm("show")}>Prikaži sve kritičare</button>
        <button onClick={() => setSelectedForm("delete")}>Obriši kritičara</button>
        <button onClick={() => setSelectedForm("edit")}>Azuriraj kriticara</button>
        <button onClick={() => setSelectedForm("rate")}>Oceni restoran</button>
      </div>
      <div className="formaKontejner">
        {selectedForm === "show" && <ShowCritics />}
        {selectedForm === "delete" && <DeleteCriticForm />}
        {selectedForm === "edit" && <EditCriticForm />}
        {selectedForm === "rate" && <RateForm />}
      </div>
    </div>
  );
}

function ShowCritics() {
  const [kriticari, setCritics] = useState([]);
  const [isListVisible, setIsListVisible] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCritics();
        setCritics(data);
      } catch (error) {
        console.error("Error loading critics", error);
        setError("Nije moguće učitati kritičare.");
      }
    };

    fetchData();
  }, []);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
    if (isListVisible) {
      window.scrollTo(0, 0);
    }
  };

  const handleRateRestaurants = (criticId) => {
    alert(`Prikazuju se/restorani za kritičara sa ID: ${criticId}`);
  };

  return (
    <div>
      <button onClick={toggleListVisibility}>
        {isListVisible ? "Sakrij kritičare" : "Prikaži kritičare"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isListVisible && (
        <div className="kriticari-list-container">
          {kriticari.map((critic, index) => (
            <div key={critic.id || index} className="kriticari-card">
              <div className="kriticari-info">
                <h3 className="kriticari-name">{critic.name}</h3>
                <p className="kriticari-specialization">{critic.specialization}</p>
                <div className="dugmicizakriticare">
                  <button onClick={() => handleRateRestaurants(critic.id)}>Oceni restorane</button>
                  <button onClick={() => handleRateRestaurants(critic.id)}>Vidi ocenjene</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function DeleteCriticForm() {
  const [criticName, setCriticName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!criticName.trim()) {
      alert("Molimo unesite ime kritičara.");
      return;
    }

    try {
      await deleteCritic(criticName);
      alert("Kritičar uspešno obrisan!");
      setCriticName("");
    } catch (error) {
      setError("Došlo je do greške prilikom brisanja kritičara.");
      console.error("Greška prilikom brisanja:", error);
    }
  };

  return (
    <div>
      <h3>Obriši kritičara</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="criticName">Unesite ime kritičara:</label>
        <input
          type="text"
          id="criticName"
          value={criticName}
          onChange={(e) => setCriticName(e.target.value)}
          placeholder="Ime kritičara"
          required
        />
        <button type="submit">Obriši</button>
      </form>
    </div>
  );
}

const EditCriticForm = () => {
  const [criticId, setCriticId] = useState(""); // Polje za unos ID-ja
  const [updatedCritic, setUpdatedCritic] = useState({
    name: "",
    specialization:""
    // Početno je false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCritic({
      ...updatedCritic,
      [name]: value,
    });
  };

 
  const handleUpdateClick = async () => {
    if (!criticId) {
      alert("Morate uneti ID kriticara.");
      return;
    }

    try {
      const updated = await updateCritic(criticId, updatedCritic);
      console.log("Updated critic:", updated);
      alert("Kritičar uspešno ažuriran!");
    } catch (error) {
      console.error("Error updating critic:", error);
      alert("Došlo je do greške prilikom ažuriranja kritičara.");
    }
  };

  return (
    <div className="kriticari-card">
      <h3>Izmenite kriticara</h3>

      {/* Polje za unos ID-ja */}
      <input
        type="text"
        name="id"
        value={criticId}
        onChange={(e) => setCriticId(e.target.value)}
        placeholder="Unesite ID kriticara"
      />

      {/* Polja za unos novih vrednosti */}
      <input
        type="text"
        name="name"
        value={updatedCritic.name}
        onChange={handleInputChange}
        placeholder="Izmenite ime"
      />
      <input
        type="text"
        name="specialization"
        value={updatedCritic.specialization}
        onChange={handleInputChange}
        placeholder="Izmenite specijalnost"
      />
      

      {/* Dugme za ažuriranje */}
      <button onClick={handleUpdateClick}>Ažuriraj kriticara</button>
    </div>
  );
};




function AddCriticForm() {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !specialization) {
      setError("All fields are required.");
      return;
    }

    const criticData = { name, specialization};

    try {
      const response = await createCritic(criticData);
      setName("");
      setSpecialization("");
      alert("Critic added successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj kriticara</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Ime i prezime"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Specijalizacija"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
      />
      <button type="submit">Dodaj kritičara</button>
    </form>
  );
}


const RateForm = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [criticName, setCriticName] = useState("");
  const [ocena, setOcena] = useState("");

  const handleSubmit = async () => {
    if (!restaurantName || !criticName || !ocena) {
      alert("Sva polja moraju biti popunjena.");
      return;
    }

    try {
      const response = await OceniRestoran(
        criticName,
        restaurantName,
        parseInt(ocena) // Osiguraj da je prepTime broj
      );
      alert(response); // Prikazujemo poruku iz backend odgovora
    } catch (error) {
      alert("Došlo je do greške prilikom ocenjivanja restorana.");
    }
  };    

  return (
    <div className="restaurant-card">
      <h3>Oceni restoran</h3>

      <input
        type="text"
        placeholder="Naziv restorana"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ime kriticara"
        value={criticName}
        onChange={(e) => setCriticName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ocena [1-5])"
        value={ocena}
        onChange={(e) => setOcena(e.target.value)}
      />

      <button onClick={handleSubmit}>Oceni</button>
    </div>
  );
};








export default Critics;
