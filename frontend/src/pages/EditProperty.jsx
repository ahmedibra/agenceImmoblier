// frontend/src/pages/EditProperty.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { properties } from '../services/api';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import RichTextarea from '../components/RichTextarea';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price_per_night: '',
    bedrooms: '',
    bathrooms: '',
    max_guests: '',
    images: [],
    amenities: [],
     availability_text: ''
  });
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const amenitiesList = [
    'WiFi', 'Climatisation', 'Chauffage', 'Cuisine équipée',
    'Machine à laver', 'Télévision', 'Parking gratuit', 'Piscine',
    'Animaux acceptés', 'Fumeurs acceptés', 'Jacuzzi', 'Sauna',
    'Barbecue', 'Terrasse', 'Jardin', 'Ascenseur'
  ];


  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProperty();
  }, [id, isAuthenticated, navigate]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const response = await properties.getOne(id);
      
      let propertyData;
      if (response.data && response.data.data) {
        propertyData = response.data.data;
      } else if (response.data) {
        propertyData = response.data;
      }
      
      setFormData({
        title: propertyData.title || '',
        description: propertyData.description || '',
        location: propertyData.location || '',
        price_per_night: propertyData.price_per_night || '',
        bedrooms: propertyData.bedrooms || '',
        bathrooms: propertyData.bathrooms || '',
        max_guests: propertyData.max_guests || '',
        images: propertyData.images || [],
        amenities: propertyData.amenities || [],
        availability_text:  propertyData.availability_text || '',
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement');
      navigate('/my-properties');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAmenityToggle = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };

  // Upload de nouvelles images
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    const formDataImages = new FormData();
    files.forEach(file => {
      formDataImages.append('images[]', file);
    });
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/api/upload-images', formDataImages, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Stocker les URLs des nouvelles images
        const uploadedUrls = response.data.images;
        setNewImages([...newImages, ...uploadedUrls]);
        setFormData({
          ...formData,
          images: [...formData.images, ...uploadedUrls]
        });
        toast.success(`${files.length} image(s) ajoutée(s)`);
        
        // Reset file input
        e.target.value = '';
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  // Marquer une image pour suppression
  const markImageForDeletion = (index) => {
    const imageToDelete = formData.images[index];
    
    // Ajouter aux images à supprimer
    setImagesToDelete([...imagesToDelete, imageToDelete]);
    
    // Retirer de l'affichage
    const newImagesList = [...formData.images];
    newImagesList.splice(index, 1);
    setFormData({
      ...formData,
      images: newImagesList
    });
    
    toast.success('Image marquée pour suppression');
  };

  // Annuler la suppression d'une image (optionnel)
  const cancelImageDeletion = (imageUrl) => {
    setImagesToDelete(imagesToDelete.filter(img => img !== imageUrl));
    setFormData({
      ...formData,
      images: [...formData.images, imageUrl]
    });
    toast.success('Suppression annulée');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    console.log('=== DONNÉES ENVOYÉES ===');
    console.log('Nouvelles images (URLs):', newImages);
    console.log('Images à supprimer:', imagesToDelete);
    
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
         availability_text:formData. availability_text,
        location: formData.location,
        price_per_night: parseFloat(formData.price_per_night),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        max_guests: parseInt(formData.max_guests),
        amenities: formData.amenities,
        new_images: newImages,           // URLs des nouvelles images
        images_to_delete: imagesToDelete // URLs des images à supprimer
      };
      
      console.log('Submit data:', submitData);
      
      const response = await properties.update(id, submitData);
      console.log('Réponse:', response.data);
      
      toast.success('Propriété modifiée avec succès');
      navigate('/my-properties');
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Response erreur:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la modification';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/storage')) return `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${url}`;
  return `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties/${url}`;
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
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="bg-white rounded shadow-sm p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="h2 mb-2">✏️ Modifier l'annonce</h1>
                <p className="text-muted">Modifiez les informations de votre bien</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Informations principales */}
                <div className="mb-4">
                  <h3 className="h5 mb-3">Informations principales</h3>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Label>Titre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Label>Description *</Form.Label>
                       <RichTextarea
                                          initialValue={formData.description}
                                          onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                                          showSubmit={false}
                                          showClear={true}
                                          required
                                        />
                    </Col>
                    <Col md={12} className="mb-3">
                                          <Form.Label>Le non disponibilité de bien (pas obligatoire)</Form.Label>
                                         <RichTextarea
                                          placeholder="Décrivez les périodes de disponibilité (ex: du 01/07/2026 au 30/08/2026"
                                          initialValue={formData.availability_text}
                                          onChange={(html) => setFormData(prev => ({ ...prev, availability_text: html }))}
                                          showSubmit={false}
                                          showClear={true}
                                        />
                                          <Form.Text className="text-muted">
                                              Décrivez les périodes où le bien est non disponible.
                                          </Form.Text>
                                        </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Localisation *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Prix par nuit (TND) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price_per_night"
                        value={formData.price_per_night}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </Col>
                  </Row>
                </div>

                {/* Capacités */}
                <div className="mb-4">
                  <h3 className="h5 mb-3">Capacités</h3>
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Label>Chambres *</Form.Label>
                      <Form.Control
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label>Salles de bain *</Form.Label>
                      <Form.Control
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label>Capacité max (personnes) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="max_guests"
                        value={formData.max_guests}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </Col>
                  </Row>
                </div>

                {/* Gestion des images */}
                <div className="mb-4">
                  <h3 className="h5 mb-3">Photos du bien</h3>
                  
                  {/* Images existantes */}
                  {formData.images.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Images actuelles</label>
                      <div className="d-flex flex-wrap gap-2">
                        {formData.images.map((img, index) => (
                          <div key={index} className="position-relative">
                           <img 
                                src={formatImageUrl(img)}
                                alt={`Image ${index + 1}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                className="rounded border"
                              />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                              onClick={() => markImageForDeletion(index)}
                              style={{ width: '25px', height: '25px', padding: 0, fontSize: '12px' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload nouvelles images */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Ajouter des photos</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <Form.Text className="text-muted">
                      Ajoutez jusqu'à 10 photos (JPEG, PNG, GIF max 5MB par photo), le premier image considérer comme l'image principal
                    </Form.Text>
                  </Form.Group>
                  
                  {uploading && (
                    <div className="text-center my-3">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Upload en cours...</span>
                    </div>
                  )}

                  {/* Images à supprimer (liste de confirmation) */}
                  {imagesToDelete.length > 0 && (
                    <div className="mt-3">
                      <label className="form-label fw-bold text-danger">Images à supprimer :</label>
                      <div className="d-flex flex-wrap gap-2">
                        {imagesToDelete.map((img, index) => (
                          <div key={index} className="position-relative">
                            <img 
                              src={`http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${img}`}
                              alt="À supprimer"
                              style={{ width: '80px', height: '80px', objectFit: 'cover', opacity: 0.6 }}
                              className="rounded border border-danger"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-success position-absolute top-0 end-0 rounded-circle"
                              onClick={() => cancelImageDeletion(img)}
                              style={{ width: '25px', height: '25px', padding: 0, fontSize: '12px' }}
                            >
                              ↺
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Équipements */}
                <div className="mb-4">
                  <h3 className="h5 mb-3">Équipements</h3>
                  <div className="row">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="col-md-4 mb-2">
                        <Form.Check
                          type="checkbox"
                          label={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <Button type="submit" variant="success" size="lg" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                  <Button variant="outline-secondary" size="lg" onClick={() => navigate('/my-properties')}>
                    Annuler
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProperty;