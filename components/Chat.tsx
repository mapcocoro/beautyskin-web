'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, SkinConcernType, SKIN_CONCERNS } from '@/types';

interface ChatProps {
  concerns: SkinConcernType[];
  age: number;
  onBack: () => void;
}

export default function Chat({ concerns, age, onBack }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `こんにちは！${age}歳のあなたの美肌コンシェルジュです。${concerns.map(c => SKIN_CONCERNS.find(sc => sc.id === c)?.name).join('・')}についてのお悩みですね。どのようなことでもお気軽にご相談ください。`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          concerns,
          age,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-120px)] max-h-[700px]">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          結果に戻る
        </button>
        <h1 className="text-lg font-bold text-gray-800">美肌相談</h1>
        <div className="w-20" />
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-pink-50 to-white rounded-2xl p-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-sm">🌸</span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 ${
                  message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center mr-2">
                <span className="text-sm">🌸</span>
              </div>
              <div className="chat-bubble-ai px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力してください..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-full border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`px-6 py-3 rounded-full text-white font-semibold transition-all ${
            input.trim() && !isLoading
              ? 'bg-pink-400 hover:bg-pink-500'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          送信
        </button>
      </form>
    </div>
  );
}
