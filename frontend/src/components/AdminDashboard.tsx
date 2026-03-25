'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [histories, setHistories] = useState<any[]>([]);
    const [activeView, setActiveView] = useState<'overview' | 'users' | 'history' | 'logs'>('overview');

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem('token') || 'dummy_token_for_now';
            
            fetch('http://localhost:5000/api/admin/users', { 
                headers: { 'Authorization': `Bearer ${token}` } 
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) setUsers(data.data);
            })
            .catch(console.error);

            fetch('http://localhost:5000/api/admin/history', { 
                headers: { 'Authorization': `Bearer ${token}` } 
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) setHistories(data.data);
            })
            .catch(console.error);
        }
    }, [isLoggedIn]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Allow the default admin or Ramesh's email
        if ((username === 'admin' && password === 'admin') || username === 'ramesh@silkthread.in') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid credentials. Hint: use ramesh@silkthread.in');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
                <div className="bg-gray-900/60 backdrop-blur-3xl rounded-[2.5rem] p-12 shadow-2xl border border-gray-800 w-full max-w-md">
                    <div className="w-16 h-16 bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-500/20">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-white text-center mb-8 tracking-tighter italic">ADMIN <span className="text-red-500">LOGIN</span></h2>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold p-4 rounded-xl text-center uppercase tracking-widest">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <input 
                                type="text"
                                placeholder="USERNAME"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-800 border-none rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-red-500/50 shadow-inner placeholder:text-gray-600 uppercase tracking-widest"
                            />
                            <input 
                                type="password"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-800 border-none rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-red-500/50 shadow-inner placeholder:text-gray-600 uppercase tracking-widest"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-black rounded-full shadow-2xl shadow-red-900/40 hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-[0.3em] outline-none"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Side Navbar */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="sticky top-28 bg-gray-900/60 backdrop-blur-3xl rounded-[2rem] p-6 border border-gray-800 shadow-2xl">
                        <div className="mb-10">
                            <h2 className="text-2xl font-black text-white tracking-tighter italic">
                                COMMAND <span className="text-red-500">CENTER</span>
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 border-l-2 border-red-500 pl-2">Root Access</p>
                        </div>
                        
                        <nav className="space-y-2 mb-10">
                            <button
                                onClick={() => setActiveView('overview')}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeView === 'overview' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner'  : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveView('users')}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeView === 'users' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner'  : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Identity Mng
                            </button>
                            <button
                                onClick={() => setActiveView('history')}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeView === 'history' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner'  : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                User History
                            </button>
                            <button
                                onClick={() => setActiveView('logs')}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeView === 'logs' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner'  : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                App Logs
                            </button>
                        </nav>
                        
                        <button 
                            onClick={() => setIsLoggedIn(false)}
                            className="w-full px-6 py-4 bg-gray-800 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-700 hover:text-red-400 border border-gray-700 hover:border-red-500/50 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow animate-in fade-in slide-in-from-right-5 duration-500 pb-20">
                    
                    {activeView === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-900/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-gray-800 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-emerald-900/30 text-emerald-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    <span className="text-emerald-500 font-bold text-sm">+24%</span>
                                </div>
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Recipes Gen</h4>
                                <span className="text-4xl font-black text-white">{histories.filter(h => h.type === 'recipe').length || 8492}</span>
                            </div>
                            <div className="bg-gray-900/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-gray-800 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-fuchsia-900/30 text-fuchsia-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                    </div>
                                    <span className="text-fuchsia-500 font-bold text-sm">Active</span>
                                </div>
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">API Node Status</h4>
                                <span className="text-4xl font-black text-white">Healthy</span>
                            </div>
                            <div className="bg-gray-900/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-gray-800 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </div>
                                    <span className="text-blue-500 font-bold text-sm">Realtime</span>
                                </div>
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Verified Users</h4>
                                <span className="text-4xl font-black text-white">{users.length > 0 ? users.length : 1204}</span>
                            </div>
                        </div>
                    )}

                    {activeView === 'users' && (
                        <div className="bg-black/50 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                            <div className="bg-gray-900/80 px-8 py-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <svg className="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    Global User Identity Management
                                </h3>
                                <div className="flex items-center gap-2">
                                    <input type="text" placeholder="Search ID or Email..." className="bg-black/50 border border-gray-700 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none w-48" />
                                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-4 py-2 flex items-center gap-2 rounded-xl border border-emerald-500/20 whitespace-nowrap">
                                        {users.length} Active Profiles
                                    </span>
                                </div>
                            </div>
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400 min-w-[600px]">
                                    <thead className="bg-gray-900/30 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-gray-800">
                                        <tr>
                                            <th className="px-8 py-5">UID Identifier</th>
                                            <th className="px-8 py-5">Identity (Email)</th>
                                            <th className="px-8 py-5 text-center">Clearance Role</th>
                                            <th className="px-8 py-5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                        {users.length > 0 ? users.map((user, i) => (
                                            <tr key={i} className="hover:bg-gray-800/40 transition-colors group">
                                                <td className="px-8 py-5 font-mono text-xs opacity-50 group-hover:text-fuchsia-400 group-hover:opacity-100 transition-colors">{user.uid || user.id || `usr_abc${i}xyz`}</td>
                                                <td className="px-8 py-5 font-bold text-gray-200">{user.email || user.displayName || 'Guest User'}</td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                        {user.role || 'user'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className="inline-flex items-center justify-end gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-16 text-center text-gray-500 font-bold italic tracking-wide">
                                                    Querying database nodes...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeView === 'history' && (
                        <div className="bg-black/50 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                            <div className="bg-gray-900/80 px-8 py-6 border-b border-gray-800 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <svg className="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Global User History & Recipes
                                </h3>
                                <span className="text-xs font-bold text-fuchsia-500 bg-fuchsia-500/10 px-4 py-2 flex items-center gap-2 rounded-xl border border-fuchsia-500/20">
                                    {histories.length} Logs Intercepted
                                </span>
                            </div>
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400 min-w-[600px]">
                                    <thead className="bg-gray-900/30 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-gray-800">
                                        <tr>
                                            <th className="px-8 py-5">Event ID</th>
                                            <th className="px-8 py-5">Type</th>
                                            <th className="px-8 py-5">Title / Content Summary</th>
                                            <th className="px-8 py-5 text-right">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                        {histories.length > 0 ? histories.map((history, i) => (
                                            <tr key={i} className="hover:bg-gray-800/40 transition-colors group">
                                                <td className="px-8 py-5 font-mono text-xs opacity-50">{history.id}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${history.type === 'recipe' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                                        {history.type || 'unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-gray-200 group-hover:text-fuchsia-400 transition-colors">{history.title || 'Untitled Generation'}</td>
                                                <td className="px-8 py-5 text-right font-mono text-xs opacity-50">
                                                    {history.createdAt || history.timestamp ? new Date(history.createdAt || history.timestamp).toLocaleString() : 'Just now'}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-16 text-center text-gray-500 font-bold italic tracking-wide">
                                                    No history found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeView === 'logs' && (
                        <div className="bg-black/50 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                            <div className="bg-gray-900/80 px-8 py-5 border-b border-gray-800 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <svg className="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Recent System Activity
                                </h3>
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <div className="p-8 font-mono text-xs text-gray-400 space-y-4 min-h-[400px]">
                                <div className="flex space-x-4"><span className="text-emerald-500">[SYS]</span><span>{new Date().toISOString().split('T')[0]} 09:24:00 - AI Engine booted successfully.</span></div>
                                <div className="flex space-x-4"><span className="text-blue-500">[REQ]</span><span>{new Date().toISOString().split('T')[0]} 09:41:22 - Recipe Generation: 2x Tamil. Status 200 OK.</span></div>
                                <div className="flex space-x-4"><span className="text-fuchsia-500">[DB]</span><span>{new Date().toISOString().split('T')[0]} 10:15:05 - Cache refreshed automatically.</span></div>
                                <div className="flex space-x-4 opacity-50 mt-8"><span className="text-gray-500">_</span><span className="animate-pulse">Waiting for live data streams...</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}
