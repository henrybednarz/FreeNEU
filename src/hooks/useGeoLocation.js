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

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
                setIsLoading(false);
            },
            (err) => {
                console.error("Error getting user location:", err);
                setError('Could not get your location. Map will be centered on a default location.');
                setIsLoading(false);
            }
        );
    }, []);

    return { userLocation, error, isLoading };
};