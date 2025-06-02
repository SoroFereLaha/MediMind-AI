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
  insights: z.string().describe('In-depth analysis and insights from the specified medical specialty regarding the patient case. If the case is out of scope, this section should explain why.'),
  recommendations: z.string().describe('Specific recommendations or next steps based on the specialist insights. If the case is out of scope, this section should suggest a more appropriate specialist.'),
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

Your primary role is to analyze patient information IF it falls within your specialty.

Patient Information: {{{patientInfo}}}

1.  First, critically evaluate if the provided \`patientInfo\` is relevant to your specialty as a {{{specialty}}}.
2.  If the \`patientInfo\` IS primarily relevant to your specialty:
    *   Provide in-depth insights and analysis in the 'insights' section.
    *   Offer specific recommendations or next steps in the 'recommendations' section.
    *   Focus on identifying potential issues, suggesting further investigations, and relevant treatment options from your specialty's perspective.
3.  If the \`patientInfo\` IS NOT primarily relevant to your specialty, or if another specialty would be more appropriate:
    *   In the 'insights' section, clearly state that the main concerns seem to be outside your core expertise as a {{{specialty}}}. Do not attempt to provide a full diagnosis or treatment plan if it's outside your scope.
    *   In the 'recommendations' section, suggest a more appropriate medical specialty or type of specialist for the patient to consult.
4.  Format your entire response according to the SpecialistInsightsOutputSchema (insights and recommendations). The output must be clear, concise, and suitable for medical professionals.
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
