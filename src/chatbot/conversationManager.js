
import { getAIReply } from './services/aiService.js';

export function getPromptResponse(userInput) {
  const defaultResponses = [
    "I'm here for you. Can you tell me more about how you're feeling?",
    "It's okay to feel this way. Want to talk about it?",
    "Thanks for sharing that. I'm listening."
  ];

  if (userInput.toLowerCase().includes("sad")) {
    return "I'm sorry you're feeling sad. Would you like to try a short breathing exercise or talk about it more?";
  } else if (userInput.toLowerCase().includes("anxious")) {
    return "Feeling anxious can be tough. I'm here with you. Want a grounding technique?";
  } else {
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    return defaultResponses[randomIndex];
  }
}

export async function getChatbotResponse(userInput) {
    const aiResponse = await getAIReply(userInput);
    return aiResponse;
}
