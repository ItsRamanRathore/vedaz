import React, { useState } from 'react';
import api from '../services/api';
import { Search, Loader2, Calendar, Clock, User, MapPin } from 'lucide-react';

const STATUS_COLORS = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Confirmed: 'bg-green-100 text-green-700 border-green-200',
    Completed: 'bg-slate-100 text-slate-700 border-slate-200',
};

const MyBookingsScreen = () => {
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchBookings = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const res = await api.get(`/bookings?email=${encodeURIComponent(email)}`);
            setBookings(res.data);
        } catch (err) {
            setError('Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Bookings</h1>
                <p className="text-slate-500">Enter your email address to view your scheduled and past sessions.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 max-w-lg mx-auto mb-10">
                <form onSubmit={fetchBookings} className="flex gap-3">
                    <div className="relative flex-1">
                        <input
                            required
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shrink-0 shadow-sm shadow-blue-500/30"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Search'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-medium max-w-lg mx-auto mb-10 border border-red-100">
                    {error}
                </div>
            )}

            {hasSearched && !loading && !error && bookings.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Bookings Found</h3>
                    <p className="text-slate-500">We couldn't find any bookings associated with "{email}".</p>
                </div>
            )}

            {bookings.length > 0 && (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 hidden md:block border bg-slate-50">
                                {booking.expertId?.image ? (
                                    <img src={booking.expertId.image} alt={booking.expertId.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><User className="text-slate-300 w-8 h-8" /></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-slate-900 truncate">{booking.expertId?.name || 'Unknown Expert'}</h3>
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                        {booking.expertId?.category || 'General'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                    <span className="flex items-center"><Calendar size={16} className="text-slate-400 mr-1.5" /> {booking.date}</span>
                                    <span className="flex items-center"><Clock size={16} className="text-slate-400 mr-1.5" /> {booking.timeSlot}</span>
                                    <span className="flex items-center"><User size={16} className="text-slate-400 mr-1.5" /> {booking.userName}</span>
                                </div>

                                {booking.notes && (
                                    <p className="mt-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-2">
                                        <span className="font-medium text-slate-700 mr-2">Notes:</span>
                                        {booking.notes}
                                    </p>
                                )}
                            </div>

                            <div className="shrink-0 flex items-center w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0 h-full">
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${STATUS_COLORS[booking.status] || STATUS_COLORS.Pending}`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsScreen;
