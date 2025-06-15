
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

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * IMPORTANT: Current YouTube Transcript Extraction Limitations
 * 
 * The current implementation of getYouTubeTranscript() is a PLACEHOLDER and does NOT
 * actually extract real transcripts from YouTube videos. Here's what's happening:
 * 
 * CURRENT ISSUES:
 * 1. The function fetches the YouTube watch page HTML, but YouTube's captions are loaded
 *    dynamically via JavaScript, not present in the initial HTML response
 * 2. The regex pattern looking for "captions" data won't find actual transcript content
 * 3. YouTube has anti-scraping measures that make direct HTML parsing unreliable
 * 4. The function currently returns a placeholder message instead of real transcript data
 * 
 * WHAT'S NEEDED FOR PRODUCTION:
 * 1. Use YouTube Data API v3 with proper API key and OAuth
 * 2. Use the official YouTube Transcript API (if available for the video)
 * 3. Use a third-party service like:
 *    - youtube-transcript-api (Python library equivalent for JS/TS)
 *    - AssemblyAI for audio transcription
 *    - Rev.ai or similar transcription services
 * 4. Handle videos without captions/transcripts gracefully
 * 
 * RECOMMENDED APPROACH:
 * - Implement YouTube Data API integration to check if captions exist
 * - Use a dedicated transcript extraction service or library
 * - Add fallback to audio extraction + transcription for videos without captions
 * - Add proper error handling for private/restricted videos
 * 
 * For now, this returns a placeholder to demonstrate the quiz generation flow.
 */
async function getYouTubeTranscript(videoId: string): Promise<string> {
  try {
    // Using YouTube Transcript API (you might need to implement this differently)
    // For now, we'll use a simple approach that might work for some videos
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    // Look for transcript data in the page (this is a simplified approach)
    // In a real implementation, you'd want to use the YouTube API or a dedicated transcript service
    const transcriptMatch = html.match(/"captions":\s*{[^}]*"playerCaptionsTracklistRenderer"[^}]*}/);
    
    if (!transcriptMatch) {
      throw new Error("No transcript available for this video");
    }
    
    // For now, return a placeholder message since extracting actual transcripts
    // requires more complex parsing or API access
    return `This is a placeholder transcript for video ${videoId}. In a production environment, you would implement proper YouTube transcript extraction using the YouTube API or a dedicated transcript service.`;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error("Failed to fetch transcript. Please ensure the video has captions available.");
  }
}

// Function to clean JSON string and fix common syntax issues
function cleanJsonString(jsonStr: string): string {
  let cleaned = jsonStr.replace(/,(\s*[}\]])/g, '$1');
  cleaned = cleaned.replace(/,(\s*,)/g, ',');
  cleaned = cleaned.replace(/,,/g, ',');
  return cleaned;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl } = await req.json();
    
    if (!youtubeUrl) {
      return new Response(JSON.stringify({ error: "No YouTube URL provided" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log('Processing YouTube URL:', youtubeUrl);

    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get transcript
    const transcript = await getYouTubeTranscript(videoId);

    // Generate quiz using the same prompt as the file upload function
    const prompt = `
        You are an AI assistant that generates educational content. Your task is to analyze the following text and generate multiple-choice questions and flashcards based STRICTLY on the provided content.

        Text to analyze:
        ---
        ${transcript}
        ---

        Generate the following in valid JSON format only (no other text or explanations):
        {
          "mcqs": [
            {
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "correctIndex": number,
              "explanation": "string"
            }
          ],
          "flashcards": [
            {
              "front": "string",
              "back": "string"
            }
          ]
        }

        Requirements:
        - Generate 5-20 multiple choice questions
        - Each MCQ must have exactly 4 options
        - Each MCQ must have exactly 1 correct answer
        - REQUIRED: Each MCQ must have a concise 1-sentence explanation of why the correct answer is right
        - Generate 5-20 flashcards
        - All content must come directly from the text
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

    // Extract JSON from response
    let jsonStr: string | null = null;
    const codeBlockMatch = content.match(/```json([\s\S]*?)```/i) || content.match(/```([\s\S]*?)```/);

    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    } else {
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

    jsonStr = cleanJsonString(jsonStr);
    console.log('Cleaned JSON string:', jsonStr);

    let json;
    try {
      json = JSON.parse(jsonStr);
    } catch (err) {
      console.error('JSON parse error:', err);
      return new Response(
        JSON.stringify({ error: "Failed to parse model output as JSON", raw: jsonStr, parseError: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }

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

    // Transform MCQs to desired format
    const transformedMcqs = json.mcqs.map((q: any, i: number) => ({
      id: i + 1,
      question: q.question || "",
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ["A", "B", "C", "D"],
      correct: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      explanation: q.explanation || "This is the correct answer based on the provided content."
    }));

    // Transform Flashcards to desired format
    const transformedFlashcards = json.flashcards.map((fc: any, i: number) => ({
      id: i + 1,
      topic: (fc.topic !== undefined ? fc.topic : "YouTube Video"),
      chapter: (fc.chapter !== undefined ? fc.chapter : "N/A"),
      front: fc.front || "",
      back: fc.back || "",
      difficulty: fc.difficulty !== undefined ? fc.difficulty : "medium"
    }));

    return new Response(JSON.stringify({
      mcqs: transformedMcqs,
      flashcards: transformedFlashcards,
      category: "YouTube Video"
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
