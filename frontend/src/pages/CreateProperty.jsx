// frontend/src/pages/CreateProperty.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { properties } from '../services/api';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import RichTextarea from '../components/RichTextarea';


const CreateProperty = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    images: [], // Stockera les URLs des images
    amenities: [],
     availability_text: ''
  });

  const amenitiesList = [
    'WiFi', 'Climatisation', 'Chauffage', 'Cuisine équipée',
    'Machine à laver', 'Télévision', 'Parking gratuit', 'Piscine',
    'Animaux acceptés', 'Fumeurs acceptés', 'Jacuzzi', 'Sauna',
    'Barbecue', 'Terrasse', 'Jardin', 'Ascenseur'
  ];
const [availabilityHtml, setAvailabilityHtml] = useState('');
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

  // Upload des images vers le serveur
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
        const newImages = [...formData.images, ...response.data.images];
        setFormData({
          ...formData,
          images: newImages
        });
        toast.success(`${files.length} image(s) uploadée(s) avec succès`);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }
  };

  // Supprimer une image
 // frontend/src/pages/CreateProperty.jsx
// Partie suppression d'image corrigée

// frontend/src/pages/CreateProperty.jsx
// Remplacer la fonction removeImage par celle-ci :

const removeImage = async (index) => {
  const imageToRemove = formData.images[index];
  
  // Ne pas ajouter http://localhost:8000, garder le chemin relatif
  // L'image est stockée comme "/storage/properties/xxx.jpg"
  let imagePath = imageToRemove;
  
  // Si l'URL commence par http, extraire le chemin
  if (imageToRemove.startsWith('http')) {
    try {
      const url = new URL(imageToRemove);
      imagePath = url.pathname;
    } catch (e) {
      imagePath = imageToRemove;
    }
  }
  
  console.log('Suppression chemin:', imagePath);
  
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete('http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/api/delete-image', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { image_url: imagePath }
    });
    
    if (response.data.success) {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({
        ...formData,
        images: newImages
      });
      toast.success('Image supprimée');
    } else {
      toast.error(response.data.message || 'Erreur lors de la suppression');
    }
    
  } catch (error) {
    console.error('Erreur suppression:', error);
    toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
         availability_text: formData.availability_text,
        location: formData.location,
        price_per_night: parseFloat(formData.price_per_night),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        max_guests: parseInt(formData.max_guests),
        amenities: formData.amenities,
        images: formData.images // URLs des images uploadées
      };
      
      const response = await properties.create(submitData);
      
      toast.success('Annonce publiée avec succès !');
      
      setTimeout(() => {
        navigate(`/property/${response.data.data.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'ajout';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Redirection...</p>
        </div>
      </Container>
    );
  }
  const handleAvailabilityChange = (value) => {
  setFormData(prev => ({ ...prev, availability_text: value }));
};

  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <Row className="justify-content-center">
          
          <Col lg={10}>
            <div className="bg-white rounded shadow-sm p-4 p-md-5">
             <button className="btn btn-success text-white" >  <Link to="/my-properties" className='text-white'>
          <i className="bi bi-plus-circle-fill me-2 text-white"></i> Liste de  mes annonces
        </Link></button>
              <div className="text-center mb-4">
                <h1 className="h2 mb-2">📸 Publier une annonce</h1>
                <p className="text-muted">
                  {user?.name}, partagez votre bien avec notre communauté
                </p>
                <div className="alert alert-success">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Ajoutez des photos de votre bien pour maximiser les chances de location
                </div>
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
                        placeholder="Ex: Magnifique villa avec piscine"
                        required
                      />
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Label>Description *</Form.Label>
                       <RichTextarea
                        placeholder="Décrivez votre bien en détail..."
                        initialValue={formData.description}
                        onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                        showSubmit={false}
                        showClear={true}
                        />   
                    </Col>

                     <Col md={12} className="mb-3">
                      <Form.Label>Le non disponibilité de bien (pas obligatoire)</Form.Label>
                      <RichTextarea
                        placeholder="Décrivez les périodes de disponibilité (ex: du 1er juin au 30 août 2025)"
                        initialValue={formData.availability_text}
                        onChange={(html) => setFormData(prev => ({ ...prev, availability_text: html }))}
                        showSubmit={false}
                        showClear={true}
                        required
                      />
                      <Form.Text className="text-muted">
                          Décrivez les périodes où le bien est non disponible.
                      </Form.Text>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Localisation *</Form.Label>
                       <Form.Select
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    className="rounded-0"
                                                     required
                                                  ><option value="">Choisir une  ville</option>
                                                    <option value="Kélibia">Kélibia</option>
                                                  <option value="Hammam El Ghezaz">Hammam El Ghezaz </option>
                                                  <option value="Dar Allouch">Ezzahra</option>
                                                  <option value="Kérkouane">Kérkouane</option>
                                                  <option value="Dar Allouch">Dar Allouch</option>
                                                  <option value="Hawaria">Hawaria</option>
                                                    <option value="autre">autre</option>
                                                  </Form.Select>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Prix par nuit (TND) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price_per_night"
                        value={formData.price_per_night}
                        onChange={handleChange}
                        placeholder="Ex: 500"
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

                {/* Upload d'images */}
                <div className="mb-4">
                  <h3 className="h5 mb-3">Photos du bien</h3>
                  <Form.Group className="mb-3">
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
                 
                  {formData.images.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img 
                            src={`http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${img}`}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            className="rounded border"
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                            onClick={() => removeImage(index)}
                            style={{ width: '25px', height: '25px', padding: 0, fontSize: '12px' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
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
                  <Button 
                    type="submit" 
                    variant="success" 
                    size="lg"
                    disabled={loading || uploading || formData.images.length === 0}
                    className="flex-grow-1"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Publication...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Publier l'annonce
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    onClick={() => navigate(-1)}
                  >
                    Annuler
                  </Button>
                </div>
                
                {formData.images.length === 0 && !uploading && (
                  <div className="text-warning mt-3 small">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    Ajoutez au moins une photo pour publier votre annonce
                  </div>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateProperty;