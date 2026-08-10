import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

const SearchForm = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    listingType: '',
    offerType: '',
    city: ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <Form className="form-search col-md-12" onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col md={3}>
          <Form.Label>Listing Types</Form.Label>
          <Form.Select
            name="listingType"
            value={filters.listingType}
            onChange={handleChange}
            className="rounded-0"
          >
            <option value="">Condo</option>
            <option value="">Commercial Building</option>
            <option value="">Land Property</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label>Offer Type</Form.Label>
          <Form.Select
            name="offerType"
            value={filters.offerType}
            onChange={handleChange}
            className="rounded-0"
          >
            <option value="">For Sale</option>
            <option value="">For Rent</option>
            <option value="">For Lease</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label>Select City</Form.Label>
          <Form.Select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="rounded-0"
          >
            <option value="">New York</option>
            <option value="">Brooklyn</option>
            <option value="">London</option>
            <option value="">Tokyo</option>
            <option value="">Paris</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button type="submit" variant="success" className="btn-block rounded-0 w-100">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;