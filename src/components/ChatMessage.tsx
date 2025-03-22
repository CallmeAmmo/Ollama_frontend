import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import { Brain } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

// Dropdown component to display <think> content
const ThinkDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="think-dropdown my-2">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="text-sm text-white bg-zinc-700 px-3 py-3 rounded-full hover:bg-zinc-600 transition-colors w-full flex justify-between items-center"
      >
        <span className="flex items-center gap-1">
          <Brain size={20} /> Thinking
        </span>
        <span className="bg-white text-black px-3 py-1 rounded-full">
          {open ? 'Hide Thoughts' : 'Show Thoughts'}
        </span>
      </button>

      {open && (
        <div className="think-content mt-2 bg-zinc-800 p-4 rounded-lg text-white">
          {children}
        </div>
      )}
    </div>
  );
};

export function ChatMessage({ message }: ChatMessageProps) {
  const [showThoughts, setShowThoughts] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (message.thinking && !message.content) {
      setIsThinking(true);
      setShowThoughts(true);
    } else if (message.content) {
      setIsThinking(false);
      setShowContent(true);
    }
  }, [message.thinking, message.content]);

  // Function to parse message content for <think> tags
  const parseContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /<think>([\s\S]*?)<\/think>/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      // Add any text before the <think> block
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Replace the <think> block with a dropdown component
      parts.push(<ThinkDropdown key={match.index}>{match[1]}</ThinkDropdown>);
      lastIndex = regex.lastIndex;
    }
    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-zinc-700 text-white rounded-full py-2 px-4 max-w-[80%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {message.thinking && (
        <div 
          className={`bg-zinc-800 rounded-lg p-4 transition-all duration-300 ${
            showThoughts ? 'animate-[slideDown_0.3s_ease-out]' : 'animate-[slideUp_0.3s_ease-out]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Brain 
                className={isThinking ? 'animate-[rotate_2s_linear_infinite]' : ''} 
                size={20} 
              />
              <span>Thinking</span>
            </div>
            <button
              onClick={() => setShowThoughts(!showThoughts)}
              className="text-sm text-white bg-zinc-700 px-3 py-1 rounded-full hover:bg-zinc-600 transition-colors"
            >
              {showThoughts ? 'Hide Thoughts' : 'Show Thoughts'}
            </button>
          </div>
          <div 
            className={`text-zinc-300 whitespace-pre-wrap overflow-hidden transition-all duration-300 ${
              showThoughts ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {message.thinking}
          </div>
        </div>
      )}
      {message.content && (
        <div 
          className={`text-white whitespace-pre-wrap ${
            showContent ? 'animate-[slideDown_0.3s_ease-out]' : ''
          }`}
        >
          {parseContent(message.content)}
        </div>
      )}
    </div>
  );
}
