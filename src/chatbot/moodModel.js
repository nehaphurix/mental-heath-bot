import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mood: { type: String, required: true },
  note: { type: String },
}, { timestamps: true });

export default mongoose.model('Mood', moodSchema);