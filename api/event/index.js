import db from '../../utils/db.js'
import webpush from 'web-push'

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_CONTACT = process.env.VAPID_CONTACT || 'mailto:no-reply@your-website.com'
const BASE_URL = process.env.BASE_URL || 'https://localhost:3000'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_CONTACT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
} else {
  console.warn('VAPID keys not configured. Push notifications will not be sent until VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are set.')
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const eventData = await getEvent()
      return res.status(200).json(eventData)
    } else if (req.method === 'POST') {
      const response = await postEvent(req.body)
      if (response.success) {
        return res.status(201).json(response)
      } else {
        return res.status(500).json(response)
      }
    } else if (req.method === 'PUT') {
      const eventId = req.body.id
      if (!eventId) {
        console.log('id is missing')
        return res.status(400).json({ success: false, message: 'Event ID is required.' })
      }
      const response = await updateLastClaimed(eventId)
      if (response.success) {
        return res.status(200).json(response)
      } else {
        return res.status(500).json(response)
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.body
      if (!id) {
        return res.status(400).json({ success: false, message: 'Event ID is required.' })
      }
      const query = `DELETE FROM events WHERE id = $1`
      const values = [id]
      try {
        const result = await db.query(query, values)
        if (result.rowCount > 0) {
          return res.status(200).json({ success: true, message: 'Event deleted successfully.' })
        } else {
          return res.status(404).json({ success: false, message: 'Event not found.' })
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Database error occurred.' })
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function getEvent() {
  const query = `SELECT * FROM events`
  const { rows } = await db.query(query, [])
  return rows
}

async function postEvent(event) {
  const query = `
INSERT INTO events (name, type, description, latitude, longitude, last_claimed, address)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *
`
  const values = [
    event.name,
    event.type,
    event.description,
    event.latitude,
    event.longitude,
    event.last_claimed,
    event.address
  ]
  try {
    const result = await db.query(query, values)
    if (result.rowCount > 0) {
      const insertedEvent = result.rows[0]

      try {
        await notifySubscriptions(insertedEvent)
      } catch (notifyErr) {
        console.error('Error notifying subscriptions:', notifyErr)
      }

      return { success: true, message: 'Event saved successfully!', event: insertedEvent }
    } else {
      return { success: false, message: 'Failed to save event.' }
    }
  } catch (err) {
    console.error('Database error:', err)
    return { success: false, message: 'Database error occurred.' }
  }
}

async function updateLastClaimed(eventId) {
  const query = `
UPDATE events
SET last_claimed = NOW()
WHERE id = $1`
  const values = [eventId]
  try {
    const result = await db.query(query, values)
    if (result.rowCount > 0) {
      return { success: true, message: 'Last claimed date updated successfully!' }
    } else {
      return { success: false, message: 'Event not found or failed to update.' }
    }
  } catch (err) {
    console.error('Database error:', err)
    return { success: false, message: 'Database error occurred.' }
  }
}

/*
 Helper functions for push notifications
 Assumes a `subscriptions` table with at least: id, email, subscription (JSON stored as text)
*/

async function getSubscriptions() {
  const q = `SELECT id, email, subscription FROM subscriptions`
  const { rows } = await db.query(q, [])
  return rows.map(r => ({
    id: r.id,
    email: r.email,
    subscription: JSON.parse(r.subscription)
  }))
}

async function removeSubscriptionById(id) {
  try {
    await db.query(`DELETE FROM subscriptions WHERE id = $1`, [id])
  } catch (err) {
    console.error('Failed to remove subscription id', id, err)
  }
}

async function notifySubscriptions(event) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('Skipping notifications: VAPID keys not configured.')
    return
  }

  const subs = await getSubscriptions()
  if (!subs.length) return

  const payload = {
    title: 'New Event Created',
    body: event.name || 'A new event was added',
    data: {
      eventId: event.id,
      url: `${BASE_URL}/events/${event.id}`
    }
  }

  const promises = subs.map(async s => {
    try {
      await webpush.sendNotification(s.subscription, JSON.stringify(payload))
    } catch (err) {
      // If subscription is no longer valid, remove it from DB
      const status = err && err.statusCode
      if (status === 410 || status === 404) {
        console.log('Removing stale subscription id', s.id)
        await removeSubscriptionById(s.id)
      } else {
        console.error('Failed to send notification to subscription id', s.id, err)
      }
    }
  })

  await Promise.all(promises)
}
