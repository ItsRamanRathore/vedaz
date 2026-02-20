import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        expertId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expert',
            required: true
        },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        userPhone: { type: String, required: true },
        date: { type: String, required: true }, // YYYY-MM-DD
        timeSlot: { type: String, required: true }, // e.g. "10:00 AM - 11:00 AM"
        notes: { type: String },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Completed'],
            default: 'Confirmed', // We'll just confirm it upon successful booking for simplicity, or we can use Pending.
        },
    },
    { timestamps: true }
);

// Compound index to ensure uniqueness and prevent double booking for the same expert, date, and time slot
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
