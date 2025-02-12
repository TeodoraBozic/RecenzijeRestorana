import React from 'react'
import '../styles/menu.css'

function RestaurantItem({image, name, price}) {
  return (
    <div className='restitem'>
        <div>
            {image}
        </div>
        <h1>
            {name}
        </h1>
        <p>
            {price}

        </p>
      
    </div>
  )
}

export default RestaurantItem
