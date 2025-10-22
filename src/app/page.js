'use client';
import {useEffect, useMemo} from 'react';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';
import SwitchSelector from "@/components/SwitchSelector.js";
import EventList from '@/components/EventList.js';
import { motion, AnimatePresence } from 'framer-motion';
import EventAddForm from "@/components/EventAddForm.js";
import NotificationBanner from "@/components/NotificationBanner.js";
import EventStatus from "@/components/EventStatus.js";
import EmailAddForm from "@/components/EmailAddForm.js";
import IconButton from "@/components/IconButton.js";

import { useEvents } from '@/hooks/useEvents.js';
import { useGeolocation } from '@/hooks/useGeoLocation.js';
import { useNotification } from '@/hooks/useNotification.js';
import { useEmailForm } from '@/hooks/useEmailForm.js';
import { useEventForm } from '@/hooks/useEventForm.js';
import { useViewManager } from '@/hooks/useViewManager.js';
import { useEventStatus } from '@/hooks/useEventStatus.js';

const MAP_VIEW = 'Map';
const EVENT_VIEW = 'Events';

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


const Map = dynamic(
    () => import('@/components/Map'),
    { loading: () => <p>A map is loading...</p>, ssr: false }
);

export default function Home() {
    const { eventsData, createEvent, updateEvent, deleteEvent } = useEvents();
    const { userLocation, error: geoError } = useGeolocation();
    const { notification, showNotification, clearNotification } = useNotification();
    const {
        showEventForm,
        isSelectingLocation,
        newEventData,
        isSubmitting,
        setIsSubmitting,
        toggleForm,
        resetForm,
        startLocationSelection,
        updateFormData,
        handleLocationSelected,
        closeForm
    } = useEventForm();
    const {
        showEmailForm,
        isSubmittingEmail,
        setIsSubmittingEmail,
        openEmailForm,
        closeEmailForm,
        toggleEmailForm,
        resetEmailForm,
        submitEmail,
        initialEmailFormState,
        emailFormData,
        updateEmailForm,
    } = useEmailForm();
    const {
        currentView,
        focusedEvent,
        switchView,
        focusEvent,
        clearFocus,
        focusEventAndSwitchView
    } = useViewManager(MAP_VIEW);
    const {
        showEventStatus,
        openEventStatus,
        closeEventStatus
    } = useEventStatus();

    useEffect(() => {
        if (geoError) {
            showNotification(geoError, 'error');
        }
    }, [geoError, showNotification]);

    const handleCardClick = (event, isClaimable) => {
        if (isClaimable && (new Date() - new Date(event.last_claimed)) > 2 * 60 * 60 * 1000) {
            openEventStatus();
        }
        focusEventAndSwitchView(event, MAP_VIEW);
    };

    const handlePinClick = (event) => {
        closeEventStatus();
        focusEventAndSwitchView(event, EVENT_VIEW);
    };

    const handleAddButtonClick = () => {
        closeEventStatus();
        toggleForm();
    };

    const handleSelectLocation = () => {
        closeEventStatus();
        startLocationSelection();
        switchView(MAP_VIEW);
    };

    const handleMapClick = async ({ lat, lng }) => {
        if (!isSelectingLocation) return;
        await handleLocationSelected(lat, lng);
    };

    const handleFormSubmit = async (formData) => {
        if (!formData.name || !formData.description || !formData.address ||
            formData.latitude === null || formData.longitude === null) {
            showNotification('Please fill in all fields, including selecting a location from the map.', 'error');
            return;
        }

        setIsSubmitting(true);
        const result = await createEvent(formData);
        setIsSubmitting(false);

        if (result.success) {
            resetForm();
            showNotification('Event created successfully!', 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    const handleEmailFormSubmit = async (formData) => {
        const result = await submitEmail(formData);
        setIsSubmitting(false);
        if (result.success) {
            resetEmailForm();
            showNotification('Email submitted successfully!', 'success');
        } else {
            showNotification(result.error, 'error');
        }
    }

    const handleStillHere = async () => {
        if (!focusedEvent) return;

        const result = await updateEvent(focusedEvent.id);

        if (result.success) {
            focusEvent({ ...focusedEvent, last_claimed: result.timestamp });
            closeEventStatus();
            showNotification('Event status updated!', 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    const handleExpired = async () => {
        if (!focusedEvent) return;

        const result = await deleteEvent(focusedEvent.id);

        if (result.success) {
            clearFocus();
            closeEventStatus();
            showNotification('Event marked as expired and removed.', 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    const handleViewSwitch = (view) => {
        switchView(view);
        clearFocus();
        closeEventStatus();
    };

    const closeForms = () => {
        closeForm();
        closeEmailForm();
    }

    const handleToggleForm = () => {
        closeEmailForm();
        toggleForm();
    }

    const handleToggleEmailForm = () => {
        closeForm();
        toggleEmailForm();
    }

    return (
        <div className="app-container">
            {/* Notification Banner */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        key="notification-banner"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: "-50%", opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="notification-banner-wrapper"
                    >
                        <NotificationBanner
                            message={notification.message}
                            type={notification.type}
                            onClose={clearNotification}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    className={`form-container ${showEventStatus ? 'form-active' : 'form-hidden'}`}
                    variants={formOverlayVariants}
                    animate={showEventStatus ? 'active' : 'inactiveTop'}
                >
                    <EventStatus
                        setShowEventStatus={closeEventStatus}
                        event={focusedEvent}
                        onCheck={handleStillHere}
                        onX={handleExpired}
                    />
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    className={`form-container ${showEventForm ? 'form-active' : 'form-hidden'}`}
                    variants={formOverlayVariants}
                    animate={showEventForm ? 'active' : 'inactiveTop'}
                >
                    <EventAddForm
                        formData={newEventData}
                        onFormDataChange={updateFormData}
                        onSubmit={handleFormSubmit}
                        onSelectLocationFromMap={handleSelectLocation}
                        isSubmitting={isSubmitting}
                    />
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    className={`form-container ${showEmailForm ? 'form-active' : 'form-hidden'}`}
                    variants={formOverlayVariants}
                    animate={showEmailForm ? 'active' : 'inactiveTop'}
                >
                    <EmailAddForm
                        formData={emailFormData}
                        onFormDataChange={updateEmailForm}
                        onSubmit={handleEmailFormSubmit}
                        isSubmitting={isSubmittingEmail}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="menu-container">
                <div className="mail-button-container">
                    <IconButton
                        type="mail"
                        onClick={handleToggleEmailForm}
                    />
                </div>

                <div className="radio-container">
                    <SwitchSelector
                        option1={MAP_VIEW}
                        option2={EVENT_VIEW}
                        onSwitch={handleViewSwitch}
                        setShowForm={closeForms}
                        value={currentView}
                    />
                </div>

                <div className="plus-button-container">
                    <IconButton
                        type="plus"
                        isOpen={showEventForm}
                        onClick={handleToggleForm}
                    />
                </div>
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
                        userLocation={userLocation}
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
                    userLocation={userLocation}
                />
            </motion.div>
        </div>
    );
}