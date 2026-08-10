// frontend/src/components/MobileAppBanner.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MobileAppBanner = () => {
  return (
    <div className="app-banner py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <h2 className="text-white fw-bold mb-3">Notre application mobile</h2>
            <p className="text-white-50 lead mb-4">
              Réservez vos vacances où que vous soyez. Téléchargez notre application et profitez d'offres exclusives !
            </p>
            <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-md-start">
  <a href="#" target="_blank" rel="noopener noreferrer">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" height="100" width="200" />
  </a>
  <a href="#" target="_blank" rel="noopener noreferrer">
    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/fr_badge_web_generic.png" alt="Google Play" height="100" width="200" />
  </a>
</div>
          </Col>
          <Col md={6} className="text-center">
            <img 
              src="/images/mobile-app-preview.png" 
              alt="Aperçu de l'application" 
              className="img-fluid"
              style={{ maxHeight: '300px' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .app-banner {
          background: #198754;;
          border-radius: 0;
          margin: 40px 0 0;
        }
        @media (max-width: 768px) {
          .app-banner {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileAppBanner;