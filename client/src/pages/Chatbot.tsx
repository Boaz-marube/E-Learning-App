import React, { useState } from 'react';
import { Send, Bot, User, BookOpen, HelpCircle, Dumbbell } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const Chatbot: React.FC = () => {
  const [currentMode, setCurrentMode] = useState('tutor');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const modes = {
    tutor: {
      title: 'AI Tutor',
      icon: <BookOpen className="w-4 h-4" />,
      placeholder: 'Ask me anything about your studies...',
      systemPrompt: 'I am your AI tutor, ready to help you learn and understand any topic.'
    },
    assistant: {
      title: 'AI Assistant', 
      icon: <HelpCircle className="w-4 h-4" />,
      placeholder: 'How can I help you today?',
      systemPrompt: 'I am your AI assistant, here to help with tasks and answer questions.'
    },
    coach: {
      title: 'AI Coach',
      icon: <Dumbbell className="w-4 h-4" />,
      placeholder: 'Let\'s work on your goals together...',
      systemPrompt: 'I am your AI coach, here to motivate and guide you towards your goals.'
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `As your ${modes[currentMode as keyof typeof modes].title.toLowerCase()}, I understand you're asking about: "${inputMessage}". I'm here to help you with that!`,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const switchMode = (mode: string) => {
    setCurrentMode(mode);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#00693F]" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {modes[currentMode as keyof typeof modes].title}
              </h1>
            </div>
          </div>
          
          {/* Mode Selection Buttons */}
          <div className="flex gap-4">
            {Object.entries(modes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentMode === key
                    ? 'text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                style={currentMode === key ? { backgroundColor: '#00693F' } : {}}
              >
                {mode.icon}
                {mode.title}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                {modes[currentMode as keyof typeof modes].icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Welcome to your {modes[currentMode as keyof typeof modes].title}!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {modes[currentMode as keyof typeof modes].systemPrompt}
              </p>
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
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                  style={message.sender === 'user' ? { backgroundColor: '#00693F' } : {}}
                >
                  <p className="text-sm">{message.text}</p>
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
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={modes[currentMode as keyof typeof modes].placeholder}
                rows={1}
                className="w-full px-4 py-3 bg-transparent rounded-full resize-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ''}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                inputMessage.trim() === ''
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-white hover:opacity-90'
              }`}
              style={inputMessage.trim() !== '' ? { backgroundColor: '#00693F' } : {}}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;