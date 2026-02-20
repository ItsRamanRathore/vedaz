import Expert from '../models/Expert.js';
import Booking from '../models/Booking.js';

export const getExperts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const search = req.query.search;

        const query = {};
        if (category && category !== 'All') {
            query.category = category;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const total = await Expert.countDocuments(query);
        const experts = await Expert.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            experts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalExperts: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) return res.status(404).json({ message: 'Expert not found' });

        // Also fetch the booked slots for this expert to pass to the frontend
        const today = new Date();
        // In a real app we'd fetch for specific date range. For now we will just return upcoming bookings.
        const bookings = await Booking.find({ expertId: req.params.id, status: { $ne: 'Cancelled' } })
            .select('date timeSlot -_id');

        res.status(200).json({
            expert,
            bookedSlots: bookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
