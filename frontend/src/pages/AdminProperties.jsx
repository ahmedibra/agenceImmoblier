// frontend/src/pages/AdminProperties.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Spinner, Alert, Image } from 'react-bootstrap';
import { properties, auth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import RichTextarea from '../components/RichTextarea';

const AdminProperties = () => {
  const { user } = useAuth();
  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);



    // États supplémentaires
const [showEditModal, setShowEditModal] = useState(false);
const [editingProperty, setEditingProperty] = useState(null);
const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    location: '',
    price_per_night: '',
    bedrooms: '',
    bathrooms: '',
    max_guests: '',
    amenities: [],
    availability_text: ''
});
const [updating, setUpdating] = useState(false);

// Liste des équipements (à adapter selon votre base)
const amenitiesList = [
    'WiFi', 'Climatisation', 'Chauffage', 'Cuisine équipée',
    'Machine à laver', 'Télévision', 'Parking gratuit', 'Piscine',
    'Animaux acceptés', 'Jacuzzi', 'Terrasse', 'Jardin'
];

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Accès non autorisé');
      return;
    }
    loadProperties();
  }, [currentPage, statusFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: 10,
        all: true // Pour que l'admin voit toutes les propriétés
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await properties.getAll(params);
      
      let data = [];
      let lastPageNum = 1;
      let totalCount = 0;
      
      if (response.data && response.data.data) {
        if (response.data.data.data) {
          data = response.data.data.data;
          lastPageNum = response.data.data.last_page || 1;
          totalCount = response.data.data.total || 0;
        } else if (Array.isArray(response.data.data)) {
          data = response.data.data;
        }
      }
      
      setPropertiesList(data);
      setLastPage(lastPageNum);
      setTotal(totalCount);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;
    
    try {
      await properties.delete(selectedProperty.id);
      toast.success('Propriété supprimée avec succès');
      setShowDeleteModal(false);
      loadProperties();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await properties.updateStatus(propertyId, { status: newStatus });
      toast.success(`Statut mis à jour: ${getStatusLabel(newStatus)}`);
      loadProperties();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleVisibility = async (property, isVisible) => {
    const newStatus = isVisible ? 'available' : 'hidden';
    setUpdatingStatus(true);
    try {
      await properties.updateStatus(property.id, { status: newStatus });
      toast.success(`Propriété ${isVisible ? 'visible sur le site' : 'masquée'}`);
      loadProperties();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'available': 'Disponible',
      'booked': 'Réservé',
      'maintenance': 'Maintenance',
      'hidden': 'Masqué'
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'available': 'success',
      'booked': 'warning',
      'maintenance': 'danger',
      'hidden': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{getStatusLabel(status)}</Badge>;
  };

  const filteredProperties = propertiesList.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  if (user?.role !== 'admin') {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <i className="bi bi-shield-lock fs-1"></i>
          <h4 className="mt-2">Accès non autorisé</h4>
          <p>Vous n'avez pas les droits pour accéder à cette page.</p>
        </Alert>
      </Container>
    );
  }





// Ouvrir la modale d’édition
const openEditModal = (property) => {
    setEditingProperty(property);
    setEditFormData({
        title: property.title || '',
        description: property.description || '',
        location: property.location || '',
        price_per_night: property.price_per_night || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        max_guests: property.max_guests || '',
        amenities: property.amenities || [],
        availability_text:property.availability_text
    });
    setShowEditModal(true);
};

// Gérer les changements dans le formulaire
const handleEditChange = (e) => {
    setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value
    });
};

// Gestion des équipements (checkbox)
const handleAmenityToggle = (amenity) => {
    if (editFormData.amenities.includes(amenity)) {
        setEditFormData({
            ...editFormData,
            amenities: editFormData.amenities.filter(a => a !== amenity)
        });
    } else {
        setEditFormData({
            ...editFormData,
            amenities: [...editFormData.amenities, amenity]
        });
    }
};

// Soumettre la modification
const handleUpdateProperty = async () => {
    setUpdating(true);
    try {
        const dataToSend = {
            ...editFormData,
            price_per_night: parseFloat(editFormData.price_per_night),
            bedrooms: parseInt(editFormData.bedrooms),
            bathrooms: parseInt(editFormData.bathrooms),
            max_guests: parseInt(editFormData.max_guests)
        };
        await properties.update(editingProperty.id, dataToSend);
        toast.success('Propriété modifiée avec succès');
        setShowEditModal(false);
        loadProperties(); // recharger la liste
    } catch (error) {
        console.error('Erreur modification:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    } finally {
        setUpdating(false);
    }
};

  return (
    <div className="bg-light py-4 min-vh-100">
      <Container fluid>
        {/* En-tête */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h1 className="h2 mb-1">
              <i className="bi bi-building me-2 text-primary"></i>
              Gestion des propriétés
            </h1>
            <p className="text-muted">Gérez toutes les propriétés du site</p>
          </div>
          <div>
            <Badge bg="primary" className="p-2">
              <i className="bi bi-database me-1"></i> {total} propriétés
            </Badge>
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Control
                  type="text"
                  placeholder="🔍 Rechercher par titre, localisation, propriétaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="available">Disponibles</option>
                  <option value="booked">Réservés</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="hidden">Masqués</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button variant="outline-secondary" onClick={loadProperties}>
                  <i className="bi bi-arrow-repeat me-1"></i> Actualiser
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tableau des propriétés */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Chargement des propriétés...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="bi bi-building fs-1 text-muted"></i>
              <h3 className="mt-3">Aucune propriété trouvée</h3>
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="bg-white rounded shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Titre / Localisation</th>
                  <th>Propriétaire</th>
                  <th>Contact</th>
                  <th>Prix / nuit</th>
                  <th>Statut</th>
                  <th>Visibilité</th>
                  <th>Date création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="align-middle">#{property.id}</td>
                    <td className="align-middle">
                      <img 
                        src={property.images && property.images[0] 
                          ? `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${property.images[0]}` 
                          : '/images/placeholder-small.jpg'}
                        alt={property.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-small.jpg';
                        }}
                      />
                    </td>
                    <td className="align-middle">
                      <strong>{property.title}</strong>
                      <br />
                      <small className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i>{property.location}
                      </small>
                      <br />
                      <small>
                        🛏️ {property.bedrooms} ch • 🚽 {property.bathrooms} sdb • 👥 {property.max_guests} pers.
                      </small>
                    </td>
                    <td className="align-middle">
                      <strong>{property.user?.name || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">ID: {property.user?.id}</small>
                    </td>
                    <td className="align-middle">
                      <i className="bi bi-envelope me-1"></i> {property.user?.email || 'N/A'}
                      <br />
                      <i className="bi bi-telephone me-1"></i> {property.user?.phone || 'Non renseigné'}
                    </td>
                    <td className="align-middle text-success fw-bold">
                      {property.price_per_night} DH
                    </td>
                    <td className="align-middle">
                      <Form.Select
                        size="sm"
                        value={property.status}
                        onChange={(e) => handleStatusChange(property.id, e.target.value)}
                        disabled={updatingStatus}
                        style={{ width: '120px' }}
                      >
                        <option value="available">Disponible</option>
                        <option value="booked">Réservé</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="hidden">Masqué</option>
                      </Form.Select>
                    </td>
                    <td className="align-middle">
                      <Form.Check
                        type="switch"
                        id={`switch-${property.id}`}
                        label={property.status !== 'hidden' ? 'Visible' : 'Masqué'}
                        checked={property.status !== 'hidden'}
                        onChange={(e) => handleToggleVisibility(property, e.target.checked)}
                        disabled={updatingStatus}
                      />
                    </td>
                    <td className="align-middle small">
                      {formatDate(property.created_at)}
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        <Button 
                          variant="info" 
                          size="sm"
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDetailModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button 
                          variant="warning" 
                          size="sm"
                          onClick={() => openEditModal(property)}
                      >
                          <i className="bi bi-pencil"></i>
                      </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted small">
              Page {currentPage} sur {lastPage}
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                disabled={currentPage === lastPage}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {/* Modal Détails */}
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Détails de la propriété</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProperty && (
              <div>
                <Row>
                  <Col md={6}>
                    <img 
                      src={selectedProperty.images && selectedProperty.images[0] 
                        ? `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${selectedProperty.images[0]}` 
                        : '/images/placeholder.jpg'}
                      alt={selectedProperty.title}
                      className="img-fluid rounded mb-3"
                      style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }}
                    />
                    <div className="d-flex gap-2 mt-2">
                      {selectedProperty.images?.slice(1, 4).map((img, idx) => (
                        <img 
                          key={idx}
                          src={`http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${img}`}
                          alt={`Thumb ${idx}`}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ))}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h4>{selectedProperty.title}</h4>
                    <p className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i> {selectedProperty.location}
                    </p>
                    <h5 className="text-success">{selectedProperty.price_per_night} DH / nuit</h5>
                    <hr />
                   <div dangerouslySetInnerHTML={{ __html: selectedProperty.description }} /><hr />

              
    <div className="mb-4">
        <h5 className="h4 text-black">🗓️ Le non disponibilité de bien</h5>
         <div dangerouslySetInnerHTML={{ __html: selectedProperty.availability_text }} /><hr />
    </div>

                    <div className="row mt-3">
                      <div className="col-6">
                        <small className="text-muted">Propriétaire</small>
                        <p><strong>{selectedProperty.user?.name}</strong></p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Contact</small>
                        <p><strong>{selectedProperty.user?.email}</strong></p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">téléphone</small>
                        <p><strong>{selectedProperty.user?.phone}</strong></p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge bg="secondary">Status: {getStatusLabel(selectedProperty.status)}</Badge>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>




{/* Modal d'édition */}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
    <Modal.Header closeButton>
        <Modal.Title>Modifier la propriété</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {editingProperty && (
            <Form>
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={editFormData.title}
                            onChange={handleEditChange}
                        />
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Label>Localisation</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={editFormData.location}
                            onChange={handleEditChange}
                        />
                    </Col>
                    <Col md={4} className="mb-3">
                        <Form.Label>Prix / nuit (DH)</Form.Label>
                        <Form.Control
                            type="number"
                            name="price_per_night"
                            value={editFormData.price_per_night}
                            onChange={handleEditChange}
                        />
                    </Col>
                    <Col md={4} className="mb-3">
                        <Form.Label>Chambres</Form.Label>
                        <Form.Control
                            type="number"
                            name="bedrooms"
                            value={editFormData.bedrooms}
                            onChange={handleEditChange}
                        />
                    </Col>
                    <Col md={4} className="mb-3">
                        <Form.Label>Salles de bain</Form.Label>
                        <Form.Control
                            type="number"
                            name="bathrooms"
                            value={editFormData.bathrooms}
                            onChange={handleEditChange}
                        />
                    </Col>
                    <Col md={12} className="mb-3">
                        <Form.Label>Capacité max (personnes)</Form.Label>
                        <Form.Control
                            type="number"
                            name="max_guests"
                            value={editFormData.max_guests}
                            onChange={handleEditChange}
                        />
                    </Col>
                    <Col><Form.Label>Description *</Form.Label>
                                           <RichTextarea
                                                              initialValue={editFormData.description}
                                                              onChange={(html) => setEditFormData(prev => ({ ...prev, description: html }))}
                                                              showSubmit={false}
                                                              showClear={true}
                                                              required
                                                            />
                                        </Col>
                                        <Col md={12} className="mb-3">
                                                              <Form.Label>Le non disponibilité de bien (pas obligatoire)</Form.Label>
                                                             <RichTextarea
                                                              placeholder="Décrivez les périodes de disponibilité (ex: du 01/07/2026 au 30/08/2026"
                                                              initialValue={editFormData.availability_text}
                                                              onChange={(html) => setEditFormData(prev => ({ ...prev, availability_text: html }))}
                                                              showSubmit={false}
                                                              showClear={true}
                                                            />
                                        </Col>
                    
                    <Col md={12} className="mb-3">
                        <Form.Label>Équipements</Form.Label>
                        <div className="row">
                            {amenitiesList.map(amenity => (
                                <div key={amenity} className="col-md-4">
                                    <Form.Check
                                        type="checkbox"
                                        label={amenity}
                                        checked={editFormData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Form>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
        </Button>
        <Button variant="primary" onClick={handleUpdateProperty} disabled={updating}>
            {updating ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
    </Modal.Footer>
</Modal>
        {/* Modal Suppression */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer définitivement la propriété ?
            <br />
            <strong>"{selectedProperty?.title}"</strong>
            <br />
            <span className="text-danger">Cette action est irréversible !</span>
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

export default AdminProperties;