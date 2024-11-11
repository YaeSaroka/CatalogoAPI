import React, { createContext, useContext, useState, useEffect } from 'react';

// Create CartContext
const CartContext = createContext();

// CartProvider component that provides the cart state
export const CartProvider = ({ children }) => {
  const [cart, setCarrito] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCarrito((prevCart) => prevCart.concat(product));
    console.log(cart, " cart contenido");
  };

  const getTotalQuantity = () => cart.length;

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCarrito((prevCart) => prevCart.filter(product => product.id !== productId));
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

