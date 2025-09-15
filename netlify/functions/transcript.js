// AssemblyAI Transcript Polling Function for Netlify
// This function polls for transcription results

const fetch = require('node-fetch');

export default async (req) => {
  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Use GET" }), { status: 405 });
    }

    // Get transcript ID from URL path
    const url = new URL(req.url);
    const transcriptId = url.pathname.split('/').pop();
    
    if (!transcriptId || transcriptId === "transcript") {
      return new Response(JSON.stringify({ error: "Missing transcript ID" }), { status: 400 });
    }

    // Get AssemblyAI API key from environment variables
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "Missing ASSEMBLYAI_API_KEY environment variable" 
      }), { status: 500 });
    }

    // Poll for transcription result
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      method: "GET",
      headers: {
        "Authorization": apiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Transcript polling failed:", errorData);
      return new Response(JSON.stringify({ 
        error: "Failed to get transcript",
        details: errorData.error || "Unknown error"
      }), { status: 500 });
    }

    const transcriptData = await response.json();
    
    // Return the transcript data
    return new Response(JSON.stringify(transcriptData), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ 
      error: "Server error",
      message: err.message
    }), { status: 500 });
  }
};