import React, { useState, useEffect } from "react";
import {
  fetchCritics,
  deleteCritic,
  updateCritic,
  createCritic,
  OceniRestoran,
} from "../services/ApiService";

function Critics() {
  const [selectedForm, setSelectedForm] = useState(null);

  return (
    <div className="critics-page">
      <h1>📝 Kritičari</h1>

      <div className="actions">
        <button onClick={() => setSelectedForm("show")}>📋 Prikaži sve</button>
        <button onClick={() => setSelectedForm("add")}>➕ Dodaj</button>
        <button onClick={() => setSelectedForm("delete")}>🗑️ Obriši</button>
        <button onClick={() => setSelectedForm("edit")}>✏️ Ažuriraj</button>
        <button onClick={() => setSelectedForm("rate")}>⭐ Oceni restoran</button>
      </div>

      <div className="form-container">
        {selectedForm === "show" && <ShowCritics />}
        {selectedForm === "add" && <AddCriticForm />}
        {selectedForm === "delete" && <DeleteCriticForm />}
        {selectedForm === "edit" && <EditCriticForm />}
        {selectedForm === "rate" && <RateForm />}
      </div>

      {/* Scoped earthy styles */}
      <style>{`
        .critics-page {
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
        .critics-card {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 14px;
          padding: 20px;
          margin: 16px auto;
          max-width: 600px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          text-align: left;
        }
        .critics-card h3 {
          margin-bottom: 14px;
          font-size: 1.2rem;
          color: #2d2a26;
        }
        .critics-list-container {
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
        form button, .critics-card button {
          margin-top: 10px;
          background: #a3b18a;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        form button:hover, .critics-card button:hover {
          background: #87986a;
        }
      `}</style>
    </div>
  );
}

/* ----------- Show Critics ----------- */
function ShowCritics() {
  const [critics, setCritics] = useState([]);
  const [isListVisible, setIsListVisible] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCritics()
      .then(setCritics)
      .catch(() => setError("Nije moguće učitati kritičare."));
  }, []);

  return (
    <div>
      <button onClick={() => setIsListVisible(!isListVisible)}>
        {isListVisible ? "🙈 Sakrij kritičare" : "👀 Prikaži kritičare"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isListVisible && (
        <div className="critics-list-container">
          {critics.map((critic, i) => (
            <div key={critic.id || i} className="critics-card">
              <h3>{critic.name}</h3>
              <p style={{ fontStyle: "italic" }}>{critic.specialization}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------- Add Critic ----------- */
function AddCriticForm() {
  const [form, setForm] = useState({ name: "", specialization: "" });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.specialization) {
      setError("⚠️ Sva polja su obavezna.");
      return;
    }
    try {
      await createCritic(form);
      alert("✅ Kritičar dodat!");
      setForm({ name: "", specialization: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="critics-card">
      <h3>➕ Dodaj kritičara</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Ime i prezime" />
      <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specijalizacija" />
      <button type="submit">Dodaj</button>
    </form>
  );
}

/* ----------- Delete Critic ----------- */
function DeleteCriticForm() {
  const [criticName, setCriticName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await deleteCritic(criticName);
      alert("🗑️ Kritičar obrisan!");
      setCriticName("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="critics-card">
      <h3>🗑️ Obriši kritičara</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input value={criticName} onChange={e => setCriticName(e.target.value)} placeholder="Ime kritičara" />
      <button type="submit">Obriši</button>
    </form>
  );
}

/* ----------- Edit Critic ----------- */
function EditCriticForm() {
  const [criticId, setCriticId] = useState("");
  const [updatedCritic, setUpdatedCritic] = useState({ name: "", specialization: "" });

  const handleChange = e => setUpdatedCritic({ ...updatedCritic, [e.target.name]: e.target.value });

  const handleUpdateClick = async () => {
    try {
      await updateCritic(criticId, updatedCritic);
      alert("✏️ Kritičar ažuriran!");
    } catch (err) {
      alert("Greška: " + err.message);
    }
  };

  return (
    <div className="critics-card">
      <h3>✏️ Izmeni kritičara</h3>
      <input value={criticId} onChange={e => setCriticId(e.target.value)} placeholder="ID kritičara" />
      <input name="name" value={updatedCritic.name} onChange={handleChange} placeholder="Ime" />
      <input name="specialization" value={updatedCritic.specialization} onChange={handleChange} placeholder="Specijalizacija" />
      <button onClick={handleUpdateClick}>Sačuvaj</button>
    </div>
  );
}

/* ----------- Rate Restaurant ----------- */
function RateForm() {
  const [restaurantName, setRestaurantName] = useState("");
  const [criticName, setCriticName] = useState("");
  const [ocena, setOcena] = useState("");

  const handleSubmit = async () => {
    try {
      await OceniRestoran(criticName, restaurantName, parseInt(ocena));
      alert("⭐ Ocena dodata!");
      setRestaurantName(""); setCriticName(""); setOcena("");
    } catch {
      alert("Greška prilikom ocenjivanja restorana.");
    }
  };

  return (
    <div className="critics-card">
      <h3>⭐ Oceni restoran</h3>
      <input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} placeholder="Naziv restorana" />
      <input value={criticName} onChange={e => setCriticName(e.target.value)} placeholder="Ime kritičara" />
      <input type="number" value={ocena} onChange={e => setOcena(e.target.value)} placeholder="Ocena [1-5]" />
      <button onClick={handleSubmit}>Oceni</button>
    </div>
  );
}

export default Critics;
