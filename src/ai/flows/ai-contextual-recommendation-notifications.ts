'use server';
/**
 * @fileOverview AI-driven contextual recommendations and notifications flow.
 *
 * - getContextualRecommendations - A function that provides contextual recommendations and notifications based on patient data.
 * - ContextualRecommendationsInput - The input type for the getContextualRecommendations function.
 * - ContextualRecommendationsOutput - The return type for the getContextualRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualRecommendationsInputSchema = z.object({
  symptoms: z.string().describe('The patient symptoms.'),
  medicalHistory: z.string().describe('The patient medical history.'),
});
export type ContextualRecommendationsInput = z.infer<
  typeof ContextualRecommendationsInputSchema
>;

const ContextualRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('The AI-driven contextual recommendations and notifications.'),
});
export type ContextualRecommendationsOutput = z.infer<
  typeof ContextualRecommendationsOutputSchema
>;

export async function getContextualRecommendations(
  input: ContextualRecommendationsInput
): Promise<ContextualRecommendationsOutput> {
  return contextualRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualRecommendationsPrompt',
  input: {schema: ContextualRecommendationsInputSchema},
  output: {schema: ContextualRecommendationsOutputSchema},
  prompt: `Based on the patient's symptoms: {{{symptoms}}} and medical history: {{{medicalHistory}}}, provide AI-driven contextual recommendations and notifications to proactively address potential health concerns and schedule timely follow-ups.`,
});

const contextualRecommendationsFlow = ai.defineFlow(
  {
    name: 'contextualRecommendationsFlow',
    inputSchema: ContextualRecommendationsInputSchema,
    outputSchema: ContextualRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
