'use client';

import React, { useState, useRef, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello! I am your Food AI Assistant. How can I help you in the kitchen today?', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.map(m => ({ role: m.role, content: m.content })).slice(-5)
                })
            });

            const result = await response.json();
            if (result.success) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: result.data.reply,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            alert("Oops! Could not reach the kitchen assistant. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.1)] border border-gray-800 relative group">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-fuchsia-500/20 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/20 transition-all duration-1000"></div>

            {/* Header */}
            <div className="px-8 py-5 bg-black/40 border-b border-gray-800 flex items-center justify-between backdrop-blur-md z-10">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-fuchsia-900/50 border border-fuchsia-400/30">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Kitchen Assistant</h2>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span> AI Engine Online
                        </span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 z-10 scrollbar-hide">
                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 shadow-xl border ${
                            m.role === 'user' 
                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-sm border-fuchsia-500/50' 
                                : 'bg-gray-800/80 text-gray-200 rounded-tl-sm border-gray-700/50 backdrop-blur-md'
                        }`}>
                            <p className="text-sm font-medium leading-loose whitespace-pre-wrap">{m.content}</p>
                            <span className={`text-[10px] uppercase font-bold tracking-widest block mt-2 opacity-50 text-right`}>
                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800/80 border border-gray-700/50 rounded-[1.5rem] rounded-tl-sm px-6 py-4 flex items-center space-x-2 backdrop-blur-md">
                            <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/40 border-t border-gray-800 backdrop-blur-md z-10">
                <div className="flex items-center space-x-4 bg-gray-900/80 rounded-2xl p-2 border border-gray-700/50 focus-within:ring-2 focus-within:ring-fuchsia-500/30 focus-within:border-fuchsia-500/50 transition-all shadow-inner">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="ASK ABOUT A RECIPE OR DIET..."
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-xs font-bold text-white uppercase tracking-widest placeholder-gray-600 outline-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim()}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 border border-fuchsia-500/30 text-white p-4 rounded-xl shadow-lg shadow-fuchsia-900/50 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale hover:brightness-110"
                    >
                        <svg className="w-4 h-4 fill-current transform rotate-90" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest font-black">
                    <button className="hover:text-fuchsia-400 hover:scale-105 transition-all text-fuchsia-500/50 border border-fuchsia-500/20 px-3 py-1.5 rounded-lg bg-fuchsia-500/5">🔥 Suggest Meal</button>
                    <button className="hover:text-violet-400 hover:scale-105 transition-all text-violet-500/50 border border-violet-500/20 px-3 py-1.5 rounded-lg bg-violet-500/5">🥗 Diet Plan</button>
                    <button className="hover:text-pink-400 hover:scale-105 transition-all text-pink-500/50 border border-pink-500/20 px-3 py-1.5 rounded-lg bg-pink-500/5">💰 Budget Tips</button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
