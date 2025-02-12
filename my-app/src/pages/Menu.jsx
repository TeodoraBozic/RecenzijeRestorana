import React from 'react';
import { RestaurantList } from "../helpers/RestaurantList";
import RestaurantItem from '../components/RestaurantItem';
import '../styles/menu.css'

export default function Menu() {
  return (
    <div className='menu'>
        <h1 className="menuTitle">Restorani</h1>
        <div className='restaurantsList'> 
            {RestaurantList.map((resitem, key) => {
                return (
                  <RestaurantItem 
                    key={key}
                    image={resitem.image} 
                    name={resitem.name} 
                    price={resitem.price}
                  />
                );
            })}
        </div>
    </div>
  );
}
