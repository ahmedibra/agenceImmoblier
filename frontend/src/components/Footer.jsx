// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0 text-white">
            <h5>
              <i className="bi bi-house-heart me-2"></i>
              Holiday Booking
            </h5>
            <p className=" small text-white">
              Holiday Booking vous offre une expérience de location de vacances unique, avec des biens soigneusement sélectionnés et un service personnalisé.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0 text-white">
            <h5>Liens rapides</h5>
            <ul className="list-unstyled text-white">
              <li><a href="/" className="text-white text-decoration-none">Accueil</a></li>
              <li><a href="/about" className="text-white text-decoration-none">À propos</a></li>
              <li><a href="/contact" className="text-white text-decoration-none">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Suivez-nous</h5>
            <div className="fs-4">
              <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="bg-secondary" />
        <div className="text-center  small">
          &copy; Cette application créer par IBR Téchnologie Studio. Tous droits réservés.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;