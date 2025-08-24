export interface AssistantMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface AssistantRequest {
  user_id: string;
  user_type: 'student' | 'instructor';
  message: string;
  student_level: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssistantResponse {
  reply: string;
  route_taken: string;
}

export interface QuickAction {
  id: string;
  label: string;
  message: string;
}