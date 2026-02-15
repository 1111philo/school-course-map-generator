import React from 'react';
import { Table, Loader2 } from 'lucide-react';

export function ResultsTable({ results, isProcessing }) {
    if (results.length === 0 && !isProcessing) return null;

    return (
        <div className="card animate-fade-in stagger-3 mt-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Table className="text-[var(--color-primary)]" size={24} />
                    <h2 className="text-xl font-semibold text-[var(--color-text-main)]">Generated Curriculum</h2>
                </div>
                {isProcessing && (
                    <div className="flex items-center gap-2 text-[var(--color-secondary)] text-sm animate-pulse">
                        <Loader2 className="animate-spin" size={16} />
                        Processing...
                    </div>
                )}
            </div>

            <div className="table-container max-h-[600px] overflow-y-auto">
                <table>
                    <thead>
                        <tr>
                            <th className="w-1/6 min-w-[200px]">Learning Objective</th>
                            <th className="w-1/6 min-w-[200px]">Enduring Understanding</th>
                            <th className="w-1/6 min-w-[200px]">Essential Questions</th>
                            <th className="w-1/6 min-w-[200px]">Assessment Project</th>
                            <th className="w-1/6 min-w-[200px]">Mastery Criteria & Accommodations</th>
                            <th className="w-1/6 min-w-[200px]">Activities</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((row, index) => (
                            <tr key={index} className="animate-fade-in">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="text-sm leading-relaxed">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {results.length === 0 && isProcessing && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-[var(--color-text-dim)]">
                                    Generating your curriculum...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
