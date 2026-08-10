// frontend/src/components/PropertyCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, Spinner } from 'react-bootstrap';

const PropertyCard = ({ property }) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const getFirstImage = () => {
    if (!property) return null;
    
    const images = property.images;
    
    // Vérifier si images existe et est un tableau
    if (Array.isArray(images) && images.length > 0) {
      let imgUrl = images[0];
      if (imgUrl) {
        // Si l'URL commence par /storage, ajouter le domaine
        if (imgUrl.startsWith('/storage')) {
          return `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties/${imgUrl}`;
        }
        // Si l'URL est déjà complète
        if (imgUrl.startsWith('http')) {
          return imgUrl;
        }
        // Sinon, ajouter le domaine et le slash
        return `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties/${imgUrl}`;
      }
    }
    
    // Si images est une chaîne JSON
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let imgUrl = parsed[0];
          if (imgUrl && imgUrl.startsWith('/storage')) {
            return `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${imgUrl}`;
          }
          return imgUrl;
        }
      } catch (e) {
        // Ce n'est pas du JSON, c'est peut-être une URL directe
        if (images && images.startsWith('/storage')) {
          return `http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/storage/properties${images}`;
        }
        return images;
      }
    }
    
    return null;
  };

  const getStatusBadge = () => {
    switch (property?.status) {
      case 'available':
        return <Badge bg="success">Disponible</Badge>;
      case 'booked':
        return <Badge bg="warning">Réservé</Badge>;
      case 'maintenance':
        return <Badge bg="danger">Maintenance</Badge>;
      default:
        return <Badge bg="success">À louer</Badge>;
    }
  };

  const imageUrl = getFirstImage();
  const showPlaceholder = imgError || !imageUrl;
  const price = property?.price_per_night || 0;
  const title = property?.title || 'Sans titre';
  const location = property?.location || 'Localisation non spécifiée';
  const bedrooms = property?.bedrooms || 0;
  const bathrooms = property?.bathrooms || 0;
  const maxGuests = property?.max_guests || 0;

  return (
    <Card className="h-100 shadow-sm hover-shadow transition">
      <div className="position-relative" style={{ height: '200px', background: '#f8f9fa' }}>
        {imgLoading && !showPlaceholder && (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="secondary" size="sm" />
          </div>
        )}
        
        {!showPlaceholder ? (
         <Link to={`/property/${property?.id}`} className="text-decoration-none text-dark">
          
           <Card.Img 
            variant="top" 
            src={imageUrl}
            style={{ 
              height: '200px', 
              objectFit: 'cover', 
              display: imgLoading ? 'none' : 'block' 
            }}
            onLoad={() => setImgLoading(false)}
            onError={(e) => {
              console.log('Erreur chargement image:', imageUrl);
              setImgLoading(false);
              setImgError(true);
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
            }}
          /></Link>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted bg-light">
            <i className="bi bi-image fs-1 mb-2"></i>
            <small>Image non disponible</small>
          </div>
        )}
        
        <div className="position-absolute top-0 start-0 m-2">
          {getStatusBadge()}
        </div>
      </div>
      
      <Card.Body>
        <Card.Title className="text-truncate">
          <Link to={`/property/${property?.id}`} className="text-decoration-none text-dark">
            {title}
          </Link>
        </Card.Title>
        
        <div className="text-muted small mb-2">
          <i className="bi bi-geo-alt-fill me-1"></i>
          {location}
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="text-success fw-bold fs-5">{price} TND</span>
            <span className="text-muted small"> / nuit</span>
          </div>
          <div className="text-muted small">
            <i className="bi bi-star-fill text-warning me-1"></i>
            {property?.average_rating || 'Nouveau'}
          </div>
        </div>
        
        <div className="d-flex justify-content-between text-muted small border-top pt-2">
          <span>
            <i className="bi bi-door-open me-1"></i> {bedrooms} ch.
          </span>
          <span>
            <i className="bi bi-droplet me-1"></i> {bathrooms} sdb
          </span>
          <span>
            <i className="bi bi-people me-1"></i> {maxGuests} pers.
          </span>
        </div>
      </Card.Body>
      
      <Card.Footer className="bg-white border-top-0">
        <Button 
          as={Link} 
          to={`/property/${property?.id}`} 
          variant="outline-success" 
          className="w-100"
          size="sm"
        >
          Voir les détails
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default PropertyCard;