import { NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.length < 50 || text.length > 2500) {
      return NextResponse.json(
        { error: 'Text must be between 50 and 2500 words' },
        { status: 400 }
      );
    }

    const assessment = await generateQuestions(text);
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Assessment generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate assessment' },
      { status: 500 }
    );
  }
}