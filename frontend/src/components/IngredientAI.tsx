'use client';

import React, { useState } from 'react';
import API_BASE_URL from '@/lib/api';
import IngredientInput from './IngredientInput';
import RecipeDisplay from './RecipeDisplay';

interface Recipe {
  recipeName: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  calories: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  chefTips?: string;
  tags?: string[];
  isMock?: boolean;
}

const IngredientAI: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [titles, setTitles] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [preferences, setPreferences] = useState({
        spicy: false,
        healthy: false,
        dietary: '',
        maxTime: '',
        budget: '',
        language: 'English'
    });

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 4000);
    };

    const addIngredient = (ingredient: string) => {
        if (!ingredients.includes(ingredient)) {
            setIngredients([...ingredients, ingredient]);
        } else {
            triggerToast("You've already added that!");
        }
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const resetIngredients = () => {
        setIngredients([]);
        setRecipes(null);
        setTitles(null);
    };

    const generateTitles = async () => {
        if (ingredients.length === 0) return;
        
        setIsLoading(true);
        setRecipes(null);
        setTitles(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/titles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients, preferences })
            });
            const result = await response.json();
            if (result.success && result.data.titles) {
                setTitles(result.data.titles.map((t: any) => t.title));
            } else {
                triggerToast("AI couldn't generate ideas right now.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            triggerToast("Could not reach the AI Kitchen. Is the server running?");
        } finally {
            setIsLoading(false);
        }
    };

    const generateDetailedRecipe = async (title: string) => {
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/recipe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients, title, preferences })
            });
            const result = await response.json();
            if (result.success && result.data.recipes) {
                setRecipes(result.data.recipes);
                setTitles(null); // Clear titles to show recipe
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            triggerToast("Could not reach the AI Kitchen.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12 max-w-6xl mx-auto px-4 lg:px-0">
            {/* Custom Toast Notification */}
            {toastMsg && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
                    <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-2xl shadow-red-900/50 flex items-center font-bold text-sm tracking-wide border border-red-400">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {toastMsg}
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="text-center space-y-4 mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-600/20 blur-[100px] rounded-full pointer-events-none -mr-20"></div>
                
                <h2 className="text-6xl font-heading font-black text-white tracking-tighter italic">
                    INGREDIENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">AI</span>
                </h2>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">
                    Convert your fridge leftovers into a Michelin-star dining experience in seconds.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
                {/* Left: Inputs & Settings */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <IngredientInput 
                        onAdd={addIngredient} 
                        ingredients={ingredients} 
                        onRemove={removeIngredient}
                        onReset={resetIngredients}
                        isLoading={isLoading}
                        onError={triggerToast}
                    />

                    {/* Preference Card */}
                    <div className="bg-[#1C1612]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-[#2D241E] space-y-6 hover:border-[#3D3128] transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                 <div className="w-10 h-10 bg-amber-900/30 text-amber-500 rounded-2xl flex items-center justify-center font-heading font-black italic">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                 </div>
                                 <h4 className="text-xl font-heading font-black text-white tracking-tight">Catering Settings</h4>
                            </div>

                            {/* Language Toggle */}
                            <div className="flex bg-[#2D241E] rounded-xl p-1 shadow-inner border border-[#3D3128]">
                                <button 
                                    onClick={() => setPreferences(p => ({ ...p, language: 'English' }))}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all ${preferences.language === 'English' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
                                >
                                    EN
                                </button>
                                <button 
                                    onClick={() => setPreferences(p => ({ ...p, language: 'Tamil' }))}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all ${preferences.language === 'Tamil' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
                                >
                                    தமிழ்
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setPreferences(p => ({ ...p, spicy: !p.spicy }))}
                                className={`px-6 py-4 rounded-2xl text-xs font-heading font-black uppercase tracking-widest transition-all shadow-sm ${
                                    preferences.spicy ? 'bg-red-500 text-white shadow-red-900/50' : 'bg-[#2D241E] text-gray-500 hover:bg-gray-700'
                                }`}
                            >
                                🔥 Spicy
                            </button>
                            <button 
                                onClick={() => setPreferences(p => ({ ...p, healthy: !p.healthy }))}
                                className={`px-6 py-4 rounded-2xl text-xs font-heading font-black uppercase tracking-widest transition-all shadow-sm ${
                                    preferences.healthy ? 'bg-emerald-500 text-white shadow-emerald-900/50' : 'bg-[#2D241E] text-gray-500 hover:bg-gray-700'
                                }`}
                            >
                                🥗 Healthy
                            </button>
                        </div>

                        <div className="space-y-4">
                             <div className="relative">
                                 <select 
                                    className="w-full bg-[#2D241E] border-none rounded-2xl px-6 py-4 text-xs font-bold text-gray-300 outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner appearance-none no-scrollbar uppercase tracking-widest"
                                    onChange={(e) => setPreferences(p => ({ ...p, dietary: e.target.value }))}
                                 >
                                     <option value="">No Dietary Restriction</option>
                                     <option value="Vegetarian">Vegetarian</option>
                                     <option value="Non-Vegetarian">Non-Vegetarian</option>
                                     <option value="Vegan">Vegan</option>
                                     <option value="Ketogenic">Ketogenic</option>
                                 </select>
                                 <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                 </div>
                             </div>
                             
                             <div className="relative">
                                 <input 
                                    type="text" 
                                    placeholder="Budget (e.g. 50)"
                                    className="w-full bg-[#2D241E] border-none rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner placeholder:text-gray-600 uppercase tracking-widest"
                                    onChange={(e) => setPreferences(p => ({ ...p, budget: e.target.value }))}
                                 />
                                 <div className="absolute right-5 top-1/2 -translate-y-1/2 text-amber-500 font-heading font-black text-xs">$</div>
                             </div>
                        </div>

                        <button
                            onClick={generateTitles}
                            disabled={isLoading || ingredients.length === 0}
                            className="w-full py-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-heading font-black rounded-[2rem] shadow-2xl shadow-amber-900/40 hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-[0.3em] disabled:grayscale disabled:opacity-50 mt-4 flex items-center justify-center gap-3 overflow-hidden group border border-amber-400/20"
                        >
                            {isLoading && !titles ? (
                                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <div className="flex items-center gap-3 group-hover:gap-5 transition-all">
                                    <span>Cook with AI</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right: Recipe Result / Title Selection */}
                <div className="lg:col-span-12 xl:col-span-7">
                    
                    {/* Title Selector View */}
                    {titles && (
                        <div className="bg-[#1C1612]/60 backdrop-blur-3xl border border-[#2D241E] rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in slide-in-from-right-5">
                            <h3 className="text-3xl font-heading font-black text-white italic tracking-tighter mb-2">SELECT A <span className="text-amber-400">RECIPE</span></h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Generated {titles.length} fast ideas from your ingredients</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {titles.map((t, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => generateDetailedRecipe(t)}
                                        className="text-left bg-[#0D0B08]/40 border border-[#3D3128]/50 hover:border-amber-500 hover:bg-amber-500/10 p-5 rounded-2xl transition-all group flex items-center justify-between shadow-lg"
                                    >
                                        <span className="text-white font-bold group-hover:text-amber-300 transition-colors uppercase text-xs tracking-wider line-clamp-2">{t}</span>
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-amber-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                ))}
                            </div>
                            
                            {isLoading && (
                                <div className="mt-8 flex items-center justify-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                                    Generating full recipe instructions...
                                </div>
                            )}
                        </div>
                    )}
                    
                    {recipes && (
                        <RecipeDisplay recipes={recipes} isLoading={isLoading} />
                    )}
                    
                    {!recipes && !titles && !isLoading && (
                        <div className="bg-[#1C1612]/30 border-2 border-dashed border-[#2D241E] rounded-[3rem] p-20 flex flex-col items-center justify-center text-center opacity-80 min-h-[500px]">
                            <div className="w-24 h-24 bg-[#2D241E] rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-xl font-heading font-black text-gray-500 italic mb-2 tracking-tight">Your culinary canvas is blank</h3>
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-relaxed">Add ingredients on the left to start the magic engine</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub-Footer Branding */}
            <div className="pt-20 pb-10 flex flex-col items-center grayscale opacity-20 gap-2">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-500 rounded-lg flex items-center justify-center text-black">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
                    </div>
                    <span className="text-xs font-heading font-black tracking-widest text-white leading-none">AI POWERED KITCHEN v2.0</span>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-gray-300">Global Standards in Food Technology</p>
            </div>
        </div>
    );
};

export default IngredientAI;
