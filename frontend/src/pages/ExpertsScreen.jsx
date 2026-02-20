import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ExpertCard from '../components/ExpertCard';
import { Search, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Medical', 'Legal', 'Tech', 'Finance'];

const ExpertsScreen = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters & Pagination
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchExperts();
    }, [page, category, debouncedSearch]);

    const fetchExperts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/experts', {
                params: {
                    page,
                    limit,
                    search: debouncedSearch,
                    category: category !== 'All' ? category : undefined
                }
            });
            setExperts(res.data.experts);
            setTotalPages(res.data.totalPages);
            setError(null);
        } catch (err) {
            setError('Failed to load experts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Hero Header */}
            <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Find the Right <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expert</span> for You
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Book real-time sessions with verified professionals across various industries. Your goals, our experts.
                </p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] mb-10 flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-100">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
                        placeholder="Search experts by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
                    <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0 hidden md:block" />
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setCategory(cat); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === cat
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {loading && experts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-500">Discovering experts...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 flex flex-col items-center">
                    <p className="font-medium mb-2">{error}</p>
                    <button onClick={fetchExperts} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm transition font-medium">Try Again</button>
                </div>
            ) : experts.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                    <p className="text-slate-500 text-lg">No experts found matching your criteria.</p>
                    <button
                        onClick={() => { setSearch(''); setCategory('All'); }}
                        className="mt-4 text-blue-600 font-medium hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {experts.map((expert, idx) => (
                        <ExpertCard key={expert._id} expert={expert} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    >
                        <ChevronLeft size={20} className="text-slate-700" />
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                    >
                        <ChevronRight size={20} className="text-slate-700" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpertsScreen;
