import { defineFunction } from '@aws-amplify/backend';

export const geminiFunction = defineFunction({
  name: 'gemini-function',
  entry: './handler.ts',
  environment: {
    // Read from Amplify environment variables or secret store
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
  timeoutSeconds: 30,
});
