import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper for Gemini AI client initialization
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AQ.Ab8RN6ITrFXsMbiXy1Ll_hgQytNb-VSSjn3l2H0KfpqAQAjKWw' || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({ apiKey });
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Analyze Job Description & Resume
app.post('/api/analyze-jd-resume', async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    if (!jobDescription && !resumeText) {
      return res.status(400).json({ error: 'Please provide a Job Description or Resume.' });
    }

    const ai = getGeminiClient();
    const prompt = `Analyze the following Job Description and/or Resume to extract interview parameters.
Job Description:
${jobDescription || 'N/A'}

Resume:
${resumeText || 'N/A'}

Provide:
1. Suggested Job Title/Role
2. Detected Experience Level (entry, mid, senior, lead, executive)
3. Key Skills & Tech Stack required (array of strings)
4. Key Focus Areas or Topics for interview questions
5. Detected Company Name (or N/A if not mentioned)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            level: { type: Type.STRING, enum: ['entry', 'mid', 'senior', 'lead', 'executive'] },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            focusAreas: { type: Type.STRING },
            companyName: { type: Type.STRING },
          },
          required: ['role', 'level', 'skills', 'focusAreas'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Failed to analyze document.');
    }

    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/analyze-jd-resume:', err);
    return res.status(500).json({ error: err.message || 'Server error analyzing document' });
  }
});

// 2. Generate Customized Interview Questions
app.post('/api/generate-interview', async (req, res) => {
  try {
    const { config } = req.body;
    if (!config || !config.role) {
      return res.status(400).json({ error: 'Missing interview configuration.' });
    }

    const ai = getGeminiClient();
    const prompt = `You are a Principal Technical & Executive Recruiter at a top tech enterprise.
Generate a realistic, high-quality interview set tailored to this position:

Role: ${config.role}
Level: ${config.level}
Interview Type: ${config.type}
Required Skills/Tech: ${config.skills?.join(', ') || 'General'}
Number of Questions: ${config.questionCount || 5}
Company Context: ${config.companyName || 'Standard Industry Leader'}
Focus Areas: ${config.focusAreas || 'Comprehensive'}
Target Job Description Context: ${config.jobDescription || 'None provided'}
Candidate Resume Context: ${config.resumeText || 'None provided'}

Guidelines for Questions:
- Make questions realistic, clear, and relevant to the candidate's target role level (${config.level}).
- For technical questions, test real problem-solving, architectural design, or debugging rather than pure trivia memorization.
- For behavioral questions, target STAR method situational scenarios (conflict resolution, leadership, failure recovery, execution).
- Include 2-3 helpful hints per question that guide candidates without giving away the full answer.
- Provide a clear ideal answer outline so evaluation can be precise.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['technical', 'behavioral', 'system-design', 'culture-fit'] },
                  difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] },
                  prompt: { type: Type.STRING },
                  context: { type: Type.STRING },
                  keyTopicsToCover: { type: Type.ARRAY, items: { type: Type.STRING } },
                  timeLimitMinutes: { type: Type.NUMBER },
                  hints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  idealAnswerOutline: { type: Type.STRING },
                },
                required: [
                  'id',
                  'title',
                  'category',
                  'difficulty',
                  'prompt',
                  'keyTopicsToCover',
                  'timeLimitMinutes',
                  'hints',
                  'idealAnswerOutline',
                ],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Failed to generate interview questions.');
    }

    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/generate-interview:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate interview.' });
  }
});

// 3. Evaluate Single Answer
app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, answerText, timeTakenSeconds, config } = req.body;
    if (!question || !answerText) {
      return res.status(400).json({ error: 'Missing question or candidate answer.' });
    }

    const ai = getGeminiClient();
    const prompt = `You are an expert interviewer evaluating a candidate's response.

Target Role: ${config?.role || 'Professional'} (${config?.level || 'Mid-Level'})
Question Category: ${question.category}
Difficulty: ${question.difficulty}
Question Title: ${question.title}
Question Prompt: "${question.prompt}"
Key Topics Expected: ${question.keyTopicsToCover?.join(', ')}
Ideal Answer Outline: "${question.idealAnswerOutline}"

Candidate Answer:
"${answerText}"

Time Taken: ${timeTakenSeconds || 60} seconds.

Evaluate the answer objectively:
1. Overall Score (0-100)
2. Clarity & Communication Score (0-100)
3. Technical/Analytical Score (0-100)
4. Completeness Score (0-100)
5. STAR Structure Score (0-100, if behavioral or situational)
6. List 2-4 Specific Strengths demonstrated
7. List 2-4 Concrete Areas for Improvement
8. List any missing key topics that should have been mentioned
9. Provide detailed, constructive feedback paragraph
10. Provide a model "Gold Standard" exemplar answer tailored to this exact question and level.
11. Suggest an insightful follow-up question an interviewer might ask next based on this response.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            clarityScore: { type: Type.NUMBER },
            technicalScore: { type: Type.NUMBER },
            completenessScore: { type: Type.NUMBER },
            starStructureScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedFeedback: { type: Type.STRING },
            modelAnswer: { type: Type.STRING },
            suggestedFollowUpQuestion: { type: Type.STRING },
          },
          required: [
            'score',
            'clarityScore',
            'technicalScore',
            'completenessScore',
            'strengths',
            'improvements',
            'missingKeyTopics',
            'detailedFeedback',
            'modelAnswer',
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Failed to evaluate answer.');
    }

    const evaluation = JSON.parse(resultText);
    evaluation.questionId = question.id;
    return res.json(evaluation);
  } catch (err: any) {
    console.error('Error in /api/evaluate-answer:', err);
    return res.status(500).json({ error: err.message || 'Failed to evaluate answer.' });
  }
});

// 4. Finalize Full Interview Session & Hiring Summary
app.post('/api/finalize-interview', async (req, res) => {
  try {
    const { config, questions, evaluations } = req.body;
    if (!config || !questions || !evaluations) {
      return res.status(400).json({ error: 'Missing session data for summary.' });
    }

    const ai = getGeminiClient();
    const prompt = `Synthesize a full Interview Final Evaluation and Hiring Recommendation.

Candidate Role: ${config.role}
Level: ${config.level}
Interview Type: ${config.type}
Evaluations Summary:
${JSON.stringify(evaluations, null, 2)}

Provide:
1. Overall Weighted Performance Score (0 - 100)
2. Final Hiring Recommendation ('Strong Hire', 'Hire', 'Weak Pass', 'Needs Work')
3. Overall Executive Feedback Summary (2-3 paragraphs assessing overall readiness)
4. Skill Breakdown matrix with estimated proficiency and feedback per key skill area
5. 3-5 Key Strategic Takeaways for the candidate
6. Recommended Study Topics / Actionable Plan to improve
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            hiringRecommendation: {
              type: Type.STRING,
              enum: ['Strong Hire', 'Hire', 'Weak Pass', 'Needs Work'],
            },
            summaryFeedback: { type: Type.STRING },
            skillBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  feedback: { type: Type.STRING },
                },
                required: ['skill', 'score', 'feedback'],
              },
            },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedStudyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'overallScore',
            'hiringRecommendation',
            'summaryFeedback',
            'skillBreakdown',
            'keyTakeaways',
            'recommendedStudyTopics',
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Failed to generate summary.');
    }

    const summary = JSON.parse(resultText);
    return res.json(summary);
  } catch (err: any) {
    console.error('Error in /api/finalize-interview:', err);
    return res.status(500).json({ error: err.message || 'Failed to finalize interview summary.' });
  }
});

// 5. Generate Role Cheat Sheet & Top Questions
app.post('/api/generate-cheatsheet', async (req, res) => {
  try {
    const { role, level } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required.' });
    }

    const ai = getGeminiClient();
    const prompt = `Create a comprehensive Interview Prep Cheat Sheet & Rapid Revision Guide for:
Role: ${role}
Level: ${level || 'Senior'}

Include:
1. Role overview & key interview expectations
2. Top 5 high-frequency technical & behavioral questions with key response points, common pitfalls, and concise model answer snippets.
3. 5 essential core concepts to master.
4. 4 behavioral & situational communication tips tailored to this role.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            overview: { type: Type.STRING },
            topQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  category: { type: Type.STRING },
                  keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  commonPitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
                  idealAnswerSnippet: { type: Type.STRING },
                },
                required: ['question', 'category', 'keyPoints', 'commonPitfalls', 'idealAnswerSnippet'],
              },
            },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['topic', 'explanation'],
              },
            },
            behavioralTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['role', 'overview', 'topQuestions', 'keyConcepts', 'behavioralTips'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Failed to generate cheat sheet.');
    }

    const cheatSheet = JSON.parse(resultText);
    return res.json(cheatSheet);
  } catch (err: any) {
    console.error('Error in /api/generate-cheatsheet:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate cheat sheet.' });
  }
});

// -------------------------------------------------------------
// VITE DEV MIDDLEWARE OR STATIC SERVING
// -------------------------------------------------------------

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Interview Generator backend running at http://0.0.0.0:${PORT}`);
});
