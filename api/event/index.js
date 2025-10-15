import db from '../../db.js'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const eventData = await getEvent(req, res);
        return res.status(200).json(eventData);
    } else if (req.method === 'POST') {
        const response = await postEvent(req.body);
        if (response.success) {
            return res.status(201).json(response);
        } else {
            return res.status(500).json(response);
        }
    } else if (req.method === 'PUT') {
        const eventId = req.body.id;
        if (!eventId) {
            console.log('id is missing');
            return res.status(400).json({ success: false, message: 'Event ID is required.' });
        }
        const response = await updateLastClaimed(eventId);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(500).json(response);
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Event ID is required.' });
        }
        const query = `DELETE FROM events WHERE id = $1`;
        const values = [id];
        try {
            const result = await db.query(query, values);
            if (result.rowCount > 0) {
                return res.status(200).json({success: true, message: 'Event deleted successfully.'});
            } else {
                return res.status(404).json({success: false, message: 'Event not found.'});
            }
        } catch (error) {
            return res.status(500).json({success: false, message: 'Database error occurred.'});
        }
    }
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function getEvent() {
    const query = `SELECT * FROM events`;
    const { rows } = await db.query(query, []);
    return rows;
}

async function postEvent(event) {
    const query = `
        INSERT INTO events (name, type, description, latitude, longitude, last_claimed, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const values = [event.name, event.type, event.description, event.latitude, event.longitude, event.last_claimed, event.address];
    try {
        const result = await db.query(query, values);
        if (result.rowCount > 0) {
            return { success: true, message: 'Score saved successfully!', event: event };
        } else {
            return { success: false, message: 'Failed to save score.' };
        }
    } catch (err) {
        console.error('Database error:', err);
        return { success: false, message: 'Database error occurred.' };
    }
}

async function updateLastClaimed(eventId) {
    const query = `
        UPDATE events
        SET last_claimed = NOW()
        WHERE id = $1`;
    const values = [eventId];
    try {
        const result = await db.query(query, values);
        if (result.rowCount > 0) {
            return { success: true, message: 'Last claimed date updated successfully!' };
        } else {
            return { success: false, message: 'Event not found or failed to update.' };
        }
    } catch (err) {
        console.error('Database error:', err);
        return { success: false, message: 'Database error occurred.' };
    }
}