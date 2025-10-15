import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import '@/styles/button.css';

const CheckButton = ({ onClick }) => {

    return (
        <div className="event-add-button green" onClick={onClick}>
            <motion.svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <motion.polyline
                    points="25,50 45,70 75,35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </motion.svg>
        </div>
    );
}

export default CheckButton;