import OpenAI from 'openai';
import { Assessment, LearningOutcome } from './types';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

async function analyzeLearningOutcome(text: string): Promise<LearningOutcome> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `
      You are an advanced educational assistant responsible for calculating both CPD (Continuing Professional Development) and AiCE (Artificial Intelligence Credit Education) points.

      CRITICAL RULES:

      1. Learning Time Calculation:
         - First, determine the actual learning time in hours based on content length and complexity
         - This learning time will be used for BOTH CPD and AiCE calculations
         - Be consistent and realistic with time estimates
         - For video content, use the actual video length as a base
         - For text content, estimate based on reading and comprehension time

      2. CPD Points Calculation:
         - CPD points are EXACTLY equal to learning time in hours
         - Example: 2 hours learning time = 2 CPD points
         - Academic level is shown but does NOT affect CPD points

      3. AiCE Points Calculation:
         - Use the SAME learning time as CPD calculation
         - Multiply learning time by level multiplier:
           * Middle School: 2 AiCE/hour
           * High School: 4 AiCE/hour
           * Undergraduate: 6 AiCE/hour
           * Master's: 8 AiCE/hour
           * PhD: 10 AiCE/hour
         - Example: 2 hours at Undergraduate level = 2 × 6 = 12 AiCE points

      4. Academic Level Assessment:
         - Evaluate content complexity objectively
         - Consider vocabulary, concepts, and required background knowledge
         - Be consistent in level assignment

      Analyze the following text and provide calculations:

      ${text}

      Respond in JSON format with:
      {
        "title": "Clear, descriptive title of the learning material",
        "kiuAllocation": "calculated AiCE points (number)",
        "cpdPoints": "learning time in hours (number)",
        "summary": "Concise summary of the material",
        "academicLevel": "one of: Middle School, High School, Undergraduate, Master's, PhD",
        "learningTime": "same as cpdPoints (number)"
      }

      IMPORTANT: Double-check that:
      1. learningTime equals cpdPoints
      2. kiuAllocation equals learningTime × level multiplier
      3. All calculations are consistent and mathematically correct
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI that analyzes educational content. Always respond with valid JSON and ensure calculations are consistent.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Failed to analyze learning outcome');

    const result = JSON.parse(content);

    // Validate calculations
    const levelMultipliers: { [key: string]: number } = {
      'Middle School': 2,
      'High School': 4,
      'Undergraduate': 6,
      'Master\'s': 8,
      'PhD': 10
    };

    const multiplier = levelMultipliers[result.academicLevel];
    const expectedAiCE = result.learningTime * multiplier;

    // Force consistency in calculations
    result.cpdPoints = result.learningTime;
    result.kiuAllocation = expectedAiCE;

    return result;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(error.message || 'Failed to analyze learning outcome');
  }
}

async function generateQuestionsOnly(text: string) {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `
      Analyze the following text and create 2 multiple-choice questions:
      - 1 easy question (50%)
      - 1 hard question (50%)
      Each question should have 4 options with one correct answer.
      
      Format the response as a JSON object with:
      {
        "questions": [
          {
            "id": number,
            "text": "question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": number (0-3),
            "difficulty": "easy" | "hard"
          }
        ],
        "topic": "main topic of the text"
      }

      Text to analyze: ${text}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI that generates multiple choice questions based on provided text. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Failed to generate questions');

    return JSON.parse(content);
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(error.message || 'Failed to generate questions');
  }
}

export async function generateQuestions(text: string): Promise<Assessment> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const [questionsResponse, learningOutcome] = await Promise.all([
      generateQuestionsOnly(text),
      analyzeLearningOutcome(text)
    ]);

    return {
      ...questionsResponse,
      learningOutcome
    };
  } catch (error: any) {
    console.error('Assessment generation error:', error);
    throw new Error(error.message || 'Failed to generate assessment');
  }
}