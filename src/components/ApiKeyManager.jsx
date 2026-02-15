import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';

export function ApiKeyManager() {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('google_ai_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            setIsSaved(true);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('google_ai_api_key', apiKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="card animate-fade-in stagger-3 mt-6">
            <div className="flex items-center gap-2 mb-4">
                <Key className="text-[var(--color-primary)]" size={20} />
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">Google AI API Key</h2>
            </div>

            <p className="text-[var(--color-text-dim)] mb-4 text-xs">
                Your API key is stored locally in your browser and never sent elsewhere except to Google AI.
            </p>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type={showKey ? "text" : "password"}
                        className="input pr-10 text-sm"
                        placeholder="Enter your API Key..."
                        value={apiKey}
                        onChange={(e) => {
                            setApiKey(e.target.value);
                            setIsSaved(false);
                        }}
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-[var(--color-text-main)] transition-colors"
                    >
                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className={`btn ${isSaved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'btn-primary'} px-3`}
                    title="Save to Local Storage"
                >
                    {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                </button>
            </div>

            {!apiKey && (
                <p className="mt-2 text-[10px] text-red-400/80 italic">
                    Required to generate curriculum. Get one at aistudio.google.com
                </p>
            )}
        </div>
    );
}
