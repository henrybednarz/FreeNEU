// IconButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '@/styles/button.css';

const IconButton = ({ type, onClick, isOpen = false }) => {

    // Define animation variants specifically for the 'plus' button
    const verticalLineVariants = {
        open: { y1: 25, y2: 75 },
        closed: { y1: 50, y2: 50 }
    };

    // Dynamically determine the className based on the button type
    const colorClassMap = {
        x: 'red',
        check: 'green',
        mail: 'blue'
    };
    const className = `event-add-button ${colorClassMap[type] || ''}`.trim();

    // Define SVG properties that change based on type
    const svgProps = {
        viewBox: type === 'mail' ? '0 0 24 24' : '0 0 100 100',
        strokeWidth: type === 'mail' ? '2' : '10',
        ...(type === 'mail' && {
            initial: { scale: 0 },
            animate: { scale: 0.8 },
            transition: { duration: 0.5, type: "spring", stiffness: 200, damping: 15 }
        })
    };

    // Conditionally render the correct SVG path based on the 'type' prop
    const renderIcon = () => {
        switch (type) {
            case 'x':
                return (
                    <motion.path
                        d="M 25 25 L 75 75 M 75 25 L 25 75"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                );
            case 'check':
                return (
                    <motion.polyline
                        points="25,50 45,70 75,35"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                );
            case 'plus':
                return (
                    <>
                        <motion.line
                            x1="50" x2="50"
                            variants={verticalLineVariants}
                            animate={isOpen ? "closed" : "open"}
                            initial="open"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                        <line x1="25" y1="50" x2="75" y2="50" />
                    </>
                );
            case 'mail':
                return (
                    <>
                        <motion.rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                        <motion.path
                            d="M22 6L12 13L2 6"
                            initial={{ rotateX: 0, y: 0 }}
                            animate={{ rotateX: isOpen ? 180 : 0, y: isOpen ? -4 : 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ transformOrigin: "center top" }}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={className} onClick={onClick}>
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...svgProps}
            >
                {renderIcon()}
            </motion.svg>
        </div>
    );
}

export default IconButton;