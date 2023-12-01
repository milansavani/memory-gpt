import { Router } from 'express';
import eventCtrl from './event.controller.js';

const router = Router();

/** GET /api/events - Returns list of event */
router.route('/')
  .get(eventCtrl.fetchEvents);

export default router;
