import React from 'react';
import { Plus, List } from 'lucide-react';

export function ObjectiveInput({ value, onChange }) {
    return (
        <div className="card animate-fade-in stagger-1">
            <div className="flex items-center gap-2 mb-4">
                <List className="text-[var(--color-primary)]" size={24} />
                <h2 className="text-xl font-semibold text-[var(--color-text-main)]">Learning Objectives</h2>
            </div>

            <p className="text-[var(--color-text-dim)] mb-4 text-sm">
                Enter your learning objectives below. Place each objective on a new line.
            </p>

            <div className="relative">
                <textarea
                    className="input min-h-[150px] resize-y font-mono text-sm leading-relaxed"
                    placeholder="1. Understand the basics of neural networks...&#10;2. Analyze the ethical implications of AI..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-xs text-[var(--color-text-dim)] pointer-events-none">
                    {value ? value.split('\n').filter(line => line.trim()).length : 0} objectives
                </div>
            </div>
        </div>
    );
}
