import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { BusinessProfile, DiagnosticReport } from './src/types';
import { generateDiagnosticReport } from './src/lib/diagnosticEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const openaiClient = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const geminiClient = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const AI_SYSTEM_PROMPT = `You are Founder Compass, an evidence-driven diagnostic assistant for founders of launched digital products.

Your job is not to generate generic marketing advice. Your job is to:
1. Summarize the actual business facts provided.
2. Identify the single most important unanswered question affecting the decision.
3. Explain why that uncertainty matters.
4. Recommend the smallest practical experiment that resolves it (specifically justified by the founder's submitted answers).
5. Define measurable success, contradictory, and inconclusive outcomes.

Rules:
- Do not automatically recommend 25-prospect outreach or a seven-day funnel baseline. Recommend these only when the evidence specifically supports them.
- For businesses with existing paying customers, consider what those customers reveal about the strongest use case, acquisition source, and purchase motivation before prescribing more outreach.
- Separate founder-provided facts from interpretations and hypotheses.
- Do not invent metrics, customers, market research, sources, conversion benchmarks, or financial outcomes.
- If the evidence is insufficient, identify the smallest practical next step justified by what the founder actually submitted.
- Consider demand, target buyer, positioning, acquisition, conversion, activation, purchasing constraints, pricing, and retention.
- Do not assume that more traffic, more outreach, lower prices, or a pivot is automatically the correct answer.
- Distinguish what is known from what remains uncertain. Never guarantee commercial success or invent probabilities.
- Be direct, commercially practical, respectful, and transparent about limitations.

You must respond ONLY with a valid JSON object strictly matching this schema:
{
  "businessSummary": "string",
  "observedFacts": ["string"],
  "founderInterpretations": ["string"],
  "missingOrUnreliableData": ["string"],
  "primaryUnansweredQuestion": "string",
  "whyUncertaintyMatters": "string",
  "smallestPracticalExperimentSummary": "string",
  "leadingBottleneckCategory": "demand_validation" | "target_customer" | "acquisition_reach" | "positioning_offer" | "sales_conversion" | "activation_value" | "pricing_purchasing" | "retention_recurring_value" | "insufficient_evidence",
  "leadingHypothesis": "string",
  "supportingEvidence": ["string"],
  "competingExplanations": ["string"],
  "criticalUnknowns": ["string"],
  "priorityRationale": "string",
  "provisionalStatus": "provisional_diagnosis" | "additional_evidence_needed" | "experiment_ready" | "results_awaiting_review",
  "primaryExperiment": {
    "id": "string",
    "title": "string",
    "hypothesis": "string",
    "targetAudience": "string",
    "timeFrame": "string",
    "procedure": ["string"],
    "requiredResources": {
      "timeHours": number,
      "moneyBudget": number,
      "toolsOrSkills": "string"
    },
    "metricsToRecord": ["string"],
    "supportingEvidenceOutcome": "string",
    "contradictoryEvidenceOutcome": "string",
    "inconclusiveCriteria": "string",
    "nextActionSupporting": "string",
    "nextActionContradictory": "string",
    "nextActionInconclusive": "string"
  },
  "limitations": ["string"],
  "sources": [{ "title": "string", "note": "string", "url": "string" }]
}`;

// API status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  const hasOpenAI = Boolean(OPENAI_API_KEY && OPENAI_API_KEY.trim().length > 0);
  const hasGemini = Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0);

  let activeProvider: 'openai' | 'gemini' | 'demo' = 'demo';
  if (hasOpenAI) activeProvider = 'openai';
  else if (hasGemini) activeProvider = 'gemini';

  res.json({
    openaiConfigured: hasOpenAI,
    geminiConfigured: hasGemini,
    activeProvider,
    openaiModel: OPENAI_MODEL,
    message: hasOpenAI 
      ? `Connected to OpenAI (${OPENAI_MODEL})`
      : hasGemini
      ? 'Connected to Gemini API'
      : 'Demo Mode: Running Deterministic Local Diagnostic Engine'
  });
});

// Diagnostic endpoint
app.post('/api/diagnose', async (req: Request, res: Response) => {
  try {
    const profile = req.body as BusinessProfile;

    if (!profile || !profile.productName || !profile.targetBuyer) {
      return res.status(400).json({ error: 'Invalid profile data. Product name and target buyer are required.' });
    }

    // Attempt OpenAI if configured
    if (openaiClient) {
      try {
        const completion = await openaiClient.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPT },
            { 
              role: 'user', 
              content: `Analyze this founder business profile and produce the structured diagnostic report:\n\n${JSON.stringify(profile, null, 2)}` 
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2
        });

        const rawContent = completion.choices[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          const report: DiagnosticReport = {
            id: `rep-openai-${Date.now()}`,
            profileId: profile.id,
            createdAt: new Date().toISOString(),
            provider: 'openai',
            modelUsed: OPENAI_MODEL,
            businessSummary: parsed.businessSummary || `${profile.productName} analysis`,
            observedFacts: Array.isArray(parsed.observedFacts) ? parsed.observedFacts : [],
            founderInterpretations: Array.isArray(parsed.founderInterpretations) ? parsed.founderInterpretations : [],
            missingOrUnreliableData: Array.isArray(parsed.missingOrUnreliableData) ? parsed.missingOrUnreliableData : [],
            primaryUnansweredQuestion: parsed.primaryUnansweredQuestion || (Array.isArray(parsed.criticalUnknowns) && parsed.criticalUnknowns[0]) || 'What is the most critical constraint?',
            whyUncertaintyMatters: parsed.whyUncertaintyMatters || parsed.priorityRationale || 'Resolving this uncertainty protects founder time and runway.',
            smallestPracticalExperimentSummary: parsed.smallestPracticalExperimentSummary || 'Focused bounded test aligned directly with founder answers.',
            leadingBottleneckCategory: parsed.leadingBottleneckCategory || 'insufficient_evidence',
            leadingHypothesis: parsed.leadingHypothesis || 'Hypothesis under evaluation',
            supportingEvidence: Array.isArray(parsed.supportingEvidence) ? parsed.supportingEvidence : [],
            competingExplanations: Array.isArray(parsed.competingExplanations) ? parsed.competingExplanations : [],
            criticalUnknowns: Array.isArray(parsed.criticalUnknowns) ? parsed.criticalUnknowns : [],
            priorityRationale: parsed.priorityRationale || 'Critical path bottleneck priority.',
            provisionalStatus: parsed.provisionalStatus || 'provisional_diagnosis',
            primaryExperiment: parsed.primaryExperiment || {
              id: `exp-${Date.now()}`,
              title: 'Primary Diagnostic Experiment',
              hypothesis: parsed.leadingHypothesis,
              targetAudience: profile.targetBuyer,
              timeFrame: '7 to 10 business days',
              procedure: ['Observe target user behavior'],
              requiredResources: { timeHours: 5, moneyBudget: 0, toolsOrSkills: 'Interviews' },
              metricsToRecord: ['Response rate'],
              supportingEvidenceOutcome: 'Positive confirmation',
              contradictoryEvidenceOutcome: 'Lack of interest',
              inconclusiveCriteria: 'Inadequate sample',
              nextActionSupporting: 'Proceed to next milestone',
              nextActionContradictory: 'Re-evaluate assumptions',
              nextActionInconclusive: 'Expand sample size'
            },
            limitations: Array.isArray(parsed.limitations) ? parsed.limitations : [],
            sources: Array.isArray(parsed.sources) ? parsed.sources : []
          };
          return res.json(report);
        }
      } catch (openAiError) {
        console.error('OpenAI call failed, falling back to deterministic local engine:', openAiError);
      }
    }

    // Attempt Gemini if configured and OpenAI was not used
    if (geminiClient) {
      try {
        const response = await geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${AI_SYSTEM_PROMPT}\n\nFounder Business Profile:\n${JSON.stringify(profile, null, 2)}` }] }
          ],
          config: {
            responseMimeType: 'application/json'
          }
        });

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const report: DiagnosticReport = {
            id: `rep-gemini-${Date.now()}`,
            profileId: profile.id,
            createdAt: new Date().toISOString(),
            provider: 'gemini',
            modelUsed: 'gemini-2.5-flash',
            businessSummary: parsed.businessSummary || `${profile.productName} analysis`,
            observedFacts: Array.isArray(parsed.observedFacts) ? parsed.observedFacts : [],
            founderInterpretations: Array.isArray(parsed.founderInterpretations) ? parsed.founderInterpretations : [],
            missingOrUnreliableData: Array.isArray(parsed.missingOrUnreliableData) ? parsed.missingOrUnreliableData : [],
            primaryUnansweredQuestion: parsed.primaryUnansweredQuestion || (Array.isArray(parsed.criticalUnknowns) && parsed.criticalUnknowns[0]) || 'What is the most critical constraint?',
            whyUncertaintyMatters: parsed.whyUncertaintyMatters || parsed.priorityRationale || 'Resolving this uncertainty protects founder time and runway.',
            smallestPracticalExperimentSummary: parsed.smallestPracticalExperimentSummary || 'Focused bounded test aligned directly with founder answers.',
            leadingBottleneckCategory: parsed.leadingBottleneckCategory || 'insufficient_evidence',
            leadingHypothesis: parsed.leadingHypothesis || 'Hypothesis under evaluation',
            supportingEvidence: Array.isArray(parsed.supportingEvidence) ? parsed.supportingEvidence : [],
            competingExplanations: Array.isArray(parsed.competingExplanations) ? parsed.competingExplanations : [],
            criticalUnknowns: Array.isArray(parsed.criticalUnknowns) ? parsed.criticalUnknowns : [],
            priorityRationale: parsed.priorityRationale || 'Critical path bottleneck priority.',
            provisionalStatus: parsed.provisionalStatus || 'provisional_diagnosis',
            primaryExperiment: parsed.primaryExperiment,
            limitations: Array.isArray(parsed.limitations) ? parsed.limitations : [],
            sources: Array.isArray(parsed.sources) ? parsed.sources : []
          };
          return res.json(report);
        }
      } catch (geminiError) {
        console.error('Gemini call failed, falling back to deterministic engine:', geminiError);
      }
    }

    // Deterministic fallback (Rule-Based Local Engine)
    const fallbackReport = generateDiagnosticReport(profile, 'demo', 'Deterministic Rule Engine (v1.0)');
    return res.json(fallbackReport);

  } catch (error) {
    console.error('Diagnosis handler error:', error);
    res.status(500).json({ error: 'Internal diagnosis error. Please try again.' });
  }
});

// Experiment review endpoint
app.post('/api/review-experiment', (req: Request, res: Response) => {
  try {
    const { experiment, observedResults } = req.body;
    if (!experiment || !observedResults) {
      return res.status(400).json({ error: 'Experiment and observed results are required.' });
    }

    const qualitative = (observedResults.qualitativeFindings || '').toLowerCase();
    const metricsStr = JSON.stringify(observedResults.metricsValues || {}).toLowerCase();
    const combined = `${qualitative} ${metricsStr}`;

    let outcomeSummary = 'Observed results gathered from experimental run.';
    let recommendationShifted = false;
    let updatedConclusion = '';
    let nextRecommendedAction = '';

    // Analyze outcome against hypothesis
    if (combined.includes('bought') || combined.includes('positive') || combined.includes('signed') || combined.includes('validated') || combined.includes('success')) {
      outcomeSummary = 'Observed evidence strongly supports the initial experimental hypothesis.';
      updatedConclusion = 'The primary bottleneck assumption was validated. Friction in this area has been clarified.';
      nextRecommendedAction = experiment.nextActionSupporting || 'Standardize this winning workflow into daily execution.';
    } else if (combined.includes('no interest') || combined.includes('refused') || combined.includes('fail') || combined.includes('rejection') || combined.includes('zero')) {
      outcomeSummary = 'Observed evidence contradicts the initial experimental hypothesis.';
      recommendationShifted = true;
      updatedConclusion = 'The assumption was not substantiated by customer behavior. Shifting investigation to adjacent bottleneck.';
      nextRecommendedAction = experiment.nextActionContradictory || 'Pivot to investigating earlier stage funnel assumptions (Demand or Target Customer).';
    } else {
      outcomeSummary = 'Observed results are currently inconclusive or sample size was insufficient to reach statistical significance.';
      updatedConclusion = 'Denominator was too small or feedback was contradictory.';
      nextRecommendedAction = experiment.nextActionInconclusive || 'Expand sample size or tighten qualification criteria before drawing definitive conclusions.';
    }

    const evaluation = {
      reviewedAt: new Date().toISOString(),
      supportingEvidenceFound: observedResults.qualitativeFindings ? `Customer observations recorded: "${observedResults.qualitativeFindings}"` : 'No qualitative evidence recorded.',
      contradictoryEvidenceFound: observedResults.unexpectedFindings ? `Unexpected friction: "${observedResults.unexpectedFindings}"` : 'None documented.',
      missingMeasurementsIdentified: Object.keys(observedResults.metricsValues || {}).length === 0 ? ['Quantitative conversion metric values were omitted.'] : [],
      outcomeSummary,
      interpretationSeparation: 'Distinction preserved: User observations are noted above; model synthesis provides the strategic pivot below.',
      updatedConclusion,
      nextRecommendedAction,
      recommendationShifted
    };

    res.json({ evaluation });
  } catch (error) {
    console.error('Review experiment error:', error);
    res.status(500).json({ error: 'Failed to process experiment review.' });
  }
});

// AI Assistant Chat endpoint
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const profile: BusinessProfile = context?.profile;
    const report: DiagnosticReport | undefined = context?.latestReport;

    const systemInstruction = `You are the First Customers Strategy Assistant.
You advise founders who have built a digital product and are working to acquire their first paying customers.
Core Philosophy: "You've built the product. Now find out why customers aren't buying, and what to do next."

Context:
- Product Name: ${profile?.productName || 'Startup Product'}
- Target Buyer: ${profile?.targetBuyer || 'Unspecified Buyer'}
- Specific Problem: ${profile?.specificProblem || 'Unspecified Problem'}
- Paying Customers: ${profile?.payingCustomers || 0}
- Current Bottleneck: ${report?.leadingBottleneckCategory || 'Demand & Positioning'}
- Available Hours: ${profile?.availableHoursPerWeek || 10} hrs/week
- Budget: $${profile?.availableMonthlyBudget || 0}/month

Instructions:
1. Provide concise, direct, peer-level guidance. Do not use generic motivational platitudes or corporate jargon.
2. If the user asks for cold outreach messages, write a specific, 3-to-4 sentence peer-to-peer message without marketing hype.
3. If the user asks why customers aren't buying, separate known facts from assumptions and identify the earliest friction point.
4. Never invent fake customer quotes, market statistics, or guaranteed conversion rates.
5. Point out what remains uncertain and suggest the smallest practical experiment to test it.`;

    if (geminiClient) {
      try {
        const contents = (history || []).map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        }));
        contents.push({
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question:\n${message}` }]
        });

        const geminiRes = await geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents
        });

        const text = geminiRes.text;
        if (text) {
          return res.json({
            reply: text,
            provider: 'gemini'
          });
        }
      } catch (geminiChatErr) {
        console.error('Gemini chat failed, falling back to deterministic advice:', geminiChatErr);
      }
    }

    if (openaiClient) {
      try {
        const openAiMessages = [
          { role: 'system', content: systemInstruction },
          ...(history || []).map((h: any) => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.content
          })),
          { role: 'user', content: message }
        ];

        const openAiRes = await openaiClient.chat.completions.create({
          model: OPENAI_MODEL,
          messages: openAiMessages as any,
          temperature: 0.3
        });

        const reply = openAiRes.choices[0]?.message?.content;
        if (reply) {
          return res.json({
            reply,
            provider: 'openai'
          });
        }
      } catch (openAiChatErr) {
        console.error('OpenAI chat failed, falling back to deterministic advice:', openAiChatErr);
      }
    }

    // Deterministic Rule-Based Fallback
    const lower = message.toLowerCase();
    let reply = '';
    const followUps: string[] = [];

    if (lower.includes('outreach') || lower.includes('email') || lower.includes('message') || lower.includes('pitch')) {
      reply = `Here is a high-converting, 4-sentence outreach template tailored specifically for ${profile?.targetBuyer || 'your target buyer'}:\n\n` +
        `"Subject: Quick question about handling ${profile?.specificProblem ? profile.specificProblem.slice(0, 30) : 'workflow'} at {{company}}\n\n` +
        `Hi {{first_name}},\n\n` +
        `I noticed you oversee operations at {{company}}. I'm a founder researching how modern teams currently manage ${profile?.specificProblem || 'this workflow'}.\n\n` +
        `Are you currently solving this with custom internal spreadsheets, or have you found an external tool that actually works?\n\n` +
        `Not pitching software—just trying to learn what the biggest point of friction is right now.\n\n` +
        `Best,\n{{your_name}}"\n\n` +
        `Tactical Rule: Do not paste a calendar scheduling link in message #1. Your primary goal is to get a reply acknowledging the pain point.`;
      followUps.push('What should I say when they reply?', 'How many prospects should I message in sprint 1?');
    } else if (lower.includes('why') && (lower.includes('buy') || lower.includes('customer') || lower.includes('sale'))) {
      const paying = profile?.payingCustomers !== 'unknown' && Number(profile?.payingCustomers) > 0;
      if (paying) {
        reply = `You have ${profile?.payingCustomers} paying customer(s), which proves willingness to pay exists. The reason you aren't acquiring more customers is almost certainly a distribution or qualification constraint, not a fundamental product failure.\n\n` +
          `1. Interview your paying accounts immediately to isolate the exact incident that caused them to swipe their card.\n` +
          `2. Check your outreach volume: have you conducted at least 30 targeted touches to their exact twin profiles this week?\n` +
          `3. Check where evaluators drop off in the Sales Diagnosis module.`;
      } else {
        reply = `With 0 paying customers, the lack of purchases typically stems from one of two root causes:\n\n` +
          `1. Target Buyer Mismatch: The people you are showing the product to do not have budget authority, or the pain is merely annoying rather than urgent.\n` +
          `2. Switching Inertia: Even if your tool is cleaner than their current spreadsheet, the friction of learning a new software tool feels greater than tolerating their messy workaround.\n\n` +
          `To fix this: Do not write more features. Run a 25-prospect direct interview sprint to see if buyers are actively spending money on any alternative today.`;
      }
      followUps.push('How do I run a Mom-Test interview?', 'Show me the Sales Diagnosis breakdown');
    } else if (lower.includes('interview') || lower.includes('mom test') || lower.includes('questions')) {
      reply = `When interviewing prospective buyers, follow the Mom Test rules:\n\n` +
        `1. Ask about past behavior, not future promises: Never ask "Would you buy a tool that does X?" (People will be polite and say yes). Ask: "When was the last time you dealt with this problem? What exact steps did you take?"\n` +
        `2. Dig into money and alternatives: "Are you paying for any software or consultant to help with this today?"\n` +
        `3. Look for active workarounds: If they haven't tried to solve it with spreadsheets or manual effort, the problem is not a priority.`;
      followUps.push('Draft a 15-minute interview script', 'How do I reach 10 interview candidates?');
    } else {
      reply = `Based on your business profile for ${profile?.productName || 'your product'} (${profile?.targetBuyer || 'Target Buyers'}):\n\n` +
        `The primary objective this week is to reduce uncertainty around whether ${profile?.targetBuyer || 'your target customer'} has acute willingness to pay.\n\n` +
        `Recommended Next Step: Open the "Next Actions" tab and execute Action #1 (25 personalized touches or customer motivation audit). Avoid building speculative features until you gather 5 direct prospect reactions.`;
      followUps.push('Draft a cold outreach template', 'Review my funnel calculations');
    }

    res.json({
      reply,
      provider: 'deterministic_engine',
      suggestedFollowUps: followUps
    });

  } catch (error) {
    console.error('Assistant handler error:', error);
    res.status(500).json({ error: 'Assistant processing error.' });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Founder Compass server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
