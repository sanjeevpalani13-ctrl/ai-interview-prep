import React, { useState, useEffect } from 'react';
import { STARStory } from '../types';
import {
  getSTARStories,
  saveSTARStory,
  deleteSTARStory,
} from '../services/storage';
import {
  Award,
  Plus,
  Trash2,
  Sparkles,
  Tag,
  BookOpen,
} from 'lucide-react';

export const StarBuilder: React.FC = () => {
  const [stories, setStories] = useState<STARStory[]>([]);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    const loaded = getSTARStories();
    setStories(loaded);
    if (loaded.length > 0) {
      loadStoryIntoForm(loaded[0]);
    }
  }, []);

  const loadStoryIntoForm = (story: STARStory) => {
    setActiveStoryId(story.id);
    setTitle(story.title);
    setSituation(story.situation);
    setTask(story.task);
    setAction(story.action);
    setResult(story.result);
    setTagsInput(story.tags.join(', '));
  };

  const handleCreateNew = () => {
    setActiveStoryId(null);
    setTitle('');
    setSituation('');
    setTask('');
    setAction('');
    setResult('');
    setTagsInput('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !situation.trim()) {
      alert('Please enter a title and situation.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const story: STARStory = {
      id: activeStoryId || `star-${Date.now()}`,
      title: title.trim(),
      situation: situation.trim(),
      task: task.trim(),
      action: action.trim(),
      result: result.trim(),
      tags,
      createdAt: new Date().toISOString(),
    };

    saveSTARStory(story);
    const updated = getSTARStories();
    setStories(updated);
    setActiveStoryId(story.id);
    alert('STAR story saved successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this STAR story?')) {
      deleteSTARStory(id);
      const updated = getSTARStories();
      setStories(updated);
      if (updated.length > 0) {
        loadStoryIntoForm(updated[0]);
      } else {
        handleCreateNew();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span>Behavioral Excellence Workshop</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          STAR Story Builder & Vault
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Craft, refine, and organize high-impact Situation-Task-Action-Result stories so you can confidently answer behavioral prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Saved Stories */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Saved Stories ({stories.length})</span>
            </span>

            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {stories.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No stories saved yet. Click "New" to craft one!
              </p>
            ) : (
              stories.map((s) => {
                const isActive = activeStoryId === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => loadStoryIntoForm(s)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-slate-900 line-clamp-1">
                        {s.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Interactive Editor */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>
                  {activeStoryId ? 'Edit STAR Story' : 'Draft New STAR Story'}
                </span>
              </h3>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Story
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Story Title / Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scaling Database Cluster under 300ms SLA"
                className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* S - Situation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="text-xs font-bold text-indigo-800 block">
                S - Situation (Context & Challenge)
              </label>
              <textarea
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Where were you? What was the context or problem statement?"
                className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>

            {/* T - Task */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="text-xs font-bold text-indigo-800 block">
                T - Task (Your Responsibility)
              </label>
              <textarea
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What was your specific role or milestone expectation?"
                className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            {/* A - Action */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="text-xs font-bold text-indigo-800 block">
                A - Action (Key Execution Steps)
              </label>
              <textarea
                rows={3}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="What precise tools, steps, or decisions did YOU execute?"
                className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            {/* R - Result */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="text-xs font-bold text-indigo-800 block">
                R - Result (Quantifiable Impact & Lessons)
              </label>
              <textarea
                rows={2}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="What metrics improved? % latency drop, $ saved, team feedback?"
                className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tags (comma-separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Performance, Leadership, Conflict Resolution, Cloud"
                className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
