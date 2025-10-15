import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import '@/styles/button.css';

const XButton = ({ onClick }) => {

    return (
        <div className="event-add-button red" onClick={onClick}>
            <motion.svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                    d="M 25 25 L 75 75 M 75 25 L 25 75"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </motion.svg>
        </div>
    );
}

export default XButton;