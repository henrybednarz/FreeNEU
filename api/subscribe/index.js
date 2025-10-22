import db from '../../db.js';

// Set this to your website's homepage
const BASE_URL = 'https://your-website.com';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (!req.body.email || !req.body.name) {
            return res.status(400).json({ success: false, message: 'Name and email are required.' });
        }

        const response = await postEmail(req.body);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(500).json(response);
        }

    } else if (req.method === 'DELETE') {
        if (!req.body.email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }
        const response = await removeEmail(req.body);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(500).json(response);
        }

    } else if (req.method === 'GET') {
        if (!req.query.email) {
            return res.status(400).json({ success: false, message: 'Email is required in query parameter.' });
        }

        const response = await removeEmail({ email: req.query.email });

        if (response.success) {
            return res.redirect(302, `${BASE_URL}/?unsubscribed=true`);
        } else {
            return res.redirect(302, `${BASE_URL}/?unsubscribe_failed=true`);
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


async function removeEmail(body) {
    const query = `DELETE FROM users WHERE email = $1`;
    const values = [body.email];
    try {
        const result = await db.query(query, values);
        if (result.rowCount > 0) {
            return { success: true, message: 'User removed successfully' };
        } else {
            return { success: true, message: 'User not found or already unsubscribed.' };
        }
    } catch (error) {
        console.error('Database query error:', error);
        return { success: false, message: 'Database error occurred' };
    }
}

async function postEmail(body) {
    const query = `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    `;
    const values = [body.name, body.email];
    try {
        const result = await db.query(query, values);
        if (result.rowCount > 0) {
            return { success: true, message: 'User saved successfully', user: result.rows[0] };
        } else {
            return { success: true, message: 'User already exists.' };
        }
    } catch (error) {
        console.error('Database query error:', error);
        return { success: false, message: 'Database error occurred' };
    }
}