import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, User } from 'lucide-react';

const ExpertCard = ({ expert }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden group transition-all duration-300"
        >
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full shadow-sm">
                        {expert.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {expert.name}
                    </h3>
                    <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                        <Star size={14} className="fill-current mr-1" />
                        <span className="text-xs font-bold">{expert.rating.toFixed(1)}</span>
                    </div>
                </div>

                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {expert.bio}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                            <Clock size={12} /> {expert.experience}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                            ${expert.price} / session
                        </span>
                    </div>

                    <Link
                        to={`/expert/${expert._id}`}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ExpertCard;
