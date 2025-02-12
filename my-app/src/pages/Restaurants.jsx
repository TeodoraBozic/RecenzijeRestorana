import React, { useState, useEffect } from "react";
import { deleteRestaurant, miselinova, updateDish } from "../services/ApiService";
import { fetchRestaurants } from "../services/ApiService"; 
import { createRestaurant } from '../services/ApiService'; 
import { updateRestaurant } from '../services/ApiService'; 
import { createDish } from '../services/ApiService'; 
import { deleteDish } from "../services/ApiService";
import styles from '../styles/Restaurants.module.css';
import {dodeliJeloRestoranu} from "../services/ApiService";
import {vratiJelaRestorana} from "../services/ApiService";
import { veganskaJela } from "../services/ApiService";

import "../styles/kartice.css";



function Restorani() {
  const [izabranaForma, setIzabranaForma] = useState(null);
  const [izabranaFormaJela, setIzabranaFormaJela] = useState(null);

  return (
    <div className={styles.restorani}>
      <div className={styles.kontejnerZaglavljeRestorani}>
        <h1>Restorani</h1>
        <div className={styles.dugmadRestorani}>
          <button onClick={() => setIzabranaForma("prikazi")}>Prikaži sve restorane</button>
          <button onClick={() => setIzabranaForma("dodaj")}>Dodaj restoran</button>
          <button onClick={() => setIzabranaForma("obrisi")}>Obriši restoran</button>
          <button onClick={() => setIzabranaForma("izmeni")}>Izmeni informacije o restoranu</button>
        </div>
      </div>

      <div className={styles.kontejnerForma}>
        {izabranaForma === "prikazi" && <PrikaziRestorane />}
        {izabranaForma === "dodaj" && <DodajRestoran />}
        {izabranaForma === "obrisi" && <ObrisiRestoran />}
        {izabranaForma === "izmeni" && <IzmeniRestoran />}
      </div>

      <div className={styles.kontejnerZaglavljeJela}>
        <h1>Jela</h1>
        <div className={styles.dugmadJela}>
          <button onClick={() => setIzabranaFormaJela("prikazi")}>Prikaži jela jednog restorana</button>
          <button onClick={() => setIzabranaFormaJela("dodaj")}>Dodaj jelo</button>
          <button onClick={() => setIzabranaFormaJela("obrisi")}>Obriši jelo</button>
          <button onClick={() => setIzabranaFormaJela("izmeni")}>Izmeni jelo</button>
          <button onClick={() => setIzabranaFormaJela("prik")}>Dodeli jelo restoranu</button>

        </div>
      </div>

      <div className={styles.kontejnerForma}>
        {izabranaFormaJela === "prikazi" && <PrikaziJela />}
        {izabranaFormaJela === "dodaj" && <DodajJelo />}
        {izabranaFormaJela === "obrisi" && <ObrisiJelo />}
        {izabranaFormaJela === "izmeni" && <IzmeniJelo />}
        {izabranaFormaJela === "prik" && <DodeliJeloRestoranu />}
      </div>

      <div className={styles.kontejnerZaglavljeRestorani}>
        <h1>Dodatne informacije</h1>
        <div className={styles.dugmadInformacije}>
          <button onClick={() => setIzabranaForma("prik")}>Svi restorani sa veganskim jelima</button>
          <button onClick={() => setIzabranaForma("pr")}>Restorani sa Miselinovom</button>
          <button onClick={() => setIzabranaForma("ob")}>Pretrazi po oceni</button>
          <button onClick={() => setIzabranaForma("izizi")}>Pretrazi po kriticaru</button>
          <button onClick={() => setIzabranaForma("komm")}>Vidi komentare restorana</button>


        </div>
      </div>

      <div className={styles.kontejnerForma}>
        {izabranaForma === "prik" && <VeganskaJela />}
        {izabranaForma === "pr" && <Miselinova />}
         {izabranaForma === "ob" && <PretragaPoOceni />}
        {izabranaForma === "izizi" && <PretragaPoKriticaru />} 
        {izabranaForma === "komm" && <KomentariJednogRestorana/>}
      </div>


      

      
    </div>
  );
}


function PrikaziRestorane() {
  const [restorani, setRestorani] = useState([]);
  const [isListVisible, setIsListVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRestaurants(); // Pretpostavljam da funkcija fetchRestaurants() dohvaća podatke
        setRestorani(data);
      } catch (error) {
        console.error("Error loading restaurants", error);
      }
    };

    fetchData();
  }, []);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
    if (isListVisible) {
      // Kada sakrivaš listu, vraćaš stranicu na početni položaj
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="restaurant-list-container">
      <div className="header">
        <h2>Svi restorani</h2>
        <button className="toggle-button" onClick={toggleListVisibility}>
          {isListVisible ? "X" : "Prikazivanje restorana"}
        </button>
      </div>
      {isListVisible && (
        <div className="listarestorana">
          {restorani.map((restoran) => (
            <li key={restoran.Id} className="restaurant-card">
              {/* Osnovne informacije o restoranu */}
              <h3 className="restaurant-name">{restoran.name}</h3>
              <p className="restaurant-location">
                <strong>Location:</strong> {restoran.location}
              </p>
              <p className="restaurant-cuisine">
                <strong>Cuisine Type:</strong> {restoran.cuisineType}
              </p>
              <p className="restaurant-michelin">
                <strong>Michelin Star:</strong> {restoran.michelinStar ? "Yes" : "No"}
              </p>
              <p className="restaurant-chef">
                <strong>Chef:</strong> {restoran.chef}
              </p>
              <p className="restaurant-hours">
                <strong>Opening Hours:</strong> {restoran.openingHours}
              </p>
              <p className="restaurant-rating">
                <strong>Average Rating:</strong> {restoran.avgRate}
              </p>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}





function DodajRestoran() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [michelinStar, setMichelinStar] = useState(false);
  const [chef, setChef] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location || !cuisineType || !chef || !openingHours) {
      setError("All fields are required.");
      return;
    }

    const restaurantData = { name, location, cuisineType, michelinStar, chef, openingHours };

    try {
      const response = await createRestaurant(restaurantData);
      // Reset form fields
      setName("");
      setLocation("");
      setCuisineType("");
      setMichelinStar(false);
      setChef("");
      setOpeningHours("");
      alert("Restaurant added successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj restoran</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Naziv restorana"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lokacija"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tip kuhunje"
        value={cuisineType}
        onChange={(e) => setCuisineType(e.target.value)}
      />
      <label> 
        Michelin zvezda:
        <input
          type="checkbox"
          checked={michelinStar}
          onChange={(e) => setMichelinStar(e.target.checked)}
        />
      </label>

      <input
        type="text"
        placeholder="Šef"
        value={chef}
        onChange={(e) => setChef(e.target.value)}
      />
      <input
        type="text"
        placeholder="Radno vreme"
        value={openingHours}
        onChange={(e) => setOpeningHours(e.target.value)}
      />
      <button type="submit">Dodaj restoran</button>
    </form>
  );
}

function ObrisiRestoran() {
  const [restaurantName, setRestaurantName] = useState(""); // Unos imena restorana
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Sprečava podrazumevano ponašanje forme

    if (!restaurantName.trim()) {
      alert("Molimo unesite ime restorana.");
      return;
    }

    try {
      await deleteRestaurant(restaurantName); // Pozivanje funkcije za brisanje iz ApiService
      alert("Restoran uspešno obrisan!");
      setRestaurantName(""); // Resetuje unos
    } catch (error) {
      setError("Došlo je do greške prilikom brisanja restorana.");
      console.error("Greška prilikom brisanja:", error);
    }
  };

  return (
    <div>
      <h3>Obriši Restoran</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="restaurantName">Unesite ime restorana:</label>
        <input
          type="text"
          id="restaurantName"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          placeholder="Ime restorana"
          required
        />
        <button type="submit">Obriši</button>
      </form>
    </div>
  );
}





const IzmeniRestoran = () => {
  const [restaurantId, setRestaurantId] = useState(""); // Polje za unos ID-ja
  const [updatedRestaurant, setUpdatedRestaurant] = useState({
    name: "",
    chef: "",
    cuisineType: "",
    openingHours: "",
    michelinStar: false, // Početno je false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRestaurant({
      ...updatedRestaurant,
      [name]: value,
    });
  };

  const handleCheckboxChange = () => {
    setUpdatedRestaurant({
      ...updatedRestaurant,
      michelinStar: !updatedRestaurant.michelinStar,
    });
  };

  const handleUpdateClick = async () => {
    if (!restaurantId) {
      alert("Morate uneti ID restorana.");
      return;
    }

    try {
      const updated = await updateRestaurant(restaurantId, updatedRestaurant);
      console.log("Updated restaurant:", updated);
      alert("Restoran uspešno ažuriran!");
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Došlo je do greške prilikom ažuriranja restorana.");
    }
  };

  return (
    <div className="restaurant-card">
      <h3>Izmenite restoran</h3>

      {/* Polje za unos ID-ja */}
      <input
        type="text"
        name="id"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        placeholder="Unesite ID restorana"
      />

      {/* Polja za unos novih vrednosti */}
      <input
        type="text"
        name="name"
        value={updatedRestaurant.name}
        onChange={handleInputChange}
        placeholder="Izmenite ime"
      />
      <input
        type="text"
        name="chef"
        value={updatedRestaurant.chef}
        onChange={handleInputChange}
        placeholder="Izmenite ime šefa"
      />
      <input
        type="text"
        name="cuisineType"
        value={updatedRestaurant.cuisineType}
        onChange={handleInputChange}
        placeholder="Izmenite tip kuhinje"
      />
      <input
        type="text"
        name="openingHours"
        value={updatedRestaurant.openingHours}
        onChange={handleInputChange}
        placeholder="Izmenite radno vreme"
      />

      {/* Polje za unos Michelin zvezde */}
      <label>
        Michelin Star:
        <input
          type="checkbox"
          name="michelinStar"
          checked={updatedRestaurant.michelinStar}
          onChange={handleCheckboxChange}
        />
      </label>

      {/* Dugme za ažuriranje */}
      <button onClick={handleUpdateClick}>Ažuriraj restoran</button>
    </div>
  );
};









function DodajJelo() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [signatureDish, setSignatureDish] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [details, setDetails] = useState("");
  const [calories, setCalories] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !price  || !details || !calories) {
      setError("All fields are required.");
      return;
    }

  

    const dishData = { name, price, signatureDish, isVegan, details, calories };

    try {
      const response = await createDish(dishData);
      // Reset form fields
      setName("");
      setPrice("");
      setSignatureDish(false);
      setIsVegan(false);
      setDetails("");
      setCalories("");
      alert("Dish added successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj jelo</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="name">Naziv jela:</label>
      <input
        type="text"
        id="name"
        placeholder="Naziv jela"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="price">Cena:</label>
      <input
        type="text"
        id="price"
        placeholder="Cena"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label>
        Specijalitet kuce:
        <input
          type="checkbox"
          checked={signatureDish}
          onChange={(e) => setSignatureDish(e.target.checked)}
        />
      </label>

      <label>
        Da li je vegansko?:
        <input
          type="checkbox"
          checked={isVegan}
          onChange={(e) => setIsVegan(e.target.checked)}
        />
      </label>

      <label htmlFor="details">Detalji:</label>
      <input
        type="text"
        id="details"
        placeholder="Detalji"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <label htmlFor="calories">Kalorije:</label>
      <input
        type="text"
        id="calories"
        placeholder="Kalorije"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <button type="submit">Dodaj jelo</button>
    </form>
  );
}


function ObrisiJelo() {
  const [dishName, setDishName] = useState(""); // Unos imena restorana
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Sprečava podrazumevano ponašanje forme

    if (!dishName.trim()) {
      alert("Molimo unesite ime jela.");
      return;
    }

    try {
      await deleteDish(dishName); // Pozivanje funkcije za brisanje iz ApiService
      alert("Jelo je uspešno obrisano!");
      setDishName(""); // Resetuje unos
    } catch (error) {
      setError("Došlo je do greške prilikom brisanja jela.");
      console.error("Greška prilikom brisanja:", error);
    }
  };

  return (
    <div>
      <h3>Obriši Jelo</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="dishName">Unesite ime jela:</label>
        <input
          type="text"
          id="dishName"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          placeholder="Ime jela"
          required
        />
        <button type="submit">Obriši</button>
      </form>
    </div>
  );
}


const IzmeniJelo = () => {
  const [dishID, setDishID] = useState(""); // Polje za unos ID-ja
  const [updatedDish, setUpdatedDish] = useState({
    name: "",
    details: "",
    price: 0,
    calories: 0,
    isVegan: false,
    signatureDish: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedDish({
      ...updatedDish,
      [name]: name === "price" || name === "calories" ? Number(value) : value,
    });
  };

  const handleIsVeganChange = () => {
    setUpdatedDish({
      ...updatedDish,
      isVegan: !updatedDish.isVegan,
    });
  };

  const handleSignatureDishChange = () => {
    setUpdatedDish({
      ...updatedDish,
      signatureDish: !updatedDish.signatureDish,
    });
  };

  const handleUpdateClick = async () => {
    if (!dishID) {
      alert("Morate uneti ID jela.");
      return;
    }

    if (updatedDish.price < 0 || updatedDish.calories < 0) {
      alert("Cena i kalorije moraju biti pozitivni brojevi.");
      return;
    }

    try {
      const updated = await updateDish(dishID, updatedDish);
      console.log("Updated dish:", updated);
      alert("Jelo uspešno ažurirano!");
    } catch (error) {
      console.error("Error updating dish:", error);
      alert("Došlo je do greške prilikom ažuriranja jela.");
    }
  };

  return (
    <div className="restaurant-card">
      <h3>Izmenite jelo</h3>

      {/* Polje za unos ID-ja */}
      <input
        type="text"
        name="id"
        value={dishID}
        onChange={(e) => setDishID(e.target.value)}
        placeholder="Unesite ID jela"
      />

      {/* Polja za unos novih vrednosti */}
      <input
        type="text"
        name="name"
        value={updatedDish.name}
        onChange={handleInputChange}
        placeholder="Izmenite naziv jela"
      />
      <input
        type="text"
        name="details"
        value={updatedDish.details}
        onChange={handleInputChange}
        placeholder="Izmenite detalje"
      />
      <input
        type="text"
        name="price"
        value={updatedDish.price}
        onChange={handleInputChange}
        placeholder="Izmenite cenu"
      />
      <input
        type="text"
        name="calories"
        value={updatedDish.calories}
        onChange={handleInputChange}
        placeholder="Izmenite broj kalorija"
      />

      {/* Polje za unos veganskog statusa i specijaliteta */}
      <label>
        Da li je vegansko?:
        <input
          type="checkbox"
          name="isVegan"
          checked={updatedDish.isVegan}
          onChange={handleIsVeganChange}
        />
      </label>
      <label>
        Da li je specijalitet kuće?:
        <input
          type="checkbox"
          name="signatureDish"
          checked={updatedDish.signatureDish}
          onChange={handleSignatureDishChange}
        />
      </label>

      {/* Dugme za ažuriranje */}
      <button onClick={handleUpdateClick}>Ažuriraj jelo</button>
    </div>
  );
};

const DodeliJeloRestoranu = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [dishName, setDishName] = useState("");
  const [prepTime, setPrepTime] = useState("");

  const handleSubmit = async () => {
    if (!restaurantName || !dishName || !prepTime) {
      alert("Sva polja moraju biti popunjena.");
      return;
    }

    try {
      const response = await dodeliJeloRestoranu(
        restaurantName,
        dishName,
        parseInt(prepTime) // Osiguraj da je prepTime broj
      );
      alert(response); // Prikazujemo poruku iz backend odgovora
    } catch (error) {
      alert("Došlo je do greške prilikom dodele jela restoranu.");
    }
  };    

  return (
    <div className="restaurant-card">
      <h3>Dodeli jelo restoranu</h3>

      <input
        type="text"
        placeholder="Naziv restorana"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Naziv jela"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Vreme pripreme (min)"
        value={prepTime}
        onChange={(e) => setPrepTime(e.target.value)}
      />

      <button onClick={handleSubmit}>Dodeli jelo</button>
    </div>
  );
};



const PrikaziJela = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);

  const getDishes = async () => {
    if (!restaurantName) {
      setError("Ime restorana nije uneseno.");
      return;
    }
    try {
      const dishesData = await vratiJelaRestorana(restaurantName);
      console.log(dishesData); // Dodaj ovo da vidiš šta se tačno vraća iz API-ja
      if (dishesData.length === 0) {
        setError("Restoran nema jela na meniju.");
      } else {
        setDishes(dishesData);
        setError(null); // Reset error if the data is fetched successfully
      }
    } catch (error) {
      setError("Greška prilikom učitavanja jela.");
    }
  };

  return (
    <div>
      <h2>Unesite ime restorana:</h2>
      <input
        type="text"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        placeholder="Ime restorana"
      />
      <button onClick={getDishes}>Prikaži jela</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {dishes.length > 0 && (
        <div>
          <h3>Jela za restoran: {restaurantName}</h3>
          <ul>
          {dishes.map((dish, index) => (
  <li key={index}>
    <strong>{dish.name}</strong><br />
    Cena: {dish.price} RSD<br />
    Detalji: {dish.details ? dish.details : "Nema detalja"}<br />
    Specijalitet kuće: {dish.signatureDish !== undefined ? (dish.signatureDish ? "Da" : "Ne") : "Nema podataka"}<br />
    Vegansko: {dish.isVegan !== undefined ? (dish.isVegan ? "Da" : "Ne") : "Nema podataka"}<br />
    Kalorije: {dish.calories !== undefined ? dish.calories : "Nema kalorija"} kcal
  </li>
))}


          </ul>
        </div>
      )}
    </div>
  );
};


const VeganskaJela = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Pozivanje funkcije kada se komponenta učita
    const fetchVeganRestaurants = async () => {
      try {
        const data = await veganskaJela();
        setRestaurants(data); // Čuvanje rezultata u stanju
      } catch (error) {
        console.error("Error loading vegan restaurants:", error);
      }
    };

    fetchVeganRestaurants(); // Pokreni fetch metod
  }, []); // Efekat se pokreće samo jednom prilikom učitavanja komponente

  return (
    <div>
      <h1>Restorani sa veganskim jelima</h1>
      <ul>
        {restaurants.map((restaurant, index) => (
          <li key={index}>
            {restaurant.restaurantName}: {restaurant.dishName}
          </li>
        ))}
      </ul>
    </div>
  );
};


const Miselinova = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchMichRestaurants = async () => {
      try {
        const data = await miselinova(); // Pretpostavka: miselinova() vraća niz stringova
        console.log("Fetched data:", data); // Provera podataka u konzoli
        setRestaurants(data);
      } catch (error) {
        console.error("Error loading restaurants:", error);
      }
    };

    fetchMichRestaurants();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f8f9fa" }}>
      <h1 style={{ textAlign: "center", color: "#343a40", marginBottom: "20px" }}>
        Restorani sa Mišelinovom zvezdicom
      </h1>
      <ul style={{ listStyleType: "none", padding: 0, maxWidth: "600px", margin: "0 auto" }}>
        {restaurants.map((restaurant, index) => (
          <li
            key={index}
            style={{
              padding: "10px 15px",
              margin: "10px 0",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
          >
            {restaurant}
          </li>
        ))}
      </ul>
    </div>
  );
};


const PretragaPoOceni = () => {
  const [score, setScore] = useState(""); // Čuvanje unete ocene
  const [restaurants, setRestaurants] = useState([]); // Lista restorana koji ispunjavaju uslov
  const [error, setError] = useState(null); // Čuvanje grešaka

  const fetchRestaurants = async () => {
    setError(null); // Resetovanje greške pre novog fetch-a
    setRestaurants([]); // Resetovanje rezultata pre novog fetch-a
    if (!score || isNaN(score)) {
      setError("Molimo unesite validnu ocenu.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:5033/api/Restaurant/RestoraniSaOcjenomVecomOd/${score}` // Endpoint
      );

      if (!response.ok) {
        throw new Error("Došlo je do greške prilikom preuzimanja podataka.");
      }

      const data = await response.json(); // Parsiranje odgovora
      setRestaurants(data); // Postavljanje rezultata u stanje
    } catch (err) {
      setError(err.message); // Postavljanje greške
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#343a40" }}>
        Filter Restorana po Oceni
      </h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Unesite ocenu (npr. 4.5)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={fetchRestaurants}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Pretraži
        </button>
      </div>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      <ul style={{ listStyleType: "none", padding: 0, maxWidth: "600px", margin: "0 auto" }}>
        {restaurants.map((restaurant, index) => (
          <li
            key={index}
            style={{
              padding: "10px 15px",
              margin: "10px 0",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <strong>{restaurant.restaurantName}</strong> - Ocena:{" "}
            {restaurant.avgRating}
          </li>
        ))}
      </ul>
    </div>
  );
};



const PretragaPoKriticaru = () => {
  const [criticName, setCriticName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  const FetchRestaurants = async () => {
    setError(null);
    setRestaurants([]);

    if (!criticName.trim()) {
      setError("Unesite ime kritičara.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:5033/api/Restaurant/${criticName}/RestoraniKojeJeOcenio`
      );

      if (!response.ok) {
        // Dodajemo više informacija o grešci za debagovanje
        throw new Error(`Greška ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Podaci sa servera:", data); // Logujemo podatke iz odgovora
      setRestaurants(data);
    } catch (err) {
      console.error("Greška prilikom preuzimanja podataka:", err); // Logujemo grešku
      setError(err.message);
    }
  };

  return (
    <div className="okvir-komponenta">
      <h1 className="naslov-komponenta">Restorani koje je ocenio kritičar</h1>
      <div className="forma-kriticara">
        <input
          type="text"
          placeholder="Ime kritičara"
          value={criticName}
          onChange={(e) => setCriticName(e.target.value)}
          className="unos-kriticara"
        />
        <button onClick={FetchRestaurants} className="dugme-pretraga">
          Pretraži
        </button>
      </div>
      {error && <p className="poruka-greske">{error}</p>}
      <ul className="lista-restorana">
        {restaurants.length === 0 ? (
          <p>Nemamo restorana za prikazivanje.</p>
        ) : (
          restaurants.map((restaurant, index) => (
            <li key={index} className="stavka-restoran">
              <span className="ime-restorana">{restaurant.restaurantName}</span>
              <span className="ocena-restorana">{restaurant.avgRating}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};






const KomentariJednogRestorana = () => {
  const [restaurantName, setRestaurantName] = useState(""); // Držimo ime restorana
  const [comments, setComments] = useState([]); // Držimo komentare
  const [error, setError] = useState(null); // Držimo greške

  const FetchComments = async () => {
    setError(null);
    setComments([]); // Očistimo prethodne komentare prilikom nove pretrage

    if (!restaurantName.trim()) {
      setError("Molimo unesite ime restorana.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:5033/api/User/${restaurantName}/Komentari`
      );

      if (!response.ok) {
        throw new Error(`Greška ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setComments(data);
      } else {
        setError(`Nema komentara za restoran "${restaurantName}".`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", maxWidth: "600px", margin: "20px auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: "20px" }}>
        Komentari za restoran
      </h2>

      {/* Unos za ime restorana */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Unesite ime restorana"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          style={{ padding: "10px", width: "250px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <button
          onClick={FetchComments}
          style={{ padding: "10px", backgroundColor: "#4caf50", color: "white", fontSize: "16px", border: "none", borderRadius: "5px", cursor: "pointer", transition: "background-color 0.3s" }}
        >
          Pretraži
        </button>
      </div>

      {error && <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>{error}</p>}
      {comments.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#777", textAlign: "center" }}>Nema komentara za ovaj restoran.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {comments.map((comment, index) => (
            <div key={index} style={{ marginBottom: "15px", padding: "15px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "5px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "18px", fontWeight: "bold", color: "#333" }}>
                <span style={{ color: "#007bff" }}>{comment.userName}</span>
              </div>
              <p style={{ fontSize: "16px", marginTop: "10px", color: "#555" }}>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};












export default Restorani;
