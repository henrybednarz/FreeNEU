import { useState, useCallback } from 'react';

export const useEmailForm = () => {
    const initialEmailFormState = {
        name: '',
        email: '',
    };

    const [emailFormData, setEmailFormData] = useState(initialEmailFormState);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

    const resetEmailForm = useCallback(() => {
        setEmailFormData(initialEmailFormState);
        setShowEmailForm(false);
        setIsSubmittingEmail(false);
    }, []);

    const openEmailForm = useCallback(() => {
        setEmailFormData(initialEmailFormState);
        setShowEmailForm(true);
    }, []);

    const closeEmailForm = useCallback(() => {
        setShowEmailForm(false);
    }, []);

    const toggleEmailForm = useCallback(() => {
        setShowEmailForm(prev => !prev);
    }, []);

    const updateEmailForm = useCallback((updatedData) => {
        setEmailFormData(prev => ({ ...prev, ...updatedData }));
    }, []);

    const submitEmail = useCallback(async (formData) => {
        setIsSubmittingEmail(true);
        try {
            const response = await fetch('/api/subscribe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit email.');
            }

            closeEmailForm();

            return { success: true, message: 'Email submitted successfully.' };
        } catch (error) {
            console.error('Error submitting email:', error);
            return { success: false, message: error };
        } finally {
            setIsSubmittingEmail(false);
        }
    }, [closeEmailForm]);

    return {
        emailFormData,
        showEmailForm,
        isSubmittingEmail,
        setIsSubmittingEmail,
        openEmailForm,
        closeEmailForm,
        toggleEmailForm,
        resetEmailForm,
        submitEmail,
        updateEmailForm,
    };
};