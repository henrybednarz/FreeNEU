// src/components/EventAddForm.js

import React, { useState, useEffect } from 'react';
import '@/styles/EventAddForm.css';

const TYPE_COLORS = {
    'Food': 'orange',
    'Drink': 'blue',
    'Party': 'purple',
    'Gift': 'red',
    'Other': 'green'
};

const EventInputForm = ({ formData, onFormDataChange, onSelectLocationFromMap, onSubmit }) => {
    const eventTypes = ['Food', 'Drink', 'Party', 'Gift', 'Other'];
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        setValidationErrors({});
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormDataChange({ ...formData, [name]: value });
    };

    const handleTypeSelect = (type) => {
        onFormDataChange({ ...formData, type: type });
    };

    const handleMapSelect = () => {
        if (onSelectLocationFromMap) {
            onSelectLocationFromMap();
        }
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = "Event name is required.";
        }
        if (!formData.description) {
            newErrors.description = "Description is required.";
        }
        if (!formData.latitude || !formData.longitude) {
            newErrors.location = "Specify a location.";
        }
        setValidationErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSubmit(formData);
        }
    };

    return (
        <div className="event-input-container">
            <div className="event-input-form">
                <div className="form-header">
                    <h3 className="form-title">Create New Event</h3>
                </div>

                <div className="form-group">
                    <label className="form-label">Event Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
                        placeholder="Enter event name"
                    />
                    {validationErrors.name && <p className="error-message">{validationErrors.name}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Event Type</label>
                    <div className="chip-container">
                        {eventTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleTypeSelect(type)}
                                className={`type-chip type-chip-${TYPE_COLORS[type]} ${
                                    formData.type === type ? 'chip-selected' : ''
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-textarea ${validationErrors.description ? 'input-error' : ''}`}
                        placeholder="Enter event description"
                        rows="3"
                    />
                    {validationErrors.description && <p className="error-message">{validationErrors.description}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <div className={`address-container`}>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="address-input"
                            placeholder="Enter address or select from map"
                            readOnly
                        />
                        <button onClick={handleMapSelect}
                                className={`map-button ${formData.latitude && formData.longitude ? 'location-selected' : ''} ${validationErrors.location ? 'input-error' : ''}`}>
                            📍 Map
                        </button>
                    </div>
                </div>
                <div className="form-group button">
                    <button onClick={handleSubmit} className="submit-button">
                        <div className="submit-button-pill">
                            Create Event
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventInputForm;