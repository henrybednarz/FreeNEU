'use client';
import { motion, AnimatePresence } from 'framer-motion';
import EventAddForm from "@/components/EventAddForm.js";
import EventStatus from "@/components/EventStatus.js";
import EmailAddForm from "@/components/EmailAddForm.js";
import { formOverlayVariants } from '@/styles/views.js';

export default function FormOverlays({
                                         eventStatusProps,
                                         eventFormProps,
                                         emailFormProps
                                     }) {
    return (
        <>
            <AnimatePresence>
                <motion.div
                    className={`form-container ${eventStatusProps.show ? 'form-active' : 'form-hidden'}`}
                    variants={formOverlayVariants}
                    animate={eventStatusProps.show ? 'active' : 'inactiveTop'}
                >
                    <EventStatus
                        setShowEventStatus={eventStatusProps.onClose}
                        event={eventStatusProps.event}
                        onCheck={eventStatusProps.onCheck}
                        onX={eventStatusProps.onX}
                    />
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    className={`form-container ${eventFormProps.show ? 'form-active' : 'form-hidden'}`}
                    variants={formOverlayVariants}
                    animate={eventFormProps.show ? 'active' : 'inactiveTop'}
                >
                    <EventAddForm
                        formData={eventFormProps.formData}
                        onFormDataChange={eventFormProps.onChange}
                        onSubmit={eventFormProps.onSubmit}
                        onSelectLocationFromMap={eventFormProps.onSelectLocation}
                        isSubmitting={eventFormProps.isSubmitting}
                    />
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    className={`form-container ${emailFormProps.show ? 'form-active' : 'form-hidden'}`}
                    variants={formOverlayVariants}
                    animate={emailFormProps.show ? 'active' : 'inactiveTop'}
                >
                    <EmailAddForm
                        formData={emailFormProps.formData}
                        onFormDataChange={emailFormProps.onChange}
                        onSubmitNotification={emailFormProps.onSubmitNotification}
                        onSubmitRemoveNotification={emailFormProps.onSubmitRemoveNotification}
                        isSubmitting={emailFormProps.isSubmitting}
                    />
                </motion.div>
            </AnimatePresence>
        </>
    );
}