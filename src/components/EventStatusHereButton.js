import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import '@/styles/EventAddButton.css';

const EventAddButton = ({ onClick }) => {
    return (
        <div className="event-add-button" onClick={onClick}>

        </div>
    );
}

export default EventAddButton;