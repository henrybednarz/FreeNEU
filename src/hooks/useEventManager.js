// src/hooks/useViewManager.js
import { useState, useCallback } from 'react';

export const useViewManager = (defaultView = 'Map') => {
    const [currentView, setCurrentView] = useState(defaultView);
    const [focusedEvent, setFocusedEvent] = useState(null);

    const switchView = useCallback((view) => {
        setCurrentView(view);
    }, []);

    const focusEvent = useCallback((event) => {
        setFocusedEvent(event);
    }, []);

    const clearFocus = useCallback(() => {
        setFocusedEvent(null);
    }, []);

    const focusEventAndSwitchView = useCallback((event, view) => {
        setFocusedEvent(event);
        setCurrentView(view);
    }, []);

    return {
        currentView,
        focusedEvent,
        switchView,
        focusEvent,
        clearFocus,
        focusEventAndSwitchView,
    };
};