import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatMessage } from './types';
import { streamResponse } from './api';
import { ChatMessage as ChatMessageComponent } from './components/ChatMessage';
import { Send, HelpCircle, Square } from 'lucide-react';
import logo from './assets/logo.svg';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewQuestion = () => {
    setMessages([]);
    setInput('');
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const controller = new AbortController();
    setAbortController(controller);

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
        thinking: '',
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Convert messages to ChatMessage format for API
      const chatMessages: ChatMessage[] = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      await streamResponse(chatMessages, (update) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage.role === 'assistant') {
            lastMessage.thinking = update.thinking || '';
            if (update.message) {
              lastMessage.content = update.message;
            }
          }
          
          return newMessages;
        });
      }, controller.signal);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="AI Logo" className="w-full h-8" />
        </div>
        <button
          onClick={handleNewQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition-colors"
        >
          {/* <HelpCircle size={20} /> */}
          <HelpCircle size={24} className="text-black bg-white rounded-full "/>
          <span>New Question</span>
        </button>
      </header>

      <main 
        ref={mainRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="mb-8">
              <img src={logo} alt="AI Logo" className="w-full h-16" />
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-4xl px-4">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything.."
                  className="w-full bg-zinc-800 text-white rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                  <HelpCircle size={24} className="text-black bg-white rounded-full "/>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {messages.map((message, index) => (
              <ChatMessageComponent key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {messages.length > 0 && (
        <div className="p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me more.."
                className="w-full bg-zinc-800 text-white rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Square size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <HelpCircle size={24} className="text-black bg-white rounded-full "/>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;