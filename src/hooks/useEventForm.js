import { useState, useCallback } from 'react';
import { getAddressFromCoordinates } from './useAddressLookup';

export const useEventForm = () => {
    const initialFormState = {
        name: '',
        description: '',
        type: 'Food',
        address: '',
        latitude: null,
        longitude: null,
    };

    const [showEventForm, setShowEventForm] = useState(false);
    const [isSelectingLocation, setIsSelectingLocation] = useState(false);
    const [newEventData, setNewEventData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = useCallback(() => {
        setNewEventData(initialFormState);
        setShowEventForm(false);
        setIsSelectingLocation(false);
        setIsSubmitting(false);
    }, []);

    const openForm = useCallback(() => {
        setShowEventForm(true);
        setNewEventData(initialFormState);
    }, []);

    const closeForm = useCallback(() => {
        setShowEventForm(false);
    }, []);

    const toggleForm = useCallback(() => {
        setShowEventForm(prev => !prev);
        if (showEventForm) {
            setNewEventData(initialFormState);
        }
    }, [showEventForm]);

    const startLocationSelection = useCallback(() => {
        setIsSelectingLocation(true);
        setShowEventForm(false);
    }, []);

    const updateFormData = useCallback((updatedData) => {
        setNewEventData(updatedData);
    }, []);

    const handleLocationSelected = useCallback(async (lat, lng) => {
        setIsSelectingLocation(false);
        setShowEventForm(true);

        const updatedData = {
            ...newEventData,
            address: "Fetching address...",
            latitude: lat,
            longitude: lng,
        };

        setNewEventData(updatedData);

        const fetchedAddress = await getAddressFromCoordinates(lat, lng);
        setNewEventData(prev => ({ ...prev, address: fetchedAddress }));
    }, [newEventData]);

    return {
        showEventForm,
        isSelectingLocation,
        newEventData,
        isSubmitting,
        setIsSubmitting,
        openForm,
        closeForm,
        toggleForm,
        resetForm,
        startLocationSelection,
        updateFormData,
        handleLocationSelected,
    };
};