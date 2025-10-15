import { useState, useEffect, useCallback } from 'react';

export const useNotification = (duration = 5000) => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [notification, duration]);

    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showNotification,
        clearNotification,
    };
};