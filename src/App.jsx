import React, { useState } from 'react';
import { ObjectiveInput } from './components/ObjectiveInput';
import { ModelSelector } from './components/ModelSelector';
import { ResultsTable } from './components/ResultsTable';
import { CsvDownloader } from './components/CsvDownloader';
import { ApiKeyManager } from './components/ApiKeyManager';
import { generateCurriculum } from './services/ai';
import { parseCSVRow } from './utils/csv';
import { Sparkles, BookOpen } from 'lucide-react';

function App() {
  const [objectives, setObjectives] = useState('');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    const objectiveList = objectives.split('\n').filter(line => line.trim().length > 0);

    if (objectiveList.length === 0) {
      setError("Please enter at least one learning objective.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults([]); // Clear previous results or append? Let's clear for now or simple append logic?
    // Project requirement says "process the response for each into a row". 
    // It's better to show progress as we go.

    const newResults = [];

    try {
      for (const obj of objectiveList) {
        try {
          const storedKey = localStorage.getItem('google_ai_api_key');
          const csvText = await generateCurriculum(model, obj, storedKey);
          const parsedRow = parseCSVRow(csvText);

          if (parsedRow && parsedRow.length > 0) {
            newResults.push(parsedRow);
            // Update state incrementally to show progress
            setResults(prev => [...prev, parsedRow]);
          }
        } catch (err) {
          console.error(`Failed to generate for: ${obj}`, err);
          // Optional: Add an error row or skip
          // newResults.push([obj, "Error generating content", "", "", "", ""]);
          // setResults(prev => [...prev, [obj, "Error", "", "", "", ""]]);
        }
      }
    } catch (generalError) {
      setError("An unexpected error occurred. Please check your API key and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] pb-20">
      <header className="border-b border-[var(--color-border)] bg-[rgba(15,15,17,0.8)] backdrop-blur-md sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-glow">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--color-text-dim)]">
              AI Curriculum Generator
            </h1>
          </div>
          <div className="text-sm text-[var(--color-text-dim)] hidden sm:block">
            Powered by Google Gemini
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ObjectiveInput value={objectives} onChange={setObjectives} />

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !objectives.trim()}
              className={`
                w-full btn btn-primary text-lg py-4 shadow-lg
                ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}
              `}
            >
              {isProcessing ? (
                <>
                  <BookOpen className="animate-pulse" />
                  Generating Curriculum...
                </>
              ) : (
                <>
                  <Sparkles />
                  Generate Curriculum
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-1">
            <ModelSelector selectedModel={model} onSelect={setModel} />

            <ApiKeyManager />

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm animate-fade-in">
                {error}
              </div>
            )}
          </div>
        </div>

        <ResultsTable results={results} isProcessing={isProcessing} />
      </main>

      <CsvDownloader results={results} />
    </div>
  );
}

export default App;
