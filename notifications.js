import db from "./db.js";
import { Resend } from 'resend';

function buildEmailTemplate(event) {
    const cardStyle = `
        border: 1px solid #ddd; 
        border-radius: 8px; 
        padding: 16px; 
        margin-bottom: 16px; 
        background-color: #ffffff;
    `;
    const titleStyle = `font-size: 18px; color: #333; margin-top: 0; margin-bottom: 8px;`;
    const textStyle = `font-size: 14px; color: #666; margin-bottom: 4px;`;

     const eventTime = new Date(event.start_time).toLocaleString('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return `
        <div style="${cardStyle}">
            <h3 style="${titleStyle}">${event.name || 'Untitled Event'}</h3>
            <p style="${textStyle}">${event.description || 'No description available.'}</p>
            <p style="${textStyle}"><strong>Location:</strong> ${event.location || 'N/A'}</p>
            <p style="${textStyle}"><strong>Time:</strong> ${eventTime || 'N/A'}</p>
        </div>
    `;
}


function createEventListTemplate(events) {
    const bodyStyle = `font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;`;
    const containerStyle = `max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;`;
    const headerStyle = `font-size: 24px; color: #333; text-align: center; margin-bottom: 20px;`;

    const eventListHtml = events.map(buildEmailTemplate).join('');

    return `
        <div style="${bodyStyle}">
            <div style="${containerStyle}">
                <h1 style="${headerStyle}">🎉 New Events On Campus!</h1>
                ${eventListHtml}
            </div>
        </div>
    `;
}

async function sendEventNotifications(resend_key) {
    const resend = new Resend(resend_key);
    const eventQuery = 'SELECT * FROM events WHERE active = TRUE';
    const userQuery = 'SELECT * FROM users';

    try {
        const { rows: activeEvents } = await db.query(eventQuery);
        const { rows: users } = await db.query(userQuery);

        if (activeEvents.length === 0) {
            return { success: true, message: 'No active events to notify.' };
        }
        if (users.length === 0) {
            return { success: true, message: 'No users to notify.' };
        }

        const emailHtmlContent = createEventListTemplate(activeEvents);

        const emailPromises = users.map(user => {
            return resend.emails.send({
                from: 'Campus Events <noreply@yourdomain.com>',
                to: user.email,
                subject: 'Happening Now: New Events On Campus!',
                html: emailHtmlContent,
            });
        });

        await Promise.all(emailPromises);

        return { success: true, message: `Successfully sent notifications to ${users.length} users.` };

    } catch (e) {
        console.error("Failed to send event notifications:", e);
        if (e.name === 'ResendError') {
            return { success: false, message: 'An error occurred while sending emails.' };
        }
        return { success: false, message: 'A database error occurred.' };
    }
}