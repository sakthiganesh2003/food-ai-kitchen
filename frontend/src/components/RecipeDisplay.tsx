'use client';

import React, { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

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

interface RecipeProps {
    recipes: Recipe[] | null;
    isLoading: boolean;
}

const RecipeDisplay: React.FC<RecipeProps> = ({ recipes, isLoading }) => {
    // Interactive step tracker state mapped per recipe by index
    const [completedSteps, setCompletedSteps] = useState<Record<number, number[]>>({});
    
    // NEW PM FLOW: List titles -> User selects -> Details -> Mistake correction
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [mistakeText, setMistakeText] = useState("");
    const [aiCorrection, setAiCorrection] = useState("");
    const [isFixing, setIsFixing] = useState(false);

    // Reset when new recipes come in
    useEffect(() => {
        setSelectedIdx(null);
        setMistakeText("");
        setAiCorrection("");
        setCompletedSteps({});
    }, [recipes]);

    const toggleStep = (recipeIdx: number, stepIdx: number) => {
        const currentRecipeSteps = completedSteps[recipeIdx] || [];
        setCompletedSteps({
            ...completedSteps,
            [recipeIdx]: currentRecipeSteps.includes(stepIdx)
                ? currentRecipeSteps.filter(i => i !== stepIdx)
                : [...currentRecipeSteps, stepIdx]
        });
    };

    const handleFixMistake = async (recipeName: string) => {
        if (!mistakeText.trim()) return;
        setIsFixing(true);
        setAiCorrection("");
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: `I am cooking ${recipeName}. I made this mistake: ${mistakeText}. Please give me a very short, easy, detailed way to correct this mistake immediately. Keep it encouraging!`,
                    history: []
                })
            });
            const result = await response.json();
            if (result.success) {
                setAiCorrection(result.data.reply);
            } else {
                setAiCorrection("Don't worry! Try adding a bit of acid (like lemon or vinegar) if it's too sweet/salty, or a bit of water if it's too strong. The AI server couldn't connect, but you got this!");
            }
        } catch (e) {
            setAiCorrection("Don't worry! Try balancing the flavors with a bit of lemon juice, sugar, or water. The AI server couldn't connect, but you still got this!");
        } finally {
            setIsFixing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#1C1612]/60 backdrop-blur-3xl rounded-[3rem] p-16 shadow-2xl border border-[#2D241E] flex flex-col items-center justify-center animate-pulse min-h-[500px]">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl animate-spin shadow-2xl shadow-amber-900/40 mb-8 flex items-center justify-center text-white">
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-3xl font-heading font-black text-white mb-2 italic">Crafting your recipes...</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">AI Chef is mixing flavors</p>
            </div>
        );
    }

    if (!recipes || recipes.length === 0) return null;

    // View 1: List of Titles (User chooses one)
    if (selectedIdx === null) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading font-black text-white tracking-tight">Our Masterpieces</h2>
                    <p className="text-gray-500 font-medium mt-2">Choose a recipe title below to begin your cooking journey.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipes.map((recipe, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedIdx(idx)}
                            className="bg-[#1C1612]/80 backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl border border-[#2D241E] cursor-pointer transition-all hover:scale-[1.02] hover:border-amber-500/50 hover:shadow-amber-900/20 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-600/10 to-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                            
                            {recipe.isMock && (
                                <span className="absolute top-4 right-4 bg-red-500/20 text-red-500 text-[10px] font-heading font-black uppercase px-2 py-1 rounded-full border border-red-500/30 shadow-sm">Fallback API</span>
                            )}
                            
                            <h3 className="text-2xl font-heading font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-amber-400 transition-all">{recipe.recipeName}</h3>
                            
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">
                                <span className="flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{recipe.cookTime}</span>
                                <span>•</span>
                                <span className="flex items-center text-amber-500">{recipe.difficulty}</span>
                                <span>•</span>
                                <span>{recipe.calories}</span>
                            </div>
                            
                            <button className="w-full py-4 bg-[#2D241E] text-white text-xs font-heading font-black uppercase tracking-widest rounded-xl group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-600 transition-all shadow-md group-hover:shadow-amber-900/50">
                                View Recipe Steps
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // View 2: Detailed Easy Explanation & Mistake Correction
    const recipe = recipes[selectedIdx];
    return (
        <div className="bg-[#1C1612]/80 backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-[#2D241E] animate-in fade-in zoom-in-95 duration-500">
            {/* Header & Back Button */}
            <div className="p-6 bg-[#0D0B08]/40 border-b border-[#2D241E] flex justify-between items-center">
                <button 
                    onClick={() => setSelectedIdx(null)}
                    className="flex items-center text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em]"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Titles
                </button>
                <div className="flex gap-2">
                    {recipe.tags?.map((tag, i) => (
                        <span key={i} className="bg-[#2D241E] text-amber-400 text-[10px] font-heading font-black uppercase px-3 py-1.5 rounded-full border border-[#3D3128]">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-orange-900 to-amber-900 p-12 text-white overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-heading font-black tracking-tight leading-none mb-6">
                        {recipe.recipeName}
                    </h2>
                    <div className="flex flex-wrap gap-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-heading font-black uppercase tracking-widest opacity-60">Difficulty</span>
                            <span className="text-xl font-bold flex items-center mt-1 italic">{recipe.difficulty}</span>
                        </div>
                        <div className="flex flex-col">
                             <span className="text-[10px] font-heading font-black uppercase tracking-widest opacity-60">Total Time</span>
                             <span className="text-xl font-bold flex items-center mt-1 italic">{recipe.prepTime} + {recipe.cookTime}</span>
                        </div>
                        <div className="flex flex-col">
                             <span className="text-[10px] font-heading font-black uppercase tracking-widest opacity-60">Nutrition</span>
                             <span className="text-xl font-bold flex items-center mt-1 italic">{recipe.calories}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8 lg:p-12 grid grid-cols-1 xl:grid-cols-12 gap-12">
                
                {/* Ingredients */}
                <div className="xl:col-span-5 flex flex-col gap-8">
                    <div>
                        <h3 className="text-xl font-heading font-black text-white mb-6 border-b-2 border-[#2D241E] pb-4 flex items-center">
                            <span className="mr-4 text-amber-500">🧂</span> Required Ingredients
                        </h3>
                        <ul className="space-y-3">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-[#2D241E]/50 p-4 rounded-2xl border border-[#3D3128] hover:border-gray-600 transition-all">
                                    <span className="text-sm font-bold text-gray-200">{ing.item}</span>
                                    <span className="text-xs font-heading font-black text-amber-400 tracking-tighter italic uppercase">{ing.amount}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Steps & Mistake Fixer */}
                <div className="xl:col-span-7 flex flex-col gap-8">
                    <h3 className="text-xl font-heading font-black text-white mb-2 border-b-2 border-[#2D241E] pb-4 flex items-center">
                        <span className="mr-4 text-amber-500">👨‍🍳</span> Easy Explanation (Steps)
                    </h3>
                          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-11 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#3D3128] before:to-transparent">
                        {recipe.instructions.map((step, idx) => {
                            const recSteps = completedSteps[selectedIdx] || [];
                            const isCompleted = recSteps.includes(idx);
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => toggleStep(selectedIdx, idx)}
                                    className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group/step cursor-pointer py-6 transition-all ${
                                        isCompleted ? 'opacity-60 grayscale' : ''
                                    }`} 
                                >
                                    {/* Timeline Marker */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0D0B08] bg-[#1C1612] text-amber-500/60 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-heading font-black z-10 transition-all duration-300 group-hover/step:bg-amber-500/10 group-hover/step:text-amber-400 group-hover/step:border-amber-500/30">
                                        {isCompleted ? '✓' : idx + 1}
                                    </div>
                                    
                                    {/* Card */}
                                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl border shadow-lg transition-all ${isCompleted ? 'bg-[#2D241E]/40 border-[#2D241E]' : 'bg-[#2D241E] border-[#3D3128] hover:border-amber-500/50 hover:bg-[#2D241E]/80 hover:-translate-y-1'}`}>
                                        <p className={`text-base font-bold leading-relaxed ${isCompleted ? 'line-through' : 'text-gray-200'}`}>
                                            {step}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* MISTAKE CORRECTOR MODULE */}
                    <div className="mt-12 group relative">
                        {/* Animated Glow Backdrop */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-orange-600 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        
                        <div className="relative bg-[#1C1612]/80 backdrop-blur-3xl border border-[#3D3128]/50 rounded-[2.5rem] p-8 lg:p-10 overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                                        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-heading font-black text-white tracking-tight">AI Chef Rescue</h3>
                                        <p className="text-xs font-bold uppercase tracking-widest text-amber-400/80 mt-1">Made a mistake? Let's fix it instantly.</p>
                                    </div>
                                </div>
                                
                                <p className="text-sm font-medium text-gray-400 mb-8 max-w-lg leading-relaxed">
                                    Did you accidentally burn the garlic? Added 3 tablespoons of salt instead of teaspoons? Describe your culinary emergency below and I'll save your dish.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1 group/input">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-focus-within/input:opacity-30 transition duration-500"></div>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-5 text-gray-500 group-focus-within/input:text-amber-400 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </span>
                                            <input 
                                                type="text" 
                                                value={mistakeText}
                                                onChange={(e) => setMistakeText(e.target.value)}
                                                placeholder="e.g. I added way too much salt!" 
                                                className="w-full bg-[#0D0B08]/50 border border-[#3D3128]/50 rounded-2xl pl-12 pr-6 py-4 text-white text-sm outline-none placeholder:text-gray-600 transition-all font-bold backdrop-blur-xl"
                                                onKeyDown={(e) => {
                                                    if(e.key === 'Enter') handleFixMistake(recipe.recipeName);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleFixMistake(recipe.recipeName)}
                                        disabled={isFixing || !mistakeText.trim()}
                                        className="relative overflow-hidden px-8 py-4 bg-[#2D241E] hover:bg-gray-700 text-white font-heading font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:grayscale sm:w-auto w-full group/btn border border-[#3D3128]/50 hover:border-amber-500/50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isFixing ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Analyzing...
                                                </>
                                            ) : 'Fix It Now'}
                                        </span>
                                    </button>
                                </div>
                                
                                {aiCorrection && (
                                    <div className="mt-8 relative animate-in slide-in-from-bottom-5 fade-in duration-700">
                                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500 to-transparent"></div>
                                        <div className="pl-12 py-2">
                                            <div className="absolute left-[20px] top-4 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#d946ef]"></div>
                                            <h4 className="text-[10px] font-heading font-black uppercase tracking-[0.3em] text-amber-400 mb-3 bg-amber-500/10 inline-block px-3 py-1 rounded-full border border-amber-500/20">ChefMind Intelligence</h4>
                                            <p className="text-white font-medium text-base leading-relaxed bg-[#0D0B08]/20 p-5 rounded-2xl border border-[#3D3128]/50 shadow-inner backdrop-blur-sm">
                                                {aiCorrection}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* END MISTAKE CORRECTOR */}

                </div>
            </div>
        </div>
    );
};

export default RecipeDisplay;
