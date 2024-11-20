import React, { useEffect, useState } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { useNavigate } from "react-router-dom";

import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import Logo from '../Imgs/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Offcanvas from "react-bootstrap/Offcanvas";
import { useCart, removeFromCart  } from "../Cart/page.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";



const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [filtro, setFiltro] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProductos(response.data.products);
        const categoriasUnicas = [...new Set(response.data.products.map(producto => producto.category))];
        //mapeo las categorías, evito las duplicadas y las guardo en un array de filtroo
        setFiltro(categoriasUnicas);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePickerChange = (event) => {
    setSelectedValue(event.target.value);
  };

  //FUNCIÓN PARA RENDERAR LOS PRODUCTOS
  const renderProducts = () => {
    const productosFiltrados = productos
      .filter(createFilter(searchTerm, ['title', 'description'])) //filtro los productos segun titulo o descripcion
      .filter(producto => !selectedValue || producto.category === selectedValue); //filtro los productos segun categoría. Si no hay una seleccionada muestro todo. 

    if (productosFiltrados.length === 0) {
      return <div style={styles.noResults}>No se encontró nada</div>;
    }
    
    //Si tengo porductos filtrados, mapeo cada producto y lo muestro
    return productosFiltrados.map((producto) => (
      <div key={producto.id} style={styles.product}>
        <img src={producto.thumbnail} alt={producto.title} style={styles.image} />
        <h3 style={styles.productTitle}>{producto.title}</h3>
        <p style={styles.description}>{producto.description}</p>
        <div style={styles.price}>${producto.price}</div>
        <button style={styles.button}>Añadir al carrito</button>
      </div>
    ));
  };

//OFFCANVAS DEL CARRITO
function OffCanvasExample({ name, ...props }) {
  const [show, setShow] = useState(false);
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //STATE DEL CARRITO
  const [repetidos, setRepetidos] = useState(new Map());
  const [Norepetidos, setNoRepetidos] = useState([]);
  let totalCarrito = 0; 
  Norepetidos.forEach(product => {
    const cantidad = repetidos[product.title]; 
    totalCarrito += product.price * cantidad;
  });

  //SACA PRODUCTOS REPETIDOS
  useEffect(() => {
    const repetidos = cart.reduce((contador, producto) => {
      contador[producto.title] = (contador[producto.title] || 0) + 1;
      return contador;
    }, {});

    // saca todos los productos repetidos :)
    setRepetidos(repetidos);
    const arrayUnicos = cart.filter(
      (producto, index, cart) =>
        index === cart.findIndex((p) => p.title === producto.title)
    ); 
    setNoRepetidos(arrayUnicos);
  }, [cart]);

// CALCULAR CANTIDAD DE PRODUCTOS EN EL CARRITO
const totalProductos = cart.reduce((total, producto) => total + 1, 0);
  
return (
  <>
   <Button
        variant="pink" 
        onClick={handleShow}
        className="me-2"
        style={styles.cartButton}
      >
        {name} <FontAwesomeIcon icon={faCartShopping} />
        {totalProductos > 0 && (
          <span className="cart-count ms-2" style={styles.cartCount}>{totalProductos}</span>
        )}
      </Button>

      <Offcanvas show={show} onHide={handleClose} style={styles.offcanvas}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={styles.offcanvasTitle}>
            <FontAwesomeIcon icon={faCartShopping} /> Carrito
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body style={styles.offcanvasBody}>
          <h5 style={styles.productHeader}>Productos:</h5>
          <button onClick={() => navigate("/detallecarrito", { state: { Norepetidos, repetidos, totalCarrito } })} style={styles.viewDetailsButton}>Ver detalles</button>
          <ul style={styles.productList}>
            {Norepetidos.map((product, index) => (
              <li key={index} style={styles.cartItem}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={styles.productImage}
                />
                <div style={styles.productInfo}>
                  <p style={styles.productTitle}>{product.title}</p>
                  <p style={styles.productPrice}>${(product.price * (repetidos[product.title] || 1)).toFixed(2)}</p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => removeFromCart(product.id)}
                  style={styles.removeButton}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </li>
            ))}
            <h3 style={styles.totalPrice}>Total: ${(totalCarrito).toFixed(2)}</h3>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" style={styles.navbar}>
        <Container fluid>
          <Navbar.Brand href="#">
            <img style={{ width: '150px' }} src={Logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={styles.navLinks}>
              <Nav.Link onClick={() => navigate("/home")} style={styles.navLink}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate("/productos")} style={styles.navLink}>Productos</Nav.Link>
              <Nav.Link onClick={() => navigate("/contacto")} style={styles.navLink}>Contacto</Nav.Link>
            </Nav>
            <Form className="d-flex">
            <SearchInput onChange={handleSearch} placeholder="Buscar productos..." style={styles.searchInput} />
            <Button variant="outline-light" style={styles.searchButton}>Buscar</Button>
          </Form>
          <OffCanvasExample placement={"end"} name={"Carrito"} />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={styles.container}>
        <h1 style={styles.title}>Nuestros Productos</h1>
        <div style={styles.filterSearchContainer}>
          <div style={styles.filtroContainer}>
            <label style={styles.label}>Filtro:</label>
            <select onChange={handlePickerChange} value={selectedValue} style={styles.select}>
              <option value="">Todos</option>
              {filtro.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
          <SearchInput style={styles.searchInput} onChange={handleSearch} placeholder="Buscar productos..." />
        </div>
        <div style={styles.productsContainer}>
          {renderProducts()}
        </div>
      </div>
    </>
  );
};


const styles = {
  navbar: {
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "8px 0", // Reduce el padding para hacer la navbar más compacta
  },
  navLinks: {
    fontSize: "0.9rem", // Disminuir tamaño de fuente de los enlaces
    fontWeight: "600",
  },
  navLink: {
    textTransform: "uppercase",
    marginLeft: "1rem", // Mantener espacio entre los enlaces
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Poppins, Arial, sans-serif',
    backgroundColor: '#ece3e5', // Fondo rosa suave
    minHeight: '100vh',
  },
  title: {
    marginBottom: '30px',
    color: '#c6acb1', // Rosa brillante
    fontSize: '2.8em',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  filterSearchContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '30px',
  },
  searchInput: {
    margin: '0 15px',
    padding: '12px',
    width: '350px',
    border: '2px solid #fdd2da', // Rosa en el borde del input
    borderRadius: '50px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    fontSize: '1em',
  },
  filtroContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  label: {
    marginRight: '10px',
    fontSize: '1.1em',
    color: '#f0dfe2', // Rosa brillante
  },
  select: {
    padding: '12px',
    border: '2px solid #f0dfe2', // Rosa en el borde
    borderRadius: '50px',
    backgroundColor: '#fff',
    fontSize: '1.1em',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  productsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '30px',
    width: '100%',
    maxWidth: '1200px',
  },
  product: {
    border: '1px solid #f0dfe2', // Rosa brillante para los bordes
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    background: '#fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  productTitle: {
    fontSize: '1.4em',
    fontWeight: 'bold',
    color: '#333',
    margin: '10px 0',
  },
  description: {
    fontSize: '1em',
    color: '#777',
    margin: '10px 0',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
    transition: 'transform 0.3s ease',
  },
  price: {
    fontSize: '1.6em',
    color: '#cda5ac',
    margin: '15px 0',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#f0dfe2", // Rosa brillante para el botón
    borderRadius: "50px",
    padding: "10px 20px",
    fontWeight: "600",
    color: "#fff", // Blanco para el texto del botón
    border: "none", // Sin borde
    transition: "background-color 0.3s ease",
  },
  noResults: {
    color: '#777',
    marginTop: '30px',
    fontSize: '1.2em',
  },
  cartButton: {
    backgroundColor: '#FF77B3', // Rosa brillante
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '50px',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
  },
  cartCount: {
    backgroundColor: '#fff',
    color: '#FF77B3', // Rosa brillante para el contador
    borderRadius: '50%',
    padding: '3px 7px',
    fontWeight: 'bold',
    fontSize: '0.9em',
  },
  offcanvas: {
    backgroundColor: '#f8e1f4', // Rosa suave
    padding: '20px',
    borderRadius: '12px',
  },
  offcanvasTitle: {
    color: '#FF77B3', // Rosa brillante
    fontSize: '1.8em',
    fontWeight: 'bold',
  },
  offcanvasBody: {
    padding: '20px',
    color: '#333',
  },
  productHeader: {
    fontSize: '1.3em',
    color: '#FF77B3', // Rosa brillante
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  viewDetailsButton: {
    backgroundColor: '#FF77B3',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '50px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '20px',
  },
  productList: {
    listStyleType: 'none',
    padding: '0',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  productImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '15px',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: '1em',
    color: '#333',
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#FF77B3', // Rosa para el precio
    fontWeight: '600',
    fontSize: '1em',
  },
  removeButton: {
    backgroundColor: '#ff4d4d', // Rojo para eliminar
    color: '#fff',
    borderRadius: '50%',
    padding: '5px 10px',
    fontSize: '1.2em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginLeft: '15px',
  },
  totalPrice: {
    fontSize: '1.5em',
    color: '#333',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '250px',
    margin: '0 auto',
    textAlign: 'center',
  },
};

export default Productos;
