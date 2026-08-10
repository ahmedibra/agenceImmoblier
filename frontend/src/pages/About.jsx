// frontend/src/pages/About.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const About = () => {
   const advantages = [
    { icon: "bi-house-heart", title: "Hébergements confortables", desc: "Propres, bien équipés et soigneusement sélectionnés." },
    { icon: "bi-geo-alt", title: "Emplacements stratégiques", desc: "Proches des plages, commerces et attractions." },
    { icon: "bi-calendar-check", title: "Réservation simple", desc: "Processus rapide et sécurisé en quelques clics." },
    { icon: "bi-headset", title: "Assistance dédiée", desc: "Accompagnement pendant tout votre séjour." },
    { icon: "bi-tags", title: "Prix transparents", desc: "Tarifs compétitifs, sans mauvaise surprise." },
    { icon: "bi-chat-dots", title: "Service réactif", desc: "Une équipe à l'écoute de vos besoins." },
    { icon: "bi-building", title: "Large choix", desc: "Villas, appartements, maisons pour tous les goûts." }
  ];
  return (
    <>
      {/* Hero Section */}
      <div 
        className="site-blocks-cover inner-page-cover overlay" 
        style={{ 
          backgroundImage: 'url(assets/images/hero_bg_2.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          minHeight: '400px'
        }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center text-center" style={{ minHeight: '400px' }}>
            <div className="col-md-10">
              <h1 className="mb-2 text-white">À propos de Holiday Booking</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="site-section">
        <Container>
          <Row>
            <Col md={6} data-aos="fade-up" data-aos-delay="100">
              <img 
                src="assets/images/about.jpg" 
                alt="À propos de Homeland" 
                className="img-fluid rounded shadow"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Image+de+l%27agence';
                }}
              />
            </Col>
            <Col md={5} className="ml-auto" data-aos="fade-up" data-aos-delay="200">
              <div className="site-section-title">
                <h2>Notre agence</h2>
              </div>
              <p className="lead">
                Holiday Booking vous offre une expérience de location de vacances unique, 
                avec des biens soigneusement sélectionnés et un service personnalisé.
              </p>
              <p>
                Forts de plusieurs années d'expérience dans l'immobilier de luxe et la location saisonnière, 
                nous mettons notre expertise à votre service pour trouver le bien de vos rêves. 
                Notre équipe dévouée vous accompagne à chaque étape, de la sélection à la réservation.
              </p>
              <p>
                Que vous cherchiez une villa avec piscine, un appartement moderne ou un riad traditionnel, 
                notre catalogue varié répond à toutes vos envies. La satisfaction de nos clients est notre priorité.
              </p>
              <Button 
                href="/contact" 
                variant="outline-primary" 
                className="rounded-0 py-2 px-5"
              >
                Nous contacter
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Section valeurs ajoutées (optionnelle, pour enrichir la page) */}
      <div className="site-section bg-light">
        <Container>
          <div className="text-center mb-5">
            <div className="site-section-title">
              <h2>Pourquoi nous choisir ?</h2>
            </div>
            <p className="lead">Des services premium pour une expérience sans souci</p>
          </div>
          <Row className="g-4 mb-5">
                    {advantages.map((adv, idx) => (
                      <Col key={idx} md={6} lg={4}>
                        <div className="advantage-card p-4 h-100 shadow-sm rounded-4 bg-white border-0 transition-hover text-center">
                          <div className="icon-wrapper mb-3 ">
                            <i className={`bi ${adv.icon} fs-1 text-success`}></i>
                          </div>
                          <h4 className="h5 fw-bold">{adv.title}</h4>
                          <p className="text-muted mb-0">{adv.desc}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
        </Container>
      </div>
    </>
  );
};

export default About;