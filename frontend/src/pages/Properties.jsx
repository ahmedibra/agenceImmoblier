// src/pages/Properties.jsx
import React, { useState, useEffect } from 'react';
import { properties } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const Properties = () => {
  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    location: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    max_guests: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [currentPage, filters]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      // Nettoyer les filtres vides
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const params = { page: currentPage, ...activeFilters };
      const response = await properties.getAll(params);
      
      // Extraction robuste du tableau de propriétés
      let data = [];
      let totalPages = 1;
      let totalItems = 0;
      
      if (response.data) {
        // Structure paginée de Laravel : { data: [...], last_page, total }
        if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data;
          totalPages = response.data.last_page || 1;
          totalItems = response.data.total || 0;
        }
        // Structure directe : [...]
        else if (Array.isArray(response.data)) {
          data = response.data;
        }
        // Fallback : si data est un objet non standard, on tente de le convertir
        else if (response.data.data && !Array.isArray(response.data.data)) {
          data = Object.values(response.data.data);
        }
      }
      
      setPropertiesList(data);
      setLastPage(totalPages);
      setTotal(totalItems);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setPropertiesList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Réinitialiser la page lors d'un filtre
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      max_guests: ''
    });
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Tous les hébergements</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          {showFilters ? 'Masquer filtres' : 'Afficher filtres'} 🔍
        </button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              name="location"
              placeholder="📍 Ville"
              value={filters.location}
              onChange={handleFilterChange}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              name="min_price"
              placeholder="💰 Prix min (TND)"
              value={filters.min_price}
              onChange={handleFilterChange}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              name="max_price"
              placeholder="💰 Prix max (TND)"
              value={filters.max_price}
              onChange={handleFilterChange}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              name="bedrooms"
              placeholder="🛏️ Chambres"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="border rounded-lg p-2"
            />
            <input
              type="number"
              name="max_guests"
              placeholder="👥 Personnes max"
              value={filters.max_guests}
              onChange={handleFilterChange}
              className="border rounded-lg p-2"
            />
          </div>
          <button
            onClick={resetFilters}
            className="mt-4 text-red-600 hover:text-red-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Résultats */}
      {propertiesList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun bien trouvé</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesList.map((property, index) => {
          console.log(`Index ${index}:`, property);
          return <PropertyCard key={property?.id || index} property={property} />;
        })}
          </div>
          
          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-3 py-1">
                Page {currentPage} sur {lastPage} ({total} biens)
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Properties;