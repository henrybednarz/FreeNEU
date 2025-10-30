import { useState, useCallback } from 'react';

export const useEmailForm = () => {
    const initialEmailFormState = {
        name: window.localStorage.getItem('userName') ||'',
        email: window.localStorage.getItem('userEmail') || '',
    };

    const [emailFormData, setEmailFormData] = useState(initialEmailFormState);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
    const [isSubmittingNotification, setIsSubmittingNotification] = useState(false);

    const resetEmailForm = useCallback(() => {
        setEmailFormData(initialEmailFormState);
        setShowEmailForm(false);
        setIsSubmittingEmail(false);
    }, [initialEmailFormState]);

    const openEmailForm = useCallback(() => {
        setEmailFormData(initialEmailFormState);
        setShowEmailForm(true);
    }, [initialEmailFormState]);

    const closeEmailForm = useCallback(() => {
        setShowEmailForm(false);
    }, []);

    const toggleEmailForm = useCallback(() => {
        setShowEmailForm(prev => !prev);
    }, []);

    const updateEmailForm = useCallback((updatedData) => {
        setEmailFormData(prev => ({ ...prev, ...updatedData }));
    }, []);

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    }

    const submitNotification = useCallback(async (formData) => {
        if (isSubmittingNotification) return;
        setIsSubmittingNotification(true);
        console.log('trying to begin VAPID process');
        try {
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') {
                setIsSubmittingNotification(false);
                return;
            }
            console.log('browser permission granted');
            const vapidResp = await fetch('/api/notifications?vapid=public');
            if (!vapidResp.ok) {
                console.error('Failed to fetch VAPID public key');
                setIsSubmittingNotification(false);
                return;
            }
            const vapidJson = await vapidResp.json();
            const publicKey = vapidJson.publicKey;
            const reg = await navigator.serviceWorker.ready;
            console.log('acquired public key')
            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            console.log('subscribing')
            const response = await fetch('/api/notifications/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    subscription,
                }),
            });
            if (response.ok) {
                window.localStorage.setItem('userEmail', formData.email);
                window.localStorage.setItem('userName', formData.name);
                window.localStorage.setItem('userNotificationsEnabled', 'true');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit notification subscription.');
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            return {success: false, message: error};
        } finally {
            setIsSubmittingNotification(false);
        }
    }, [isSubmittingNotification]);


    const submitEmail = useCallback(async (formData) => {
        if (isSubmittingEmail) return;
        setIsSubmittingEmail(true);
        try {
            const response = await fetch('/api/subscribe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.localStorage.setItem('userEmail', formData.email);
                window.localStorage.setItem('userName', formData.name);
                window.localStorage.setItem('userEmailsEnabled', 'true');
            } else {
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
    }, [closeEmailForm, isSubmittingEmail]);

    return {
        emailFormData,
        showEmailForm,
        isSubmittingEmail,
        setIsSubmittingEmail,
        isSubmittingNotification,
        setIsSubmittingNotification,
        openEmailForm,
        closeEmailForm,
        toggleEmailForm,
        resetEmailForm,
        submitEmail,
        submitNotification,
        updateEmailForm,
    };
};