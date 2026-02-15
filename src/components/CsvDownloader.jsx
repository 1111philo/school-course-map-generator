import React from 'react';
import { Download } from 'lucide-react';
import { generateCSV } from '../utils/csv';

export function CsvDownloader({ results }) {
    if (results.length === 0) return null;

    const handleDownload = () => {
        // Defined headers based on the prompt requirements
        const headers = [
            "Learning Objective / Competency",
            "Enduring Understanding",
            "Essential Questions",
            "Assessment Project Check Bloom's & Webb's",
            "Mastery Criteria / Success Metrics UDL Accommodations",
            "Activities"
        ];

        const csvContent = generateCSV(headers, results);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'curriculum_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed bottom-8 right-8 animate-fade-in z-50">
            <button
                onClick={handleDownload}
                className="btn btn-primary shadow-lg hover:shadow-glow transform hover:scale-105 transition-all"
            >
                <Download size={20} />
                Download CSV
            </button>
        </div>
    );
}
