import { AssistantRequest, AssistantResponse } from '../types/assistant';

// Convert markdown to plain text
const markdownToText = (markdown: string): string => {
  return markdown
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/^[-*+]\s+/gm, '• ') // Convert list items to bullets
    .replace(/^\d+\.\s+/gm, '• ') // Convert numbered lists to bullets
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
    .trim();
};

const ASSISTANT_API_URL = 'https://directed-ai-latest.onrender.com';

export const assistantApi = {
  async sendMessage(request: AssistantRequest): Promise<AssistantResponse> {
    try {
      const response = await fetch(`${ASSISTANT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'I apologize, but I could not process your request at the moment.';
      return {
        reply: markdownToText(reply),
        route_taken: data.route_taken || 'unknown'
      };
    } catch (error) {
      console.error('Assistant API Error:', error);
      return {
        reply: 'I apologize, but I am currently unavailable. Please try again later.',
        route_taken: 'error'
      };
    }
  }
};