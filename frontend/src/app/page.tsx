'use client';

import React, { useState } from 'react';
import API_BASE_URL from '@/lib/api';
import IngredientAI from '@/components/IngredientAI';
import ChatAssistant from '@/components/ChatAssistant';
import AdminDashboard from '@/components/AdminDashboard';
import UserHistory from '@/components/UserHistory';

export default function Home() {
    const [activeTab, setActiveTab] = useState<'ingredients' | 'chat' | 'history' | 'admin'>('ingredients');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [tempEmail, setTempEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [authError, setAuthError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Check session on load
    React.useEffect(() => {
        const storedUser = localStorage.getItem('userName');
        if (storedUser) setUserName(storedUser);
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        if (!tempEmail || !password) {
            setAuthError("Please fill all fields");
            return;
        }
        setIsLoading(true);
        const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: tempEmail, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', tempEmail);
                setUserName(tempEmail);
                setIsLoginModalOpen(false);
            } else {
                setAuthError(data.error || "Authentication failed");
            }
        } catch (err) {
            setAuthError("Network error checking server");
        }
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setUserName(null);
    };



    return (
        <main className="min-h-screen bg-black/95 text-white selection:bg-fuchsia-500/30">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 w-full glass z-50 border-b border-gray-800 bg-black/50 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-fuchsia-900/50">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-white translate-y-[1px]">FOOD AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">KITCHEN</span></h1>
                    </div>
                    
                    <nav className="hidden md:flex items-center space-x-1 p-1 bg-gray-900 rounded-2xl border border-gray-800 shadow-inner">
                        <button 
                            onClick={() => setActiveTab('ingredients')}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'ingredients' ? 'bg-gray-800 text-fuchsia-400 shadow-md border border-gray-700' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            Ingredient AI
                        </button>
                        <button 
                            onClick={() => setActiveTab('chat')}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'chat' ? 'bg-gray-800 text-fuchsia-400 shadow-md border border-gray-700' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            Chat Assistant
                        </button>
                        {userName && (
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'history' ? 'bg-gray-800 text-fuchsia-400 shadow-md border border-gray-700' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                History
                            </button>
                        )}
                    </nav>

                    <div className="flex items-center space-x-3">
                        {userName ? (
                            <div className="flex items-center gap-3 bg-gray-800/80 pl-4 pr-1 py-1 rounded-full border border-fuchsia-500/30">
                                <span className="text-xs font-bold text-fuchsia-400 capitalize tracking-widest">{userName.split('@')[0]}</span>
                                <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsLoginModalOpen(true)} className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition-all text-gray-500 hover:text-white">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'ingredients' && (
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <IngredientAI />
                        </div>
                    )}
                    {activeTab === 'chat' && (
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 h-[calc(100vh-160px)]">
                            <ChatAssistant />
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <UserHistory />
                        </div>
                    )}
                    {activeTab === 'admin' && (
                        <AdminDashboard />
                    )}
                </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-gray-800 flex items-center justify-around py-3 z-50">
                 <button onClick={() => setActiveTab('ingredients')} className={`p-2 transition-all ${activeTab === 'ingredients' ? 'text-fuchsia-500 scale-110' : 'text-gray-500'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 </button>
                 <button onClick={() => setActiveTab('chat')} className={`p-2 transition-all ${activeTab === 'chat' ? 'text-fuchsia-500 scale-110' : 'text-gray-500'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                 </button>
                 {userName && (
                     <button onClick={() => setActiveTab('history')} className={`p-2 transition-all ${activeTab === 'history' ? 'text-fuchsia-500 scale-110' : 'text-gray-500'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </button>
                 )}
            </div>
            {/* User Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-gray-900/95 border border-gray-700/50 rounded-[2.5rem] p-10 max-w-sm w-full relative shadow-[0_0_50px_rgba(217,70,239,0.15)] overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>
                        
                        {/* Close button */}
                        <button 
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-fuchsia-500/30 rounded-2xl flex items-center justify-center text-fuchsia-400 mx-auto mb-6 shadow-lg shadow-fuchsia-900/30">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-white text-center mb-1">
                                {isSignUp ? "Create Account" : "Welcome Back"}
                            </h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-8">Access your digital kitchen</p>
                            
                            <form className="space-y-4 mb-6" onSubmit={handleAuth}>
                                {authError && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] uppercase font-bold p-3 rounded-xl text-center">
                                        {authError}
                                    </div>
                                )}
                                <input 
                                    type="email" 
                                    placeholder="YOUR EMAIL"
                                    value={tempEmail}
                                    onChange={(e) => setTempEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-2xl px-6 py-4 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
                                />
                                <input 
                                    type="password" 
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-2xl px-6 py-4 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
                                />
                                <button disabled={isLoading} type="submit" className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-fuchsia-900/40 transition-all active:scale-95 mt-2 disabled:opacity-50">
                                    {isLoading ? "Authenticating..." : (isSignUp ? "Sign Up Now" : "Secure Login")}
                                </button>
                            </form>
                            
                            <div className="flex justify-center mb-6">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); }} 
                                    className="text-[10px] font-bold text-gray-400 hover:text-fuchsia-400 uppercase tracking-widest transition-colors"
                                >
                                    {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
                                </button>
                            </div>
                            
                            <div className="relative flex items-center justify-center mb-6">
                                <div className="absolute inset-x-0 h-px bg-gray-800"></div>
                                <span className="relative bg-[#111827] px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Or</span>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    setIsLoginModalOpen(false);
                                    setActiveTab('admin');
                                }}
                                className="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-500/50 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 group"
                            >
                                <svg className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Access Admin Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Chat Action Button */}
            {activeTab !== 'chat' && (
                <button 
                    onClick={() => setActiveTab('chat')}
                    className="fixed bottom-20 md:bottom-8 right-6 z-40 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-4 rounded-full shadow-[0_0_30px_rgba(217,70,239,0.5)] text-white hover:scale-110 active:scale-95 transition-all duration-300 border border-fuchsia-400/30 group animate-in fade-in slide-in-from-bottom-10"
                >
                    <svg className="w-8 h-8 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    
                    {/* Ping indicator */}
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
                    </span>
                </button>
            )}

        </main>
    );
}
