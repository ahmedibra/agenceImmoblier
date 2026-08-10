import React from 'react';
import { Link } from 'react-router-dom';

const HostDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Hôte</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/host/properties/create" className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700">
            Ajouter un bien
          </Link>
          <Link to="/host/properties" className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700">
            Mes biens
          </Link>
          <Link to="/host/bookings" className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700">
            Réservations reçues
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;