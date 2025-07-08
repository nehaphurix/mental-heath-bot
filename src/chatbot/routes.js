import express from 'express';
import { getPromptResponse, getChatbotResponse } from './conversationManager.js';
import Mood from './moodModel.js';
import ChatHistory from './chatHistoryModel.js';
import { getAIReply } from './services/aiService.js';



const router = express.Router();

router.get('/', (req, res) => {
  res.send('Mental Health Bot API is running.');
});

// ✅ updated POST /message route with crisis handling
router.post('/message', async (req, res) => {
  const { message } = req.body;
  const userId = 'user123'; // Ideally from session/token

  // Crisis keywords list
  const crisisKeywords = [
    'suicide',
    'want to die',
    'kill myself',
    'hopeless',
    'worthless',
    'end this',
    'giving up',
    'no reason to live'
  ];

  try {
    // Check if message contains any crisis keyword
    const isCrisis = crisisKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    let botResponse = '';

    if (isCrisis) {
      botResponse = `I'm really sorry you're feeling this way. You're not alone — help is available. Please reach out to a professional or contact a local mental health helpline immediately.\n\n**India Helpline:** 9152987821\n**Global:** https://findahelpline.com/`;
    } else {
      // If no crisis detected, get AI-generated response
      botResponse = await getAIReply(message);
    }

    // Save user message
    await ChatHistory.create({ userId, role: 'USER', message, isCrisis });

    // Save bot response
    const savedBotMessage = await ChatHistory.create({
      userId,
      role: 'BOT',
      message: botResponse
    });

    // Send bot response with createdAt timestamp
    res.json({
      response: botResponse,
      createdAt: savedBotMessage.createdAt,
      isCrisis: savedBotMessage.isCrisis
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Save mood entry
router.post('/mood', async (req, res) => {
  console.log('Incoming mood request:', req.body);
  const { userId, mood, note } = req.body;

  if (!userId || !mood) {
    return res.status(400).json({ error: 'userId and mood are required' });
  }

  const newMood = await Mood.create({ userId, mood, note });
  console.log('Saved mood:', newMood);
  res.json(newMood);
});

// GET mood history for a user
router.get('/mood-history/:userId', async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    console.error('Error fetching mood history:', err);
    res.status(500).json({ error: 'Failed to fetch mood history.' });
  }
});

// Save a chat message
router.post('/chat-history', async (req, res) => {
  try {
    const { userId, role, message } = req.body;
    const newChat = new ChatHistory({ userId, role, message });
    await newChat.save();
    res.json({ message: 'Chat message saved successfully!' });
  } catch (err) {
    console.error('Error saving chat history:', err);
    res.status(500).json({ error: 'Failed to save chat message.' });
  }
});

// Get full chat history for a user
router.get('/chat-history/:userId', async (req, res) => {
  try {
    const history = await ChatHistory.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.json(history);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
});

export default router;