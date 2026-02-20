import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. "5 Years"
    rating: { type: Number, required: true, default: 0 },
    bio: { type: String },
    image: { type: String }, // URL or base64
    price: { type: Number, required: true, default: 50 },
  },
  { timestamps: true }
);

const Expert = mongoose.model('Expert', expertSchema);
export default Expert;
