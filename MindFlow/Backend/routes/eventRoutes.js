const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const eventController = require('../controllers/eventController');

router.use(authMiddleware);

router.get('/', eventController.getEvents);
router.get('/range', eventController.getEventsByDateRange);
router.get('/:eventId', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:eventId', eventController.updateEvent);
router.delete('/:eventId', eventController.deleteEvent);

module.exports = router;
