import db from '../../utils/db.js';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_CONTACT = process.env.VAPID_CONTACT || 'mailto:no-reply@your-website.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_CONTACT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
    console.warn('VAPID keys not configured. Push notifications will not work.');
}

export default async function handler(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                return await handlePost(req, res);
            case 'DELETE':
                return await handleDelete(req, res);
            case 'GET':
                return await handleGet(req, res);
            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (err) {
        console.error('Notifications API handler error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function handlePost(req, res) {
    const { email, subscription, name } = req.body;
    if (!email || !subscription) {
        return res.status(400).json({ success: false, message: 'Email and subscription object are required.' });
    }

    const response = await upsertPushSubscriber(email, subscription, name);
    return response.success ? res.status(200).json(response) : res.status(500).json(response);
}

async function handleDelete(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const response = await unsubscribePush(email);
    return response.success ? res.status(200).json(response) : res.status(500).json(response);
}

async function handleGet(req, res) {
    if (req.query.vapid === 'public') {
        if (!VAPID_PUBLIC_KEY) {
            return res.status(500).json({ success: false, message: 'VAPID public key not configured.' });
        }
        return res.status(200).json({ publicKey: VAPID_PUBLIC_KEY });
    }

    // All other GET requests are not allowed
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end(`Method GET Not Allowed for this route (unless for VAPID key)`);
}

/**
 * Inserts a new user or updates an existing one with a push subscription.
 * Sets notifications = true and emailsOn = false (if new)
 * If user exists, it preserves their name, or adds it if it was null.
 */
async function upsertPushSubscriber(email, subscription, name = null) {
    const query = `
        INSERT INTO users (email, name, subscription, notifications, emails)
        VALUES ($1, $2, $3, true, false)
            ON CONFLICT (email) DO UPDATE
                                       SET subscription = EXCLUDED.subscription,
                                       notifications = true,
                                       name = COALESCE(users.name, EXCLUDED.name)
                                       RETURNING *
    `;
    const values = [email, name, JSON.stringify(subscription)];
    try {
        const result = await db.query(query, values);
        return { success: true, message: 'Push subscription saved', user: result.rows[0] };
    } catch (error) {
        console.error('Database error (upsertPushSubscriber):', error);
        return { success: false, message: 'Database error occurred while saving push subscription' };
    }
}

/**
 * Sets notificationsOn = false for a given user.
 * This disables push notifications without deleting the subscription object.
 */
async function unsubscribePush(email) {
    const query = `
        UPDATE users 
        SET notifications = false 
        WHERE email = $1
        RETURNING *
    `;
    const values = [email];
    try {
        const result = await db.query(query, values);
        if (result.rowCount > 0) {
            return { success: true, message: 'User unsubscribed from push notifications' };
        } else {
            return { success: true, message: 'User not found.' };
        }
    } catch (error) {
        console.error('Database query error (unsubscribePush):', error);
        return { success: false, message: 'Database error occurred' };
    }
}