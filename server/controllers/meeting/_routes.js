const express = require('express');
const router = express.Router();
const meetingController = require('./meeting.controller.js');
const auth = require('../../middelwares/auth.js');

// Get all meetings
router.get('/', auth, meetingController.getMeetings);

// Create meeting
router.post('/', auth, meetingController.createMeeting);

// Delete multiple meetings
router.delete('/deleteMany', auth, meetingController.deleteManyMeeting);

// Get single meeting
router.get('/:id', auth, meetingController.getMeeting);

// Update meeting
router.put('/:id', auth, meetingController.updateMeeting);

// Delete meeting
router.delete('/:id', auth, meetingController.deleteMeeting);

module.exports = router;