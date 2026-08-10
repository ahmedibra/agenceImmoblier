// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Pagination } from 'react-bootstrap';
import { properties } from '../services/api';
import HeroCarousel from '../components/HeroCarousel';
import PropertyCard from '../components/PropertyCard';
import WhyChooseUs from '../components/WhyChooseUs';
import MobileAppBanner from '../components/MobileAppBanner';

const Home = () => {
  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadProperties();
  }, [searchFilters, currentPage]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      const params = { page: currentPage };
      if (searchFilters) {
        if (searchFilters.location) params.location = searchFilters.location;
        if (searchFilters.min_price) params.min_price = searchFilters.min_price;
        if (searchFilters.max_price) params.max_price = searchFilters.max_price;
        if (searchFilters.bedrooms) params.bedrooms = searchFilters.bedrooms;
        if (searchFilters.check_in) params.check_in = searchFilters.check_in;
        if (searchFilters.check_out) params.check_out = searchFilters.check_out;
        if (searchFilters.guests) params.max_guests = searchFilters.guests;
      }
      
      const response = await properties.getAll(params);
      
      let data = [];
      let last = 1;
      let totalItems = 0;
      
      if (response.data && response.data.data) {
        if (response.data.data.data) {
          data = response.data.data.data;
          last = response.data.data.last_page || 1;
          totalItems = response.data.data.total || 0;
        } else if (Array.isArray(response.data.data)) {
          data = response.data.data;
          last = response.data.last_page || 1;
          totalItems = response.data.total || 0;
        } else {
          data = [];
        }
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else {
        data = [];
      }
      
      setPropertiesList(data);
      setLastPage(last);
      setTotal(totalItems);
      
    } catch (error) {
      console.error('Erreur:', error);
      setPropertiesList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page); 
    }
    document.getElementById("lo").scrollIntoView({behavior:"smooth"});
  };

  // Générer les numéros de pagination
  const renderPaginationItems = () => {
    let items = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(lastPage, currentPage + 2);
    
    if (endPage - startPage < 4) {
      if (startPage > 1) startPage = Math.max(1, endPage - 4);
      if (endPage < lastPage) endPage = Math.min(lastPage, startPage + 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <>
      <HeroCarousel onSearch={handleSearch} />
      <div className="py-5 bg-light">
        <Container id="lo">
          <div className="text-center mb-5">
            <p className="text-muted">
              {searchFilters?.location 
                ? `Résultats pour ${searchFilters.location}` 
                : 'Découvrez notre sélection de biens de vacances'}
              {total > 0 && <span className="ms-2">({total} biens)</span>}
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : propertiesList.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-building fs-1 text-muted"></i>
              <h3 className="mt-3">Aucun bien trouvé</h3>
              <p className="text-muted">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <>
              <Row>
                {propertiesList.map((property) => (
                  <Col key={property.id} md={6} lg={4} className="mb-4">
                    <PropertyCard property={property} />
                  </Col>
                ))}
              </Row>
              
              {/* Pagination */}
              {lastPage > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1}  />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {renderPaginationItems()}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage} />
                    <Pagination.Last onClick={() => handlePageChange(lastPage)} disabled={currentPage === lastPage} />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Container>
      </div>
      <WhyChooseUs />
      <MobileAppBanner />
    </>
  );
};

export default Home;