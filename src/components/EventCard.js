import React from 'react';
import '@/styles/EventCard.css';

const TYPE_COLORS = {
    "Food": "orange",
    "Drink": "blue",
    "Item": "purple",
    "Event": "green",
    "Other": "red"
}


const EventCard = ({ event, onClick, isFocused, isClaimable }) => {
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div
            className={`event-card ${isFocused ? 'focused-card' : ''} ${isClaimable ? 'claimable' : ''}`}
            onClick={() => onClick(event, isClaimable)}
        >
            <div className="card-header" >
                <h3 className="card-title">{event.name}</h3>
                <span className={`card-type card-type-${TYPE_COLORS[event.type] || "blue"}`}>{event.type}</span>
            </div>
            <p className="card-description">{event.description}</p>
            <p className="card-address"><strong>Address:</strong> {event.address}</p>
            <p className="card-timestamp">
                <strong>Last Claimed:</strong> {formatTimestamp(event.last_claimed)}
            </p>
        </div>
    );
};

export default EventCard;