import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, PaperclipIcon } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface AgentTabProps {
  messages: Message[];
  onAddMessage: (message: Message) => void;
}

const AgentTab: React.FC<AgentTabProps> = ({ messages, onAddMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    onAddMessage(userMessage);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/agent/chat', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
          filePath: currentFilePath // Send the current file path with the message
        }),
      });

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry the agent could not deal with that request. Please try again.",
        sender: 'agent',
        timestamp: new Date(),
      };

      onAddMessage(agentMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      onAddMessage({
        id: (Date.now() + 1).toString(),
        content: "Oops! Something went wrong",
        sender: 'agent',
        timestamp: new Date()
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      
      // Create FormData and send file to backend
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setCurrentFilePath(data.filePath);

        onAddMessage({
          id: Date.now().toString(),
          content: `File uploaded: ${fileName}`,
          sender: 'user',
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        onAddMessage({
          id: Date.now().toString(),
          content: 'Error uploading file. Please try again.',
          sender: 'agent',
          timestamp: new Date()
        });
      }
      
      e.target.value = '';
    }
  };
  
  return (
    <motion.div 
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Space Agent</h2>
        <p className="text-text-secondary text-sm">Ask me anything about your orbit journey</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`chat-message ${message.sender}`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message agent">
              <div className="flex space-x-1">
                <span className="loading-dot w-2 h-2 rounded-full bg-white"></span>
                <span className="loading-dot w-2 h-2 rounded-full bg-white"></span>
                <span className="loading-dot w-2 h-2 rounded-full bg-white"></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2">
            <label className="file-upload-label">
              <PaperclipIcon size={18} />
              <input 
                type="file" 
                className="file-upload" 
                onChange={handleFileUpload}
              />
            </label>
            
            <div className="flex-1 relative">
              <textarea
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-12 resize-none"
                placeholder="Type your message..."
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-white transition-colors"
                onClick={handleSendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentTab;
