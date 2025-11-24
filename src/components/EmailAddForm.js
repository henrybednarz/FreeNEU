import React, { useState, useEffect } from 'react';
import '@/styles/FormCard.css';

const EmailInputForm = ({ formData, onFormDataChange, onSubmitNotification, onSubmitRemoveNotification, isSubmitting }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [notificationsAllowed, setNotificationsAllowed] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationsSupported, setNotificationsSupported] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const supported = ('Notification' in window) && ('serviceWorker' in navigator);
        setNotificationsSupported(supported);

        if (supported) {
            const permission = Notification.permission;
            setNotificationsAllowed(permission === 'granted');

            const storedValue = window.localStorage.getItem('userNotificationsEnabled');
            setNotificationsEnabled(storedValue === 'true' && permission === 'granted');
        }
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
        if (!notificationsSupported) {
            console.log("Notifications are not supported in this browser.");
            return;
        }

        // Request permission if not already granted
        if (!notificationsAllowed) {
            const permission = await Notification.requestPermission();
            setNotificationsAllowed(permission === 'granted');

            if (permission !== 'granted') {
                console.log("Notification permission not granted.");
                return;
            }
        }

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
            window.localStorage.setItem('userNotificationsEnabled', 'true');
        }
    }

    const handleNotificationUnsubscribe = async () => {
        if (!notificationsSupported) return;

        onSubmitRemoveNotification(formData);
        setNotificationsEnabled(false);
        window.localStorage.setItem('userNotificationsEnabled', 'false');
    }

    const isButtonDisabled = () => {
        if (isSubmitting) return true;
        if (!notificationsSupported) return true;
        if (notificationsEnabled) return false; // Unsubscribe button should always be enabled
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied') return true;
        return false;
    }

    const getButtonText = () => {
        if (notificationsEnabled) {
            return 'Disable Notifications';
        }
        if (!notificationsSupported) {
            return 'Notifications Not Supported';
        }
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied') {
            return 'Notifications Blocked';
        }
        if (!notificationsAllowed) {
            return 'Enable Notifications (Allow Permission)';
        }
        return 'Enable Notifications';
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
                        disabled={isButtonDisabled()}
                        className={`submit-button ${notificationsEnabled ? 'unsubscribe' : ''}`}
                        type="button"
                    >
                        <div className="submit-button-pill">
                            {getButtonText()}
                        </div>
                    </button>
                </div>

                {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied' && !notificationsEnabled && (
                    <p className="error-message" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                        Notifications are blocked. Please enable them in your browser settings.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmailInputForm;