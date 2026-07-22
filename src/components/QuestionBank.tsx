import React, { useState } from 'react';
import { CheatSheet } from '../types';
import { generateCheatSheet } from '../services/api';
import {
  BookOpen,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Zap,
} from 'lucide-react';

export const QuestionBank: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Senior React & Frontend Engineer');
  const [targetLevel, setTargetLevel] = useState('Senior');
  const [cheatSheet, setCheatSheet] = useState<CheatSheet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setIsLoading(true);
    try {
      const result = await generateCheatSheet(targetRole, targetLevel);
      setCheatSheet(result);
    } catch (err: any) {
      alert('Error generating cheat sheet: ' + (err.message || 'Server error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySnippet = (snippet: string, idx: number) => {
    navigator.clipboard.writeText(snippet);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Role-Specific Prep Guide & Flashcards</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Interview Cheat Sheet Generator
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Instantly generate high-frequency questions, ideal model answer snippets, core concept overviews, and pitfall warnings for any job title.
        </p>
      </div>

      {/* Role Input Form */}
      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Target Role Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, DevOps, Product Manager"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Seniority
            </label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead / Staff</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Tailored Prep Cheat Sheet...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Role Cheat Sheet</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Cheat Sheet Display */}
      {cheatSheet && (
        <div className="space-y-8 animate-fadeIn">
          {/* Overview Header */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-2">
            <h2 className="text-xl font-extrabold text-indigo-300">
              {cheatSheet.role} Prep Overview
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {cheatSheet.overview}
            </p>
          </div>

          {/* Top High-Frequency Questions */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
              <span>Top High-Frequency Questions & Model Snippets</span>
            </h3>

            <div className="space-y-4">
              {cheatSheet.topQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                        {item.category}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {item.question}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleCopySnippet(item.idealAnswerSnippet, idx)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Copy Answer Snippet"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Key Points & Pitfalls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
                      <span className="font-bold text-emerald-900 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Key Points to Cover:</span>
                      </span>
                      <ul className="space-y-1 text-emerald-950">
                        {item.keyPoints.map((kp, kIdx) => (
                          <li key={kIdx}>• {kp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1">
                      <span className="font-bold text-rose-900 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Common Pitfalls to Avoid:</span>
                      </span>
                      <ul className="space-y-1 text-rose-950">
                        {item.commonPitfalls.map((pf, pIdx) => (
                          <li key={pIdx}>• {pf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ideal Snippet */}
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono">
                    <span className="text-indigo-400 font-bold block mb-1">
                      Model Answer Snippet:
                    </span>
                    <p className="whitespace-pre-wrap">{item.idealAnswerSnippet}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Concepts Grid & Behavioral Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Concepts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Core Concepts to Master
              </h3>
              <div className="space-y-3">
                {cheatSheet.keyConcepts.map((kc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <span className="font-bold text-indigo-700 block">
                      {kc.topic}
                    </span>
                    <p className="text-slate-600 leading-relaxed">{kc.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral Tips */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Communication & Behavioral Strategy Tips
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {cheatSheet.behavioralTips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start space-x-2 text-indigo-950"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
