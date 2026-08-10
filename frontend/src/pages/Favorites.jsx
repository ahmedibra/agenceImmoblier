// src/pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { favorites } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';

const Favorites = () => {
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await favorites.getAll();
      setFavoritesList(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await favorites.remove(propertyId);
      setFavoritesList(favoritesList.filter(fav => fav.id !== propertyId));
      toast.success('Retiré des favoris');
    } catch (error) {
      toast.error('Erreur');
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
      <h1 className="text-2xl font-bold mb-6">Mes favoris ❤️</h1>
      
      {favoritesList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Vous n'avez aucun favori</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoritesList.map((property) => (
            <div key={property.id} className="relative">
              <button
                onClick={() => removeFavorite(property.id)}
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
              >
                ❌
              </button>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;