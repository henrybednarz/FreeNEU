import React from 'react';
import '@/styles/NotificationBanner.css'; // Add this new import

const NotificationBanner = ({ message, type, onClose }) => {
    return (
        <div className={`notification-banner ${type}`} onClick={onClose}>
            <span className="notification-message">{message}</span>
        </div>
    )
}

export default NotificationBanner;