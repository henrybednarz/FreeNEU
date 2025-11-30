import React from 'react';
import { motion } from 'framer-motion';
import '@/styles/button.css';

const IconButton = ({ type, onClick, isOpen = false }) => {

    const verticalLineVariants = {
        open: { y1: 25, y2: 75 },
        closed: { y1: 50, y2: 50 }
    };

    const colorClassMap = {
        x: 'red',
        check: 'green',
        bell: 'blue' // Renamed from 'mail'
    };
    const className = `event-add-button ${colorClassMap[type] || ''}`.trim();

    // Updated conditionals to check for 'bell' instead of 'mail'
    const svgProps = {
        viewBox: type === 'bell' ? '0 0 24 24' : '0 0 100 100',
        strokeWidth: type === 'bell' ? '2' : '10',
        ...(type === 'bell' && {
            initial: { scale: 0 },
            animate: { scale: 0.8 }, // Slight scale adjustment for the bell
            transition: { duration: 0.5, type: "spring", stiffness: 200, damping: 15 }
        })
    };

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
            case 'bell':
                return (
                    <>
                        {/* Bell Body */}
                        <motion.path
                            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                        />
                        {/* Bell Clapper */}
                        <motion.path
                            d="M13.73 21a2 2 0 0 1-3.46 0"
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