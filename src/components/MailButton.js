import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '@/styles/button.css';

const MailButton = ({ onClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className="event-add-button blue" onClick={handleButtonClick}>
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ scale: 0 }}
                animate={{ scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
            >
                {/* Envelope body */}
                <motion.rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    ry="2"
                />

                {/* Envelope flap */}
                <motion.path
                    d="M22 6L12 13L2 6"
                    initial={{ rotateX: 0, y: 0 }}
                    animate={{ rotateX: isOpen ? 180 : 0, y: isOpen ? -4 : 0 }} // Rotate and move down
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "center top" }} // Rotate from the bottom edge
                />
            </motion.svg>
        </div>
    );
}

export default MailButton;