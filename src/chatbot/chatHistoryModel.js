import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, enum: ['USER', 'BOT'], required: true },
  message: { type: String, required: true },
  isCrisis: { type: Boolean, default: false },   // <-- added this line
}, { timestamps: true });

export default mongoose.model('ChatHistory', chatHistorySchema);