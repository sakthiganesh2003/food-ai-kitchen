'use client';

import React, { useState } from 'react';

interface IngredientInputProps {
    onAdd: (ingredient: string) => void;
    ingredients: string[];
    onRemove: (index: number) => void;
    onReset: () => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ 
    onAdd, 
    ingredients, 
    onRemove, 
    onReset,
    isLoading,
    onError
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    const handleAddClick = () => {
        validateAndAdd(inputValue);
    };

    const validateAndAdd = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        
        // Validation: must be at least 2 characters, mostly letters (no strict numbers like "500")
        if (trimmed.length < 2) {
            onError("Ingredient name is too short.");
            return;
        }
        if (/^\d+$/.test(trimmed)) {
            onError("Numbers alone aren't ingredients. Add a name!");
            return;
        }
        if (/^[^a-zA-Z]+$/.test(trimmed)) {
            onError("Please enter a valid ingredient name.");
            return;
        }

        onAdd(trimmed);
        setInputValue('');
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 border border-gray-800 transition-all duration-500 hover:border-gray-700 flex flex-col gap-6 group">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-fuchsia-900/40">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1 group-hover:text-fuchsia-400 transition-colors">Pantry Stock</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">List my ingredients</p>
                    </div>
                </div>
                {ingredients.length > 0 && (
                    <button 
                        onClick={onReset}
                        className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 active:scale-90"
                        title="Clear Stock"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                )}
            </div>
            
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add ingredient... (e.g., Organic Eggs)"
                        disabled={isLoading}
                        className="w-full bg-black/40 border-2 border-gray-800 focus:border-fuchsia-500/50 focus:bg-gray-900 rounded-3xl px-7 py-5 text-sm font-bold transition-all outline-none text-white placeholder:text-gray-500 shadow-inner no-scrollbar"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest bg-fuchsia-500/10 px-2 py-1 rounded-lg">Enter ↵</span>
                    </div>
                </div>
                <button
                    onClick={handleAddClick}
                    disabled={isLoading || !inputValue.trim()}
                    className="px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-3xl shadow-xl shadow-fuchsia-900/30 hover:shadow-fuchsia-900/50 hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:grayscale disabled:opacity-50"
                >
                    Add
                </button>
            </div>

            <div className="flex flex-wrap gap-3 min-h-[40px]">
                {ingredients.length === 0 ? (
                    <div className="flex-1 py-4 flex flex-col items-center justify-center text-center opacity-40">
                         <svg className="w-10 h-10 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                         <p className="text-xs font-bold leading-relaxed uppercase tracking-widest text-gray-400">Inventory is empty.<br/>Tell me what's in your fridge!</p>
                    </div>
                ) : (
                    ingredients.map((ingredient, index) => (
                        <div 
                            key={index} 
                            className="group/chip flex items-center bg-gray-800 border border-gray-700 shadow-sm rounded-2xl px-5 py-3 animate-in zoom-in-50 duration-300 hover:border-fuchsia-500/50 hover:bg-gray-800 transition-all cursor-default"
                        >
                            <span className="text-xs font-black text-gray-200 uppercase tracking-wider">{ingredient}</span>
                            <button
                                onClick={() => onRemove(index)}
                                className="ml-4 w-5 h-5 rounded-full bg-gray-900 text-gray-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center group-hover/chip:rotate-90"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {ingredients.length > 0 && (
                <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 blur-[1px] animate-pulse"></span>
                        {ingredients.length} Stocked items ready for processing
                    </p>
                </div>
            )}
        </div>
    );
};

export default IngredientInput;
