import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/users" className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700">
            Gérer les utilisateurs
          </Link>
          <Link to="/admin/properties" className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700">
            Gérer les propriétés
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;