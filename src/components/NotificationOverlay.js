'use client';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBanner from "@/components/NotificationBanner.js";

export default function NotificationOverlay({ notification, onClose }) {
    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    key="notification-banner"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: "-50%", opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="notification-banner-wrapper"
                >
                    <NotificationBanner
                        message={notification.message}
                        type={notification.type}
                        onClose={onClose}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}