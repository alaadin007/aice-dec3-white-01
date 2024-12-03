export async function getYouTubeTranscript(videoUrl: string): Promise<string> {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const apiKey = process.env.NEXT_PUBLIC_SEARCHAPI_KEY;
    const response = await fetch(
      `https://www.searchapi.io/api/v1/search?engine=youtube_transcripts&video_id=${videoId}&api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch transcript');
    }

    const data = await response.json();
    if (!data.transcripts || data.transcripts.length === 0) {
      throw new Error('No transcript found for this video');
    }

    // Combine all transcript segments into a single text
    const transcript = data.transcripts
      .map((segment: { text: string }) => segment.text)
      .join(' ');

    // Clean up the transcript
    return transcript
      .replace(/\[.*?\]/g, '') // Remove timestamps and speaker labels
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  } catch (error) {
    console.error('YouTube transcript error:', error);
    throw error;
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^[a-zA-Z0-9_-]{11}$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function validateYouTubeUrl(url: string): boolean {
  return !!extractVideoId(url);
}