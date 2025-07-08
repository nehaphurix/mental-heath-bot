import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatbotRoutes from './src/chatbot/routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/chatbot', chatbotRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  // ✅ Listen on 0.0.0.0 so Docker can expose the port properly
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('DB connection error:', err));