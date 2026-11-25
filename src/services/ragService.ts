import { apiRequest } from './api';

// Google Gemini-powered RAG Assistant Service
// Communicates with the FastAPI backend endpoint /api/chat
// Supports official Google Gemini API generation with vector-grounded context and source citations.

export interface ChatResponse {
  answer: string;
  sources: Array<{
    title: string;
    book_id?: number;
    type: string;
  }>;
  engine: string;
}

export const ragService = {
  query: async (
    question: string,
    history: Array<{ role: string; content: string }> = []
  ): Promise<ChatResponse> => {
    try {
      const response = await apiRequest<ChatResponse>('/chat', {
        method: 'POST',
        body: JSON.stringify({
          question,
          history,
        }),
      });
      return response;
    } catch (err: any) {
      return {
        answer: `LPU AI Librarian notice: Unable to contact the backend service (${err.message || 'Connection error'}). Please verify the FastAPI service is running.`,
        sources: [],
        engine: 'Service-Offline-Fallback',
      };
    }
  },
};
