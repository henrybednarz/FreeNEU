import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import '@/styles/button.css';

const PlusButton = ({ onClick, isOpen }) => {

    const verticalLineVariants = {
        open: {
            y1: 25,
            y2: 75,
            opacity: 1,
        },

        closed: {
            y1: 50,
            y2: 50,
            opacity: 1,
        }
    };

    return (
        <div className="event-add-button" onClick={onClick}>
            <motion.svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <motion.line
                    x1="50"
                    x2="50"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    variants={verticalLineVariants}
                    animate={isOpen ? "closed" : "open"}
                    initial="open"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <line
                    x1="25" y1="50"
                    x2="75" y2="50"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
            </motion.svg>
        </div>
    );
}

export default PlusButton;