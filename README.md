# AssemblyAI Transcriber

A reliable backup speech-to-text transcription service using AssemblyAI API. This implementation provides the same functionality as the OpenAI Whisper transcriber but with a more stable API integration.

## Features

- Audio and video file transcription
- Drag and drop file upload
- Multiple output formats (TXT, SRT, VTT, JSON, CSV)
- Real-time progress logging
- Copy to clipboard functionality
- Responsive design
- Error handling with detailed messages

## Setup Instructions

1. Create a free AssemblyAI account at [assemblyai.com](https://www.assemblyai.com/)
2. Get your API key from the dashboard
3. Set the environment variable `ASSEMBLYAI_API_KEY` in your Netlify site settings
4. Deploy to Netlify

## Deployment to Netlify

1. Create a new site on Netlify
2. Link this repository to your Netlify site
3. Set the environment variable `ASSEMBLYAI_API_KEY` in Netlify site settings
4. Set the build command to: `npm run build`
5. Set the publish directory to: `client/dist`

## API Endpoints

- `POST /api/transcribe` - Upload file and start transcription
- `GET /api/transcript/{id}` - Poll for transcription results

## File Size Limits

AssemblyAI supports files up to 100MB, which is more generous than OpenAI's 25MB limit.

## Supported Formats

- MP3
- WAV
- MP4
- MOV
- AVI
- And many other audio/video formats

## Implementation Details

This implementation uses:
- React for the frontend
- Netlify Functions for the backend
- AssemblyAI API for transcription
- Vite for building the client

The transcription process works in two steps:
1. Upload the file to AssemblyAI and get a transcript ID
2. Poll for results using the transcript ID until completion

This approach is more reliable than streaming directly to the transcription API and provides better error handling.