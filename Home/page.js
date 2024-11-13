import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { View } from 'react-native';
//npm install react-native-web
//npm install react-native


import SearchInput from "react-search-input"; //npm install react-search-input --save
// Carousel
import Image from "../Imgs/banner1.png";
import Image2 from "../Imgs/banner2.png";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

//BOOTSTRAP
import Logo from "../Imgs/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

//FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

//CARRITO
import Offcanvas from "react-bootstrap/Offcanvas";
import { useCart, removeFromCart  } from "../Cart/page.js";

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

    setRepetidos(repetidos);
    const arrayUnicos = cart.filter(
      (producto, index, cart) =>
        index === cart.findIndex((p) => p.title === producto.title)
    ); // saca todos los productos repetidos :(
    setNoRepetidos(arrayUnicos);
  }, [cart]);

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={styles.btnPrimary}>
        {name} <FontAwesomeIcon icon={faCartShopping} />
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton style={styles.offcanvasHeader}>
          <Offcanvas.Title style={styles.offcanvasTitle}>
            <FontAwesomeIcon icon={faCartShopping} /> Cart
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body style={styles.offcanvasBody}>
          <h5>Productos:</h5>
          <View
            style={{ textDecoration: 'underline'}}
          />
          <button 
            onClick={() => navigate("/detallecarrito", { state: { Norepetidos, repetidos, totalCarrito } })} 
            style={styles.button}>
            Ver detalles
          </button>
          <ul style={styles.offcanvasList}>
            {Norepetidos.map((product, index) => (
              <li key={index} style={styles.offcanvasListItem}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={styles.offcanvasImg}
                />
                <p>{product.title}</p>
                <p>
                  Precio: ${product.price * (repetidos[product.title] || 1)}
                </p>
                <Button
                  variant="danger"
                  onClick={() => removeFromCart(product.id)} // Llamamos a removeFromCart
                  style={styles.offcanvasBtnDanger}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </li>
            ))}
            <h3 style={styles.offcanvasH3}>Subtotal : {totalCarrito} </h3>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function Home() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  //TRAEMOS API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/products");
        setProductos(response.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (term) => {
    if (term) {
      try {
        const response1 = await axios.get(
          `https://dummyjson.com/products/search?q=${term}`
        );
        setProductos(response1.data.products);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>

      <Navbar expand="lg" style={styles.navbar}>
        <Container fluid>
          <Navbar.Brand href="#">
            <img style={styles.navbarBrand} src={Logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link onClick={() => navigate("/home")} style={styles.navbarNavLink}>
                Home
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/productos")} style={styles.navbarNavLink}>
                Productos
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/contacto")} style={styles.navbarNavLink}>
                Contacto
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <SearchInput
                onChange={handleSearch}
                placeholder="Buscar productos..."
                style={styles.formControl}
              />
              <Button variant="outline-success" style={styles.btnOutlineSuccess}>
                Buscar
              </Button>
            </Form>

            <OffCanvasExample placement={"end"} name={"Carrito"} />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Carousel style={styles.caro}>
          <Carousel.Item>
            <img className="d-block w-100" src={Image} alt="First slide" style={styles.carouselItemImg} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={Image2} alt="Second slide" style={styles.carouselItemImg} />
          </Carousel.Item>
        </Carousel>

        {/* Título "Productos" con estilo */}
        <h2 style={styles.productosTitle}>Productos</h2>

        <Row>
          {productos.slice(0, 10).map((producto) => (
            <Col xs={12} sm={6} md={4} key={producto.id}>
              <Card style={{ ...styles.card, ...styles.cardHover }}>
                <Card.Img
                  variant="top"
                  src={producto.thumbnail}
                  alt={producto.title}
                  style={styles.cardImgTop}
                />
                <Card.Body style={styles.cardBody}>
                  <Card.Title style={styles.cardTitle}>{producto.title}</Card.Title>
                  <Card.Text style={styles.cardText}>Precio: ${producto.price}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate("/detalle", { state: { producto } })
                    }
                    style={styles.cardButton}
                  >
                    Ver más
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    margin: 0,
    padding: 0
  },
  caro: {
    marginBottom: '3rem',
  },

  navbar: {
    backgroundColor: '#E9BABC' , 
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '3rem',
  },

  navbarBrand: {
    maxWidth: '150px'
  },

  navbarNavLink: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: '15px',
    fontSize: '1.1rem',
    textTransform: 'uppercase'
  },

  formControl: {
    borderRadius: '20px',
    border: '1px solid #ccc',
    padding: '0.5rem',
    fontSize: '1rem',
    width: '200px',
  },

  btnOutlineSuccess: {
    borderRadius: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    marginLeft: '10px',
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    marginRight: '3rem',
  },

  offcanvasBody: {
    backgroundColor: '#ffffff',
    color: '#333',
    padding: '2rem'
  },

  offcanvasHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderBottom: '2px solid #ddd',
  },

  offcanvasTitle: {
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },

  offcanvasBtnDanger: {
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '50%',
    padding: '0.5rem',
    marginLeft: '10px',
  },

  offcanvasList: {
    listStyle: 'none',
    paddingLeft: 0
  },

  offcanvasListItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
  },

  offcanvasImg: {
    borderRadius: '5px',
    marginRight: '10px',
    width: '50px', // Ajustamos el tamaño de la imagen
    height: '50px',
    objectFit: 'cover',
  },

  offcanvasH3: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: '20px',
    color: '#4CAF50'
  },

  card: {
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    marginBottom: '3rem',
  },

  cardHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  },

  cardImgTop: {
    borderRadius: '15px 15px 0 0',
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },

  cardBody: {
    backgroundColor: '#fff',
    textAlign: 'center',
    padding: '1rem',
  },

  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '10px 0',
  },

  cardText: {
    color: '#4CAF50',
    fontSize: '1rem',
    fontWeight: 'bold',
  },

  cardButton: {
    marginTop: '15px',
    borderRadius: '20px',
    backgroundColor: '#E9BABC',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    transition: 'background-color 0.3s ease',
  },

  carouselItemImg: {
    borderRadius: '10px',
    transition: 'transform 0.3s ease'
  },

  productosTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#E9BABC',
    margin: '20px 0',
    textAlign: 'center',
    marginBottom: '4rem',
    marginTop: '6rem',
  },

  btnPrimary: {
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '20px',
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
  },

  button: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },

  buttonFocus: {
    outline: 'none',
  },

  // Nueva clase para el buscador
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
  },

  searchInput: {
    width: '300px',
    borderRadius: '20px',
    padding: '0.5rem',
    fontSize: '1.1rem',
    marginRight: '10px',
    border: '1px solid #ddd'
  },

  searchButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '1.1rem',
  },
};


export default Home;
