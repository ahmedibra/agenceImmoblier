// src/pages/Profile.jsx - Version Bootstrap
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab } from 'react-bootstrap';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.updateProfile(formData);
      toast.success('Profil mis à jour');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await auth.updatePassword(passwordData);
      toast.success('Mot de passe mis à jour');
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <div className="bg-white rounded-circle p-3 d-inline-block shadow-sm mb-3">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
              </div>
              <h1 className="h2 mb-2">Mon Profil</h1>
              <p className="text-muted">Gérez vos informations personnelles</p>
            </div>

            <Tabs defaultActiveKey="profile" className="mb-4 justify-content-center">
              <Tab eventKey="profile" title={<span><i className="bi bi-person me-2"></i>Informations</span>}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h3 className="h5 mb-4">Informations personnelles</h3>
                    <Form onSubmit={handleProfileUpdate}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Nom complet</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Téléphone</Form.Label>
                          <Form.Control
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+212 6 12 34 56 78"
                          />
                        </Col>
                        <Col md={12} className="mb-3">
                          <Form.Label>Adresse</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Votre adresse complète"
                          />
                        </Col>
                      </Row>
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="security" title={<span><i className="bi bi-shield-lock me-2"></i>Sécurité</span>}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h3 className="h5 mb-4">Changer le mot de passe</h3>
                    <Form onSubmit={handlePasswordUpdate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mot de passe actuel</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwordData.password}
                          onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmer le mot de passe</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwordData.password_confirmation}
                          onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" variant="warning" disabled={loading}>
                        {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                    logout();
                  }
                }}
                className="btn btn-link text-danger"
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Se déconnecter
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;