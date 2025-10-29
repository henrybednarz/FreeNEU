import { sendPushToAll } from '../../utils/push-notification.js';

export default async function handler(req, res) {
    // --- !!! SECURITY CHECK !!! ---
    // You MUST add a way to secure this.
    // Example: Check for a secret key passed in the request.
    // const { authorization } = req.headers;
    // if (authorization !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    //     return res.status(401).json({ success: false, message: 'Unauthorized' });
    // }

    if (req.method === 'GET') {
        try {
            // const { title, body } = req.body;
            const { title, body } = {"title":"Test Notification","body":"This is a test notification body."};
            if (!title || !body) {
                return res.status(400).json({ success: false, message: 'Title and body are required.' });
            }

            // This function is async but you don't have to wait for it.
            // Fire-and-forget, so the API request returns quickly.
            await sendPushToAll({ title, body });

            return res.status(202).json({ success: true, message: 'Notification batch started.' });

        } catch (err) {
            console.error('Notify API error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}