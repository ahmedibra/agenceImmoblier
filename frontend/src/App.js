// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Composants communs
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Routes protégées
import ProtectedRoute from './components/ProtectedRoute';
import HostRoute from './components/HostRoute';
import AdminRoute from './components/AdminRoute';

// Pages publiques
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Pages utilisateur
import UserDashboard from './pages/Dashboard/UserDashboard';
import Bookings from './pages/Bookings';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

// Pages hôte
import HostDashboard from './pages/Dashboard/HostDashboard';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import MyProperties from './pages/MyProperties';
import HostBookings from './pages/HostBookings';

// Pages admin
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProperties from './pages/AdminProperties';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
             
              <Route path="/contact" element={<Contact />} />

              <Route path="/about" element={<About />} />
              
              {/* Routes utilisateur connecté */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                
                <Route path="/host/properties/create" element={<CreateProperty />} />
                <Route path="/host/properties/edit/:id" element={<EditProperty />} />
                <Route path="/my-properties" element={<MyProperties />} />
                <Route path="/host/properties/edit/:id" element={<EditProperty />} />
                <Route path="/host/bookings" element={<HostBookings />} />
              </Route>
              
              {/* Routes hôte */}
              <Route element={<HostRoute />}>
                <Route path="/host/dashboard" element={<HostDashboard />} />
              </Route>
              
              {/* Routes admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/properties" element={<AdminProperties />} />
              </Route>
              
              {/* 404 - Page non trouvée */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

// Composant 404
const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
    <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
      Retour à l'accueil
    </a>
  </div>
);

export default App;
