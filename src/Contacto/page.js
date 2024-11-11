import { Container } from 'react-bootstrap';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Logo from '../Imgs/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useNavigate } from "react-router-dom";

function Contacto() {
  const navigate = useNavigate();
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
        <div style={styles.header}>
          <h2 style={styles.title}>Contacto</h2>
        </div>
        <div style={styles.row}>
          <div style={styles.formContainer} data-aos="zoom-in" data-aos-delay="100">
            <div style={styles.formWrapper}>
              <form method="POST">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese su email" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Asunto</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el asunto" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Mensaje</Form.Label>
                  <textarea placeholder="Ingrese su mensaje" style={styles.textarea}></textarea>
                </Form.Group>

                <Button style={styles.button}>Enviar</Button>
              </form>
            </div>
          </div>
          <div style={styles.infoContainer} data-aos="fade-left" data-aos-delay="300">
            <div style={styles.infoText}>
              <div style={styles.infoTitle}>Sigamos en contacto!</div>
              <p>Comunícate con nosotros a través del formulario.</p>
              <p>¡Gracias por visitar nuestro sitio web!</p>
            </div>
            <div style={styles.contactDetails}>
              <div style={styles.contactRow}>
                <div style={styles.contactLabel}>Email:</div>
                <div style={styles.contactValue}>camibelu1302@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    marginTop:'4rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formContainer: {
    flex: '1',
    marginRight: '1rem',
  },
  formWrapper: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  textarea: {
    width: '100%',
    height: '100px',
    borderRadius: '4px',
    padding: '0.5rem',
    border: '1px solid #ccc',
  },
  button: {
    marginTop: '1rem',
  },
  infoContainer: {
    flex: '1',
    marginLeft: '1rem',
  },
  infoText: {
    marginTop: '1rem',
  },
  infoTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  contactDetails: {
    marginTop: '2rem',
  },
  contactRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '0.5rem',
  },
  contactLabel: {
    fontWeight: 'bold',
  },
  contactValue: {
    fontWeight: 'normal',
  },
};

export default Contacto;
