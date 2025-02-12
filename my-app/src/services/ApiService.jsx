// const BASE_URL = "http://localhost:5033/api"; // Tvoj backend URL
const BASE_URL = "https://localhost:5033/api"; // Tvoj backend URL

// Helper funkcija za fetch pozive
const fetchAPI = async (endpoint, method = "GET", body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "An error occurred");
  }

  return await response.json();
};



// fetchRestaurants funkcija
export async function fetchRestaurants() {
  try {
    const response = await fetchAPI("/Restaurant/VratiSveRestorane", "GET");
    return response;
  } catch (error) {
    console.error('Error in fetchRestaurants:', error);
    throw error;
  }
}


export const createRestaurant = async (restaurantData) => {
  try {
    const response = await fetch("https://localhost:5033/api/Restaurant/CreateRestaurant", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData),  // Proveri da li odgovara formatu koji server očekuje
  });
  
  if (!response.ok) {
      console.error("Greška prilikom kreiranja restorana:", await response.text());
  } else {
      console.log("Restoran je uspešno kreiran.");
  }
  
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Error creating restaurant: ' + error.message);
  }
};


export const createCritic = async (criticData) => {
  try {
    const response = await fetch("https://localhost:5033/api/Critic/AddCritic", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(criticData),  // Proveri da li odgovara formatu koji server očekuje
  });
  
  if (!response.ok) {
      console.error("Greška prilikom kreiranja kriticara:", await response.text());
  } else {
      console.log("Kritičar je uspešno kreiran.");
  }
  
    const result = await response.json;
    return result;
  } catch (error) {
    throw new Error('Error creating critic: ' + error.message);
  }
};



export const deleteRestaurant = async (restaurantName) => {
  try {
    const response = await fetch(`https://localhost:5033/api/Restaurant/DeleteRestaurant/${restaurantName}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete restaurant`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
};


// ApiService.js
export const updateRestaurant = async (id, restaurantData) => {
  try {
    const response = await fetch(`https://localhost:5033/api/Restaurant/UpdateRestaurant/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData),
    });

    if (!response.ok) {
      throw new Error('Failed to update restaurant');
    }

    const updatedRestaurant = await response.json();
    return updatedRestaurant; // Vraća ažurirani restoran
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};



export async function fetchCritics() {
  try {
    const response = await fetchAPI("/Critic/GetCritics", "GET");
    return response;
  } catch (error) {
    console.error('Error in fetchCritics:', error);
    throw error;
  }
}



export const deleteCritic = async (criticName) => {
  try {
    const response = await fetch(`https://localhost:5033/api/Critic/DeleteCritic/${criticName}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete critic`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting critic:", error);
    throw error;
  }
};
  
  
export const updateCritic = async (id, criticData) => {
  try {
    const response = await fetch(`https://localhost:5033/api/Critic/UpdateCritic/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(criticData),
    });

    if (!response.ok) {
      throw new Error('Failed to update critic');
    }

    const updatedCritic = await response.json();
    return updatedCritic; // Vraća ažurirani restoran
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};


export async function fetchUsers() {
  try {
    const response = await fetchAPI("/User/GetAllUsers", "GET");
    return response;
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    throw error;
  }
};


export const createUser = async (userData) => {
  try {
    const response = await fetch("https://localhost:5033/api/User/CreateUser", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),  // Proveri da li odgovara formatu koji server očekuje
  });
  
  if (!response.ok) {
      console.error("Greška prilikom kreiranja korisnika:", await response.text());
  } else {
      console.log("Koirisnik je uspešno kreiran.");
  }
  
    const result = await response.json;
    return result;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};


export const deleteUser = async (userID) => {
  try {
    const response = await fetch(`https://localhost:5033/api/User/DeleteUser/${userID}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete USER`);
    }
    return await response.json;
  } catch (error) {
    console.error("Error deleting USER:", error);
    throw error;
  }
};


export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`https://localhost:5033/api/User/UpdateUser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update critic');
    }

    const updatedUser = await response.json();
    return updatedUser; // Vraća ažurirani restoran
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};


export const createDish = async (dishData) => {
  try {
    const response = await fetch("https://localhost:5033/api/Dish/CreateDish", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(dishData),  // Proveri da li odgovara formatu koji server očekuje
  });
  
  if (!response.ok) {
      console.error("Greška prilikom kreiranja jela:", await response.text());
  } else {
      console.log("Jelo je uspešno kreirano.");
  }
  
    const result = await response.json;
    return result;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};


export const deleteDish = async (dishName) => {
  try {
    const response = await fetch(`https://localhost:5033/api/Dish/DeleteDish/${dishName}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete dish`);
    }
    return await response.json;
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw error;
  }
};

export const updateDish = async (id, dishData) => {
  try {
    const response = await fetch(`https://localhost:5033/api/Dish/UpdateDish/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dishData),
    });

    if (!response.ok) {
      throw new Error('Failed to update dish');
    }

    const updatedDish = await response.json();
    return updatedDish; // Vraća ažurirani restoran
  } catch (error) {
    console.error('Error updating dish:', error);
    throw error;
  }
};




///////////////////////////////////////////////////////////////////

export const dodeliJeloRestoranu = async (restaurantName, dishName, prepTime) => {
  const url = ` https://localhost:5033/api/Restaurant/${restaurantName}/DodeliJeloRestoranu/${dishName}`;
 // https://localhost:5033/api/Restaurant/aa/DodeliJeloRestoranu/aa

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prepTime), // Pošto prepTime dolazi kao broj, šaljemo ga u JSON formatu
    });

     if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Unknown error occurred.");
    }

    const result = await response.text(); // Očekuje običan tekst, ne JSON
    console.log("Uspešno povezivanje:", result);
    return result;
  } catch (error) {
    console.error("Error linking dish to restaurant:", error);
    throw error;
  }
};


// U ApiService.jsx fajlu
export const vratiJelaRestorana = async (restaurantName) => {
  try {
    const response = await fetch(`https://localhost:5033/api/Dish/${restaurantName}/dishes`);
    if (!response.ok) {
      throw new Error("Nije moguće učitati jela za restoran.");
    }
    const dishes = await response.json();
    return dishes; // Vrati podatke
  } catch (error) {
    throw new Error(error.message);
  }
};


export const OceniRestoran = async (criticName, restaurantName, ocena) => {

  const url = `https://localhost:5033/api/Critic/${criticName}/OceniRestoran/${restaurantName}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ocena), // Pošto prepTime dolazi kao broj, šaljemo ga u JSON formatu
    });

     if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage || "Unknown error occurred.");
    }

    const result = await response.json();
    console.log("Uspešno povezivanje:", result.message);
    return result;
    

    
  } catch (error) {
    console.error("Error grading restaurant:", error);
    throw error;
  }
};


export const omiljeniRestoran = async (restaurantName, userName, comment) => {
  const url = `https://localhost:5033/api/User/${restaurantName}/OmiljeniRestoran/${userName}/${comment}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),  // Pošaljite 'comment' u telu
    });

    const responseText = await response.text(); // Čitanje odgovora kao običan tekst
    console.log("Serverov odgovor:", responseText); // Prikazivanje odgovora u konzoli

    if (!response.ok) {
      throw new Error(`Server error: ${responseText}`); // Ako odgovor nije OK, baci grešku
    }

    return responseText; // Vratimo običan tekst umesto JSON-a

  } catch (error) {
    console.error("Error grading restaurant:", error);
    throw error;
  }
};


export const veganskaJela = async () => {
  const url = "https://localhost:5033/api/Restaurant/RestoraniSaVeganskimJelima";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.statusText);
    }

    const restaurants = await response.json(); // Parse response as JSON

    console.log("Restorani sa veganskim jelima:", restaurants); // Prikazivanje rezultata u konzoli
    return restaurants; // Vratiti rezultate iz funkcije

  } catch (error) {
    console.error("Error fetching vegan restaurants:", error);
    throw error;
  }
};


export const miselinova = async () => {
  const url = "https://localhost:5033/api/Restaurant/RestoraniSaMiselinovomZvezdom";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.statusText);
    }

    const restaurants = await response.json(); // Parse response as JSON

    console.log("Restorani sa miselinovom zvezdicom:", restaurants); // Prikazivanje rezultata u konzoli
    return restaurants; // Vratiti rezultate iz funkcije

  } catch (error) {
    console.error("Error fetching restaurants with michelin star:", error);
    throw error;
  }
};
