// src/components/SwitchSelector.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '@/styles/SwitchSelector.css';

/**
 * A rounded, two-option radio switch selector component with Framer Motion animations.
 *
 * @param {object} props - The component's props.
 * @param {string} props.option1 - The label for the first option.
 * @param {string} props.option2 - The label for the second option.
 * @param {function} props.onSwitch - Callback function that receives the selected option.
 * @param {string} [props.defaultSelected] - The option that should be selected by default (for uncontrolled mode).
 * @param {string} [props.value] - The currently selected value (for controlled mode).
 */
const SwitchSelector = ({ option1, option2, onSwitch, defaultSelected, value, setShowForm }) => {
    const [internalSelection, setInternalSelection] = useState(defaultSelected || option1);
    const selectedOption = value !== undefined ? value : internalSelection;

    const handleSwitch = (option) => {
        if (option === selectedOption) return;
        setInternalSelection(option);
        if (onSwitch) {
            onSwitch(option);
        }
        setShowForm(false);
    };

    useEffect(() => {
        if (value !== undefined && value !== internalSelection) {
            setInternalSelection(value);
        }
    }, [value, internalSelection]);

    const tweenTransition = {
        type: "tween",
        duration: 0.5,
        ease: "easeInOut",
    };

    return (
        <div className="switch-container">
            <button
                className={`switch-button ${selectedOption === option1 ? 'active' : ''}`}
                onClick={() => handleSwitch(option1)}
            >
                <motion.span
                    className="switch-text"
                    animate={{ color: selectedOption === option1 ? 'var(--font-color-light)' : 'var(--font-color-dark)' }}
                    transition={tweenTransition}
                >
                    {option1}
                </motion.span>
                {selectedOption === option1 && (
                    <motion.div
                        className="active-pill"
                        layoutId="active-pill"
                        transition={tweenTransition}
                    />
                )}
            </button>
            <button
                className={`switch-button ${selectedOption === option2 ? 'active' : ''}`}
                onClick={() => handleSwitch(option2)}
            >
                <motion.span
                    className="switch-text"
                    animate={{ color: selectedOption === option2 ? 'var(--font-color-light)' : 'var(--font-color-dark)' }}
                    transition={tweenTransition}
                >
                    {option2}
                </motion.span>
                {selectedOption === option2 && (
                    <motion.div
                        className="active-pill"
                        layoutId="active-pill"
                        transition={tweenTransition}
                    />
                )}
            </button>
        </div>
    );
};

export default SwitchSelector;