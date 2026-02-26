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
                            <th className="min-w-[250px]">Learning Objective</th>
                            <th className="min-w-[200px]">Competencies</th>
                            <th className="min-w-[200px]">Enduring Understandings</th>
                            <th className="min-w-[200px]">Essential Questions</th>
                            <th className="min-w-[300px]">Assessments</th>
                            <th className="min-w-[250px]">Mastery Criteria</th>
                            <th className="min-w-[250px]">UDL Accommodations</th>
                            <th className="min-w-[300px]">Activities</th>
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
                                <td colSpan="8" className="text-center py-8 text-[var(--color-text-dim)]">
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
