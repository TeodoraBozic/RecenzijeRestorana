import React, { useEffect, useState } from 'react';
import "../styles/users.css"; // Importujemo CSS fajl za stilizovanje forme
import { fetchUsers } from "../services/ApiService"; 
import { deleteUser } from '../services/ApiService';
import { createUser } from '../services/ApiService';
import { updateUser } from '../services/ApiService';
import { omiljeniRestoran } from '../services/ApiService';


function Users() {
  const [selectedForm, setSelectedForm] = useState(null);

  return (
    <div className="korisnici">
      <h1>Korisnici</h1>
      <div className="formaKontejner">
        <AddUserForm />
      </div>
      <div className="dugmadContainer">
        <button onClick={() => setSelectedForm("show")}>Prikaži sve korisnike</button>
        <button onClick={() => setSelectedForm("delete")}>Obriši korisnika</button>
        <button onClick={() => setSelectedForm("edit")}>Azuriraj korisnika</button>
        <button onClick={() => setSelectedForm("rate")}>Omiljeni restoran</button>
      </div>
      <div className="formaKontejner">
        {selectedForm === "show" && <ShowUsers />}
        {selectedForm === "delete" && <DeleteUserForm />}
        {selectedForm === "edit" && <EditUserForm />}
        {selectedForm === "rate" && <FavouriteRestaurant />}
      </div>
    </div>
  );
}

function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [isListVisible, setIsListVisible] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users", error);
        setError("Nije moguće učitati korisnike.");
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

  // const handleRateRestaurants = (criticId) => {
  //   alert(`Prikazuju se/restorani za kritičara sa ID: ${criticId}`);
  // };

  return (
    <div>
      <button onClick={toggleListVisibility}>
        {isListVisible ? "Sakrij korisnike" : "Prikaži korisnike"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isListVisible && (
        <div className="users-list-container">
         {users.map((user, index) => (
  <div key={user.id || index} className="users-card">
    <div className="users-info">
      <h3 className="users-name">{user.name}</h3>
      <p className="users-email">{user.email}</p>
      <p className="users-password">{user.password}</p>
      <div className="dugmicizakorisnike">
        {/* <button onClick={() => handleRateRestaurants(user.id)}>Oceni restorane</button>
        <button onClick={() => handleRateRestaurants(user.id)}>Vidi ocenjene</button> */}
      </div>
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
}



function DeleteUserForm() {
  const [userID, setUserID] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userID.trim()) {
      alert("Molimo unesite ID korisnika.");
      return;
    }

    try {
      // Pozivamo funkciju za brisanje korisnika
      await deleteUser(userID);
      alert("Korisnik uspešno obrisan!");
      setUserID("");
    } catch (error) {
      // U slučaju greške, prikazujemo detaljniju poruku
      setError(error.message || "Došlo je do greške prilikom brisanja korisnika.");
      console.error("Greška prilikom brisanja:", error);
    }
  };

  return (
    <div>
      <h3>Obriši korisnika</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="userID">Unesite ID korisnika:</label>
        <input
          type="text"
          id="userID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          placeholder="ID korisnika"
          required
        />
        <button type="submit">Obriši</button>
      </form>
    </div>
  );
}
const EditUserForm = () => {
  const [userID, setUserID] = useState(""); // Polje za unos ID-ja
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email:"",
    password:""
    // Početno je false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

 
  const handleUpdateClick = async () => {
    if (!userID) {
      alert("Morate uneti ID korisnika.");
      return;
    }

    try {
      const updated = await updateUser(userID, updatedUser);
      console.log("Updated user:", updated);
      alert("Korisnik uspešno ažuriran!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Došlo je do greške prilikom ažuriranja korisnika.");
    }
  };

  return (
    <div className="users-card">
      <h3>Izmenite korisnika</h3>

      {/* Polje za unos ID-ja */}
      <input
        type="text"
        name="id"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        placeholder="Unesite ID korisnika"
      />

      {/* Polja za unos novih vrednosti */}
      <input
        type="text"
        name="name"
        value={updatedUser.name}
        onChange={handleInputChange}
        placeholder="Izmenite ime"
      />
      <input
        type="text"
        name="email"
        value={updatedUser.email}
        onChange={handleInputChange}
        placeholder="Izmenite email adresu"
      />
        <input
        type="text"
        name="password"
        value={updatedUser.password}
        onChange={handleInputChange}
        placeholder="Izmenite password"
      />

      {/* Dugme za ažuriranje */}
      <button onClick={handleUpdateClick}>Ažuriraj kriticara</button>
    </div>
  );
};




function AddUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const userData = { name, email, password};

    try {
      const response = await createUser(userData);
      setName("");
      setEmail("");
      setPassword("");
      alert("User added successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj korisnika</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Ime i prezime"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
         <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Dodaj korisnika</button>
    </form>
  );
}

const FavouriteRestaurant = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!restaurantName || !userName || !comment) {
      alert("Sva polja moraju biti popunjena.");
      return;
    }

    try {
      const response = await omiljeniRestoran(
        restaurantName,
        userName,
        comment // Osiguraj da je prepTime broj
      );
      alert(response); // Prikazujemo poruku iz backend odgovora
    } catch (error) {
      alert("Došlo je do greške prilikom ostavljanja komentara.");
    }
  };    

  return (
    <div className="users-card">
      <h3>Ostavi komentar restoranu</h3>

      <input
        type="text"
        placeholder="Naziv restorana"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
      />
      <input
        type="text"
        placeholder="UserName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Komentar:)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={handleSubmit}>Ostavi komentar</button>
    </div>
  );
};




export default Users;
