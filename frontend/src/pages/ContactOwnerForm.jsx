// frontend/src/components/ContactOwnerForm.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';

const ContactOwnerForm = ({ propertyId, propertyTitle }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/api/contact', {
        ...formData,
        property_id: propertyId,
        property_title: propertyTitle,
        subject: `Demande d'information sur la propriété: ${propertyTitle}`,
      });
      setSuccess(true);
      toast.success('Message envoyé ! Le propriétaire vous répondra rapidement.');
      setFormData({ fullname: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm mt-4">
      <h4 className="mb-3">Contacter le propriétaire</h4>
      {success ? (
        <Alert variant="success">Message envoyé avec succès !</Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom complet *</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Téléphone * </Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le message'}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default ContactOwnerForm;