import db from "./db.js";
import { Resend } from 'resend';

const TYPE_COLORS = {
    "Food": { bg: '#fff7ed', text: '#f97316' }, // Orange
    "Drink": { bg: '#e0f2fe', text: '#0284c7' }, // Blue
    "Item": { bg: '#f3e8ff', text: '#9333ea' }, // Purple
    "Event": { bg: '#f0fdf4', text: '#16a34a' }, // Green
    "Other": { bg: '#ffe4e6', text: '#dc2626' }  // Red
};

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SUBJECT_TAGLINES = [
    "Erm There's Free Stuff on Campus",
    "Free Events Right Now! Click Here",
    "Freebies Available at NEU",
    "Don't Miss Out on Free Stuff!",
    "Grab Your Freebies on Campus Today",
    "Exciting Free Events Happening Now",
    "Discover Freebies Around You",
    "Free Stuff Alert! Check It Out"
]


function getEventTypeStyles(type) {
    const colors = TYPE_COLORS[type] || TYPE_COLORS["Other"];
    return `
        background-color: ${colors.bg};
        color: ${colors.text};
        padding: 4px 12px;
        border-radius: 50px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
    `;
}


function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US');
}

function buildEmailTemplate(event) {
    const cardStyle = `
        background-color: #ffffff;
        border-radius: 16px;
        border: 1px solid #323232;
        padding: 16px;
        box-shadow: 1px 2px #323232;
        width: 85%;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        margin: 0 auto 16px auto;
    `;
    const tableStyle = `width: 100%; border-collapse: collapse; cellspacing: 0; cellpadding: 0;`;
    const linkStyle = `text-decoration: none; color: inherit;`;
    const titleStyle = `font-size: 20px; font-weight: 600; color: #333333; margin: 0;`;
    const descriptionStyle = `font-size: 14px; color: #333333; line-height: 1.2; margin-top: 12px; margin-bottom: 12px;`;
    const textStyle = `font-size: 14px; color: #333333; margin: 4px 0;`;
    const strongStyle = `font-weight: 500; color: #333333;`;

    const eventTypeStyle = getEventTypeStyles(event.type);
    const eventType = event.type || 'Other';

    return `
        <a href="${SITE_URL}" target="_blank" style="${linkStyle}">
            <div style="${cardStyle}">
                <table style="${tableStyle}">
                    <tr>
                        <td style="vertical-align: top; text-align: left;">
                            <h3 style="${titleStyle}">${event.name || 'Untitled Event'}</h3>
                        </td>
                        <td style="vertical-align: top; text-align: right; width: 120px;">
                            <span style="${eventTypeStyle}">${eventType}</span>
                        </td>
                    </tr>
                </table>
                <p style="${descriptionStyle}">${event.description || 'No description available.'}</p>
                <p style="${textStyle}"><strong style="${strongStyle}">Address:</strong> ${event.address || 'N/A'}</p>
                <p style="${textStyle}"><strong style="${strongStyle}">Last Claimed:</strong> ${formatTimestamp(event.last_claimed)}</p>
            </div>
        </a>
    `;
}

function createEventListTemplate(events) {
    const bodyStyle = `font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;`;
    const containerStyle = `max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;`;
    const headerStyle = `font-size: 24px; color: #323232; text-align: center; margin-bottom: 20px;`;
    const eventListHtml = events.map(buildEmailTemplate).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>🎉Free Events On Campus‼️</title>
        </head>
        <body style="${bodyStyle}">
            <div style="${containerStyle}">
                <h1 style="${headerStyle}">🎉Free Events On Campus‼️</h1>
                ${eventListHtml}
            </div>
            {{FOOTER}}
        </body>
        </html>
    `;
}

function createFooter(user) {
    const footerStyle = `
        text-align: center; 
        font-size: 12px; 
        color: #888888; 
        margin-top: 24px; 
        padding-top: 16px; 
        border-top: 1px solid #eeeeee;
    `;
    const linkStyle = `color: #323232; text-decoration: underline;`;
    const unsubscribeUrl = `${SITE_URL}/api/subscribe?email=${encodeURIComponent(user.email)}`;
    return `
        <div style="${footerStyle}">
            <p>
            Emails too annoying? <a href="${unsubscribeUrl}" target="_blank" style="${linkStyle}">Unsubscribe</a>
            </p>
        </div>
    `
}

export async function sendEventNotifications(resend_key) {
    const resend = new Resend(resend_key);
    const eventQuery = 'SELECT * FROM events'; // You may want to filter this later
    const userQuery = 'SELECT * FROM users';   // (e.g., WHERE created_at > NOW() - INTERVAL '1 day')

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
                from: 'FreeNEU <onboarding@resend.dev>',
                to: user.email,
                subject: `${SUBJECT_TAGLINES[Math.floor(Math.random() * SUBJECT_TAGLINES.length)]}`,
                html: emailHtmlContent.replace('{{FOOTER}}', createFooter(user)),
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