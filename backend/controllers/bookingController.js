import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
    try {
        const { expertId, userName, userEmail, userPhone, date, timeSlot, notes } = req.body;

        // Validate request
        if (!expertId || !userName || !userEmail || !userPhone || !date || !timeSlot) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newBooking = new Booking({
            expertId,
            userName,
            userEmail,
            userPhone,
            date,
            timeSlot,
            notes,
        });

        const savedBooking = await newBooking.save();

        // Emit real-time update
        if (req.io) {
            req.io.emit('slotBooked', {
                expertId,
                date,
                timeSlot,
            });
        }

        res.status(201).json(savedBooking);
    } catch (error) {
        if (error.code === 11000) {
            // MongoDB duplicate key error (our compound index triggered)
            return res.status(409).json({ message: 'This slot has already been booked. Please choose another.' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required.' });
        }

        const bookings = await Booking.find({ userEmail: email })
            .populate('expertId', 'name category image')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Emit event if needed for real-time status update
        if (req.io) {
            req.io.emit('bookingStatusUpdated', booking);
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
