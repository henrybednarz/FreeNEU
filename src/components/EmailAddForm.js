import React, { useState, useEffect } from 'react';
import '@/styles/FormCard.css';

const EmailInputForm = ({ formData, onFormDataChange, onSubmit, onSubmitNotification, submissionState }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Default to false

    useEffect(() => {
        const storedValue = window.localStorage.getItem('userNotificationsEnabled');
        setNotificationsEnabled(storedValue === 'true');
    }, []);

    useEffect(() => {
        setValidationErrors({});
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormDataChange({ ...formData, [name]: value });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleNotificationSubmit = () => {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
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
            console.log('sending notification subscription request');
            onSubmitNotification(formData);
        }
    }

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
                    <h3 className="form-title">Get Notified</h3>
                    <div className="form-subtext">Sign up for email and push notifications of the latest events.</div>
                </div>

                <div className="form-group">
                    <label className="form-label">Name</label>
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
                    <button
                        onClick={handleNotificationSubmit}
                        disabled={submissionState.isSubmittingNotification || notificationsEnabled}
                        className="submit-button"
                        type="button"
                    >
                        <div className="submit-button-pill">
                            {notificationsEnabled ? 'Notifications Enabled' : 'Push Notifications'}
                        </div>
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submissionState.isSubmittingEmail}
                        className="submit-button">
                        <div className="submit-button-pill">
                            {submissionState.isSubmittingEmail ? 'Subscribing...' : 'Email Updates'}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailInputForm;
