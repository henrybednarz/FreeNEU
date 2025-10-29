import React, { useState, useEffect } from 'react';
import '@/styles/EventAddForm.css'; // Re-using the same styles

const EmailInputForm = ({ formData, onFormDataChange, onSubmit }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [subscribed, setSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);

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

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    }

    async function enableNotifications() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
        if (!formData.email || !validateEmail(formData.email)) {
            setValidationErrors((prev) => ({ ...prev, email: 'Valid email is required to enable notifications.' }));
            return;
        }

        try {
            setSubscribing(true);
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') {
                setSubscribing(false);
                return;
            }

            const vapidResp = await fetch('/api/notifications?vapid=public');
            if (!vapidResp.ok) {
                console.error('Failed to fetch VAPID public key');
                setSubscribing(false);
                return;
            }
            const vapidJson = await vapidResp.json();
            const publicKey = vapidJson.publicKey;
            const reg = await navigator.serviceWorker.ready;
            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            const resp = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    subscription
                }),
            });

            if (resp.ok) {
                setSubscribed(true);
            } else {
                console.error('Failed to save subscription');
            }
        } catch (err) {
            console.error('Subscription error:', err);
        } finally {
            setSubscribing(false);
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
                    <div className="form-subtext">Sign up for email notifications of the latest events. Optionally enable push notifications.</div>
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

                <div className="form-group">
                    <button
                        onClick={enableNotifications}
                        disabled={subscribed || subscribing}
                        className="submit-button"
                        type="button"
                    >
                        <div className="submit-button-pill">
                            {subscribing ? 'Enabling...' : (subscribed ? 'Subscribed to notifications' : 'Enable notifications')}
                        </div>
                    </button>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                        {subscribed ? 'Push notifications enabled for this email.' : 'Push requires a valid email and service worker.'}
                    </div>
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
