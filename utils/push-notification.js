import webpush from 'web-push';
import db from './db.js';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_CONTACT = process.env.VAPID_CONTACT || 'mailto:no-reply@your-website.com';

let isVapidConfigured = false;
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_CONTACT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    isVapidConfigured = true;
} else {
    console.warn('VAPID keys not configured for push sender. Notifications will not work.');
}

async function removeStaleSubscription(email) {
    try {
        await db.query(
            `UPDATE users SET notifications = false, subscription = NULL WHERE email = $1`,
            [email]
        );
        console.log(`Removed stale subscription for: ${email}`);
    } catch (dbError) {
        console.error(`Failed to remove stale subscription for ${email}:`, dbError);
    }
}

export async function sendPushToAll(payload) {
    if (!isVapidConfigured) {
        throw new Error("VAPID keys not configured. Cannot send notifications.");
    }

    let subscribers = [];
    try {
        const result = await db.query(
            `SELECT email, subscription FROM users WHERE notifications = true AND subscription IS NOT NULL`
        );
        subscribers = result.rows;
    } catch (dbError) {
        console.error("Failed to fetch subscribers from DB:", dbError);
        return;
    }

    if (subscribers.length === 0) {
        console.log("No subscribers to send notifications to.");
        return;
    }

    console.log(`Attempting to send notifications to ${subscribers.length} subscribers...`);
    const payloadString = JSON.stringify(payload);

    const sendPromises = subscribers.map(async (user) => {
        try {
            await webpush.sendNotification(user.subscription, payloadString);
            return { email: user.email, status: 'success' };
        } catch (error) {
            if (error.statusCode === 410 || error.statusCode === 404) {
                await removeStaleSubscription(user.email);
                return { email: user.email, status: 'stale' };
            } else {
                console.error(`Failed to send to ${user.email}:`, error.body || error.message);
                return { email: user.email, status: 'failed' };
            }
        }
    });

    const results = await Promise.all(sendPromises);
    console.log(results);
}