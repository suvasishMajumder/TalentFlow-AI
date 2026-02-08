import express, { Router } from "express"
import { signupUser , loginUser, logoutUser } from "../controllers/authController.js";
import pool from "../db.js";

const router = Router();


router.post('/signup',signupUser);

router.post('/login',loginUser);

router.post('/logout',logoutUser);

// Dev-only debug endpoint: list users (id and email) to confirm which DB is connected.
router.get('/debug/users', async (req, res) => {
	if (process.env.NODE_ENV === 'production') {
		return res.status(403).json({ detail: 'Not allowed' });
	}
	try {
		const result = await pool.query('SELECT id, email FROM users ORDER BY id LIMIT 100');
		return res.status(200).json({ count: result.rowCount, users: result.rows });
	} catch (err) {
		console.error('debug/users error:', err);
		return res.status(500).json({ detail: err.message });
	}
});

// Dev-only: sanitized DB connection info (no passwords)
router.get('/debug/db', (req, res) => {
	if (process.env.NODE_ENV === 'production') return res.status(403).json({ detail: 'Not allowed' });

	try {
		const info = {};

		if (process.env.DATABASE_URL) {
			try {
				const url = new URL(process.env.DATABASE_URL);
				info.source = 'DATABASE_URL';
				info.protocol = url.protocol.replace(':', '');
				info.host = url.hostname;
				info.port = url.port;
				info.database = url.pathname ? url.pathname.replace('/', '') : undefined;
				info.username = url.username ? url.username : undefined;
			} catch (e) {
				info.source = 'DATABASE_URL';
				info.error = 'Could not parse DATABASE_URL';
			}
		} else {
			info.source = 'PG_* vars';
			info.host = process.env.PG_HOST;
			info.port = process.env.PG_PORT;
			info.database = process.env.PG_DATABASE;
			info.username = process.env.PG_USER;
		}

		// Do not include passwords or full connection strings in the response
		return res.status(200).json(info);
	} catch (err) {
		console.error('debug/db error:', err);
		return res.status(500).json({ detail: err.message });
	}
});

export default router;