// frontend/src/pages/MyProperties.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { properties } from '../services/api';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';

const MyProperties = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadMyProperties();
  }, [isAuthenticated, navigate]);

  const loadMyProperties = async () => {
    try {
      setLoading(true);
      const response = await properties.myProperties();
      console.log('Mes propriétés:', response.data);
      
      let data = [];
      if (response.data && response.data.data) {
        data = response.data.data.data || response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      setPropertiesList(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    
    try {
      await properties.delete(propertyToDelete.id);
      toast.success('Propriété supprimée avec succès');
      setShowDeleteModal(false);
      loadMyProperties();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <Badge bg="success">Disponible</Badge>;
      case 'booked':
        return <Badge bg="warning">Réservé</Badge>;
      case 'maintenance':
        return <Badge bg="danger">Maintenance</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        {/* En-tête */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Mes propriétés</h1>
            <p className="text-muted">Gérez vos annonces immobilières</p>
          </div>
          <Link to="/host/properties/create">
            <Button variant="success">
              <i className="bi bi-plus-circle-fill me-2"></i>
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        {/* Statistiques */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3>{propertiesList.length}</h3>
                <p className="text-muted mb-0">Total annonces</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-success">
                  {propertiesList.filter(p => p.status === 'available').length}
                </h3>
                <p className="text-muted mb-0">Disponibles</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-warning">
                  {propertiesList.filter(p => p.status === 'booked').length}
                </h3>
                <p className="text-muted mb-0">Réservées</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Liste des propriétés */}
        {propertiesList.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="bi bi-building fs-1 text-muted"></i>
              <h3 className="mt-3">Aucune propriété</h3>
              <p className="text-muted">Vous n'avez pas encore publié d'annonces</p>
              <Link to="/host/properties/create">
                <Button variant="success">
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Créer ma première annonce
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {propertiesList.map((property) => (
              <Col key={property.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={property.images && property.images[0] 
                        ? `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${property.images[0]}` 
                        : 'https://via.placeholder.com/300x200?text=Image+non+disponible'}
                      style={{ height: '180px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="text-truncate">
                      {property.title}
                    </Card.Title>
                    <div className="text-muted small mb-2">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {property.location}
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-success fw-bold">
                        {property.price_per_night} TND <span className="text-muted small">/ nuit</span>
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/property/${property.id}`}
                        variant="outline-primary" 
                        size="sm"
                        className="flex-grow-1"
                      >
                        <i className="bi bi-eye me-1"></i> Voir
                      </Button>
                      <Button 
                        as={Link} 
                        to={`/host/properties/edit/${property.id}`}
                        variant="outline-warning" 
                        size="sm"
                        className="flex-grow-1"
                      >
                        <i className="bi bi-pencil me-1"></i> Modifier
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="flex-grow-1"
                        onClick={() => {
                          setPropertyToDelete(property);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="bi bi-trash me-1"></i> Supprimer
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal de confirmation de suppression */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer la propriété 
            <strong> "{propertyToDelete?.title}"</strong> ?
            <br />
            Cette action est irréversible.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <i className="bi bi-trash me-1"></i> Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default MyProperties;