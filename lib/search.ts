import { AssessmentResult } from './types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface SearchResult {
  confidence: 'High' | 'Medium' | 'Low';
  evidence: {
    direct: {
      assessments: AssessmentResult[];
      description: string;
    };
    related: {
      assessments: AssessmentResult[];
      description: string;
    };
  };
  recommendations: string[];
  lastDemonstrated?: string;
}

export async function searchCompetencies(
  query: string,
  assessments: AssessmentResult[]
): Promise<SearchResult> {
  const prompt = `
    Analyze the following learning history and respond to this query: "${query}"

    Learning History:
    ${JSON.stringify(assessments, null, 2)}

    Provide a detailed analysis in the following JSON format:
    {
      "confidence": "High|Medium|Low",
      "evidence": {
        "direct": {
          "assessments": [list of relevant assessment IDs],
          "description": "Description of directly demonstrated skills"
        },
        "related": {
          "assessments": [list of related assessment IDs],
          "description": "Description of related or inferred skills"
        }
      },
      "recommendations": [
        "List of recommendations for additional skill verification"
      ],
      "lastDemonstrated": "Date of most recent relevant assessment"
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing learning histories and competencies.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Failed to analyze competencies');

    return JSON.parse(content);
  } catch (error) {
    console.error('Competency search error:', error);
    throw error;
  }
}