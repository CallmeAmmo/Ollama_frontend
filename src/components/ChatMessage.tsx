import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import { Brain } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ThinkDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  if (!children || (typeof children === 'string' && children.trim() === '')) {
    return null;
  }

  return (
    <div className="think-dropdown my-2 bg-zinc-800 rounded-lg transition-all">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="text-sm text-white px-4 py-3 w-full flex justify-between items-center hover:bg-zinc-700/20 rounded-lg"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5">
          <Brain size={20} aria-hidden="true" />
          Thinking
        </span>
        <span className="bg-white/90 text-zinc-800 px-2.5 py-1 rounded-md text-sm">
          {open ? 'Hide Thoughts' : 'Show Thoughts'}
        </span>
      </button>

      {open && (
        <div 
          className="px-4 pb-4 -mt-2 text-white/90 whitespace-pre-wrap text-sm"
          role="region"
          aria-live="polite"
        >
          <div className="pt-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};





export function ChatMessage({ message }: ChatMessageProps) {
  const [thinkBlocks, setThinkBlocks] = useState<Array<{ content: string; closed: boolean }>>([]);
  const [finalText, setFinalText] = useState('');
  const [displayedFinalLength, setDisplayedFinalLength] = useState(0);

  // Parse content into think blocks and final text
  useEffect(() => {
    if (!message.content) return;

    const content = message.content;
    const blocks: Array<{ content: string; closed: boolean }> = [];
    let lastClosingIndex = -1;

    const regex = /<think>([\s\S]*?)<\/think>|<think>([\s\S]*)/gi;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const content = match[1] || match[2];
      const trimmedContent = content?.trim() || '';
      
      if (trimmedContent) { // Only add if there's actual content
        blocks.push({
          content: trimmedContent,
          closed: !!match[1]
        });
      }
      
      if (match[1]) {
        lastClosingIndex = regex.lastIndex;
      }
    }

    // Extract final text after last </think>
    const final = lastClosingIndex !== -1 ? content.slice(lastClosingIndex) : '';
    
    setThinkBlocks(blocks);
    setFinalText(final);
  }, [message.content]);

  // Handle final text streaming
  useEffect(() => {
    if (finalText.length === 0 || displayedFinalLength >= finalText.length) return;

    const interval = setInterval(() => {
      setDisplayedFinalLength(prev => {
        if (prev >= finalText.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [finalText, displayedFinalLength]);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-zinc-500/90 text-white mt-4 rounded-lg py-2.5 px-4 max-w-[85%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {/* Thinking indicator */}
      {message.thinking && (
        <div className="bg-zinc-800/80 rounded-lg p-3 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Brain size={16} />
            Generating response...
          </div>
        </div>
      )}

      {/* Processed think blocks */}
      {thinkBlocks.map((block, index) => block.closed ? (
        <ThinkDropdown key={`think-${index}`}>
          {block.content}
        </ThinkDropdown>
      ) : (
        <div 
          key={`streaming-think-${index}`}
          className="bg-zinc-800/80 p-3 rounded-lg mb-2 text-sm text-white/80"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Brain size={20} />
            <span>Thinking</span>
          </div>
          {block.content}
        </div>
      ))}

      {/* Streamed final text */}
      {finalText.length > 0 && (
        <div className="text-white/90 whitespace-pre-wrap ">
          {finalText.trim().slice(0, displayedFinalLength)}
        </div>
      )}
    </div>
  );
}

 