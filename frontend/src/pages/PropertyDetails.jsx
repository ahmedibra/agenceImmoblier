// frontend/src/pages/PropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { properties, bookings, favorites } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Button, Form, Alert, Spinner, Modal, Carousel } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import toast from 'react-hot-toast';
import ContactOwnerForm from '../pages/ContactOwnerForm';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    if (id) loadProperty();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && property) checkIfFavorite();
  }, [isAuthenticated, property]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const response = await properties.getOne(id);
      let propertyData = response.data?.data || response.data?.property || response.data;
      if (!propertyData) throw new Error('Format de réponse invalide');
      setProperty(propertyData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement';
      setError(errorMessage);
      toast.error(errorMessage);
      setTimeout(() => navigate('/properties'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await favorites.getAll();
      let favoritesList = response.data?.data || response.data || [];
      setIsFavorite(favoritesList.some(fav => fav.id === parseInt(id)));
    } catch (error) {
      console.error('Erreur favoris:', error);
    }
  };

  const calculateTotal = () => {
    if (checkIn && checkOut && property) {
      const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      setTotalPrice(nights > 0 ? nights * property.price_per_night : 0);
    }
  };

  useEffect(() => calculateTotal(), [checkIn, checkOut, property]);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Veuillez sélectionner les dates');
      return;
    }
    try {
      const response = await properties.checkAvailability(id, checkIn, checkOut);
      setAvailability(response.data);
      toast[response.data.available ? 'success' : 'error'](
        response.data.available ? 'Propriété disponible pour ces dates !' : 'Non disponible pour ces dates'
      );
    } catch (error) {
      toast.error('Erreur lors de la vérification');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter');
      return navigate('/login');
    }
    if (!checkIn || !checkOut) {
      toast.error('Veuillez sélectionner les dates');
      return;
    }
    try {
      await bookings.create({
        property_id: parseInt(id),
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice
      });
      toast.success('Réservation confirmée !');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter');
      return navigate('/login');
    }
    try {
      if (isFavorite) {
        await favorites.remove(id);
        setIsFavorite(false);
        toast.success('Retiré des favoris');
      } else {
        await favorites.add(id);
        setIsFavorite(true);
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Message envoyé à l\'agent');
  };

  const formatImageUrl = (url) => {
    if (!url) return '/images/placeholder.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/storage')) return `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${url}`;
    return `hhttp://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties/${url}`;
  };

  const images = property?.images?.length ? property.images.map(formatImageUrl) : [];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/properties')}>Retour à la liste</Button>
        </Alert>
      </Container>
    );
  }

  if (!property) return null;
  const phoneNumber = "+21628658042";
  const whatsappNumber = "21628658042"; // sans le + pour WhatsApp

  return (
    <>
      {/* Hero Section avec parallaxe */}
      <div className="hero-section position-relative" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${images[0] || '/images/hero-bg.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '76px'
      }}>
        <Container className="text-center text-white">
          
          <h1 className="display-3 fw-bold mb-3">{property.title}</h1>
          <p className="lead mb-4">
            <i className="bi bi-geo-alt-fill me-2"></i>{property.location}
          </p>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <div className="bg-dark bg-opacity-50 rounded-pill px-4 py-2">
              <i className="bi bi-door-open me-2"></i>{property.bedrooms} Chambres
            </div>
            <div className="bg-dark bg-opacity-50 rounded-pill px-4 py-2">
              <i className="bi bi-droplet me-2"></i>{property.bathrooms} Salles de bain
            </div>
            <div className="bg-dark bg-opacity-50 rounded-pill px-4 py-2">
              <i className="bi bi-people me-2"></i>{property.max_guests} Personnes
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {/* Galerie principale */}
          <Col lg={8}>
            {/* Carrousel principal */}
            {images.length > 0 && (
              <div className="mb-4">
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  navigation
                  pagination={{ clickable: true }}
                  thumbs={{ swiper: thumbsSwiper }}
                  className="main-swiper rounded-4 overflow-hidden"
                  style={{ height: '450px' }}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        alt={`${property.title} - ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => { setLightboxIndex(idx); setShowLightbox(true); }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Miniatures */}
                <Swiper
                  modules={[FreeMode, Navigation, Thumbs]}
                  freeMode
                  watchSlidesProgress
                  slidesPerView={4}
                  spaceBetween={10}
                  onSwiper={setThumbsSwiper}
                  className="thumb-swiper mt-3"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        style={{ height: '80px', width: '100%', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4"> 
          <h1 className="display-3 fw-bold mb-3">{property.title}</h1>
           <hr />
          <p className="lead mb-4">
           <strong>Code :</strong> <i className=" text-success"></i>#{property.id}
          </p>
            <hr />
          <p className="lead mb-4">
            <i className="bi bi-geo-alt-fill me-2 text-success"></i>{property.location}
          </p>
            <hr />
          <div className="d-flex  gap-4 flex-wrap">
            <div className="  ">
              <i className="bi bi-door-open me-2  text-success"></i>{property.bedrooms} Chambres
            </div>
            <div className=" ">
              <i className="bi bi-droplet me-2 text-success"></i>{property.bathrooms} Salles de bain
            </div>
            <div className=" ">
              <i className="bi bi-people me-2 text-success"></i>{property.max_guests} Personnes
            </div>
          </div> </div> 
              
            {/* Description détaillée */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
              <h3 className="h4 mb-3">
                <i className="bi bi-info-circle-fill text-success me-2"></i>
                Description
              </h3>
              <div dangerouslySetInnerHTML={{ __html: property.description }} /><hr />

              {property.availability_text && (
    <div className="mb-4">
        <h5 className="h4 text-black">🗓️ Le non disponibilité de bien</h5>
         <div dangerouslySetInnerHTML={{ __html: property.availability_text }} /><hr />
    </div>
)} 
              <h3 className="h4 mb-3">
                <i className="bi bi-grid-3x3-gap-fill text-success me-2"></i>
                Équipements
              </h3>
              <div className="row">
                {property.amenities?.map((amenity, idx) => (
                  <div key={idx} className="col-md-4 mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Carte de localisation */}
            <div className="bg-white rounded-4 shadow-sm p-4">
              <h3 className="h4 mb-3">
                <i className="bi bi-geo-alt-fill text-success me-2"></i>
                Localisation
              </h3>
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                  title="Map"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </Col>

          {/* Sidebar réservation */}
          <Col lg={4}>
            {/* Widget prix et réservation */}
            <div className="bg-white rounded-4 shadow-sm p-4 " style={{ top: '90px' }}>
              <div className="text-center mb-4">
                <div className="display-4 text-success fw-bold">
                  {property.price_per_night} TND
                </div>
                <p className="text-muted">par nuit</p>
                {property.average_rating > 0 && (
                  <div className="text-warning">
                    {'★'.repeat(Math.floor(property.average_rating))}
                    {'☆'.repeat(5 - Math.floor(property.average_rating))}
                    <span className="text-muted ms-2">({property.reviews_count} avis)</span>
                  </div>
                )}
              </div>
              <hr className="my-4" />
 <div className="contact-buttons py-4 bg-light">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h3 className="mb-3">Pour réserver</h3>
            <p className="text-muted mb-4">
              Notre équipe est à votre disposition .
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {/* Bouton Appel téléphonique */}
              <a
                href={`tel:${phoneNumber}`}
                className="btn btn-primary btn-lg rounded-pill px-4"
                style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
              >
                <i className="bi bi-telephone-fill me-2"></i>
                Nous appeler 28658042
              </a>

              {/* Bouton WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg rounded-pill px-4"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                <i className="bi bi-whatsapp me-2"></i>
                WhatsApp
              </a>
            </div>
            <p className="mt-3 small text-muted">
              Disponible 7j/7 de 9h à 20h
            </p>
          </Col>
        </Row>
      </Container>
    </div>
            </div>

            {/* Contact propriétaire */}
            <ContactOwnerForm propertyId={property.id} propertyTitle={property.title} />
          </Col>
        </Row>
      </Container>

      {/* Lightbox / Modal galerie */}
      <Modal show={showLightbox} fullscreen onHide={() => setShowLightbox(false)} className="lightbox-modal">
        <Modal.Header closeButton className="bg-dark text-white border-0">
          <Modal.Title>Galerie photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark d-flex align-items-center p-0">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            initialSlide={lightboxIndex}
            className="lightbox-swiper"
            style={{ width: '100%', height: '100vh' }}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={img} alt={`Full ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal.Body>
      </Modal>

      <style jsx global>{`
        .main-swiper {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .main-swiper .swiper-button-next,
        .main-swiper .swiper-button-prev {
          background: rgba(255,255,255,0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #28a745;
        }
        .main-swiper .swiper-button-next:after,
        .main-swiper .swiper-button-prev:after {
          font-size: 18px;
        }
        .thumb-swiper .swiper-slide {
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .thumb-swiper .swiper-slide-thumb-active {
          opacity: 1;
          border: 2px solid #28a745;
          border-radius: 8px;
        }
        .lightbox-modal .modal-content {
          background: transparent;
        }
        .lightbox-swiper .swiper-button-next,
        .lightbox-swiper .swiper-button-prev {
          color: white;
          background: rgba(0,0,0,0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        @media (max-width: 768px) {
          .hero-section {
            background-attachment: scroll;
            min-height: 400px;
          }
          .hero-section h1 {
            font-size: 1.75rem;
          }
          .main-swiper {
            height: 300px !important;
          }
        }
      `}</style>
    </>
  );
};

export default PropertyDetails;