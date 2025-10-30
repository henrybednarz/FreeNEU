import { useState, useCallback } from 'react';

export const usePWAInfoCard = () => {
    const [isPWAInfoCardVisible, setIsPWAInfoCardVisible] = useState(false);

    const showPWAInfoCard = useCallback(() => {
        setIsPWAInfoCardVisible(true);
    }, []);

    const closePWAInfoCard = useCallback(() => {
        setIsPWAInfoCardVisible(false);
    }, []);

    return {
        isPWAInfoCardVisible,
        showPWAInfoCard,
        closePWAInfoCard,
    }
}