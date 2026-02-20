import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExpertsScreen from './pages/ExpertsScreen.jsx';
import ExpertDetailScreen from './pages/ExpertDetailScreen.jsx';
import MyBookingsScreen from './pages/MyBookingsScreen.jsx';
import { Calendar, Users } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Modern Navbar */}
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Calendar size={20} />
                </div>
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ExpertBook
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                <Link to="/" className="text-slate-600 hover:text-blue-600 transition flex items-center gap-2 font-medium">
                  <Users size={18} /> Find Experts
                </Link>
                <Link to="/my-bookings" className="text-slate-600 hover:text-blue-600 transition flex items-center gap-2 font-medium">
                  <Calendar size={18} /> My Bookings
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ExpertsScreen />} />
            <Route path="/expert/:id" element={<ExpertDetailScreen />} />
            <Route path="/my-bookings" element={<MyBookingsScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
