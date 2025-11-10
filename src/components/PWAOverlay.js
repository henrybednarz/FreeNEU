'use client';
import { motion, AnimatePresence } from 'framer-motion';
import PWAInfoCard from "@/components/PWAInfoCard";
import { pwaOverlayVariants } from '@/styles/views.js';

export default function PWAOverlay({ isVisible, onClose }) {
    return (
        <AnimatePresence>
            <motion.div
                className={`pwa-container ${isVisible ? 'form-active' : 'form-hidden'}`}
                variants={pwaOverlayVariants}
                animate={isVisible ? 'active' : 'inactiveBottom'}
            >
                <PWAInfoCard
                    onClose={onClose}
                />
            </motion.div>
        </AnimatePresence>
    );
}