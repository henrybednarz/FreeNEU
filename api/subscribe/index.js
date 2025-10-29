import db from '../../utils/db.js';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-website.com';

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
        console.error('Subscribe API handler error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function handlePost(req, res) {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const response = await upsertEmailSubscriber(name, email);
    return response.success ? res.status(200).json(response) : res.status(500).json(response);
}

async function handleDelete(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const response = await unsubscribeEmail(email);
    return response.success ? res.status(200).json(response) : res.status(500).json(response);
}

// Handles unsubscribe links from emails
async function handleGet(req, res) {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required in query parameter.' });
    }

    const response = await unsubscribeEmail(email);

    if (response.success) {
        return res.redirect(302, `${BASE_URL}/?unsubscribed=true`);
    } else {
        return res.redirect(302, `${BASE_URL}/?unsubscribe_failed=true`);
    }
}

/**
 * Inserts a new user or updates an existing one to set emailsOn = true.
 * Sets emailsOn = true, notificationsOn = false (if new)
 */
async function upsertEmailSubscriber(name, email) {
    const query = `
        INSERT INTO users (name, email, emails, notifications)
        VALUES ($1, $2, true, false)
            ON CONFLICT (email) DO UPDATE
                                       SET emails = true,
                                       name = EXCLUDED.name
                                       RETURNING *
    `;
    const values = [name, email];
    try {
        const result = await db.query(query, values);
        return { success: true, message: 'User subscribed to emails', user: result.rows[0] };
    } catch (error) {
        console.error('Database query error (upsertEmailSubscriber):', error);
        return { success: false, message: 'Database error occurred' };
    }
}

/**
 * Sets emailsOn = false for a given user.
 */
async function unsubscribeEmail(email) {
    const query = `
        UPDATE users 
        SET emails = false 
        WHERE email = $1
        RETURNING *
    `;
    const values = [email];
    try {
        const result = await db.query(query, values);
        if (result.rowCount > 0) {
            return { success: true, message: 'User unsubscribed from emails' };
        } else {
            return { success: true, message: 'User not found.' };
        }
    } catch (error) {
        console.error('Database query error (unsubscribeEmail):', error);
        return { success: false, message: 'Database error occurred' };
    }
}