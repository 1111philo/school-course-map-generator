import React from 'react';
import { Bot } from 'lucide-react';
import { MODELS } from '../services/ai';

export function ModelSelector({ selectedModel, onSelect }) {
    return (
        <div className="card animate-fade-in stagger-2">
            <div className="flex items-center gap-2 mb-4">
                <Bot className="text-[var(--color-secondary)]" size={24} />
                <h2 className="text-xl font-semibold text-[var(--color-text-main)]">Select AI Model</h2>
            </div>

            <p className="text-[var(--color-text-dim)] mb-4 text-sm">
                Choose the Google AI model to generate your curriculum.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 is-mobile-col">
                {MODELS.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => onSelect(model.id)}
                        className={`
              relative flex items-center p-4 rounded-xl border transition-all text-left group
              ${selectedModel === model.id
                                ? 'border-[var(--color-primary)] bg-[rgba(139,92,246,0.15)] shadow-glow ring-1 ring-[var(--color-primary)]'
                                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)]'
                            }
            `}
                    >
                        <div className={`
              w-5 h-5 rounded-full border mr-3 flex items-center justify-center transition-colors
              ${selectedModel === model.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-text-dim)]'}
            `}>
                            {selectedModel === model.id && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className={selectedModel === model.id ? 'text-[var(--color-text-main)] font-semibold' : 'text-[var(--color-text-dim)]'}>
                                {model.name}
                            </span>
                            {selectedModel === model.id && (
                                <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-primary)] mt-0.5">
                                    Active Model
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
