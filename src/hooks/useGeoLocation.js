import { useState, useEffect } from 'react';

export const useGeolocation = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError('Geolocation is not supported by your browser.');
            setIsLoading(false);
            return;
        }

        let watchId = null; // Variable to store the watch ID

        const handleSuccess = (position) => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
            setError(null);
            setIsLoading(false);
        };

        const handleError = (err) => {
            console.error("Error watching user location:", err);
            setError('Could not get your location. Map will be centered on a default location.');
            setIsLoading(false);
        };

        watchId = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    return { userLocation, error, isLoading };
};