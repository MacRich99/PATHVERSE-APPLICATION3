import { GoogleGenerativeAI } from '@google/generative-ai';
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

/**
 * AWS Amplify Gen 2 Backend Lambda Function for Gemini API
 * Accepts POST requests at /api/gemini with body: { prompt: "user query" }
 * Returns JSON: { text: "gemini AI response" }
 */
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Standard CORS headers for AWS Amplify / API Gateway
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
  };

  // Handle HTTP OPTIONS preflight request
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS Preflight OK' }),
    };
  }

  try {
    // Read the secret GEMINI_API_KEY from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'GEMINI_API_KEY environment variable is not configured on the server.',
        }),
      };
    }

    // Parse the incoming JSON body
    let body: { prompt?: string } = {};
    if (event.body) {
      try {
        const rawBody = event.isBase64Encoded
          ? Buffer.from(event.body, 'base64').toString('utf-8')
          : event.body;
        body = JSON.parse(rawBody);
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON body in request.' }),
        };
      }
    }

    const { prompt } = body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required in JSON body: { "prompt": "..." }' }),
      };
    }

    // Initialize the official Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content using gemini-1.5-flash
    const result = await model.generateContent(prompt.trim());
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text }),
    };
  } catch (err: any) {
    console.error('Error in Gemini handler:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err?.message || 'An error occurred while generating response from Gemini API.',
      }),
    };
  }
};
