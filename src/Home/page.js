import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
      <Button variant="primary" onClick={handleShow} className="me-2">
        {name} <FontAwesomeIcon icon={faCartShopping} />
        {totalProductos > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "5px 10px",
              fontSize: "14px",
            }}
          >
            {totalProductos}
          </div>
        )}
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FontAwesomeIcon icon={faCartShopping} /> Cart
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <h5>Productos:</h5>
          <button onClick={() => navigate("/detallecarrito", { state: { Norepetidos, repetidos, totalCarrito } })}>Ver detalles</button>
          <ul>
            {Norepetidos.map((product, index) => (
              <li key={index}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{ width: "50px", height: "50px" }}
                />
                <p>{product.title}</p>
                <p>
                  Precio: ${product.price * (repetidos[product.title] || 1)}
                </p>
                <Button
                  variant="danger"
                  onClick={() => removeFromCart(product.id)} // Llamamos a removeFromCart
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </li>
            ))}
            <h3>Subtotal: {totalCarrito}</h3>
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
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="#">
            <img style={{ width: "150px" }} src={Logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link onClick={() => navigate("/home")}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate("/productos")}>
                Productos
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/contacto")}>
                Contacto
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <SearchInput
                onChange={handleSearch}
                placeholder="Buscar productos..."
              />
              <Button variant="outline-success">Buscar</Button>
            </Form>

            <OffCanvasExample placement={"end"} name={"Carrito"} />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src={Image} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={Image2} alt="Second slide" />
          </Carousel.Item>
        </Carousel>

        <h2>Productos</h2>
        <Row>
          {productos.slice(0, 10).map((producto) => (
            <Col xs={12} sm={6} md={4} key={producto.id}>
              <Card style={{ margin: "1rem" }}>
                <Card.Img
                  variant="top"
                  src={producto.thumbnail}
                  alt={producto.title}
                  style={{ height: "200px", width: "100%", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{producto.title}</Card.Title>
                  <Card.Text>Precio: ${producto.price}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate("/detalle", { state: { producto } })
                    }
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

export default Home;
