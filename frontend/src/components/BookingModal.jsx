import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const BookingModal = ({ isOpen, onClose, expert, selectedDate, selectedSlot, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        notes: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/bookings', {
                expertId: expert._id,
                date: selectedDate,
                timeSlot: selectedSlot,
                ...formData
            });
            setSuccess(true);
            setTimeout(() => {
                onSuccess(selectedDate, selectedSlot);
                setSuccess(false);
                setFormData({ userName: '', userEmail: '', userPhone: '', notes: '' });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book slot. It might be already taken.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden shadow-[0_0_40px_-15px_rgba(0,0,0,0.3)]"
                >
                    <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center relative z-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Book Session</h2>
                            <p className="text-sm text-slate-500 mt-1">with {expert.name}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-10 flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                                <p className="text-slate-500 mb-6">Your session has been successfully booked.</p>
                                <div className="p-4 bg-slate-50 rounded-2xl w-full flex justify-between text-sm font-medium border border-slate-100">
                                    <span className="flex items-center gap-1.5 text-slate-700"><CalendarIcon size={16} className="text-blue-500" /> {selectedDate}</span>
                                    <span className="flex items-center gap-1.5 text-slate-700"><Clock size={16} className="text-blue-500" /> {selectedSlot}</span>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-6 flex justify-between text-sm text-blue-900 font-medium">
                                    <div className="flex items-center gap-2"><CalendarIcon size={16} className="text-blue-600" /> {selectedDate}</div>
                                    <div className="flex items-center gap-2"><Clock size={16} className="text-blue-600" /> {selectedSlot}</div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="relative">
                                        <User className="absolute top-3 left-3 text-slate-400" size={18} />
                                        <input required type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute top-3 left-3 text-slate-400" size={18} />
                                        <input required type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute top-3 left-3 text-slate-400" size={18} />
                                        <input required type="tel" name="userPhone" value={formData.userPhone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                                    </div>
                                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Session Notes (Optional)" rows="2" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 mt-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition flex justify-center items-center shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookingModal;
