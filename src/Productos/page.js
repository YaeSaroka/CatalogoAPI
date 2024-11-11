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

  const renderProducts = () => {
    const productosFiltrados = productos
      .filter(createFilter(searchTerm, ['title', 'description']))
      .filter(producto => !selectedValue || producto.category === selectedValue);

    if (productosFiltrados.length === 0) {
      return <div style={styles.noResults}>No se encontró nada</div>;
    }

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

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">
              <img style={{ width: '150px' }} src={Logo} alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                <Nav.Link onClick={() => navigate("/home")}>Home</Nav.Link>
                <Nav.Link onClick={() => navigate("/productos")}>Productos</Nav.Link>
                <Nav.Link onClick={() => navigate("/contacto")}>Contacto</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

    <div style={styles.container}>
      <h1 style={styles.title}>Tienda de Productos</h1>
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
    </div></>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    marginBottom: '30px',
    color: '#333',
    fontSize: '2.5em',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  filterSearchContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
  },
  searchInput: {
    margin: '0 10px',
    padding: '12px',
    width: '400px',
    border: '2px solid #0070f3',
    borderRadius: '25px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  filtroContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
  },
  label: {
    marginRight: '10px',
    fontSize: '1.1em',
    color: '#555',
  },
  select: {
    padding: '10px',
    border: '2px solid #0070f3',
    borderRadius: '25px',
    backgroundColor: '#fff',
  },
  productsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '30px',
    width: '100%',
    maxWidth: '1200px',
  },
  product: {
    border: '1px solid #e1e1e1',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    background: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  productTitle: {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#333',
    margin: '10px 0',
  },
  description: {
    fontSize: '0.9em',
    color: '#555',
    margin: '10px 0',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  price: {
    fontSize: '1.5em',
    color: '#b12704',
    margin: '10px 0',
  },
  button: {
    padding: '10px',
    background: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    fontSize: '1em',
  },
  noResults: {
    color: '#777',
    marginTop: '20px',
  },
  productHover: {
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', 
    },
  },
};

export default Productos;
