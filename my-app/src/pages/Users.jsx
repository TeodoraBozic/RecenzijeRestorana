import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  deleteUser,
  createUser,
  updateUser,
  omiljeniRestoran,
} from "../services/ApiService";

function Users() {
  const [selectedForm, setSelectedForm] = useState(null);

  return (
    <div className="users-page">
      <h1>👤 Korisnici</h1>

      <div className="actions">
        <button onClick={() => setSelectedForm("show")}>📋 Prikaži sve</button>
        <button onClick={() => setSelectedForm("add")}>➕ Dodaj</button>
        <button onClick={() => setSelectedForm("delete")}>🗑️ Obriši</button>
        <button onClick={() => setSelectedForm("edit")}>✏️ Ažuriraj</button>
        <button onClick={() => setSelectedForm("rate")}>⭐ Omiljeni restoran</button>
      </div>

      <div className="form-container">
        {selectedForm === "show" && <ShowUsers />}
        {selectedForm === "add" && <AddUserForm />}
        {selectedForm === "delete" && <DeleteUserForm />}
        {selectedForm === "edit" && <EditUserForm />}
        {selectedForm === "rate" && <FavouriteRestaurant />}
      </div>

      {/* Scoped earthy styles */}
      <style>{`
        .users-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 20px;
          text-align: center;
          color: #2d2a26;
          font-family: 'Segoe UI', sans-serif;
        }
        h1 {
          margin-bottom: 20px;
          font-size: 2rem;
          background: linear-gradient(135deg, #a3b18a, #d6a57c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
        }
        .actions button {
          background: linear-gradient(135deg, #a3b18a, #d6a57c);
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          color: #2d2a26;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .actions button:hover {
          background: linear-gradient(135deg, #b5c49d, #e2b38f);
          transform: translateY(-2px);
        }
        .form-container {
          margin-top: 20px;
        }
        .users-card {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 14px;
          padding: 20px;
          margin: 16px auto;
          max-width: 600px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          text-align: left;
        }
        .users-card h3 {
          margin-bottom: 14px;
          font-size: 1.2rem;
          color: #2d2a26;
        }
        .users-list-container {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }
        input {
          display: block;
          width: 100%;
          margin: 10px 0;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        form button, .users-card button {
          margin-top: 10px;
          background: #a3b18a;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        form button:hover, .users-card button:hover {
          background: #87986a;
        }
      `}</style>
    </div>
  );
}

/* ----------- Show Users ----------- */
function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [isListVisible, setIsListVisible] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError("Nije moguće učitati korisnike."));
  }, []);

  return (
    <div>
      <button onClick={() => setIsListVisible(!isListVisible)}>
        {isListVisible ? "🙈 Sakrij korisnike" : "👀 Prikaži korisnike"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isListVisible && (
        <div className="users-list-container">
          {users.map((user, i) => (
            <div key={user.id || i} className="users-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p style={{ fontSize: "0.9em", color: "#777" }}>{user.password}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------- Add User ----------- */
function AddUserForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("⚠️ Sva polja su obavezna.");
      return;
    }
    try {
      await createUser(form);
      alert("✅ Korisnik dodat!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="users-card">
      <h3>➕ Dodaj korisnika</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Ime i prezime" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Dodaj</button>
    </form>
  );
}

/* ----------- Delete User ----------- */
function DeleteUserForm() {
  const [userID, setUserID] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await deleteUser(userID);
      alert("🗑️ Korisnik obrisan!");
      setUserID("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="users-card">
      <h3>🗑️ Obriši korisnika</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input value={userID} onChange={e => setUserID(e.target.value)} placeholder="ID korisnika" />
      <button type="submit">Obriši</button>
    </form>
  );
}

/* ----------- Edit User ----------- */
function EditUserForm() {
  const [userID, setUserID] = useState("");
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", password: "" });

  const handleChange = e => setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });

  const handleUpdateClick = async () => {
    try {
      await updateUser(userID, updatedUser);
      alert("✏️ Korisnik ažuriran!");
    } catch (err) {
      alert("Greška: " + err.message);
    }
  };

  return (
    <div className="users-card">
      <h3>✏️ Izmeni korisnika</h3>
      <input value={userID} onChange={e => setUserID(e.target.value)} placeholder="ID korisnika" />
      <input name="name" value={updatedUser.name} onChange={handleChange} placeholder="Ime" />
      <input name="email" value={updatedUser.email} onChange={handleChange} placeholder="Email" />
      <input name="password" value={updatedUser.password} onChange={handleChange} placeholder="Password" />
      <button onClick={handleUpdateClick}>Sačuvaj</button>
    </div>
  );
}

/* ----------- Favourite Restaurant ----------- */
function FavouriteRestaurant() {
  const [restaurantName, setRestaurantName] = useState("");
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      await omiljeniRestoran(restaurantName, userName, comment);
      alert("⭐ Komentar dodat!");
      setRestaurantName(""); setUserName(""); setComment("");
    } catch {
      alert("Greška prilikom ostavljanja komentara.");
    }
  };

  return (
    <div className="users-card">
      <h3>⭐ Omiljeni restoran</h3>
      <input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} placeholder="Naziv restorana" />
      <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Ime korisnika" />
      <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Komentar" />
      <button onClick={handleSubmit}>Sačuvaj</button>
    </div>
  );
}

export default Users;
