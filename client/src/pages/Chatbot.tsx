import React, { useState } from 'react';
import { Send, Bot, User, BookOpen, HelpCircle, Dumbbell, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAssistantContext } from '../hooks/usePageContext';
import { assistantApi } from '../utils/assistantApi';
import { AssistantMessage } from '../types/assistant';



const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const { userId, userType, studentLevel, quickActions } = useAssistantContext();
  const [currentMode, setCurrentMode] = useState('tutor');
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modes = {
    tutor: {
      title: 'AI Tutor',
      icon: <BookOpen className="w-4 h-4" />,
      placeholder: 'Ask about your studies...',
      systemPrompt: 'I am your AI tutor, ready to help you learn and understand any topic.'
    },
    assistant: {
      title: 'AI Assistant', 
      icon: <HelpCircle className="w-4 h-4" />,
      placeholder: 'How can I help?',
      systemPrompt: 'I am your AI assistant, here to help with tasks and answer questions.'
    },
    coach: {
      title: 'AI Coach',
      icon: <Dumbbell className="w-4 h-4" />,
      placeholder: 'Let\'s work on goals...',
      systemPrompt: 'I am your AI coach, here to motivate and guide you towards your goals.'
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (text === '' || isLoading) return;
    
    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await assistantApi.sendMessage({
        user_id: userId,
        user_type: userType,
        message: text,
        student_level: studentLevel
      });
      
      const assistantMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  const switchMode = (mode: string) => {
    setCurrentMode(mode);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-2 sm:p-4 my-[15vh] h-[70vh] flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-[#00693F]" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {modes[currentMode as keyof typeof modes].title}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {userType} • {studentLevel} level
                </p>
              </div>
            </div>
          </div>
          
          {/* Mode Selection Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {Object.entries(modes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  currentMode === key
                    ? 'text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                style={currentMode === key ? { backgroundColor: '#00693F' } : {}}
              >
                {mode.icon}
                <span className="hidden sm:inline">{mode.title}</span>
                <span className="sm:hidden">{mode.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white dark:bg-gray-800">
          {messages.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                {modes[currentMode as keyof typeof modes].icon}
              </div>
              <h3 className="text-base sm:text-lg font-medium mb-2 text-gray-900 dark:text-white px-4">
                Welcome to your {modes[currentMode as keyof typeof modes].title}!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4 mb-4">
                {modes[currentMode as keyof typeof modes].systemPrompt}
              </p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 justify-center px-4">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.message)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#00693F' }}
                  >
                    {isLoading && message.sender === 'assistant' && messages[messages.length - 1].id === message.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                  style={message.sender === 'user' ? { backgroundColor: '#00693F' } : {}}
                >
                  <p className="text-sm break-words">{message.text}</p>
                </div>
                
                {message.sender === 'user' && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#00693F' }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative rounded-2xl sm:rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={modes[currentMode as keyof typeof modes].placeholder}
                rows={1}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent rounded-2xl sm:rounded-full resize-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={inputMessage.trim() === '' || isLoading}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                inputMessage.trim() === '' || isLoading
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-white hover:opacity-90'
              }`}
              style={inputMessage.trim() !== '' && !isLoading ? { backgroundColor: '#00693F' } : {}}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-current"></div>
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;