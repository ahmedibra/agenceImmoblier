// src/components/SimpleHero.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const HeroCarousel = ({ onSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState({
    location: '',
    min_price: '',
    max_price: '',
    bedrooms: ''
  });

  const slides = [
    {
      image: 'assets/images/billboard.jpg',
      title: 'Trouvez votre séjour idéal',
      type: 'Location de vacances',
      subtitle: 'Des biens de qualité au meilleur prix'
    },
    {
      image: 'assets/images/hero_bg_4.jpg',
      title: 'Bienvenue sur Homeland',
      type: 'Location de vacances',
      subtitle: 'Découvrez nos propriétés exceptionnelles'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
   
    e.preventDefault();
    // Nettoyer les champs vides
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    console.log('Filtres envoyés:', activeFilters);
    if (onSearch) onSearch(activeFilters);
    document.getElementById("lo").scrollIntoView({behavior:"smooth"});
  };

  const slide = slides[currentSlide];

  return (
    <div className="hero-with-search position-relative">
      {/* Hero Background */}
      <div 
        className="site-blocks-cover overlay"
        style={{ 
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '650px',
          transition: 'background-image 0.5s ease',
          position: 'relative'
        }}
      >
        <div className="hero-overlay">
          <Container className="h-100">
            <Row className="align-items-center justify-content-center text-center h-100">
              <Col md={10}>
                <span className="d-inline-block bg-success text-white px-3 mb-3 property-offer-type rounded">
                  {slide.type}
                </span>
                <h1 className="mb-2 text-white display-3 fw-bold">{slide.title}</h1>
                <p className="mb-4 text-white lead">{slide.subtitle}</p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Search Form - Positionné au milieu du carousel */}
      <div className="search-form-middle">
        <Container>
          <div className="search-form-wrapper">
            <Form onSubmit={handleSubmit}>
              <Row className="g-3 align-items-end">
                <Col lg={3} md={6}>
                  <Form.Label className="fw-bold text-dark mb-1">
                    <i className="bi bi-geo-alt-fill text-success me-1"></i> Destination
                  </Form.Label>
                  <Form.Select
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    className="rounded-0 form-select-lg"
                  >
                    <option value="">Toutes les destinations</option>
                    <option value="Kélibia">Kélibia</option>
                    <option value="Hammam El Ghezaz">Hammam El Ghezaz</option>
                    <option value="Ezzahra">Ezzahra</option>
                    <option value="Kérkouane">Kérkouane</option>
                    <option value="Dar Allouch">Dar Allouch</option>
                    <option value="Hawaria">Hawaria</option>
                  </Form.Select>
                </Col>

                <Col lg={3} md={6}>
                  <Form.Label className="fw-bold text-dark mb-1">
                    <i className="bi bi-cash-stack text-success me-1"></i> Prix min (TND)
                  </Form.Label>
                  <input
                    type="number"
                    name="min_price"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={handleChange}
                    className="form-control rounded-0"
                  />
                </Col>

                <Col lg={3} md={6}>
                  <Form.Label className="fw-bold text-dark mb-1">
                    <i className="bi bi-cash-stack text-success me-1"></i> Prix max (TND)
                  </Form.Label>
                  <input
                    type="number"
                    name="max_price"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={handleChange}
                    className="form-control rounded-0"
                  />
                </Col>

                <Col lg={3} md={6}>
                  <Form.Label className="fw-bold text-dark mb-1">
                    <i className="bi bi-door-open text-success me-1"></i> Chambres
                  </Form.Label>
                  <input
                    type="number"
                    name="bedrooms"
                    placeholder="Nb chambres"
                    value={filters.bedrooms}
                    onChange={handleChange}
                    className="form-control rounded-0"
                  />
                </Col>

                <Col lg={12} className='text-center'>
                   <Button 
                    type="submit" 
                    variant="success" 
                    className="w-50 search-btn"
                  >
                    <i className="bi bi-search me-2"></i>
                    Rechercher
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </div>

      <style jsx>{`
        .hero-with-search {
          position: relative;
          min-height: 650px;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
        }

        .search-form-middle {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          z-index: 20;
          padding: 0 15px;
        }

        .search-form-wrapper {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          max-width: 1100px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-btn {
          background: #28a745;
          border: none;
          border-radius: 0;
          padding: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          min-height: 58px;
        }

        .search-btn:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        }

        .form-control, .form-select {
          padding: 12px 15px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 0;
        }

        .form-control:focus, .form-select:focus {
          border-color: #28a745;
          box-shadow: none;
          outline: none;
        }

        @media (max-width: 768px) {
          .search-form-wrapper {
            padding: 20px;
          }
          .hero-with-search {
            min-height: 550px;
          }
          .search-btn {
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;