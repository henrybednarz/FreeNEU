import db from '../../db.js'

export default async function handler(req, res)  {
    if (req.method === 'POST') {
        const response = await postEmail(req.body);
        if (response.success) {
            return res.status(201).json(response);
        } else {
            return res.status(500).json(response);
        }
    }
}

async function postEmail(body) {
    const query = `INSERT INTO users (name, email) VALUES ($1, $2)`
    const values = [body.name, body.email]
    try {
        const result = await db.query(query, values)
        if (result.rowCount > 0) {
            return { success: true, message: 'User added successful'};
        } else {
            return { success: false, message: 'Failed to save user.' };
        }
    } catch (error) {
        return { success: false, message: 'Database error occurred' };
    }

}