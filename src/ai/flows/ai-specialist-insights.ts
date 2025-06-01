// 'use server'
'use server';

/**
 * @fileOverview An AI agent that integrates expert knowledge from various medical specialties to provide in-depth analysis of a patient's case.
 *
 * - getSpecialistInsights - A function that handles the process of gathering specialist insights for a patient's case.
 * - SpecialistInsightsInput - The input type for the getSpecialistInsights function.
 * - SpecialistInsightsOutput - The return type for the getSpecialistInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpecialistInsightsInputSchema = z.object({
  patientInfo: z
    .string()
    .describe("Comprehensive patient information, including symptoms, medical history, and any relevant test results."),
  specialty: z.string().describe('The medical specialty to focus on for insights (e.g., Cardiology, Neurology).'),
});
export type SpecialistInsightsInput = z.infer<typeof SpecialistInsightsInputSchema>;

const SpecialistInsightsOutputSchema = z.object({
  insights: z.string().describe('In-depth analysis and insights from the specified medical specialty regarding the patient case.'),
  recommendations: z.string().describe('Specific recommendations or next steps based on the specialist insights.'),
});
export type SpecialistInsightsOutput = z.infer<typeof SpecialistInsightsOutputSchema>;

export async function getSpecialistInsights(input: SpecialistInsightsInput): Promise<SpecialistInsightsOutput> {
  return specialistInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'specialistInsightsPrompt',
  input: {schema: SpecialistInsightsInputSchema},
  output: {schema: SpecialistInsightsOutputSchema},
  prompt: `You are an AI medical expert specializing in {{{specialty}}}.

  Analyze the following patient information and provide in-depth insights and recommendations from your specialty's perspective.

  Patient Information: {{{patientInfo}}}

  Focus your analysis on identifying potential issues, suggesting further investigations, and offering relevant treatment options based on the provided information.
  Format the output in a clear and concise manner, suitable for medical professionals.
  `,
});

const specialistInsightsFlow = ai.defineFlow(
  {
    name: 'specialistInsightsFlow',
    inputSchema: SpecialistInsightsInputSchema,
    outputSchema: SpecialistInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
