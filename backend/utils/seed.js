import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expert from '../models/Expert.js';

dotenv.config();

const expertsData = [
    {
        name: 'Dr. Sarah Jenkins',
        category: 'Medical',
        experience: '15 Years',
        rating: 4.9,
        bio: 'General practitioner with over 15 years of experience in family medicine.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop',
        price: 150
    },
    {
        name: 'Mark O. Thompson',
        category: 'Legal',
        experience: '10 Years',
        rating: 4.8,
        bio: 'Corporate lawyer specializing in startups and intellectual property.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop',
        price: 300
    },
    {
        name: 'Alice Wong',
        category: 'Tech',
        experience: '8 Years',
        rating: 5.0,
        bio: 'Senior Software Engineer and Systems Architect at a top firm.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
        price: 200
    },
    {
        name: 'Dr. Michael Chen',
        category: 'Medical',
        experience: '12 Years',
        rating: 4.7,
        bio: 'Cardiologist interested in preventive cardiovascular medicine.',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop',
        price: 250
    },
    {
        name: 'Emma Stevens',
        category: 'Finance',
        experience: '6 Years',
        rating: 4.6,
        bio: 'Certified Financial Planner with a focus on retirement planning.',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop',
        price: 120
    },
    {
        name: 'John Davis',
        category: 'Tech',
        experience: '5 Years',
        rating: 4.5,
        bio: 'Frontend developer and UI/UX expert helping designers code.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
        price: 100
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seed');

        await Expert.deleteMany();
        console.log('Experts deleted');

        await Expert.insertMany(expertsData);
        console.log('Experts Seeded Successfully');

        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedDB();
