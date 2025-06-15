
// Forced redeploy: Removed Node-only libraries; now accepts plain text files only.
// If you need PDF extraction, this must be done client-side or with a different server.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS setup
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const NOVITA_API_KEY = Deno.env.get("NOVITA_AI_API_KEY");
const NOVITA_BASE_URL = "https://api.novita.ai/v3/openai";
const NOVITA_MODEL = "deepseek/deepseek-r1-distill-llama-70b";

// Only allow plain text uploads!
async function extractText(file: Uint8Array, fileType: string): Promise<string> {
  try {
    if (fileType.includes("plain")) {
      // Interpret buffer as UTF-8 string
      return new TextDecoder().decode(file);
    }
    // No PDF/DOC/DOCX support.
    return "Unsupported file type. Only .txt (plain text) files are currently supported for text extraction on Supabase Edge.";
  } catch (error) {
    console.error("Error extracting text:", error);
    return `Error extracting text: ${error.message}`;
  }
}

// Function to clean JSON string and fix common syntax issues
function cleanJsonString(jsonStr: string): string {
  // Remove trailing commas before closing brackets/braces
  let cleaned = jsonStr.replace(/,(\s*[}\]])/g, '$1');
  
  // Remove any extra commas at the end of arrays
  cleaned = cleaned.replace(/,(\s*,)/g, ',');
  
  // Fix any double commas
  cleaned = cleaned.replace(/,,/g, ',');
  
  return cleaned;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    console.log('File uploaded:', file);
    const fileBuf = new Uint8Array(await file.arrayBuffer());
    const fileType = file.type || file.name.split(".").pop() || "";

    // Extract text from the uploaded file (now: only for plain text)
    const plainText = await extractText(fileBuf, fileType);

    // --- PROMPT ---
    const prompt = `
        You are an AI assistant that generates educational content. Your task is to analyze the following text and generate multiple-choice questions and flashcards based STRICTLY on the provided content.

        Text to analyze:
        ---
        ${plainText}
        ---

        Generate the following in valid JSON format only (no other text or explanations):
        {
          "mcqs": [
            {
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "correctIndex": number,
              "explanation": "string"  // REQUIRED: One concise sentence explaining why this answer is correct
            }
            // 5-20 questions total
          ],
          "flashcards": [
            {
              "front": "string",
              "back": "string"
            }
            // 5-20 flashcards total
          ]
        }

        Requirements:
        - Generate 5-20 multiple choice questions
        - Each MCQ must have exactly 4 options
        - Each MCQ must have exactly 1 correct answer
        - REQUIRED: Each MCQ must have a concise 1-sentence explanation of why the correct answer is right
        - Generate 5-20 flashcards
        - All content must come directly from the text
        - Skip any references section
        - Return ONLY valid JSON, no other text
        - DO NOT include trailing commas in arrays or objects
        - Make sure explanations are informative but brief (1 sentence maximum)
        `;

    const llmResp = await fetch(`${NOVITA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NOVITA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NOVITA_MODEL,
        messages: [
          { role: "system", content: "You are an expert educational AI for quiz and flashcard generation. Always provide clear, concise explanations for MCQ answers. Follow prompts precisely and generate valid JSON without trailing commas." },
          { role: "user", content: prompt }
        ],
        stream: false,
        response_format: { type: "text" }
      }),
    });

    if (!llmResp.ok) {
      const err = await llmResp.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: corsHeaders,
      });
    }
    const result = await llmResp.json();
    let content: string = result.choices?.[0]?.message?.content || "";
    content = content.trim();

    // --- Robust JSON Extraction Logic ---
    // Try to find anything inside ```json ... ```
    let jsonStr: string | null = null;
    const codeBlockMatch = content.match(/```json([\s\S]*?)```/i) || content.match(/```([\s\S]*?)```/);

    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    } else {
      // Fallback: extract from first '{' to last '}'
      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = content.slice(firstBrace, lastBrace + 1);
      }
    }

    if (!jsonStr) {
      return new Response(
        JSON.stringify({ error: "No JSON object found in output", raw: content }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Clean the JSON string to fix common syntax issues
    jsonStr = cleanJsonString(jsonStr);
    console.log('Cleaned JSON string:', jsonStr);

    let json;
    try {
      json = JSON.parse(jsonStr);
    } catch (err) {
      console.error('JSON parse error:', err);
      console.error('Attempted to parse:', jsonStr);
      return new Response(
        JSON.stringify({ error: "Failed to parse model output as JSON", raw: jsonStr, parseError: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Validate the result contains mcqs and flashcards keys
    if (
      typeof json !== "object" ||
      !json.mcqs ||
      !json.flashcards ||
      !Array.isArray(json.mcqs) ||
      !Array.isArray(json.flashcards)
    ) {
      return new Response(
        JSON.stringify({ error: "Parsed JSON does not contain expected { mcqs, flashcards } structure", raw: json }),
        { status: 500, headers: corsHeaders }
      );
    }

    // --- Transform MCQs to desired "Quiz.tsx" format ---
    // Desired: id, question, options, correct (index), explanation
    const transformedMcqs = json.mcqs.map((q: any, i: number) => ({
      id: i + 1,
      question: q.question || "",
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ["A", "B", "C", "D"],
      correct: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      explanation: q.explanation || "This is the correct answer based on the provided content."
    }));

    // --- Transform Flashcards to desired format ---
    // Desired: id, topic, chapter, front, back, difficulty
    // If those properties do NOT exist, set as empty or "N/A"
    const transformedFlashcards = json.flashcards.map((fc: any, i: number) => ({
      id: i + 1,
      topic: (fc.topic !== undefined ? fc.topic : "N/A"),
      chapter: (fc.chapter !== undefined ? fc.chapter : "N/A"),
      front: fc.front || "",
      back: fc.back || "",
      difficulty: fc.difficulty !== undefined ? fc.difficulty : "medium"
    }));

    return new Response(JSON.stringify({
      mcqs: transformedMcqs,
      flashcards: transformedFlashcards
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: err.message || err.toString() }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
