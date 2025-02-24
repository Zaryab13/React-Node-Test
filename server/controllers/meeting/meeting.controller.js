const Meeting = require('../../model/schema/meeting');

// Get all meetings
const getMeetings = async (req, res) => {
    try {
        const { createBy } = req.query;
        const query = createBy ? { createBy, deleted: false } : { deleted: false };
        const meetings = await Meeting.find(query).populate('createBy', 'firstName lastName email');
        // Always return an array
        res.status(200).json({ status: 200, data: meetings || [] });
    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({ error: error.message, data: [] });
    }
};

// Get single meeting
const getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOne({ _id: req.params.id, deleted: false });
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json({ status: 200, data: meeting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create meeting
const createMeeting = async (req, res) => {
    try {
        const meeting = new Meeting({
            ...req.body,
            createBy: req.user.userId
        });
        await meeting.save();
        res.status(201).json({ status: 201, data: meeting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete multiple meetings
const deleteManyMeeting = async (req, res) => {
    try {
        const { ids } = req.body;
        await Meeting.updateMany(
            { _id: { $in: ids } },
            { deleted: true }
        );
        res.status(200).json({ status: 200, message: 'Meetings deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update meeting
const updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json({ status: 200, data: meeting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete meeting
const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json({ status: 200, message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMeetings,
    getMeeting,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    deleteManyMeeting
}; 