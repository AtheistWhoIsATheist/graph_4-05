import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeNoteWithGemini(content: string) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. Returning mock data.');
    return {
      aporiaMarkers: ['Mock Aporia: The tension between being and nothingness.']
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Analyze the following philosophical note and extract "aporia markers" (points of irresolvable contradiction, paradox, or profound doubt). Return the result as a JSON object with an array of strings under the key "aporiaMarkers".\n\nNote Content:\n${content}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aporiaMarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: 'List of aporia markers identified in the text.'
            }
          },
          required: ['aporiaMarkers']
        }
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return parsed as { aporiaMarkers: string[] };
    }
    return { aporiaMarkers: [] };
  } catch (error) {
    console.error('Error analyzing note with Gemini:', error);
    return { aporiaMarkers: [] };
  }
}
