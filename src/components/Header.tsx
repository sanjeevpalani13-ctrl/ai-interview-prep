import React from 'react';
import {
  Sparkles,
  BookOpen,
  Award,
  History,
  Briefcase,
  Volume2,
  VolumeX,
} from 'lucide-react';

export type AppTab = 'setup' | 'cheatsheet' | 'star' | 'history';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  hasActiveSession: boolean;
  onReturnToActiveSession: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasActiveSession,
  onReturnToActiveSession,
  soundEnabled,
  setSoundEnabled,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('setup')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  AI Interview Generator
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tailored Mock Practice & Real-time AI Evaluation
              </p>
            </div>
          </div>

          {/* Center Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              id="nav-btn-setup"
              onClick={() => setActiveTab('setup')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'setup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>New Interview</span>
            </button>

            <button
              id="nav-btn-cheatsheet"
              onClick={() => setActiveTab('cheatsheet')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'cheatsheet'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Prep & Cheat Sheets</span>
            </button>

            <button
              id="nav-btn-star"
              onClick={() => setActiveTab('star')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'star'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>STAR Stories</span>
            </button>

            <button
              id="nav-btn-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Past Sessions</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {hasActiveSession && (
              <button
                id="btn-resume-session"
                onClick={onReturnToActiveSession}
                className="animate-pulse flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
                <span>Active Simulator</span>
              </button>
            )}

            <button
              id="btn-toggle-sound"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Speech audio enabled' : 'Speech audio muted'}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-800 py-2 text-xs overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'setup' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            New Interview
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'cheatsheet' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            Cheat Sheets
          </button>
          <button
            onClick={() => setActiveTab('star')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'star' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            STAR Stories
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
};
