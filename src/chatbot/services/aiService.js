import axios from 'axios';

const COHERE_API_KEY = 'iojMbLQ67393rd3gStAgibq5VyzausSgqP3a9HUK';

// Keep a chat history array to maintain context
let chatHistory = [];

export async function getAIReply(userInput) {
  try {
    // Add the new user message to the chat history
    chatHistory.push({ role: 'USER', message: userInput });

    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        model: 'command-r',
        message: userInput,
        temperature: 0.7,
        chat_history: chatHistory,
        preamble: `You are CalmCare, a compassionate mental health support assistant.
Your primary role is to listen empathetically to how users say they are feeling and respond with warmth, encouragement, and supportive wellbeing advice.

When a user shares a feeling word (like 'happy', 'sad', 'anxious', 'excited', 'cherish', etc), respond with empathy — acknowledge the emotion and optionally ask a gentle, supportive follow-up.

If they mention:
- 'sad', 'upset', 'depressed': express concern and suggest self-care or talking to a loved one.
- 'anxious', 'worried', 'stressed': reassure them, recommend deep breathing or relaxation.
- 'angry', 'frustrated': acknowledge it's okay to feel that way and offer calming suggestions.
- 'happy', 'grateful', 'content': celebrate the positive feeling and ask what made them feel good.

If a user asks about unrelated topics, kindly redirect them by saying: 
"I'm here to support your mental and emotional wellbeing. Could you tell me how you're feeling today?"

Keep responses gentle, warm, and caring. Never explain word definitions — respond as a supportive companion.`
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.text) {
      // Add AI's response to the chat history
      chatHistory.push({ role: 'CHATBOT', message: response.data.text.trim() });
      return response.data.text.trim();
    } else {
      console.error('Cohere API returned no text:', response.data);
      return "I'm here for you. How are you feeling right now?";
    }

  } catch (error) {
    if (error.response) {
      console.error('Cohere API error:', error.response.status, error.response.data);
    } else {
      console.error('Cohere API error:', error.message);
    }
    return "I'm having a little trouble connecting. Could you please try again?";
  }
}

// Optional: a function to reset chat history when needed
export function resetChatHistory() {
  chatHistory = [];
}