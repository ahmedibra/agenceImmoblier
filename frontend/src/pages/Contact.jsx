// frontend/src/pages/Contact.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Envoi vers votre API backend (à adapter si besoin)
      await axios.post('http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/api/contact', formData);
      toast.success('Message envoyé avec succès !');
      setFormData({ fullname: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="site-blocks-cover inner-page-cover overlay"
        style={{
          backgroundImage: 'url(/images/hero_bg_2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center text-center" style={{ minHeight: '400px' }}>
            <div className="col-md-10">
              <h1 className="mb-2 text-white">Contactez-nous</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div className="site-section">
        <Container>
          <Row>
            <Col md={12} lg={8} className="mb-5">
              <Form onSubmit={handleSubmit} className="p-5 bg-white border rounded shadow-sm">
                <Row className="form-group">
                  <Col md={12} className="mb-3">
                    <Form.Label className="font-weight-bold">Nom complet*</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12} className="mb-3">
                    <Form.Label className="font-weight-bold">Email*</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </Col>
                </Row>
                 <Row className="form-group">
                  <Col md={12} className="mb-3">
                    <Form.Label className="font-weight-bold">Télephone*</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="télephone"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12} className="mb-3">
                    <Form.Label className="font-weight-bold">Sujet*</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12} className="mb-3">
                    <Form.Label className="font-weight-bold">Message*</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12}>
                    <Button type="submit" variant="primary" className="py-2 px-4 rounded-0" disabled={loading}>
                      {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col lg={4}>
              <div className="p-4 mb-3 bg-white rounded shadow-sm">
                <h3 className="h6 text-black mb-3 text-uppercase">Coordonnées</h3>
                <p className="mb-0 font-weight-bold">Adresse</p>
                <p className="mb-4">Kélibia</p>

                <p className="mb-0 font-weight-bold">Téléphone</p>
                <p className="mb-4"><a href="tel:+212522123456">+21628658042</a></p>

              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Contact;