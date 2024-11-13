import { useLocation } from "react-router-dom";
import { useCart } from '../Cart/page';

function Detalle() {
  const location = useLocation();
  const { addToCart } = useCart(); 
  const { producto } = location.state || {}; 

  if (!producto) {
    return <div>No se encontró el producto.</div>;
  }

  const handleAddToCart = () => {
    addToCart(producto);
    alert(`${producto.title} se ha agregado al carrito!`);  // Mostrar mensaje de confirmación
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{producto.title}</h1>
      <img src={producto.thumbnail} alt={producto.name} style={styles.image} />
      <p style={styles.price}>${producto.price}</p>
      <p style={styles.description}>{producto.description}</p>
      <button onClick={handleAddToCart} style={styles.button}>Agregar a carrito</button>
      {console.log(producto)}
    </div>
  );
}

const styles = {
  container: {
    padding: '15px',  
    maxWidth: '650px',
    margin: 'auto',
    marginTop: '1rem',  
    backgroundColor: '#ffffff',
    borderRadius: '12px',  
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E9BABC',
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',  
    fontWeight: 'bold',
    marginBottom: '12px',  
    color: '#333333',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',  
    marginBottom: '12px',  
    border: '1px solid #E9BABC',
  },
  description: {
    fontSize: '14px',  
    marginBottom: '12px',  
    lineHeight: '1.4',
    color: '#555555',
  },
  price: {
    fontSize: '18px',  
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: '12px',  
  },
  button: {
    backgroundColor: '#E9BABC',
    color: '#ffffff',
    padding: '8px 16px',  
    border: 'none',
    borderRadius: '6px', 
    cursor: 'pointer',
    fontSize: '14px',  
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#d29b8c',
  }
};

export default Detalle;
