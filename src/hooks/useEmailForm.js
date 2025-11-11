import { useState, useEffect, useCallback } from 'react';

export const useEmailForm = () => {
    const [emailFormData, setEmailFormData] = useState({
        name: '',
        email: '',
    });

    useEffect(() => {
        const initialEmailFormState = {
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
        };
        setEmailFormData(initialEmailFormState);
    }, []);

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [isSubmittingNotification, setIsSubmittingNotification] = useState(false);

    const resetEmailForm = useCallback(() => {
        setEmailFormData(emailFormData);
        setShowEmailForm(false);
    }, []);

    const openEmailForm = useCallback(() => {
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

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    }

    const unsubscribeNotification = useCallback(async (formData) => {
        if (isSubmittingNotification) return;
        setIsSubmittingNotification(true);
        try {
            const response = await fetch('/api/notifications/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                }),
            });
            if (response.ok) {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.setItem('userNotificationsEnabled', 'false');
                return { success: true, message: response.json() };
            } else {
                return { success: false, message: response.json() };
            }
        } catch (error) {
            return {success: false, message: error};
        } finally {
            setIsSubmittingNotification(false);
        }

    }, [isSubmittingNotification])

    const subscribeNotification = useCallback(async (formData) => {
        if (isSubmittingNotification) return;
        setIsSubmittingNotification(true);
        try {
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') {
                setIsSubmittingNotification(false);
                return;
            }
            const vapidResp = await fetch('/api/notifications?vapid=public');
            if (!vapidResp.ok) {
                console.error('Failed to fetch VAPID public key');
                setIsSubmittingNotification(false);
                return;
            }
            const vapidJson = await vapidResp.json();
            const publicKey = vapidJson.publicKey;
            const reg = await navigator.serviceWorker.ready;
            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

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
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('userName', formData.name);
                localStorage.setItem('userNotificationsEnabled', 'true');
                return { success: true, message: response.json()  };
            } else {
                return { success: false, message: response.json()  }
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            return { success: false, message: error };
        } finally {
            setIsSubmittingNotification(false);
        }
    }, [isSubmittingNotification]);

    return {
        emailFormData,
        showEmailForm,
        isSubmittingNotification,
        setIsSubmittingNotification,
        openEmailForm,
        closeEmailForm,
        toggleEmailForm,
        resetEmailForm,
        subscribeNotification,
        unsubscribeNotification,
        updateEmailForm,
    };
};