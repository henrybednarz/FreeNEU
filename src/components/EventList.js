import React from 'react';
import EventCard from './EventCard';
import '@/styles/EventList.css';

function isClaimable(event, userLocation) {
    if (!userLocation) return false;
    const userLat = userLocation[0];
    const userLng = userLocation[1];

    const dlt = event.latitude - userLat;
    const dln = event.longitude - userLng;
    return (Math.sqrt(dlt * dlt + dln * dln) < 0.003);
}

const EventList = ({ events, focusedEvent, onCardClick, userLocation }) => {
    const sortedEvents = [...events];

    sortedEvents.sort((a, b) => {
        const aIsClaimable = isClaimable(a, userLocation);
        const bIsClaimable = isClaimable(b, userLocation);

        return Number(bIsClaimable) - Number(aIsClaimable);
    });

    return (
        <div className="event-list-wrapper">
            <div className="event-list-header">Events</div>
            <div className="event-list-items">
                {sortedEvents.length > 0 ? (
                    sortedEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={onCardClick}
                            isClaimable={isClaimable(event, userLocation)}
                            isFocused={focusedEvent && focusedEvent.id === event.id}
                        />
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
};

export default EventList;