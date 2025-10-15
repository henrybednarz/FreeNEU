import { useState, useEffect, useCallback } from 'react';

export const useEvents = () => {
    const [eventsData, setEventsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/event/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEventsData(data);
        } catch (err) {
            console.error("Failed to fetch events:", err);
            setError('Failed to load events. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const createEvent = useCallback(async (eventData) => {
        try {
            const response = await fetch('/api/event/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...eventData,
                    last_claimed: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const responseJson = await response.json();
            responseJson.event.id = responseJson.event.id || `temp-${Date.now()}`;

            setEventsData(prevEvents => [...prevEvents, responseJson.event]);
            return { success: true, event: responseJson.event };
        } catch (err) {
            console.error("Error creating event:", err);
            return { success: false, error: 'Failed to create event. Please try again.' };
        }
    }, []);

    const updateEvent = useCallback(async (eventId) => {
        try {
            const response = await fetch('/api/event/', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId }),
            });

            if (!response.ok) {
                throw new Error('Failed to update event');
            }

            const updatedTimestamp = new Date().toISOString();
            setEventsData(prevEvents =>
                prevEvents.map(ev =>
                    ev.id === eventId
                        ? { ...ev, last_claimed: updatedTimestamp }
                        : ev
                )
            );

            return { success: true, timestamp: updatedTimestamp };
        } catch (err) {
            console.error("Error updating event:", err);
            return { success: false, error: 'Failed to update event. Please try again.' };
        }
    }, []);

    const deleteEvent = useCallback(async (eventId) => {
        try {
            const response = await fetch('/api/event/', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            setEventsData(prevEvents => prevEvents.filter(ev => ev.id !== eventId));
            return { success: true };
        } catch (err) {
            console.error("Error deleting event:", err);
            return { success: false, error: 'Failed to delete event. Please try again.' };
        }
    }, []);

    return {
        eventsData,
        isLoading,
        error,
        createEvent,
        updateEvent,
        deleteEvent,
        refetchEvents: fetchEvents,
    };
};