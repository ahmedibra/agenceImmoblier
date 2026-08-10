// src/pages/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { bookings } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookings.getAll();
      setBookingsList(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Annuler cette réservation ?')) return;
    
    try {
      await bookings.cancel(id);
      toast.success('Réservation annulée');
      loadBookings();
    } catch (error) {
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      cancelled: 'Annulée'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${badges[status]}`}>
        {labels[status]}
      </span>
    );
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
      <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>
      
      {bookingsList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Vous n'avez aucune réservation</p>
          <Link to="/properties" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Découvrir des hébergements
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookingsList.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-lg p-4 shadow">
              <div className="flex flex-wrap justify-between items-start">
                <div className="flex-1">
                  <Link to={`/property/${booking.property_id}`}>
                    <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                      {booking.property?.title || `Propriété #${booking.property_id}`}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mt-2">
                    📍 {booking.property?.location || 'Adresse non spécifiée'}
                  </p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span>📅 Du {new Date(booking.check_in).toLocaleDateString()}</span>
                    <span>➡️ Au {new Date(booking.check_out).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 font-bold text-blue-600">
                    Total: {booking.total_price} DH
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(booking.status)}
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="block mt-2 text-red-600 text-sm hover:underline"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;