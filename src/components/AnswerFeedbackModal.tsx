import React, { useState } from 'react';
import { QuestionEvaluation, Question } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  X,
  ThumbsUp,
  Target,
  MessageSquare,
} from 'lucide-react';

interface AnswerFeedbackModalProps {
  question: Question;
  evaluation: QuestionEvaluation;
  onClose: () => void;
  onNextQuestion?: () => void;
  hasNextQuestion: boolean;
}

export const AnswerFeedbackModal: React.FC<AnswerFeedbackModalProps> = ({
  question,
  evaluation,
  onClose,
  onNextQuestion,
  hasNextQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'modelAnswer'>('feedback');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                Question Answer Evaluation
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                {question.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Badges Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              Overall Score
            </span>
            <span className={`text-xl font-extrabold block mt-0.5 ${getScoreColor(evaluation.score).split(' ')[0]}`}>
              {evaluation.score}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              Clarity & Tone
            </span>
            <span className="text-xl font-extrabold text-slate-800 block mt-0.5">
              {evaluation.clarityScore}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              Technical Depth
            </span>
            <span className="text-xl font-extrabold text-slate-800 block mt-0.5">
              {evaluation.technicalScore}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              Completeness
            </span>
            <span className="text-xl font-extrabold text-slate-800 block mt-0.5">
              {evaluation.completenessScore}%
            </span>
          </div>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs font-bold">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3 px-4 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'feedback'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Feedback & Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('modelAnswer')}
            className={`py-3 px-4 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'modelAnswer'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Exemplar Model Answer</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {activeTab === 'feedback' ? (
            <>
              {/* Detailed Paragraph Feedback */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-950 text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-indigo-900 block mb-1">
                  Executive Assessment:
                </span>
                {evaluation.detailedFeedback}
              </div>

              {/* Strengths & Improvements Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5 uppercase">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>Key Strengths</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {evaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5 uppercase">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Areas for Improvement</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {evaluation.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Key Topics Warning */}
              {evaluation.missingKeyTopics && evaluation.missingKeyTopics.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block uppercase">
                    Topics Missed or Worth Adding:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.missingKeyTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 font-medium"
                      >
                        ⚠️ {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Question Preview */}
              {evaluation.suggestedFollowUpQuestion && (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-950 space-y-1">
                  <span className="text-xs font-bold text-purple-900 flex items-center space-x-1.5 uppercase">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <span>Likely Interviewer Follow-up:</span>
                  </span>
                  <p className="text-xs italic text-purple-900">
                    "{evaluation.suggestedFollowUpQuestion}"
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Model Exemplar Answer Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Target Exemplar Response Outline
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
                  {evaluation.modelAnswer}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Review Question Detail
          </button>

          {hasNextQuestion && onNextQuestion ? (
            <button
              onClick={() => {
                onClose();
                onNextQuestion();
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Back to Session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
