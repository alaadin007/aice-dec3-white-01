import { NextResponse } from 'next/server';
import { AssessmentResult } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const result: AssessmentResult = await request.json();
    
    // For now, we'll just return success since certificates are stored in the dashboard
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}