import React from 'react';
import IconButton from './IconButton';
import '@/styles/EventStatus.css';

const EventStatus = ({ onCheck, onX, setShowEventStatus, event }) => {
    const handleCheck = () => {
        if (onCheck) {
            onCheck();
        }
        setShowEventStatus(false);
    }

    const handleX = () => {
        if (onX) {
            onX();
        }
        setShowEventStatus(false);
    }
    return (
        <div className="event-status-container">
            <div className="header-card">Is {event ? event.name : 'null'} still happening?</div>
            <div className="button-group">
                <IconButton type="check" onClick={handleCheck} />
                <IconButton type="x" onClick={handleX} />
            </div>
        </div>
    );
}
export default EventStatus;