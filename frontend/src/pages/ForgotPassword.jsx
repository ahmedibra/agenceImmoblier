// pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { auth } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await auth.forgotPassword(email);
      toast.success(response.data.message || 'Email envoyé !');
      setSubmitted(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de l\'envoi';
      console.log(msg)
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="bi bi-key fs-1 text-primary"></i>
                <h2 className="mt-2">Mot de passe oublié ?</h2>
                <p className="text-muted">
                  Entrez votre email, nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              {submitted ? (
                <Alert variant="success" className="text-center">
                  <i className="bi bi-envelope-check-fill fs-4"></i>
                  <p className="mb-0 mt-2">
                    Un email vous a été envoyé avec les instructions.
                  </p>
                  <Link to="/login" className="btn btn-link mt-3">
                    Retour à la connexion
                  </Link>
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Votre adresse email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@email.com"
                        required
                        className="border-start-0"
                      />
                    </div>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-2 rounded-pill"
                    disabled={loading}
                  >
                    {loading ? 'Envoi...' : 'Envoyer le lien'}
                  </Button>
                  <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none">
                      ← Retour à la connexion
                    </Link>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;