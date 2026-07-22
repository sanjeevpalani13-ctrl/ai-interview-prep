import React, { useState } from 'react';
import {
  InterviewConfig,
  ExperienceLevel,
  InterviewType,
} from '../types';
import { analyzeJDAndResume } from '../services/api';
import {
  Briefcase,
  Sparkles,
  Layers,
  Award,
  FileText,
  Sliders,
  Plus,
  X,
  Loader2,
  Building2,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
  isLoading: boolean;
}

const POPULAR_ROLES = [
  'Senior Frontend Engineer (React/TypeScript)',
  'Full Stack Software Engineer',
  'Senior Backend Engineer (Node/Go/Python)',
  'AI / Machine Learning Engineer',
  'Staff Systems & Cloud Architect',
  'Product Manager (Tech & Growth)',
  'Data Engineer & Analytics Specialist',
  'DevOps & Infrastructure Engineer',
  'Behavioral & Leadership Generalist',
];

const SUGGESTED_SKILLS: Record<string, string[]> = {
  Frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Web Performance', 'System Architecture', 'Testing (Jest/Cypress)'],
  Backend: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Microservices', 'GraphQL', 'System Design'],
  AI: ['Gemini API', 'LLMs', 'PyTorch', 'Vector Databases', 'Prompt Engineering', 'LangChain'],
  Product: ['Product Strategy', 'A/B Testing', 'User Retention', 'Roadmapping', 'Agile / Scrum'],
  General: ['Communication', 'Conflict Resolution', 'Project Delivery', 'Mentorship', 'STAR Method'],
};

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  onStartInterview,
  isLoading,
}) => {
  const [role, setRole] = useState('Senior Frontend Engineer (React/TypeScript)');
  const [level, setLevel] = useState<ExperienceLevel>('senior');
  const [type, setType] = useState<InterviewType>('mixed');
  const [skills, setSkills] = useState<string[]>([
    'React',
    'TypeScript',
    'Web Performance',
    'System Design',
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [companyName, setCompanyName] = useState('');
  const [focusAreas, setFocusAreas] = useState('');

  // Auto-fill extracted from JD / Resume
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSuccess, setAnalysisSuccess] = useState(false);
  const [showDocAnalysis, setShowDocAnalysis] = useState(false);

  const handleAddSkill = (skillToAdd?: string) => {
    const target = (skillToAdd || newSkill).trim();
    if (target && !skills.includes(target)) {
      setSkills([...skills, target]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAnalyzeDoc = async () => {
    if (!jobDescription.trim() && !resumeText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisSuccess(false);

    try {
      const extracted = await analyzeJDAndResume(jobDescription, resumeText);
      if (extracted.role) setRole(extracted.role);
      if (extracted.level) setLevel(extracted.level);
      if (extracted.skills && extracted.skills.length > 0) {
        // Merge skills
        const merged = Array.from(new Set([...skills, ...extracted.skills]));
        setSkills(merged);
      }
      if (extracted.focusAreas) setFocusAreas(extracted.focusAreas);
      if (extracted.companyName && extracted.companyName !== 'N/A') {
        setCompanyName(extracted.companyName);
      }
      setAnalysisSuccess(true);
    } catch (err: any) {
      alert('Analysis error: ' + (err.message || 'Failed to parse text.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      alert('Please enter a target role.');
      return;
    }

    onStartInterview({
      role: role.trim(),
      level,
      type,
      skills,
      questionCount,
      jobDescription: jobDescription.trim() || undefined,
      resumeText: resumeText.trim() || undefined,
      companyName: companyName.trim() || undefined,
      focusAreas: focusAreas.trim() || undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Intro Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tailored AI Practice Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          Generate realistic, role-tailored technical and behavioral questions with voice & text practice, instant scoring, and expert model answers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Role Selection & Custom Input */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Target Role / Position</span>
            </label>
            <span className="text-xs text-slate-500">Customizable</span>
          </div>

          <div className="relative">
            <input
              id="input-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead React Developer, Staff Backend Architect, Product Manager"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
              required
            />
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block mb-2">
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ROLES.map((popularRole) => (
                <button
                  key={popularRole}
                  type="button"
                  onClick={() => setRole(popularRole)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    role === popularRole
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {popularRole}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Level & Interview Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience Level */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Experience Level</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  { id: 'entry', label: 'Entry Level', desc: '0 - 2 years experience' },
                  { id: 'mid', label: 'Mid Level', desc: '2 - 5 years experience' },
                  { id: 'senior', label: 'Senior', desc: '5 - 8 years experience' },
                  { id: 'lead', label: 'Lead / Staff', desc: '8+ years & system leadership' },
                  { id: 'executive', label: 'Executive / Director', desc: 'Org strategy & management' },
                ] as const
              ).map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    level === lvl.id
                      ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-sm">{lvl.label}</div>
                    <div className="text-xs text-slate-500 font-normal">{lvl.desc}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      level === lvl.id
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {level === lvl.id && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Type & Questions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-3">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Interview Focus Type</span>
              </label>
              <div className="space-y-2">
                {(
                  [
                    { id: 'mixed', label: 'Mixed (Recommended)', desc: 'Balanced technical & behavioral questions' },
                    { id: 'technical', label: 'Technical Depth', desc: 'Coding logic, frameworks & debugging' },
                    { id: 'system-design', label: 'System Design & Architecture', desc: 'Scalability, API design, tradeoff tradeoffs' },
                    { id: 'behavioral', label: 'Behavioral & STAR Method', desc: 'Conflict, leadership, failure recovery stories' },
                    { id: 'culture-fit', label: 'Culture & Executive Fit', desc: 'Values, team alignment, vision' },
                  ] as const
                ).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      type === t.id
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-sm">{t.label}</div>
                      <div className="text-xs text-slate-500 font-normal">{t.desc}</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        type === t.id
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {type === t.id && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Count & Company */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Number of Questions
                </label>
                <div className="flex space-x-2">
                  {[3, 5, 7, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        questionCount === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Company Name (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Stripe, Meta, Acme Corp"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Skills Tag Input */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Key Skills & Tech Stack to Test</span>
          </label>

          {/* Active Skill Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-indigo-400 hover:text-indigo-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Skill Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type skill (e.g. GraphQL, AWS, Microservices) and press Enter"
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Recommended Skill Chips */}
          <div className="pt-2">
            <span className="text-xs text-slate-500 block mb-1.5">
              Click to add recommended tags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'React',
                'TypeScript',
                'Node.js',
                'System Design',
                'Web Performance',
                'PostgreSQL',
                'AWS',
                'Docker',
                'STAR Method',
                'Conflict Resolution',
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  disabled={skills.includes(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    skills.includes(s)
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                      : 'bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Document Auto-Extract Accordion */}
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-2xl border border-indigo-100/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Smart Auto-Fill from Job Description / Resume
                </h3>
                <p className="text-xs text-slate-500">
                  Paste target job description or your resume to tailor exact questions.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDocAnalysis(!showDocAnalysis)}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              {showDocAnalysis ? 'Hide Document Inputs' : 'Expand Inputs'}
            </button>
          </div>

          {showDocAnalysis && (
            <div className="space-y-4 pt-2 border-t border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Job Description / Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job post requirements here..."
                    className="w-full p-3 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Candidate Resume / Bio Summary
                  </label>
                  <textarea
                    rows={4}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste key experience bullet points or resume text..."
                    className="w-full p-3 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleAnalyzeDoc}
                  disabled={isAnalyzing || (!jobDescription.trim() && !resumeText.trim())}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting Key Parameters...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Extract Parameters</span>
                    </>
                  )}
                </button>

                {analysisSuccess && (
                  <span className="flex items-center space-x-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Auto-extracted role & skill parameters!</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            id="btn-generate-interview"
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting Customized Interview Set...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate & Start Mock Interview</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
