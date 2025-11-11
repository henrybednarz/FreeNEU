'use client';
import { useEffect } from 'react';
import '@/styles/globals.css';
import { useEvents } from '@/hooks/useEvents.js';
import { useGeolocation } from '@/hooks/useGeoLocation.js';
import { useNotification } from '@/hooks/useNotification.js';
import { useEmailForm } from '@/hooks/useEmailForm.js';
import { useEventForm } from '@/hooks/useEventForm.js';
import { useViewManager } from '@/hooks/useViewManager.js';
import { useEventStatus } from '@/hooks/useEventStatus.js';
import { usePWAInfoCard } from "@/hooks/usePWAInfoCard";

import FormOverlays from '@/components/FormOverlays.js';
import AppMenu from '@/components/AppMenu.js';
import ViewContainer from '@/components/ViewContainer.js';
import NotificationOverlay from '@/components/NotificationOverlay.js';
import PWAOverlay from '@/components/PWAOverlay.js';

const MAP_VIEW = 'Map';
const EVENT_VIEW = 'Events';

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
        openEmailForm,
        closeEmailForm,
        toggleEmailForm,
        resetEmailForm,
        emailFormData,
        updateEmailForm,
        subscribeNotification,
        unsubscribeNotification,
        isSubmittingNotification,
        setIsSubmittingNotification
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
    const {
        isPWAInfoCardVisible,
        showPWAInfoCard,
        closePWAInfoCard
    } = usePWAInfoCard();


    useEffect(() => {
        if (geoError) {
            showNotification(geoError, 'error');
        }
        const params = new URLSearchParams(window.location.search);
        const isPwa = params.has('source');
        if (!isPwa) {
            showPWAInfoCard();
        }
    }, [geoError, showNotification]);

    const handleCardClick = (event, isClaimable) => {
        if (isClaimable && (new Date() - new Date(event.last_claimed)) > 2 * 60 * 60 * 1000) {
            openEventStatus();
        }
        focusEventAndSwitchView(event, MAP_VIEW);
    };

    const handlePinClick = (event) => {
        if (isSelectingLocation) return;
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
        if (!isSelectingLocation) {
            closeEmailForm();
            closeForm();
            return
        }
        await handleLocationSelected(lat, lng);
    };

    const handleFormSubmit = async (formData) => {
        if (isSubmitting) { return }
        setIsSubmitting(true);
        const request = await createEvent(formData);
        const result = await request;
        if (result.success) {
            resetForm();
            showNotification('Event created successfully!', 'success');
        } else {
            showNotification(result.error, 'error');
        }
        setIsSubmitting(false);
    };

    const handleNotificationSubscribe = async (formData) => {
        if (isSubmittingNotification) { return }
        const request = await subscribeNotification(formData);
        const result = await request;
        if (result.success) {
            showNotification('Email submitted successfully!', 'success');
            closeEmailForm();
        } else {
            console.log(result)
            showNotification(`Couldn't subscribe ${result.message}`, 'error');
        }
        setIsSubmittingNotification(false);
    }

    const handleNotificationUnsubscribe = async (formData) => {
        if (isSubmittingNotification) { return }
        const request = await unsubscribeNotification(formData);
        const result = await request;
        if (result.success) {
            showNotification('Unsubscribed from notifications successfully!', 'success');
            resetEmailForm();
        } else {
            showNotification(result.error, 'error');
        }
        setIsSubmittingNotification(false);
    }

    const handleStillHere = async () => {
        if (!focusedEvent) return;
        const request = await updateEvent(focusedEvent.id);
        const result = await request;
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
        const request = await deleteEvent(focusedEvent.id);
        const result = await request;
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

    const eventStatusProps = {
        show: showEventStatus,
        onClose: closeEventStatus,
        event: focusedEvent,
        onCheck: handleStillHere,
        onX: handleExpired
    };

    const eventFormProps = {
        show: showEventForm,
        formData: newEventData,
        onChange: updateFormData,
        onSubmit: handleFormSubmit,
        onSelectLocation: handleSelectLocation,
        isSubmitting: isSubmitting
    };

    const emailFormProps = {
        show: showEmailForm,
        formData: emailFormData,
        onChange: updateEmailForm,
        onSubmitNotification: handleNotificationSubscribe,
        onSubmitRemoveNotification: handleNotificationUnsubscribe,
        isSubmitting: isSubmittingNotification,
    };

    const mapProps = {
        events: eventsData,
        focusedEvent: focusedEvent,
        onPinClick: handlePinClick,
        onMapClick: handleMapClick,
        isAddingEvent: isSelectingLocation,
        userLocation: userLocation
    };

    const eventListProps = {
        events: eventsData,
        onCardClick: handleCardClick,
        focusedEvent: focusedEvent,
        userLocation: userLocation
    };

    return (
        <div className="app-container">
            <NotificationOverlay
                notification={notification}
                onClose={clearNotification}
            />

            <FormOverlays
                eventStatusProps={eventStatusProps}
                eventFormProps={eventFormProps}
                emailFormProps={emailFormProps}
            />

            <PWAOverlay
                isVisible={isPWAInfoCardVisible}
                onClose={closePWAInfoCard}
            />

            <AppMenu
                currentView={currentView}
                isEventFormOpen={showEventForm}
                onSwitchView={handleViewSwitch}
                onCloseForms={closeForms}
                onToggleEmailForm={handleToggleEmailForm}
                onToggleEventForm={handleToggleForm}
            />

            <ViewContainer
                currentView={currentView}
                mapProps={mapProps}
                eventListProps={eventListProps}
            />
        </div>
    );
}