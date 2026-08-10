// src/pages/HostBookings.jsx
import React, { useState, useEffect } from 'react';
import { bookings } from '../services/api';
import toast from 'react-hot-toast';

const HostBookings = () => {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookings.hostBookings();
      setBookingsList(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      if (status === 'confirm') {
        await bookings.confirm(id);
        toast.success('Réservation confirmée');
      } else {
        await bookings.reject(id);
        toast.success('Réservation refusée');
      }
      loadBookings();
    } catch (error) {
      toast.error('Erreur');
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
      <h1 className="text-2xl font-bold mb-6">Réservations reçues</h1>
      
      {bookingsList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucune réservation reçue</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookingsList.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-lg p-4 shadow">
              <div className="flex flex-wrap justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{booking.property?.title}</h2>
                  <p className="text-gray-600 mt-1">
                    Voyageur: {booking.user?.name}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>📅 Du {new Date(booking.check_in).toLocaleDateString()}</span>
                    <span>➡️ Au {new Date(booking.check_out).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 font-bold text-blue-600">
                    Montant: {booking.total_price} DH
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(booking.status)}
                  {booking.status === 'pending' && (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirm')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'reject')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Refuser
                      </button>
                    </div>
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

export default HostBookings;