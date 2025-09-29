import React from "react";
import { RestaurantList } from "../helpers/RestaurantList";
import RestaurantItem from "../components/RestaurantItem";

export default function Menu() {
  return (
    <div className="menu-page">
      <h1 className="menu-title">🍲 Restorani</h1>

      <div className="restaurants-grid">
        {RestaurantList.map((resitem, key) => (
          <RestaurantItem
            key={key}
            image={resitem.image}
            name={resitem.name}
            price={resitem.price}
          />
        ))}
      </div>

      <style>{`
        .menu-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px;
          text-align: center;
          color: #2d2a26;
        }

        .menu-title {
          margin-bottom: 28px;
          font-size: 2.2rem;
          font-weight: bold;
          color: #2d2a26;
          background: linear-gradient(135deg, #a3b18a, #d6a57c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .restaurants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
      `}</style>
    </div>
  );
}
