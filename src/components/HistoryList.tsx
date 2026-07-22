import React, { useState, useEffect } from 'react';
import { InterviewSession } from '../types';
import { getSavedSessions, deleteSession } from '../services/storage';
import {
  History,
  Trash2,
  ChevronRight,
  Sparkles,
  Calendar,
  Award,
  Briefcase,
} from 'lucide-react';

interface HistoryListProps {
  onSelectSession: (session: InterviewSession) => void;
  onStartNew: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  onSelectSession,
  onStartNew,
}) => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    setSessions(getSavedSessions());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session record?')) {
      deleteSession(id);
      setSessions(getSavedSessions());
    }
  };

  const getRecColor = (rec?: string) => {
    switch (rec) {
      case 'Strong Hire':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hire':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Weak Pass':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-indigo-600" />
            <span>Past Interview Sessions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review past scores, feedback summaries, and candidate evaluations.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Start New Interview</span>
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No Past Sessions Saved
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Once you complete an interview session, your scorecard and evaluations will be archived here.
            </p>
          </div>
          <button
            onClick={onStartNew}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Create Your First Session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {session.config.role}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium capitalize">
                    {session.config.level}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span>•</span>
                  <span>{session.questions.length} Questions</span>
                  {session.config.companyName && (
                    <>
                      <span>•</span>
                      <span className="text-indigo-600 font-medium">
                        {session.config.companyName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {session.overallScore !== undefined ? (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold block">
                      Score
                    </span>
                    <span className="text-lg font-extrabold text-indigo-600">
                      {session.overallScore}%
                    </span>
                  </div>
                ) : (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">
                    In Progress
                  </span>
                )}

                {session.hiringRecommendation && (
                  <span
                    className={`text-xs px-3 py-1 rounded-lg border font-bold ${getRecColor(
                      session.hiringRecommendation
                    )}`}
                  >
                    {session.hiringRecommendation}
                  </span>
                )}

                <button
                  onClick={(e) => handleDelete(session.id, e)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
