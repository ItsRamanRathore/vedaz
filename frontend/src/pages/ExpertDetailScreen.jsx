import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { socket } from '../services/socket';
import BookingModal from '../components/BookingModal';
import { format, addDays } from 'date-fns';
import { ArrowLeft, Star, Clock, Calendar as CalIcon, Loader2, Award, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

// Generate next 7 days
const getNext7Days = () => {
    return Array.from({ length: 7 }).map((_, i) => {
        const d = addDays(new Date(), i + 1); // Start from tomorrow
        return format(d, 'yyyy-MM-dd');
    });
};

// Generate time slots (9 AM to 5 PM)
const TIME_SLOTS = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
];

const ExpertDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expert, setExpert] = useState(null);
    const [bookedSlotsLocal, setBookedSlotsLocal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(getNext7Days()[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);

    const dates = getNext7Days();

    useEffect(() => {
        fetchExpert();

        // Setup Socket Listener
        socket.on('slotBooked', handleSlotBooked);

        return () => {
            socket.off('slotBooked', handleSlotBooked);
        };
    }, [id]);

    const handleSlotBooked = (data) => {
        if (data.expertId === id) {
            setBookedSlotsLocal(prev => [...prev, { date: data.date, timeSlot: data.timeSlot }]);
        }
    };

    const fetchExpert = async () => {
        try {
            const res = await api.get(`/experts/${id}`);
            setExpert(res.data.expert);
            setBookedSlotsLocal(res.data.bookedSlots || []);
        } catch (err) {
            setError('Failed to load expert details.');
        } finally {
            setLoading(false);
        }
    };

    const isSlotBooked = (date, slot) => {
        return bookedSlotsLocal.some(b => b.date === date && b.timeSlot === slot);
    };

    const handleBookClick = (slot) => {
        setSelectedSlotForBooking(slot);
        setIsModalOpen(true);
    };

    const handleBookingSuccess = (date, slot) => {
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    if (error || !expert) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error || 'Expert not found'}</p>
                <button onClick={() => navigate('/')} className="text-blue-500 font-medium">Back to Experts</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition font-medium text-sm group"
            >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Experts
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Expert Info */}
                <div className="col-span-1 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm h-fit lg:sticky lg:top-24 mb-8 lg:mb-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden mb-6 mx-auto relative shadow-md">
                        <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center mb-6">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                            {expert.category}
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{expert.name}</h1>
                        <div className="flex items-center justify-center text-amber-500 bg-amber-50 w-fit mx-auto px-3 py-1 rounded-full text-sm">
                            <Star size={16} className="fill-current mr-1" />
                            <span className="font-bold">{expert.rating.toFixed(1)} Rating</span>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-6">
                        <div className="flex items-start text-slate-600">
                            <Briefcase className="w-5 h-5 mr-3 shrink-0 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-slate-900 leading-tight">Experience</p>
                                <p className="text-sm">{expert.experience}</p>
                            </div>
                        </div>
                        <div className="flex items-start text-slate-600">
                            <Award className="w-5 h-5 mr-3 shrink-0 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-slate-900 leading-tight">Session Fee</p>
                                <p className="text-sm">${expert.price} / hour</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Bio and Slots */}
                <div className="col-span-1 lg:col-span-2">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {expert.bio}
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                <CalIcon className="mr-2 text-blue-600" /> Availability
                            </h2>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center"><div className="w-3 h-3 bg-white border border-slate-200 rounded-full mr-1.5" /> Available</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-full mr-1.5" /> Booked</div>
                            </div>
                        </div>

                        {/* Date Selector */}
                        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
                            {dates.map((date) => {
                                const isSelected = selectedDate === date;
                                const dateObj = new Date(date);
                                const dayName = format(dateObj, 'EEE');
                                const dayNum = format(dateObj, 'd');
                                const monthName = format(dateObj, 'MMM');

                                return (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex flex-col items-center justify-center min-w-[5rem] py-3 px-4 rounded-2xl border transition-all duration-300 ${isSelected
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600'
                                            }`}
                                    >
                                        <span className={`text-xs uppercase tracking-wider mb-1 ${isSelected ? 'text-slate-300' : ''}`}>{dayName}</span>
                                        <span className="text-2xl font-bold leading-none mb-1">{dayNum}</span>
                                        <span className={`text-xs ${isSelected ? 'text-slate-300' : ''}`}>{monthName}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Time Slots */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                            {TIME_SLOTS.map((slot) => {
                                const booked = isSlotBooked(selectedDate, slot);
                                return (
                                    <button
                                        key={slot}
                                        disabled={booked}
                                        onClick={() => handleBookClick(slot)}
                                        className={`py-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center ${booked
                                            ? 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed line-through decoration-slate-300'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 shadow-sm'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                expert={expert}
                selectedDate={selectedDate}
                selectedSlot={selectedSlotForBooking}
                onSuccess={handleBookingSuccess}
            />
        </div>
    );
};

export default ExpertDetailScreen;
