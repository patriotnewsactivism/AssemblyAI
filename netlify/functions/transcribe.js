// AssemblyAI Transcription Function for Netlify
// This function handles file uploads and transcription requests

const fetch = require('node-fetch');

export default async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Use POST" }), { status: 405 });
    }

    // Get AssemblyAI API key from environment variables
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "Missing ASSEMBLYAI_API_KEY environment variable" 
      }), { status: 500 });
    }

    // Log request for debugging
    console.log("AssemblyAI transcription request received");
    
    // Upload file to AssemblyAI first
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": req.headers.get("content-type") || ""
      },
      body: req.body
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("File upload failed:", errorData);
      return new Response(JSON.stringify({ 
        error: "File upload failed",
        details: errorData.error || "Unknown upload error"
      }), { status: 500 });
    }

    const uploadData = await uploadResponse.json();
    const audioUrl = uploadData.upload_url;

    // Start transcription
    const transcribeResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        format_text: true,
        punctuate: true
      })
    });

    if (!transcribeResponse.ok) {
      const errorData = await transcribeResponse.json();
      console.error("Transcription start failed:", errorData);
      return new Response(JSON.stringify({ 
        error: "Transcription failed to start",
        details: errorData.error || "Unknown error"
      }), { status: 500 });
    }

    const transcribeData = await transcribeResponse.json();
    const transcriptId = transcribeData.id;

    // Return transcript ID for client-side polling
    return new Response(JSON.stringify({
      id: transcriptId,
      status: "queued"
    }), { 
      status: 202, // Accepted
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