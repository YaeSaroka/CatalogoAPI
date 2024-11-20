import { useLocation } from "react-router-dom";
import React, { useState } from "react";



const Detalles = () => {
  const location = useLocation();
  const { Norepetidos, repetidos, totalCarrito } = location.state || {};
  

  return (
    
    <div style={styles.container}>
      <h2 style={styles.title}>Detalles del Carrito</h2>
      <ul style={styles.productList}>
        {Norepetidos.map((product, index) => (
          <li key={index} style={styles.productItem}>
            <img
              src={product.thumbnail}
              alt={product.title}
              style={styles.productImage}
            />
            <div style={styles.productInfo}>
              <p style={styles.productTitle}>{product.title}</p>
              Precio: ${ (product.price * (repetidos[product.title] || 1)).toFixed(2) }
              <p style={styles.productQuantity}>Cantidad: {repetidos[product.title]}</p>
            </div>
            {/* <button style={styles.removeButton} onClick={eliminardecart(product)}>Eliminar de carrito</button> */}
          </li>
        ))}
      </ul>

      <div style={styles.totalContainer}>
      <h3 style={styles.subtotal}>Subtotal: ${(totalCarrito).toFixed(2)}</h3>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Poppins, Arial, sans-serif',
    backgroundColor: '#f8e1f4', // Fondo rosa suave
    minHeight: '100vh',
    color: '#333',
  },
  title: {
    textAlign: 'center',
    fontSize: '2em',
    color: '#FF77B3', // Rosa brillante para el título
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  productList: {
    listStyleType: 'none',
    padding: '0',
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '15px',
    margin: '10px 0',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    fontSize: '1em',
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '15px',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '1.1em',
  },
  productPrice: {
    color: '#FF77B3', // Rosa para el precio
    fontWeight: '600',
    margin: '5px 0',
  },
  productQuantity: {
    color: '#777',
    fontSize: '0.9em',
  },
  removeButton: {
    backgroundColor: '#FF77B3', // Rosa brillante para el botón
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    padding: '8px 15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  removeButtonHover: {
    backgroundColor: '#ff4d94', // Rosa más oscuro al pasar el ratón
  },
  totalContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  subtotal: {
    fontSize: '1.5em',
    color: '#333',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '250px',
    margin: '0 auto',
  },
};

export default Detalles;

