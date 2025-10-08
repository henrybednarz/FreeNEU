'use client';
import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';
import SwitchSelector from "@/components/SwitchSelector";
import EventList from '@/components/EventList';
import { motion, AnimatePresence } from 'framer-motion'; // Ensure AnimatePresence is imported
import EventAddButton from "@/components/EventAddButton";
import EventAddForm from "@/components/EventAddForm";
import NotificationBanner from "@/components/NotificationBanner";

const MAP_VIEW = 'Map';
const EVENT_VIEW = 'Events';

const initialFormState = {
    name: '',
    description: '',
    type: 'Food',
    address: '',
    latitude: null,
    longitude: null,
};

const viewVariants = {
    active: {
        opacity: 1, x: 0, pointerEvents: 'auto',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
    inactiveLeft: {
        opacity: 0, x: "-100%", pointerEvents: 'none',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
    inactiveRight: {
        opacity: 0, x: "100%", pointerEvents: 'none',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    }
};

const formOverlayVariants = {
    active: {
        opacity: 1, y: 0, pointerEvents: 'auto',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
    inactiveTop: {
        opacity: 0, y: "-100%", pointerEvents: 'none',
        transition: { type: "tween", ease: "anticipate", duration: 0.7 }
    },
};

let uid = 0;

export default function Home() {
    const [eventsData, setEventsData] = useState([]);
    const [currentView, setCurrentView] = useState(MAP_VIEW);
    const [focusedEvent, setFocusedEvent] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [isSelectingLocation, setIsSelectingLocation] = useState(false);
    const [newEventData, setNewEventData] = useState(initialFormState);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch('/api/event/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEventsData(data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setNotification({ message: 'Failed to load events. Please try again later.', type: 'error' });
            }
        }
        fetchEvents();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const Map = useMemo(() => dynamic(
        () => import('@/components/Map'),
        { loading: () => <p>A map is loading...</p>, ssr: false }
    ), []);

    const handleCardClick = (event) => {
        setFocusedEvent(event);
        setCurrentView(MAP_VIEW);
    };

    const handlePinClick = (event) => {
        setFocusedEvent(event);
        setCurrentView(EVENT_VIEW);
    };

    const handleAddButtonClick = () => {
        setShowEventForm(!showEventForm);
        setNewEventData(initialFormState);
    }

    const handleSelectLocation = () => {
        setIsSelectingLocation(true);
        setShowEventForm(false);
        setCurrentView(MAP_VIEW);
    }

    async function getAddressFromCoordinates(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const address = data['address'] || {};
            const addressString = [address['building'] || '', address['house_number'], address['road']].join(" ")
            return addressString || "Unknown address";
        } catch (error) {
            console.error("Error fetching address:", error);
            setNotification({ message: 'Failed to get address from the selected location.', type: 'error' });
            return "Could not fetch address.";
        }
    }

    const handleMapClick = async ({ lat, lng }) => {
        if (!isSelectingLocation) return;

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
    };

    const handleFormChange = (updatedData) => {
        setNewEventData(updatedData);
    };

    const handleFormSubmit = async (formData) => {
        if (!formData.name || !formData.description || !formData.address || formData.latitude === null || formData.longitude === null) {
            setNotification({ message: 'Please fill in all fields, including selecting a location from the map.', type: 'error' });
            return;
        }

        try {
            setShowEventForm(false);
            const response = await fetch('/api/event/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    last_claimed: new Date().toISOString(),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create event');
            }
            const responseJson = await response.json();
            responseJson.event.id = uid--;
            setEventsData(prevEvents => [...prevEvents, responseJson.event]);
            setNewEventData(initialFormState);
            setNotification({ message: 'Event created successfully!', type: 'success' });
        } catch (error) {
            console.error("Error submitting event:", error);
            setNotification({ message: 'There was an error creating the event. Please try again.', type: 'error' });
        }
    };

    return (
        <div className="app-container">
            <AnimatePresence>
                {notification && (
                    <motion.div
                        key="notification-banner" // Important for AnimatePresence to track
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: "-50%", opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="notification-banner-wrapper" // Add a wrapper class for positioning
                    >
                        <NotificationBanner
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    className={`form-container ${showEventForm ? 'form-active' : 'form-hidden'}`}
                    variants={formOverlayVariants}
                    animate={showEventForm ? 'active' : 'inactiveTop'}
                >
                    <EventAddForm
                        formData={newEventData}
                        onFormDataChange={handleFormChange}
                        onSubmit={handleFormSubmit}
                        onSelectLocationFromMap={handleSelectLocation}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="radio-container">
                <SwitchSelector
                    option1={MAP_VIEW}
                    option2={EVENT_VIEW}
                    onSwitch={(view) => {
                        setCurrentView(view);
                        setFocusedEvent(null);
                    }}
                    setShowForm={setShowEventForm}
                    value={currentView}
                />
            </div>
            <div className="button-container">
                <EventAddButton
                    isOpen={showEventForm}
                    setIsOpen={setShowEventForm}
                    onClick={handleAddButtonClick} />
            </div>

            <motion.div
                className="page-container"
                variants={viewVariants}
                animate={currentView === MAP_VIEW ? 'active' : 'inactiveLeft'}
            >
                <div className="map-container">
                    <Map
                        events={eventsData}
                        focusedEvent={focusedEvent}
                        onPinClick={handlePinClick}
                        onMapClick={handleMapClick}
                        isAddingEvent={isSelectingLocation}
                    />
                </div>
            </motion.div>

            <motion.div
                className="event-container"
                variants={viewVariants}
                animate={currentView === EVENT_VIEW ? 'active' : 'inactiveRight'}
            >
                <EventList
                    events={eventsData}
                    onCardClick={handleCardClick}
                    focusedEvent={focusedEvent}
                />
            </motion.div>
        </div>
    );
}