import React, { useState, useEffect } from 'react';
import '@/styles/FormCard.css';

const EmailInputForm = ({ formData, onFormDataChange, onSubmitNotification, onSubmitRemoveNotification, isSubmitting }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

    const handleNotificationSubscribe = async () => {
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
            onSubmitNotification(formData);
            setNotificationsEnabled(true);
        }
    }

    const handleNotificationUnsubscribe = async () => {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
        onSubmitRemoveNotification(formData);
        setNotificationsEnabled(false);
    }

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
                        disabled={notificationsEnabled}
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
                        disabled={notificationsEnabled}
                        onChange={handleChange}
                        className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                        placeholder="Enter your email address"
                    />
                    {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
                </div>
                <div className="form-group button">
                    <button
                        onClick={notificationsEnabled ? handleNotificationUnsubscribe : handleNotificationSubscribe}
                        disabled={isSubmitting}
                        className={`submit-button ${notificationsEnabled ? 'unsubscribe' : ''}`}
                        type="button"
                    >
                        <div className="submit-button-pill">
                            {notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailInputForm;
