import React, { useState, useEffect } from 'react';
import '@/styles/EventAddForm.css'; // Re-using the same styles

const EmailInputForm = ({ formData, onFormDataChange, onSubmit }) => {
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        setValidationErrors({});
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormDataChange({ ...formData, [name]: value });
    };

    const validateEmail = (email) => {
        // Simple regex for email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = "Name is required.";
        }
        if (!formData.email) {
            newErrors.email = "Email address is required.";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
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
                    <h3 className="form-title">Enter Your Information</h3>
                </div>

                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
                        placeholder="Enter your full name"
                    />
                    {validationErrors.name && <p className="error-message">{validationErrors.name}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                        placeholder="Enter your email address"
                    />
                    {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
                </div>

                <div className="form-group button">
                    <button onClick={handleSubmit} className="submit-button">
                        <div className="submit-button-pill">
                            Submit
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailInputForm;