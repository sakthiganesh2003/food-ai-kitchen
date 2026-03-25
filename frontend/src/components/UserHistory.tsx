'use client';

import React, { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

export default function UserHistory() {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token') || 'dummy_token';
        fetch(`${API_BASE_URL}/api/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setHistory(data.data);
            }
            setIsLoading(false);
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1612]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-[#2D241E] shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <h3 className="text-2xl font-heading font-black text-white tracking-tight">Your Activity Log</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Past recipes and interactions</p>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-bold italic border-2 border-dashed border-[#2D241E] rounded-2xl">
                    No history found. Try generating a recipe!
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between bg-[#0D0B08]/50 p-6 rounded-2xl border border-[#2D241E] hover:border-amber-500/50 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'recipe' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {item.type === 'recipe' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold group-hover:text-amber-400 transition-colors">{item.title || "Unknown Interaction"}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                        {new Date(item.createdAt || item.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button className="mt-4 md:mt-0 px-6 py-2 bg-[#2D241E] text-xs font-bold text-white uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
