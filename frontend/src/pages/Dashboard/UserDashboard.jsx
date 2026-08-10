import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg">Bienvenue, {user?.name} !</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link to="/bookings" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100">
            <h3 className="font-bold">Mes réservations</h3>
          </Link>
          <Link to="/favorites" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
            <h3 className="font-bold">Mes favoris</h3>
          </Link>
          <Link to="/profile" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100">
            <h3 className="font-bold">Mon profil</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;