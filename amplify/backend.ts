import { defineBackend } from '@aws-amplify/backend';
import { geminiFunction } from './functions/gemini/resource';

/**
 * AWS Amplify Gen 2 Backend Definition
 * Wires the Gemini Lambda function resource to the Amplify backend infrastructure.
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
export const backend = defineBackend({
  geminiFunction,
});
