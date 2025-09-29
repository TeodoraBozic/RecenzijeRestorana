import React, { useState, useEffect } from "react";
import {
  fetchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createDish,
  updateDish,
  deleteDish,
  dodeliJeloRestoranu,
  vratiJelaRestorana,
  veganskaJela,
  miselinova
} from "../services/ApiService";

function Restorani() {
  const [izabranaForma, setIzabranaForma] = useState(null);
  const [izabranaFormaJela, setIzabranaFormaJela] = useState(null);

  return (
    <div className="earth-page">
      <div className="earth-header">
        <h1>Restorani</h1>
        <p className="subtitle">Upravljaj restoranima i menijima u par klikova</p>
      </div>

      <section className="earth-section">
        <div className="earth-toolbar">
          <button className={`btn ${izabranaForma === "prikazi" ? "btn-primary" : "btn-ghost"}`} onClick={() => setIzabranaForma("prikazi")}>Prikaži sve</button>
          <button className={`btn ${izabranaForma === "dodaj" ? "btn-primary" : "btn-ghost"}`} onClick={() => setIzabranaForma("dodaj")}>Dodaj</button>
          <button className={`btn ${izabranaForma === "obrisi" ? "btn-danger" : "btn-ghost"}`} onClick={() => setIzabranaForma("obrisi")}>Obriši</button>
          <button className={`btn ${izabranaForma === "izmeni" ? "btn-primary" : "btn-ghost"}`} onClick={() => setIzabranaForma("izmeni")}>Izmeni</button>
        </div>

        <div className="earth-body">
          {izabranaForma === "prikazi" && <PrikaziRestorane />}
          {izabranaForma === "dodaj" && <DodajRestoran />}
          {izabranaForma === "obrisi" && <ObrisiRestoran />}
          {izabranaForma === "izmeni" && <IzmeniRestoran />}
          {!izabranaForma && <EmptyHint text="Izaberi akciju za rad sa restoranima." />}
        </div>
      </section>

      <section className="earth-section">
        <div className="earth-header-inline">
          <h2>Jela</h2>
        </div>
        <div className="earth-toolbar">
          <button className={`btn ${izabranaFormaJela === "prikazi" ? "btn-primary" : "btn-ghost"}`} onClick={() => setIzabranaFormaJela("prikazi")}>Prikaži jela restorana</button>
          <button className={`btn ${izabranaFormaJela === "dodaj" ? "btn-primary" : "btn-ghost"}`} onClick={() => setIzabranaFormaJela("dodaj")}>Dodaj jelo</button>
          <button className={`btn ${izabranaFormaJela === "obrisi" ? "btn-danger" : "btn-ghost"}`} onClick={() => setIzabranaFormaJela("obrisi")}>Obriši jelo</button>
          <button className={`btn ${izabranaFormaJela === "izmeni" ? "btn-primary" : "btn-ghost"}`} onClick={() => setIzabranaFormaJela("izmeni")}>Izmeni jelo</button>
          <button className={`btn ${izabranaFormaJela === "prik" ? "btn-primary" : "btn-ghost"}`} onClick={() => setIzabranaFormaJela("prik")}>Dodeli jelo restoranu</button>
        </div>

        <div className="earth-body">
          {izabranaFormaJela === "prikazi" && <PrikaziJela />}
          {izabranaFormaJela === "dodaj" && <DodajJelo />}
          {izabranaFormaJela === "obrisi" && <ObrisiJelo />}
          {izabranaFormaJela === "izmeni" && <IzmeniJelo />}
          {izabranaFormaJela === "prik" && <DodeliJeloRestoranu />}
          {!izabranaFormaJela && <EmptyHint text="Izaberi akciju za rad sa jelima." />}
        </div>
      </section>

      <section className="earth-section">
        <div className="earth-header-inline">
          <h2>Dodatne informacije</h2>
        </div>
        <div className="earth-toolbar wrap">
          <button className="btn btn-ghost" onClick={() => setIzabranaForma("prik")}>Restorani sa veganskim jelima</button>
          <button className="btn btn-ghost" onClick={() => setIzabranaForma("pr")}>Restorani sa Mišelin zvezdom</button>
          <button className="btn btn-ghost" onClick={() => setIzabranaForma("ob")}>Pretraži po oceni</button>
          <button className="btn btn-ghost" onClick={() => setIzabranaForma("izizi")}>Pretraži po kritičaru</button>
          <button className="btn btn-ghost" onClick={() => setIzabranaForma("komm")}>Komentari restorana</button>
        </div>

        <div className="earth-body">
          {izabranaForma === "prik" && <VeganskaJela />}
          {izabranaForma === "pr" && <Miselinova />}
          {izabranaForma === "ob" && <PretragaPoOceni />}
          {izabranaForma === "izizi" && <PretragaPoKriticaru />}
          {izabranaForma === "komm" && <KomentariJednogRestorana />}
          {!["prik", "pr", "ob", "izizi", "komm"].includes(izabranaForma) && (
            <EmptyHint text="Odaberi šta želiš da pregledaš u dodatnim informacijama." />
          )}
        </div>
      </section>

      {/* Scoped styles */}
      <style>{`
        :root{
          --bg1:#f5f3ef;       /* bež */
          --bg2:#eae6df;       /* peščana */
          --ink:#2d2a26;       /* tamno-siva braon */
          --muted:#6c675f;     /* taupe */
          --olive:#a3b18a;     /* maslinasta */
          --terra:#d6a57c;     /* terakota */
          --leaf:#cad2c5;      /* svetla zelena */
          --glass:rgba(255,255,255,0.65);
          --border:rgba(0,0,0,0.08);
          --danger:#b5524e;
          --shadow:0 10px 28px rgba(0,0,0,.10);
          --radius:18px;
        }

        .earth-page{
          min-height:100%;
          display:flex;
          flex-direction:column;
          gap:24px;
          padding:24px 16px 40px;
          color:var(--ink);
          background: linear-gradient(135deg, var(--bg1), var(--bg2));
        }

        .earth-header{
          text-align:center;
          margin-top:8px;
        }
        .earth-header h1{ margin:6px 0 4px; font-size:clamp(24px,3.4vw,36px); letter-spacing:.3px;}
        .subtitle{ color:var(--muted); }

        .earth-section{
          background:var(--glass);
          border:1px solid var(--border);
          box-shadow:var(--shadow);
          backdrop-filter: blur(10px);
          border-radius:var(--radius);
          padding:18px;
        }

        .earth-header-inline{
          display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px;
        }
        .earth-header-inline h2{ margin:0; font-size:20px; }

        .earth-toolbar{
          display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;
        }
        .earth-toolbar.wrap{ row-gap:10px; }

        .earth-body{ padding:8px 2px; }

        .btn{
          height:38px; padding:0 14px;
          border-radius:12px;
          border:1px solid var(--border);
          background:rgba(255,255,255,.6);
          font-weight:600; letter-spacing:.2px;
          cursor:pointer;
          transition:transform .12s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
        }
        .btn:hover{ transform:translateY(-1px); }
        .btn-primary{
          background: linear-gradient(135deg, rgba(163,177,138,.35), rgba(214,165,124,.30));
          border-color: rgba(163,177,138,.45);
          box-shadow: 0 8px 18px rgba(163,177,138,.18);
        }
        .btn-ghost{
          background: rgba(255,255,255,.4);
        }
        .btn-danger{
          background: linear-gradient(135deg, rgba(213,134,128,.25), rgba(214,165,124,.22));
          border-color: rgba(181,82,78,.35);
        }

        .card{
          background:#fff;
          border:1px solid var(--border);
          border-radius:16px;
          box-shadow:var(--shadow);
          padding:16px;
        }

        .grid{
          display:grid; gap:12px;
          grid-template-columns: repeat(1,minmax(0,1fr));
        }
        @media (min-width:640px){
          .grid{ grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (min-width:940px){
          .grid{ grid-template-columns: repeat(3,minmax(0,1fr)); }
        }

        .list-title{
          display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px;
        }

        .input, .select, .textarea{
          width:100%;
          height:40px;
          padding:0 12px;
          border-radius:12px;
          border:1px solid var(--border);
          background:#fff;
          outline:none;
          transition:border-color .2s;
        }
        .textarea{ height:auto; padding:10px 12px; min-height:80px; resize:vertical; }
        .input:focus, .textarea:focus{ border-color: var(--olive); }

        .field{ display:grid; gap:6px; }
        .fields{ display:grid; gap:12px; grid-template-columns:1fr; }
        @media (min-width:640px){ .fields{ grid-template-columns:1fr 1fr; } }

        .check{
          display:flex; align-items:center; gap:10px;
          padding:8px 10px; border:1px solid var(--border);
          border-radius:12px; background:#fff; height:40px;
        }

        .tag{
          display:inline-flex; align-items:center; gap:6px;
          height:26px; padding:0 10px; border-radius:999px;
          background:rgba(163,177,138,.18); border:1px solid rgba(163,177,138,.35);
          font-size:12px;
        }

        .danger{ color:var(--danger); font-weight:600; }
        .muted{ color:var(--muted); }

        .actions-right{ display:flex; gap:10px; }

        .empty{
          text-align:center; color:var(--muted); padding:12px 6px;
        }
      `}</style>
    </div>
  );
}

/* -------------------- HELPERS -------------------- */
function EmptyHint({ text }) {
  return <div className="empty">{text}</div>;
}

/* -------------------- LISTA RESTORANA -------------------- */
function PrikaziRestorane() {
  const [restorani, setRestorani] = useState([]);
  const [isListVisible, setIsListVisible] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRestaurants();
        setRestorani(data);
      } catch (e) {
        console.error("Error loading restaurants", e);
      }
    })();
  }, []);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
    if (isListVisible) window.scrollTo(0, 0);
  };

  return (
    <div className="card">
      <div className="list-title">
        <h3>Svi restorani</h3>
        <div className="actions-right">
          <span className="tag">Ukupno: {restorani?.length || 0}</span>
          <button className="btn btn-ghost" onClick={toggleListVisibility}>
            {isListVisible ? "Sakrij" : "Prikaži"}
          </button>
        </div>
      </div>

      {isListVisible && (
        <div className="grid">
          {restorani.map((r) => (
            <article key={r.Id || r.id || r.name} className="card">
              <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <h4 style={{margin:0}}>{r.name}</h4>
                {r.michelinStar ? <span className="tag">Mišelin ⭐</span> : <span className="tag" style={{opacity:.7}}>Bez Mišelina</span>}
              </header>
              <p className="muted" style={{margin:'6px 0 10px'}}>{r.location} • {r.cuisineType}</p>
              <p><strong>Chef:</strong> {r.chef}</p>
              <p><strong>Radno vreme:</strong> {r.openingHours}</p>
              <p><strong>Prosečna ocena:</strong> {r.avgRate ?? "—"}</p>
            </article>
          ))}
          {(!restorani || restorani.length === 0) && <EmptyHint text="Nema restorana za prikaz." />}
        </div>
      )}
    </div>
  );
}

/* -------------------- DODAJ RESTORAN -------------------- */
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
      setError("Sva polja osim Mišelin su obavezna.");
      return;
    }
    try {
      await createRestaurant({ name, location, cuisineType, michelinStar, chef, openingHours });
      setName(""); setLocation(""); setCuisineType(""); setMichelinStar(false); setChef(""); setOpeningHours("");
      alert("Restoran je dodat.");
      setError(null);
    } catch (err) {
      setError(err.message || "Greška pri dodavanju restorana.");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Dodaj restoran</h3>
      {error && <p className="danger">{error}</p>}

      <div className="fields">
        <div className="field">
          <label>Naziv restorana</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="npr. Terra Verde" />
        </div>
        <div className="field">
          <label>Lokacija</label>
          <input className="input" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="npr. Beograd" />
        </div>
        <div className="field">
          <label>Tip kuhinje</label>
          <input className="input" value={cuisineType} onChange={(e)=>setCuisineType(e.target.value)} placeholder="Mediteranska, Fusion..." />
        </div>
        <div className="field">
          <label>Šef</label>
          <input className="input" value={chef} onChange={(e)=>setChef(e.target.value)} placeholder="Ime i prezime" />
        </div>
        <div className="field">
          <label>Radno vreme</label>
          <input className="input" value={openingHours} onChange={(e)=>setOpeningHours(e.target.value)} placeholder="npr. 10–23h" />
        </div>
        <div className="field">
          <label>Mišelin zvezda</label>
          <div className="check">
            <input type="checkbox" checked={michelinStar} onChange={(e)=>setMichelinStar(e.target.checked)} />
            <span>{michelinStar ? "Ima Mišelin zvezdu" : "Nema Mišelin zvezdu"}</span>
          </div>
        </div>
      </div>

      <div style={{display:'flex', gap:10, marginTop:12}}>
        <button type="submit" className="btn btn-primary">Sačuvaj</button>
        <button type="button" className="btn btn-ghost" onClick={()=>{
          setName(""); setLocation(""); setCuisineType(""); setMichelinStar(false); setChef(""); setOpeningHours(""); setError(null);
        }}>Reset</button>
      </div>
    </form>
  );
}

/* -------------------- OBRIŠI RESTORAN -------------------- */
function ObrisiRestoran() {
  const [restaurantName, setRestaurantName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantName.trim()) { setError("Unesi ime restorana."); return; }
    try {
      await deleteRestaurant(restaurantName);
      alert("Restoran obrisan.");
      setRestaurantName(""); setError(null);
    } catch (err) {
      setError("Greška prilikom brisanja.");
      console.error(err);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Obriši restoran</h3>
      {error && <p className="danger">{error}</p>}

      <div className="field">
        <label>Ime restorana</label>
        <input className="input" value={restaurantName} onChange={(e)=>setRestaurantName(e.target.value)} placeholder="Unesi ime restorana" />
      </div>

      <button className="btn btn-danger" type="submit">Obriši</button>
    </form>
  );
}

/* -------------------- IZMENI RESTORAN -------------------- */
const IzmeniRestoran = () => {
  const [restaurantId, setRestaurantId] = useState("");
  const [updatedRestaurant, setUpdatedRestaurant] = useState({
    name: "", chef: "", cuisineType: "", openingHours: "", michelinStar: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRestaurant({ ...updatedRestaurant, [name]: value });
  };
  const handleCheckboxChange = () => {
    setUpdatedRestaurant({ ...updatedRestaurant, michelinStar: !updatedRestaurant.michelinStar });
  };

  const handleUpdateClick = async () => {
    if (!restaurantId) { alert("Unesi ID restorana."); return; }
    try {
      await updateRestaurant(restaurantId, updatedRestaurant);
      alert("Restoran ažuriran.");
    } catch (err) {
      console.error(err);
      alert("Greška pri ažuriranju.");
    }
  };

  return (
    <div className="card">
      <h3>Izmeni restoran</h3>

      <div className="fields">
        <div className="field">
          <label>ID restorana</label>
          <input className="input" name="id" value={restaurantId} onChange={(e)=>setRestaurantId(e.target.value)} placeholder="ID" />
        </div>
        <div className="field">
          <label>Naziv</label>
          <input className="input" name="name" value={updatedRestaurant.name} onChange={handleInputChange} placeholder="Novi naziv" />
        </div>
        <div className="field">
          <label>Šef</label>
          <input className="input" name="chef" value={updatedRestaurant.chef} onChange={handleInputChange} placeholder="Novi šef" />
        </div>
        <div className="field">
          <label>Tip kuhinje</label>
          <input className="input" name="cuisineType" value={updatedRestaurant.cuisineType} onChange={handleInputChange} placeholder="Novi tip" />
        </div>
        <div className="field">
          <label>Radno vreme</label>
          <input className="input" name="openingHours" value={updatedRestaurant.openingHours} onChange={handleInputChange} placeholder="Novo radno vreme" />
        </div>
        <div className="field">
          <label>Mišelin zvezda</label>
          <div className="check">
            <input type="checkbox" name="michelinStar" checked={updatedRestaurant.michelinStar} onChange={handleCheckboxChange} />
            <span>{updatedRestaurant.michelinStar ? "Da" : "Ne"}</span>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleUpdateClick}>Ažuriraj</button>
    </div>
  );
};

/* -------------------- DODAJ JELO -------------------- */
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
    if (!name || !price || !details || !calories) { setError("Sva polja su obavezna."); return; }
    try {
      await createDish({ name, price, signatureDish, isVegan, details, calories });
      setName(""); setPrice(""); setSignatureDish(false); setIsVegan(false); setDetails(""); setCalories("");
      alert("Jelo dodato."); setError(null);
    } catch (err) { setError(err.message || "Greška pri dodavanju jela."); }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Dodaj jelo</h3>
      {error && <p className="danger">{error}</p>}

      <div className="fields">
        <div className="field">
          <label>Naziv</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="npr. Pappa al pomodoro" />
        </div>
        <div className="field">
          <label>Cena</label>
          <input className="input" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="RSD" />
        </div>
        <div className="field">
          <label>Detalji</label>
          <input className="input" value={details} onChange={(e)=>setDetails(e.target.value)} placeholder="Kratak opis" />
        </div>
        <div className="field">
          <label>Kalorije</label>
          <input className="input" value={calories} onChange={(e)=>setCalories(e.target.value)} placeholder="kcal" />
        </div>
        <div className="field">
          <label>Specijalitet kuće</label>
          <div className="check">
            <input type="checkbox" checked={signatureDish} onChange={(e)=>setSignatureDish(e.target.checked)} />
            <span>{signatureDish ? "Da" : "Ne"}</span>
          </div>
        </div>
        <div className="field">
          <label>Vegansko</label>
          <div className="check">
            <input type="checkbox" checked={isVegan} onChange={(e)=>setIsVegan(e.target.checked)} />
            <span>{isVegan ? "Da" : "Ne"}</span>
          </div>
        </div>
      </div>

      <div style={{display:'flex', gap:10, marginTop:12}}>
        <button className="btn btn-primary" type="submit">Sačuvaj</button>
        <button className="btn btn-ghost" type="button" onClick={()=>{
          setName(""); setPrice(""); setSignatureDish(false); setIsVegan(false); setDetails(""); setCalories(""); setError(null);
        }}>Reset</button>
      </div>
    </form>
  );
}

/* -------------------- OBRIŠI JELO -------------------- */
function ObrisiJelo() {
  const [dishName, setDishName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dishName.trim()) { setError("Unesi ime jela."); return; }
    try {
      await deleteDish(dishName);
      alert("Jelo obrisano."); setDishName(""); setError(null);
    } catch (err) { setError("Greška prilikom brisanja jela."); console.error(err); }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Obriši jelo</h3>
      {error && <p className="danger">{error}</p>}

      <div className="field">
        <label>Ime jela</label>
        <input className="input" value={dishName} onChange={(e)=>setDishName(e.target.value)} placeholder="Unesi ime jela" />
      </div>

      <button className="btn btn-danger" type="submit">Obriši</button>
    </form>
  );
}

/* -------------------- IZMENI JELO -------------------- */
const IzmeniJelo = () => {
  const [dishID, setDishID] = useState("");
  const [updatedDish, setUpdatedDish] = useState({
    name: "", details: "", price: 0, calories: 0, isVegan: false, signatureDish: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDish({ ...updatedDish, [name]: name === "price" || name === "calories" ? Number(value) : value });
  };
  const handleIsVeganChange = () => setUpdatedDish({ ...updatedDish, isVegan: !updatedDish.isVegan });
  const handleSignatureDishChange = () => setUpdatedDish({ ...updatedDish, signatureDish: !updatedDish.signatureDish });

  const handleUpdateClick = async () => {
    if (!dishID) { alert("Unesi ID jela."); return; }
    if (updatedDish.price < 0 || updatedDish.calories < 0) { alert("Cena i kalorije moraju biti pozitivne."); return; }
    try {
      await updateDish(dishID, updatedDish);
      alert("Jelo ažurirano.");
    } catch (err) {
      console.error(err);
      alert("Greška pri ažuriranju jela.");
    }
  };

  return (
    <div className="card">
      <h3>Izmeni jelo</h3>

      <div className="fields">
        <div className="field">
          <label>ID jela</label>
          <input className="input" name="id" value={dishID} onChange={(e)=>setDishID(e.target.value)} placeholder="ID" />
        </div>
        <div className="field">
          <label>Naziv</label>
          <input className="input" name="name" value={updatedDish.name} onChange={handleInputChange} placeholder="Novi naziv" />
        </div>
        <div className="field">
          <label>Detalji</label>
          <input className="input" name="details" value={updatedDish.details} onChange={handleInputChange} placeholder="Novi detalji" />
        </div>
        <div className="field">
          <label>Cena</label>
          <input className="input" name="price" value={updatedDish.price} onChange={handleInputChange} placeholder="RSD" />
        </div>
        <div className="field">
          <label>Kalorije</label>
          <input className="input" name="calories" value={updatedDish.calories} onChange={handleInputChange} placeholder="kcal" />
        </div>
        <div className="field">
          <label>Vegansko</label>
          <div className="check">
            <input type="checkbox" name="isVegan" checked={updatedDish.isVegan} onChange={handleIsVeganChange} />
            <span>{updatedDish.isVegan ? "Da" : "Ne"}</span>
          </div>
        </div>
        <div className="field">
          <label>Specijalitet kuće</label>
          <div className="check">
            <input type="checkbox" name="signatureDish" checked={updatedDish.signatureDish} onChange={handleSignatureDishChange} />
            <span>{updatedDish.signatureDish ? "Da" : "Ne"}</span>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleUpdateClick}>Ažuriraj</button>
    </div>
  );
};

/* -------------------- DODELI JELO RESTORANU -------------------- */
const DodeliJeloRestoranu = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [dishName, setDishName] = useState("");
  const [prepTime, setPrepTime] = useState("");

  const handleSubmit = async () => {
    if (!restaurantName || !dishName || !prepTime) { alert("Sva polja su obavezna."); return; }
    try {
      const response = await dodeliJeloRestoranu(restaurantName, dishName, parseInt(prepTime));
      alert(response);
    } catch (err) {
      alert("Greška prilikom dodele jela restoranu.");
    }
  };

  return (
    <div className="card">
      <h3>Dodeli jelo restoranu</h3>

      <div className="fields">
        <div className="field">
          <label>Naziv restorana</label>
          <input className="input" value={restaurantName} onChange={(e)=>setRestaurantName(e.target.value)} placeholder="Restoran" />
        </div>
        <div className="field">
          <label>Naziv jela</label>
          <input className="input" value={dishName} onChange={(e)=>setDishName(e.target.value)} placeholder="Jelo" />
        </div>
        <div className="field">
          <label>Vreme pripreme (min)</label>
          <input className="input" type="number" value={prepTime} onChange={(e)=>setPrepTime(e.target.value)} placeholder="npr. 15" />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>Dodeli</button>
    </div>
  );
};

/* -------------------- PRIKAŽI JELA RESTORANA -------------------- */
const PrikaziJela = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);

  const getDishes = async () => {
    setError(null);
    if (!restaurantName) { setError("Unesi ime restorana."); return; }
    try {
      const data = await vratiJelaRestorana(restaurantName);
      if (!data || data.length === 0) { setError("Restoran nema jela."); setDishes([]); }
      else { setDishes(data); }
    } catch (err) { setError("Greška prilikom učitavanja jela."); }
  };

  return (
    <div className="card">
      <h3>Jela restorana</h3>

      <div className="fields">
        <div className="field">
          <label>Ime restorana</label>
          <input className="input" value={restaurantName} onChange={(e)=>setRestaurantName(e.target.value)} placeholder="Unesi ime" />
        </div>
      </div>

      <div style={{display:'flex', gap:10, marginTop:10}}>
        <button className="btn btn-primary" onClick={getDishes}>Prikaži jela</button>
        <span className="muted">{dishes?.length ? `Pronađeno: ${dishes.length}` : ""}</span>
      </div>

      {error && <p className="danger" style={{marginTop:10}}>{error}</p>}

      {dishes.length > 0 && (
        <div className="grid" style={{marginTop:12}}>
          {dishes.map((dish, i) => (
            <article key={i} className="card">
              <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <h4 style={{margin:0}}>{dish.name}</h4>
                {dish.signatureDish ? <span className="tag">Specijalitet</span> : null}
              </header>
              <p className="muted" style={{margin:'6px 0 8px'}}>{dish.details || "Nema detalja"}</p>
              <p><strong>Cena:</strong> {dish.price} RSD</p>
              <p><strong>Vegansko:</strong> {dish.isVegan ? "Da" : "Ne"}</p>
              <p><strong>Kalorije:</strong> {dish.calories ?? "—"} kcal</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------- VEGANSKA JELA -------------------- */
const VeganskaJela = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      try { setRestaurants(await veganskaJela()); }
      catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="card">
      <h3>Restorani sa veganskim jelima</h3>
      <div className="grid" style={{marginTop:10}}>
        {restaurants.map((x, i) => (
          <article key={i} className="card">
            <h4 style={{margin:'0 0 6px'}}>{x.restaurantName}</h4>
            <p className="muted">{x.dishName}</p>
          </article>
        ))}
        {(!restaurants || restaurants.length === 0) && <EmptyHint text="Nema rezultata." />}
      </div>
    </div>
  );
};

/* -------------------- MIŠELIN RESTORANI -------------------- */
const Miselinova = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      try { setRestaurants(await miselinova()); }
      catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="card">
      <h3>Restorani sa Mišelin zvezdom</h3>
      <div className="grid" style={{marginTop:10}}>
        {restaurants.map((r, i) => (
          <article key={i} className="card">
            <h4 style={{margin:0}}>{r}</h4>
          </article>
        ))}
        {(!restaurants || restaurants.length === 0) && <EmptyHint text="Nema Mišelin restorana." />}
      </div>
    </div>
  );
};

/* -------------------- PRETRAGA PO OCENI -------------------- */
const PretragaPoOceni = () => {
  const [score, setScore] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  const doFetch = async () => {
    setError(null); setRestaurants([]);
    if (!score || isNaN(score)) { setError("Unesi validnu ocenu (npr. 4.5)."); return; }
    try {
      const res = await fetch(`https://localhost:5033/api/Restaurant/RestoraniSaOcjenomVecomOd/${score}`);
      if (!res.ok) throw new Error("Greška pri preuzimanju podataka.");
      setRestaurants(await res.json());
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="card">
      <h3>Filter po oceni</h3>
      <div className="fields">
        <div className="field">
          <label>Ocena</label>
          <input className="input" value={score} onChange={(e)=>setScore(e.target.value)} placeholder="npr. 4.2" />
        </div>
      </div>
      <button className="btn btn-primary" style={{marginTop:10}} onClick={doFetch}>Pretraži</button>
      {error && <p className="danger" style={{marginTop:10}}>{error}</p>}

      <div className="grid" style={{marginTop:12}}>
        {restaurants.map((r, i) => (
          <article key={i} className="card">
            <h4 style={{margin:'0 0 6px'}}>{r.restaurantName}</h4>
            <p><strong>Ocena:</strong> {r.avgRating}</p>
          </article>
        ))}
        {(!restaurants || restaurants.length === 0) && !error && <EmptyHint text="Nema rezultata." />}
      </div>
    </div>
  );
};

/* -------------------- PRETRAGA PO KRITIČARU -------------------- */
const PretragaPoKriticaru = () => {
  const [criticName, setCriticName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  const FetchRestaurants = async () => {
    setError(null);
    setRestaurants([]);

    if (!criticName.trim()) {
      setError("Unesi ime kritičara.");
      return;
    }

    try {
      const res = await fetch(
        `https://localhost:5033/api/Restaurant/${criticName}/RestoraniKojeJeOcenio`
      );
      if (!res.ok) throw new Error(`Greška ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Restorani koje je ocenio kritičar</h3>

      <div className="fields">
        <div className="field">
          <label>Ime kritičara</label>
          <input
            className="input"
            value={criticName}
            onChange={(e) => setCriticName(e.target.value)}
            placeholder="Unesi ime"
          />
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: 10 }}
        onClick={FetchRestaurants}
      >
        Pretraži
      </button>
      {error && <p className="danger" style={{ marginTop: 10 }}>{error}</p>}

      <div className="grid" style={{ marginTop: 12 }}>
        {restaurants.map((r, i) => (
          <article
            key={i}
            className="card"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span><strong>{r.restaurantName}</strong></span>
            <span className="tag">Ocena: {r.rating}</span>

          </article>
        ))}
        {(!restaurants || restaurants.length === 0) && !error && (
          <EmptyHint text="Nema rezultata." />
        )}
      </div>
    </div>
  );
};

/* -------------------- KOMENTARI JEDNOG RESTORANA -------------------- */
const KomentariJednogRestorana = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const FetchComments = async () => {
    setError(null);
    setComments([]);
    if (!restaurantName.trim()) {
      setError("Unesi ime restorana.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:5033/api/User/${restaurantName}/Komentari`
      );
      if (!res.ok) throw new Error(`Greška ${res.status}: ${res.statusText}`);

      const data = await res.json();
      if (data && data.length > 0) {
        setComments(data);
      } else {
        setError(`Nema komentara za "${restaurantName}".`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Komentari za restoran</h3>

      <div className="fields">
        <div className="field">
          <label>Ime restorana</label>
          <input
            className="input"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Unesi ime"
          />
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: 10 }}
        onClick={FetchComments}
      >
        Pretraži
      </button>

      {error && <p className="danger" style={{ marginTop: 10 }}>{error}</p>}

      <div className="grid" style={{ marginTop: 12 }}>
        {comments.map((c, i) => (
          <article key={i} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#2d2a26" }}>{c.userName}</strong>
            </div>
            <p className="muted" style={{ marginTop: 8 }}>{c.comment}</p>
          </article>
        ))}
        {(!comments || comments.length === 0) && !error && (
          <EmptyHint text="Nema komentara za prikaz." />
        )}
      </div>
    </div>
  );
};

// 👇 ovo mora biti na SAMOM KRAJU fajla, samo jednom
export default Restorani;
