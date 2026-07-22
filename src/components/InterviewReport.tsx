import React, { useState } from 'react';
import { InterviewSession } from '../types';
import {
  Award,
  CheckCircle2,
  Sparkles,
  Printer,
  Copy,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Check,
  TrendingUp,
} from 'lucide-react';

interface InterviewReportProps {
  session: InterviewSession;
  onRestart: () => void;
}

export const InterviewReport: React.FC<InterviewReportProps> = ({
  session,
  onRestart,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    session.questions[0]?.id || null
  );
  const [copied, setCopied] = useState(false);

  const getRecBadge = (rec?: string) => {
    switch (rec) {
      case 'Strong Hire':
        return 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20';
      case 'Hire':
        return 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20';
      case 'Weak Pass':
        return 'bg-amber-500 text-white border-amber-400';
      default:
        return 'bg-rose-600 text-white border-rose-500';
    }
  };

  const handleCopySummary = () => {
    const text = `AI Interview Scorecard for ${session.config.role} (${session.config.level}):
Overall Score: ${session.overallScore || 0}%
Hiring Recommendation: ${session.hiringRecommendation || 'N/A'}

Executive Feedback:
${session.summaryFeedback || 'N/A'}

Key Takeaways:
${session.keyTakeaways?.map((t) => '• ' + t).join('\n') || ''}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Printable / Viewable Executive Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Comprehensive Interview Scorecard
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {session.config.role}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 capitalize">
              Level: <strong className="text-slate-200">{session.config.level}</strong> | Type:{' '}
              <strong className="text-slate-200">{session.config.type}</strong>
              {session.config.companyName && (
                <span>
                  {' '}
                  | Target Company: <strong className="text-indigo-300">{session.config.companyName}</strong>
                </span>
              )}
            </p>
          </div>

          {/* Overall Score & Hiring Badge */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                Overall Rating
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
                {session.overallScore || 0}%
              </span>
            </div>

            <div
              className={`px-4 py-2.5 rounded-2xl border text-sm font-extrabold tracking-wide uppercase ${getRecBadge(
                session.hiringRecommendation
              )}`}
            >
              {session.hiringRecommendation || 'Evaluated'}
            </div>
          </div>
        </div>

        {/* Executive Feedback Paragraph */}
        {session.summaryFeedback && (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-1">
            <span className="font-bold text-indigo-300 flex items-center space-x-1.5 uppercase text-xs">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Executive Synthesis</span>
            </span>
            <p>{session.summaryFeedback}</p>
          </div>
        )}

        {/* Top Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>

          <button
            onClick={onRestart}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>

      {/* Skills Matrix & Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Breakdown */}
        {session.skillBreakdown && session.skillBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Skill Matrix Evaluation</span>
            </h3>

            <div className="space-y-3">
              {session.skillBreakdown.map((sb, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sb.skill}</span>
                    <span className="font-bold text-indigo-600">{sb.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${sb.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 italic">{sb.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Takeaways & Study Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Actionable Growth Plan</span>
          </h3>

          {session.keyTakeaways && session.keyTakeaways.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase block">
                Key Strategic Takeaways:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {session.keyTakeaways.map((t, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {session.recommendedStudyTopics && session.recommendedStudyTopics.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase block">
                Recommended Study Topics:
              </span>
              <div className="flex flex-wrap gap-2">
                {session.recommendedStudyTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium"
                  >
                    📖 {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Question-by-Question Accordion Review */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Detailed Q&A Review ({session.questions.length})</span>
        </h3>

        <div className="space-y-3">
          {session.questions.map((q, idx) => {
            const userAns = session.answers[q.id];
            const evalResult = session.evaluations[q.id];
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
              >
                {/* Question Bar Header */}
                <div
                  onClick={() =>
                    setExpandedQuestionId(isExpanded ? null : q.id)
                  }
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {q.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 capitalize">
                        {q.category} • {q.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {evalResult && (
                      <span className="text-xs font-bold text-indigo-600 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg">
                        {evalResult.score}%
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50/70 border-t border-slate-200 space-y-4 text-xs sm:text-sm text-slate-800">
                    {/* Prompt */}
                    <div>
                      <span className="font-bold text-slate-700 text-xs uppercase block mb-1">
                        Prompt:
                      </span>
                      <p className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                        {q.prompt}
                      </p>
                    </div>

                    {/* Candidate Answer */}
                    <div>
                      <span className="font-bold text-slate-700 text-xs uppercase block mb-1">
                        Candidate Answer:
                      </span>
                      <p className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap">
                        {userAns?.answerText || 'No answer submitted'}
                      </p>
                    </div>

                    {/* Feedback */}
                    {evalResult && (
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-xs text-indigo-950">
                          <span className="font-bold text-indigo-900 block mb-0.5">
                            AI Feedback:
                          </span>
                          {evalResult.detailedFeedback}
                        </div>

                        {/* Model Answer */}
                        <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono whitespace-pre-wrap">
                          <span className="font-bold text-indigo-400 block mb-1">
                            Model Exemplar Answer:
                          </span>
                          {evalResult.modelAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
