import React from 'react';
import EventCard from './EventCard';
import '@/styles/EventList.css';

const EventList = ({ events, focusedEvent, onCardClick }) => {

    return (
        <div className="event-list-wrapper">
            <div className={"event-list-header"}>Events</div>
            <div className="event-list-items">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={onCardClick}
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