import React, { createContext, useContext, useState, useEffect } from 'react';

// CONTEXTO GLOBAL PARA EL CARRITO Y PARA PODER USARLO EN TODAS LAS PÁGINAAAS
const CartContext = createContext();


export const CartProvider = ({ children }) => {  //acá el children son los componentes hijos que están en cart
  const [cart, setCarrito] = useState(() => {
    const savedCart = localStorage.getItem('cart'); //se maneja con key-value
    return savedCart ? JSON.parse(savedCart) : []; //convierto el texto JSON en un array de JS
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]); //Convierte el estado del carrito en una cadena de texto JSON.

  const addToCart = (product) => {
    setCarrito((prevCart) => prevCart.concat(product)); //concat es una función de JS que se utiliza para unir dos arrays, no cambia el array original
    console.log(cart, " cart contenido");
  };

  const getTotalQuantity = () => cart.length;

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCarrito((prevCart) => prevCart.filter(product => product.id !== productId)); // creo un nuevo arreglo que excluye el producto con el id que me pasaron.
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, getTotalQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

