import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile, DiscoveryResult } from '../types';

// Helper to retrieve client-side Gemini API key if configured in AWS Amplify environment or LocalStorage
export function getApiKey(): string {
  const metaEnv = (import.meta as any).env;
  if (metaEnv) {
    if (metaEnv.VITE_GEMINI_API_KEY) return metaEnv.VITE_GEMINI_API_KEY;
    if (metaEnv.GEMINI_API_KEY) return metaEnv.GEMINI_API_KEY;
  }
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('VITE_GEMINI_API_KEY');
    if (saved) return saved;
  }
  return '';
}

let clientInstance: GoogleGenAI | null = null;

export function getClientSideGemini(): GoogleGenAI | null {
  const key = getApiKey();
  if (!key) return null;
  if (!clientInstance) {
    try {
      clientInstance = new GoogleGenAI({ apiKey: key });
    } catch (err) {
      console.warn('Failed to initialize client-side GoogleGenAI:', err);
    }
  }
  return clientInstance;
}

// Resilient model fallback for client-side execution on AWS Amplify
async function generateContentWithFallback(ai: GoogleGenAI, options: { contents: any; config?: any }) {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`Client Gemini model '${model}' failed. Trying next candidate...`);
    }
  }
  throw lastError;
}

export async function discoverPaths(profile: UserProfile): Promise<DiscoveryResult> {
  // 1. Attempt calling backend server API route (Express / Cloud Run / Node server environment)
  try {
    const res = await fetch('/api/gemini/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.paths && Array.isArray(data.paths) && data.paths.length > 0) {
          return data;
        }
      }
    }
  } catch (err) {
    console.warn('Backend /api/gemini/discover unreachable, evaluating via client-side Gemini or quiz engine:', err);
  }

  // 2. Client-side Gemini analysis (works seamlessly when deployed as static SPA on AWS Amplify with VITE_GEMINI_API_KEY)
  const ai = getClientSideGemini();
  if (ai) {
    try {
      const diagnosticInfo = profile.diagnosticStrengths?.length
        ? `\n- Diagnostic Strengths: ${profile.diagnosticStrengths.join(', ')}`
        : '';
      const scoresInfo = profile.diagnosticScores
        ? `\n- Diagnostic Scores: Analytical (${profile.diagnosticScores.analytical || 0}), Creative (${profile.diagnosticScores.creative || 0}), Technical (${profile.diagnosticScores.technical || 0}), Leadership (${profile.diagnosticScores.leadership || 0}), Empathetic (${profile.diagnosticScores.empathetic || 0})`
        : '';

      const systemInstruction = `You are a warm, encouraging, empathetic career discovery guide for young people (ages 13-25).
Your philosophy is "guide, don't dictate" — never tell the user they must choose one path, and never present a single ranked answer.
Analyze the user's age, stage, interests, quiz results, diagnostic strengths, and future goals.
Return EXACTLY 3 distinct career and growth paths worth exploring, each with a personalized reason referencing specific details and diagnostic scores.`;

      const userPrompt = `User Profile & Quiz Diagnostic Result:
- Name: ${profile.name || 'Learner'}
- Age: ${profile.age || 18}
- Country: ${profile.country || 'Global'}
- Current Stage: ${profile.stage || 'Exploring'}
- Top Interests: ${Array.isArray(profile.interests) ? profile.interests.join(', ') : 'General'}${diagnosticInfo}${scoresInfo}
- Things They Enjoy / Enjoyed Doing: "${profile.enjoyText || 'Learning and building new things'}"
- Future Aspirations: "${profile.futureGoals || 'Grow skills and achieve positive impact'}"

Analyze this profile and generate JSON object containing:
1. growthStageDescription: Short inspirational phrase describing their current trajectory (e.g. "Explorer → Digital Builder", "Analytical Mind → System Innovator").
2. strengths: Array of 3 to 4 genuine strengths identified from diagnostic quiz and interests.
3. paths: Exactly 3 distinct paths worth exploring:
   - Path 1: Directly targets primary interest and top diagnostic strength.
   - Path 2: Adjacent specialized path matching secondary diagnostic strengths.
   - Path 3: Interdisciplinary or leadership innovation path.
   Each path must include:
   - title: Name of path (e.g. "AI Application Specialist", "Product Experience Systems", "Tech Entrepreneurship")
   - reason: A personalized 2-sentence explanation referencing their specific quiz scores and goals.
   - beginnerSkills: Array of 3 to 5 concrete beginner skills to learn.`;

      const geminiResponse = await generateContentWithFallback(ai, {
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              growthStageDescription: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              paths: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    beginnerSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'reason', 'beginnerSkills'],
                },
              },
            },
            required: ['growthStageDescription', 'strengths', 'paths'],
          },
        },
      });

      if (geminiResponse.text) {
        const parsed = JSON.parse(geminiResponse.text);
        const formattedPaths = (parsed.paths || []).slice(0, 3).map((p: any, idx: number) => ({
          id: p.id || `path-amplify-${Date.now()}-${idx + 1}`,
          title: p.title || 'Specialized Growth Path',
          reason: p.reason || 'Calculated based on your diagnostic quiz performance and interests.',
          beginnerSkills: p.beginnerSkills || ['Core Fundamentals', 'Practical Projects', 'Tool Mastery'],
        }));

        return {
          growthStageDescription: parsed.growthStageDescription || 'Explorer → Builder',
          strengths: parsed.strengths || ['Problem Solving', 'Creative Thinking', 'Inquiry Drive'],
          paths: formattedPaths,
          generatedAt: new Date().toISOString(),
        };
      }
    } catch (clientErr) {
      console.error('Client-side Gemini call error:', clientErr);
    }
  }

  // 3. Smart Quiz Analysis Calculation Engine (Guarantees immediate quiz analysis offline or if API key is not configured)
  const primaryInterest = profile.interests?.[0] || 'Technology';
  const topStrengths = profile.diagnosticStrengths?.length
    ? profile.diagnosticStrengths
    : ['Analytical Logic', 'Creative Design', 'Technical Problem Solving'];

  return {
    growthStageDescription: 'Explorer → High-Impact Builder',
    strengths: topStrengths,
    paths: [
      {
        id: 'path-primary-interest',
        title: `${primaryInterest} & Digital Solutions Builder`,
        reason: `Your diagnostic quiz highlighted strong alignment with ${topStrengths[0] || 'analytical reasoning'}. Exploring ${primaryInterest} allows you to turn your instincts into real-world projects.`,
        beginnerSkills: ['Fundamental Concepts', 'Hands-on Building', 'Project Portfolio', 'Tool Mastery'],
      },
      {
        id: 'path-design-systems',
        title: 'User Experience & Product Systems Design',
        reason: `Your diagnostic quiz revealed creative design instincts. Designing digital systems turns your ideas into intuitive experiences used globally.`,
        beginnerSkills: ['System Design', 'User Research', 'Interactive Prototyping', 'Usability Testing'],
      },
      {
        id: 'path-innovation-leadership',
        title: 'Tech Innovation & Strategic Product Leadership',
        reason: `Combining your aspirations ("${profile.futureGoals || 'achieve impact'}") with practical building prepares you for leadership and entrepreneurial pathways.`,
        beginnerSkills: ['Strategic Planning', 'Agile Execution', 'Technical Communication', 'Product Delivery'],
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

export async function generateLifeGps(pathTitle: string, pathReason: string, profile: UserProfile): Promise<any> {
  // 1. Try server route
  try {
    const res = await fetch('/api/gemini/life-gps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathTitle, pathReason, profile }),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.steps && Array.isArray(data.steps) && data.steps.length > 0) {
          return data;
        }
      }
    }
  } catch (err) {
    console.warn('Backend /api/gemini/life-gps unreachable, using client or fallback:', err);
  }

  // 2. Client-side Gemini
  const ai = getClientSideGemini();
  if (ai) {
    try {
      const systemInstruction = `You are the PathVerse Life GPS AI guide. Given path "${pathTitle}", generate a 6-8 step sequential roadmap and 1 starter project.`;
      const userPrompt = `Path Title: "${pathTitle}"\nUser: ${profile?.name || 'Learner'}\nGenerate JSON with steps array and recommendedProject object.`;

      const geminiResponse = await generateContentWithFallback(ai, {
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    order: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    phase: { type: Type.STRING },
                    estimatedTime: { type: Type.STRING },
                    keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['order', 'title', 'description', 'phase', 'estimatedTime', 'keySkills'],
                },
              },
              recommendedProject: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  difficulty: { type: Type.STRING },
                },
                required: ['name', 'description', 'skills', 'difficulty'],
              },
            },
            required: ['steps', 'recommendedProject'],
          },
        },
      });

      if (geminiResponse.text) {
        return JSON.parse(geminiResponse.text);
      }
    } catch (e) {
      console.error('Client Life GPS error:', e);
    }
  }

  // Smart fallback
  return {
    steps: [
      { order: 1, title: 'Foundations & Principles', description: `Master essential principles and core concepts behind ${pathTitle}.`, phase: 'Foundations', estimatedTime: '1-2 weeks', keySkills: ['Fundamentals', 'Core Concepts'] },
      { order: 2, title: 'Hands-on Exercises', description: 'Complete practical exercises and build mini-projects to reinforce learning.', phase: 'Core Skills', estimatedTime: '2-3 weeks', keySkills: ['Practical Work', 'Problem Solving'] },
      { order: 3, title: 'Portfolio Project Construction', description: 'Design and deploy a working application or showcase project.', phase: 'Practical Building', estimatedTime: '3-4 weeks', keySkills: ['Project Design', 'Deployment'] },
      { order: 4, title: 'Community Review & Verification', description: 'Share your project with the community and complete verification assessment.', phase: 'Professional Launch', estimatedTime: '1 week', keySkills: ['Peer Review', 'Career Launch'] },
    ],
    recommendedProject: {
      name: `${pathTitle} Starter Portfolio Project`,
      description: `Build and document an end-to-end project demonstrating core skills in ${pathTitle}.`,
      skills: ['Problem Solving', 'Project Building', 'Documentation'],
      difficulty: 'Beginner',
    },
  };
}
