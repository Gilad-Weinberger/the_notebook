"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AIChat({ subjectId, subjectName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'system', content: `Welcome to the AI Assistant for ${subjectName || 'your subject'}. Ask me anything!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simulate AI response (would be replaced with actual API call)
      setTimeout(() => {
        const responseContent = `This is a simulated AI response for "${input}" related to subject #${subjectId}.
        
In a real implementation, this would be connected to an actual AI service that would provide relevant information about ${subjectName}.`;
        
        const aiMessage = { role: 'assistant', content: responseContent };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Messages container with extra bottom padding to make room for floating input */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : msg.role === 'system'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Floating input bar at the bottom with more space between input and button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-3xl">
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about this subject..."
            className="flex-grow py-3 px-4 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
            disabled={isLoading}
          />
          {/* Increased margin and removed rectangle background */}
          <button 
            type="submit"
            className="ml-6 flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-11 text-blue-500 drop-shadow-md" fill="none" viewBox="0 0 27 24" stroke="currentColor" transform="rotate(45)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}