import { NextResponse } from 'next/server';
import { getYouTubeTranscript } from '@/lib/searchapi';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const transcript = await getYouTubeTranscript(url);
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('YouTube transcript error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube transcript' },
      { status: 500 }
    );
  }
}