import db from '../../db.js'

export default async function handler(req, res)  {
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
    }
}

async function postEmail(body) {

    const query = `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    `
    const values = [body.name, body.email]
    try {
        const result = await db.query(query, values)
        if (result.rowCount > 0) {
            return { success: true, message: 'User saved successfully', user: result.rows[0] };
        } else {
            return { success: false, message: 'Failed to save user.' };
        }
    } catch (error) {
        console.error('Database query error:', error); // Log the actual error for debugging
        return { success: false, message: 'Database error occurred' };
    }
}