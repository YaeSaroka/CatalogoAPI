import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import SearchInput from "react-search-input"; //npm install react-search-input --save
// Carousel
import Image from "../Imgs/banner1.png";
import Image2 from "../Imgs/banner2.png";
import Image3 from "../Imgs/banner3.png";
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
  //el reduce permite acumular o reducir un objeto del cart a un solo valor
  useEffect(() => {
    const repetidos = cart.reduce((contador, producto) => {
      contador[producto.title] = (contador[producto.title] || 0) + 1; //si el producto ya está en el contador, toma su valor actual. Sino usamos cero como valor inicial. 
      //uso el titulo del producto como clave
      return contador;
    }, {});

    setRepetidos(repetidos);
    const arrayUnicos = cart.filter(
      (producto, index, cart) =>
        index === cart.findIndex((p) => p.title === producto.title)
      //Busca el índice del primer producto en el carrito cuyo titulo coincide con el titulo del producto actual.
    ); // saca todos los productos repetidos :(
    setNoRepetidos(arrayUnicos);
  }, [cart]);


// CALCULAR CANTIDAD DE PRODUCTOS EN EL CARRITO
const totalProductos = cart.reduce((total, producto) => total + 1, 0);
  
return (
  <>
    <Button
        variant="pink" // Utiliza el color rosa personalizado
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
                  style={styles.productImageCart}
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

  //FUNCIÓN PARA BUSCAR PRODUCTOS CON API
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
    <Navbar expand="lg" className="bg-body-tertiary" style={styles.navbar}>
      <Container fluid>
        <Navbar.Brand href="#">
          <img style={{ width: "150px" }} src={Logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={styles.nav}>
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

    <Container style={styles.container}>
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={Image} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={Image2} alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={Image3} alt="Third slide" />
        </Carousel.Item>
      </Carousel>

      <h2 style={styles.productTitle}>Productos</h2>
      <Row>
        {productos.slice(0, 10).map((producto) => (
          <Col xs={12} sm={6} md={4} key={producto.id}>
            <Card style={styles.productCard}>
              <Card.Img
                variant="top"
                src={producto.thumbnail}
                alt={producto.title}
                style={styles.productImage}
              />
              <Card.Body>
                <Card.Title style={styles.productName}>{producto.title}</Card.Title>
                <Card.Text style={styles.productPrice}>${producto.price}</Card.Text>
                <Button
                  variant="pink"
                  onClick={() => navigate("/detalle", { state: { producto } })}
                  style={styles.viewButton}
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
navbar: {
  backgroundColor: "#fff", 
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  padding: "8px 0"
},
nav: {
  color: "#333",
},
navLink: {
  color: "#333",
  fontWeight: "600",
  fontSize: "1.1rem",
  marginLeft: "1rem",
  textTransform: "uppercase",
  ':hover': {
    color: "#ebe4e5", // Rosa brillante en hover
  },
},
searchInput: {
  padding: "10px",
  borderRadius: "50px",
  border: "2px solid #f5dbdf", // Rosa brillante para el borde
  width: "300px",
},
searchButton: {
  backgroundColor: "#fcd3d9", // Rosa para el botón
  color: "white",
  borderRadius: "50px",
  marginLeft: "10px",
  ':hover': {
    backgroundColor: "#FF4D94", // Rosa más oscuro en hover
  },
},
container: {
  padding: "30px 0",
},
productTitle: {
  textAlign: "center",
  color: "#333",
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "30px",
  marginTop: "20px",
  fontFamily: "'Poppins', sans-serif"
},
productCard: {
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  marginBottom: "30px",
  ':hover': {
    transform: "scale(1.05)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  },
},
productImage: {
  height: "250px",
  width: "100%",
  objectFit: "cover",
  borderRadius: "10px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  ':hover': {
    transform: "scale(1.1)", // Efecto de zoom en hover
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
},
productName: {
  fontWeight: "500",
  fontSize: "1.2rem",
},
productPrice: {
  color: "#d99aa4", // Rosa para precio
  fontWeight: "600",
},
viewButton: {
  backgroundColor: "#f5dbdf", // Rosa brillante
  borderRadius: "50px",
  padding: "10px 20px",
  fontWeight: "600",
  ':hover': {
    backgroundColor: "#f5dbdf", // Rosa más oscuro
  },
},
cartItem: {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
},
removeButton: {
  marginLeft: "10px",
},
loading: {
  textAlign: "center",
  fontSize: "1.5rem",
  marginTop: "50px",
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
productImageCart: {
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

export default Home;