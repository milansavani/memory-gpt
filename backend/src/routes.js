import { Router } from 'express';
import eventRoutes from './modules/event/event.routes.js';

const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /events
router.use('/events', eventRoutes);

export default router;
