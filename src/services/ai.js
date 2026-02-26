import { GoogleGenerativeAI } from "@google/generative-ai";

export const MODELS = [
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash (Preview)" },
  { id: "gemini-3-pro-preview", name: "Gemini 3 Pro (Preview)" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
];

export async function generateCurriculum(modelId, learningObjective, apiKey) {
  const key = apiKey || localStorage.getItem('google_ai_api_key') || import.meta.env.VITE_GOOGLE_API_KEY;

  if (!key) {
    throw new Error("Google AI API Key is missing. Please enter it in the settings.");
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `
You are a professional curriculum creator for AI Leaders (our workforce development course) who writes in plain, succinct language. The user will give you a learning objective. Respond by creating a detailed lesson plan structure that strictly adheres to the following requirements.

All activities must be focused on building a student's professional portfolio that they will use to get jobs.

Your output MUST be a valid JSON object matching this exact schema. Do NOT wrap your response in markdown (like \`\`\`json). Return ONLY the raw JSON object.

### JSON Schema & Field-by-field Requirements
{
  "learningObjective": {
    "statement": "Restate the objective in first person, one sentence, measurable, and aligned to the assessment. YOU MUST USE THIS PATTERN: 'I can [measurable verb] [thing] [context] [quality/constraint].'",
    "measurableVerb": "A single verb from Bloom’s-aligned verbs (e.g., 'draft', 'compare', 'design', 'justify'). This verb MUST appear at the start of the statement.",
    "successEvidence": ["2–4 bullet items describing what observable proof looks like. These will be referenced by activities."]
  },
  "competency": {
    "index": "Integer used as the numbered heading (e.g., 1, 2, 3).",
    "label": "Short heading (3–8 words), e.g., '1. Prompting for Reliable Outputs'.",
    "summary": "One sentence describing the broader skill area."
  },
  "enduringUnderstanding": {
    "whyItMatters": "1–2 sentences on long-term value.",
    "keyTakeaways": ["2–4 concise bullets that the lesson should reinforce."]
  },
  "essentialQuestions": ["Exactly 2–4 questions. Must be answerable by the end of the lesson + assessment project. Avoid yes/no questions; prefer 'how/why/what' framing."],
  "assessmentProject": {
    "artifactName": "Clear name for the SINGLE portfolio artifact proving the objective (e.g., 'One-Page Strategy Memo').",
    "prompt": "The exact instructions a learner sees. Detailed enough to produce and grade the artifact without assumptions.",
    "submissionType": "One of: short_response, image_upload, either. Respect any constraints provided in the learning objective.",
    "bloomsLevel": "One of: remember, understand, apply, analyze, evaluate, create.",
    "webbDOK": "Integer 1–4.",
    "requirements": ["3–7 concrete requirements (length, components, constraints)."],
    "scoringDimensions": ["3–6 dimensions (e.g., 'accuracy', 'clarity', 'justification', 'completeness')."]
  },
  "masteryCriteria": {
    "successMetric": "A single sentence defining what 'meets mastery' means for the assessment artifact. This is the rubric for the assessment.",
    "rubricChecks": ["3–6 rubric-style checks. Must be binary-checkable (e.g., 'Includes 3 stakeholder needs with evidence.'). Must map directly to assessment requirements/scoring dimensions."]
  },
  "udlAccommodations": {
    "engagement": ["2–4 accommodations tailored to the objective, assessment format, and learner profile needs (choice, relevance, motivation, scaffolding)."],
    "representation": ["2–4 accommodations tailored to the objective, assessment format, and learner profile needs (multiple formats, examples, vocabulary support)."],
    "actionExpression": ["2–4 accommodations tailored to the objective, assessment format, and learner profile needs (multiple ways to respond, tools, templates, assistive tech)."]
  },
  "activities": [
    {
      "title": "Short and specific title.",
      "type": "One of: read | watch | practice | reflect | discuss | build",
      "instructions": "Step-based, actionable instructions that prepare the learner for the specific assessment.",
      "estimatedMinutes": "Numeric estimate (integer).",
      "outputs": "Clearly state what the learner produces (notes, draft, checklist, etc.)",
      "alignment": {
        "objectiveEvidence": ["One or more exact string(s) matched from learningObjective.successEvidence."],
        "rubricChecks": ["One or more exact string(s) matched from masteryCriteria.rubricChecks."]
      }
    }
  ]
}

### Global Validation Rules (must follow)
- Essential questions: 2–4.
- Rubric checks: 3–6.
- Activities: 3–6.
- Assessment project must produce EXACTLY ONE artifact only.
- Every activity must align to at least:
  1) one item from learningObjective.successEvidence, AND
  2) one item from masteryCriteria.rubricChecks.
- Objective fidelity + measurability: learningObjective.statement must be one sentence, first person, and preserve the meaning of the original objective. learningObjective.measurableVerb MUST appear in the statement.
- Required counts and bounds:
  - assessmentProject.requirements: 3–7 items.
  - assessmentProject.scoringDimensions: 3–6 items.
  - Each UDL array: 2–4 items.
- Rubric alignment: Every masteryCriteria.rubricChecks item must be directly gradeable against the assessment artifact (no vague checks like 'shows understanding'). Rubric checks should have NO orphans; they must map to requirements or scoring dimensions.
- Activity alignment: alignment.objectiveEvidence and alignment.rubricChecks MUST contain strings that exactly match items earlier in the JSON. No empty alignment arrays.
- Instructions: Each activity’s instructions must be actionable (step-based).
- Submission Type: Must be one of short_response|image_upload|either.

Original Learning Objective: ${learningObjective}
   `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up potential markdown wrapper from the AI
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    try {
      const data = JSON.parse(text);

      const escapeCsv = (str) => {
        if (str == null) return '""';
        const s = String(str);
        if (s.includes('"') || s.includes(',') || s.includes('\n')) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      };

      const col1 = `Objective: ${data.learningObjective?.statement}\nVerb: ${data.learningObjective?.measurableVerb}\nEvidence:\n- ${data.learningObjective?.successEvidence?.join('\n- ')}`;
      const col2 = `Competency ${data.competency?.index}: ${data.competency?.label}\n${data.competency?.summary}`;
      const col3 = `${data.enduringUnderstanding?.whyItMatters}\n\nKey Takeaways:\n- ${data.enduringUnderstanding?.keyTakeaways?.join('\n- ')}`;
      const col4 = data.essentialQuestions?.map(q => `- ${q}`).join('\n');
      const col5 = `${data.assessmentProject?.artifactName} (${data.assessmentProject?.submissionType})\nBloom's: ${data.assessmentProject?.bloomsLevel} | DOK: ${data.assessmentProject?.webbDOK}\n\nPrompt:\n${data.assessmentProject?.prompt}\n\nRequirements:\n- ${data.assessmentProject?.requirements?.join('\n- ')}\n\nScoring Dimensions:\n- ${data.assessmentProject?.scoringDimensions?.join('\n- ')}`;
      const col6 = `Mastery: ${data.masteryCriteria?.successMetric}\nRubric:\n- ${data.masteryCriteria?.rubricChecks?.join('\n- ')}`;
      const col7 = `Engagement:\n- ${data.udlAccommodations?.engagement?.join('\n- ')}\nRepresentation:\n- ${data.udlAccommodations?.representation?.join('\n- ')}\nAction & Expression:\n- ${data.udlAccommodations?.actionExpression?.join('\n- ')}`;
      const col8 = data.activities?.map(a => `${a.title} (${a.type}, ${a.estimatedMinutes}m)\nOutputs: ${a.outputs}\nInstructions: ${a.instructions}\nAlignment Evidence: ${a.alignment?.objectiveEvidence?.join(', ')}\nAlignment Rubric: ${a.alignment?.rubricChecks?.join(', ')}`).join('\n\n');

      return [col1, col2, col3, col4, col5, col6, col7, col8].map(escapeCsv).join(',');
    } catch (parseError) {
      console.warn("Could not parse JSON response as CSV, returning raw text", parseError, text);
      return text;
    }
  } catch (error) {
    console.error("Error generating curriculum:", error);
    throw error;
  }
}
