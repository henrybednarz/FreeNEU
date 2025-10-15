import { useState, useCallback } from 'react';

export const useEventStatus = () => {
    const [showEventStatus, setShowEventStatus] = useState(false);

    const openEventStatus = useCallback(() => {
        setShowEventStatus(true);
    }, []);

    const closeEventStatus = useCallback(() => {
        setShowEventStatus(false);
    }, []);

    return {
        showEventStatus,
        openEventStatus,
        closeEventStatus,
    };
};