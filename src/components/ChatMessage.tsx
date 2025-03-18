import React, { useState } from 'react';
import { Message } from '../types';
import { Brain } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showThoughts, setShowThoughts] = useState(true);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-zinc-700 text-white rounded-lg py-2 px-4 max-w-[80%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {message.thinking && !message.content && (
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Brain className="animate-[rotate_2s_linear_infinite]" size={20} />
              <span>Thinking</span>
            </div>
            <button
              onClick={() => setShowThoughts(!showThoughts)}
              className="text-sm text-white bg-zinc-700 px-3 py-1 rounded-full hover:bg-zinc-600 transition-colors"
            >
              {showThoughts ? 'Hide Thoughts' : 'Show Thoughts'}
            </button>
          </div>
          {showThoughts && (
            <div className="text-zinc-300 whitespace-pre-wrap">{message.thinking}</div>
          )}
        </div>
      )}
      {message.content && (
        <>
          {message.thinking && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Brain className="animate-[rotate_2s_linear_infinite]" size={20} />
                  <span>Thinking</span>
                </div>
                <button
                  onClick={() => setShowThoughts(!showThoughts)}
                  className="text-sm text-white bg-zinc-700 px-3 py-1 rounded-full hover:bg-zinc-600 transition-colors"
                >
                  {showThoughts ? 'Hide Thoughts' : 'Show Thoughts'}
                </button>
              </div>
              {showThoughts && (
                <div className="text-zinc-300 whitespace-pre-wrap">{message.thinking}</div>
              )}
            </div>
          )}
          <div className="text-white whitespace-pre-wrap">{message.content}</div>
        </>
      )}
    </div>
  );
}