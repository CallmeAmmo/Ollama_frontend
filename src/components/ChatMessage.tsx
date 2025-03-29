import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import { Brain } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ThinkDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="think-dropdown my-2">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="text-sm text-white bg-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-600 transition-colors w-full flex justify-between items-center"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5">
          <Brain size={18} aria-hidden="true" />
          Thinking Process
        </span>
        <span className="bg-white/90 text-zinc-800 px-2.5 py-0.5 rounded-md text-sm">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>

      {open && (
        <div 
          className="think-content mt-2 bg-zinc-800 p-4 rounded-lg text-white/90 whitespace-pre-wrap text-sm"
          role="region"
          aria-live="polite"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export function ChatMessage({ message }: ChatMessageProps) {
  const [parsedContent, setParsedContent] = useState<Array<React.ReactNode>>([]);
  const [processedThinkBlocks, setProcessedThinkBlocks] = useState<Set<number>>(new Set());

  // Parse content into think blocks and regular text
  const parseContent = (content: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /(<think>[\s\S]*?<\/think>)|(<think>[\s\S]*)/gi;
    let lastIndex = 0;
    let counter = 0;

    content.split(regex).forEach((segment, index) => {
      if (!segment) return;
      
      if (segment.toLowerCase().startsWith('<think>')) {
        const isClosed = segment.toLowerCase().includes('</think>');
        const content = segment
          .replace(/<\/?think>/gi, '')
          .trim();

        if (isClosed) {
          parts.push(
            <ThinkDropdown key={`think-${index}`}>
              {content}
            </ThinkDropdown>
          );
        } else {
          parts.push(
            <div 
              key={`streaming-think-${index}`}
              className="bg-zinc-800/80 p-3 rounded-lg mb-2 animate-pulse-fast text-sm text-white/80"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Brain className="animate-spin" size={16} />
                <span>Thinking</span>
              </div>
              {content}
            </div>
          );
        }
        lastIndex = index + 1;
        counter++;
      } else if (index === lastIndex) {
        parts.push(
          <span 
            key={`text-${index}`}
            className="text-white/90 whitespace-pre-wrap"
          >
            {segment}
          </span>
        );
      }
    });

    return parts;
  };

  useEffect(() => {
    if (message.content) {
      const parsed = parseContent(message.content);
      setParsedContent(parsed);
    }
  }, [message.content]);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-600/90 text-white rounded-lg py-2.5 px-4 max-w-[85%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      {message.thinking && (
        <div className="bg-zinc-800/80 rounded-lg p-3 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Brain className="animate-spin" size={16} />
            Generating response...
          </div>
        </div>
      )}

      <div className="text-white/90 whitespace-pre-wrap">
        {parsedContent}
      </div>
    </div>
  );
}


