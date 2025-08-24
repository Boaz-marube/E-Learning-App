import { AssistantRequest, AssistantResponse } from '../types/assistant';

const ASSISTANT_API_URL = 'https://299dae2dbbcc.ngrok-free.app';

export const assistantApi = {
  async sendMessage(request: AssistantRequest): Promise<AssistantResponse> {
    try {
      const response = await fetch(`${ASSISTANT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        reply: data.reply || 'I apologize, but I could not process your request at the moment.',
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