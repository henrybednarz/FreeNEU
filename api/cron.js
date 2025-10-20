'use server';
import db from '../db.js'
import { Resend } from 'resend';

export default async function handler(req, res) {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    // Cron Tasks here:

    // 1. Delete expired events
    await removeExpiredEvents();

    res.status(200).end('Cron tasks completed successfully');
}

async function removeExpiredEvents() {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const query = `
        DELETE FROM events
        WHERE last_claimed < $1;
    `;
    const values = [twoHoursAgo];

    try {
        const result = await db.query(query, values);
        console.log(`Deleted ${result.rowCount} expired events.`);
        return { success: true, deletedCount: result.rowCount };
    } catch (err) {
        console.error('Database error:', err);
        return { success: false, message: 'Database error occurred.' };
    }
}