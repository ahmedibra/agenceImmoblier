// frontend/src/components/HeroCarouselWithSearch.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroCarouselWithSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    location: '',
    check_in: '',
    check_out: '',
    guests: ''
  });

  const slides = [
    {
      id: 1,
      image: '/images/hero_bg_1.jpg',
      title: 'Trouvez votre séjour idéal',
      subtitle: 'Des milliers de biens de vacances au Maroc',
      type: 'Rent'
    },
    {
      id: 2,
      image: '/images/hero_bg_2.jpg',
      title: 'Location de vacances',
      subtitle: 'Les meilleurs prix garantis',
      type: 'Sale'
    },
    {
      id: 3,
      image: '/images/hero_bg_3.jpg',
      title: 'Réservez en toute confiance',
      subtitle: 'Paiement sécurisé et annulation gratuite',
      type: 'Lease'
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: true,
    prevArrow: <button type="button" className="slick-prev">‹</button>,
    nextArrow: <button type="button" className="slick-next">›</button>
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <div className="hero-with-search position-relative">
      <Slider {...settings} className="hero-carousel">
        {slides.map((slide) => (
          <div key={slide.id}>
            <div 
              className="hero-slide"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '650px',
                position: 'relative'
              }}
            >
              <div className="hero-overlay">
                <Container className="h-100">
                  <Row className="align-items-center justify-content-center text-center h-100">
                    <Col md={8}>
                      <h1 className="text-white display-3 fw-bold mb-3">{slide.title}</h1>
                      <p className="text-white lead mb-4">{slide.subtitle}</p>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Search Form - Superposé au milieu du carousel */}
      <div className="search-form-overlay">
        <Container>
          <div className="search-form-wrapper bg-white rounded-4 shadow-lg p-4">
            <Form onSubmit={handleSubmit}>
              <Row className="g-3 align-items-end">
                <Col lg={4} md={6}>
                  <Form.Label className="fw-bold text-dark">
                    <i className="bi bi-geo-alt-fill text-success me-1"></i> Destination
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Où voulez-vous aller ?"
                    value={filters.location}
                    onChange={handleChange}
                    className="border-0 border-bottom rounded-0 py-2"
                    style={{ borderBottom: '2px solid #28a745 !important' }}
                  />
                </Col>
                <Col lg={3} md={6}>
                  <Form.Label className="fw-bold text-dark">
                    <i className="bi bi-calendar-check text-success me-1"></i> Arrivée
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="check_in"
                    value={filters.check_in}
                    onChange={handleChange}
                    className="border-0 border-bottom rounded-0 py-2"
                    style={{ borderBottom: '2px solid #28a745 !important' }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Col>
                <Col lg={3} md={6}>
                  <Form.Label className="fw-bold text-dark">
                    <i className="bi bi-calendar-x text-success me-1"></i> Départ
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="check_out"
                    value={filters.check_out}
                    onChange={handleChange}
                    className="border-0 border-bottom rounded-0 py-2"
                    style={{ borderBottom: '2px solid #28a745 !important' }}
                    min={filters.check_in || new Date().toISOString().split('T')[0]}
                  />
                </Col>
                <Col lg={2} md={6}>
                  <Button 
                    type="submit" 
                    variant="success" 
                    className="w-100 py-3 rounded-pill fw-bold"
                  >
                    <i className="bi bi-search me-2"></i>
                    Rechercher
                  </Button>
                </Col>
              </Row>
            </Form>
            
            {/* Liens rapides */}
            <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
              <small className="text-muted">Recherches populaires :</small>
              <a href="#" className="text-decoration-none small text-success" 
                onClick={(e) => {
                  e.preventDefault();
                  setFilters({...filters, location: 'Casablanca'});
                }}>
                Casablanca
              </a>
              <a href="#" className="text-decoration-none small text-success"
                onClick={(e) => {
                  e.preventDefault();
                  setFilters({...filters, location: 'Marrakech'});
                }}>
                Marrakech
              </a>
              <a href="#" className="text-decoration-none small text-success"
                onClick={(e) => {
                  e.preventDefault();
                  setFilters({...filters, location: 'Tanger'});
                }}>
                Tanger
              </a>
              <a href="#" className="text-decoration-none small text-success"
                onClick={(e) => {
                  e.preventDefault();
                  setFilters({...filters, location: 'Rabat'});
                }}>
                Rabat
              </a>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HeroCarouselWithSearch;