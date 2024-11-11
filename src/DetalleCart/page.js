import { useLocation } from "react-router-dom";
import React, { useState } from "react";

function Detalles() {
  const location = useLocation();
  const { Norepetidos, repetidos, totalCarrito } = location.state || {};

  return (
    <div>
      <ul>
        {Norepetidos.map((product, index) => (
          <li key={index}>
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{ width: "50px", height: "50px" }}
            />
            <p>{product.title}</p>
            <p>Precio: ${product.price * (repetidos[product.title] || 1)}</p>
            <p>Cantidad: {repetidos[product.title]}</p>
           {/* <button onClick={eliminardecart(product)}>Eliminar de carrito</button> */} 
          </li>
        ))}
      </ul>

      <h3>Subtotal: ${totalCarrito}   </h3>
    </div>
  );
}

export default Detalles;
