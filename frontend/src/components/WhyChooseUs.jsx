import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const WhyChooseUs = () => {
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
    
     <section className="why-choose-us py-5">
      <Container>
        <div className="text-center mb-5">
          <span className="badge bg-success px-3 py-2 mb-3">Pourquoi nous choisir ?</span>
          <h2 className="display-5 fw-bold mb-3">Holiday Booking</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Nous faisons de chaque séjour une expérience <strong>confortable, simple et mémorable</strong>.
            Des logements soigneusement sélectionnés pour répondre à toutes vos envies.
          </p>
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

        <div className="text-center mt-4 p-5 bg-light rounded-4">
          <h3 className="fw-bold mb-3">Notre priorité : votre satisfaction</h3>
          <p className="lead mb-4">
            Nous nous engageons à vous offrir un séjour agréable avec un service <strong>fiable et de qualité</strong>.
          </p>
          <button className="btn btn-success btn-lg rounded-pill px-5">
            Réservez dès maintenant
          </button>
          <p className="mt-4 text-muted small">
            Choisissez-nous pour des vacances sans stress et des souvenirs inoubliables. ✨
          </p>
        </div>
      </Container>

      <style jsx>{`
        .transition-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .transition-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px -10px rgba(0,0,0,0.15) !important;
        }
        .why-choose-us {
          background: #f8f9fa;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;