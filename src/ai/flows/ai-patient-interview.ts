// This is an auto-generated file from Firebase Studio.

'use server';

/**
 * @fileOverview An AI-powered patient interview flow.
 *
 * - aiPatientInterview - A function that initiates the AI patient interview.
 * - AiPatientInterviewInput - The input type for the aiPatientInterview function.
 * - AiPatientInterviewOutput - The return type for the aiPatientInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPatientInterviewInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  initialComplaint: z.string().describe('The patient\'s initial complaint or symptoms.'),
});
export type AiPatientInterviewInput = z.infer<typeof AiPatientInterviewInputSchema>;

const AiPatientInterviewOutputSchema = z.object({
  interviewSummary: z.string().describe('A summary of the AI patient interview.'),
  suggestedSpecialty: z.string().describe('A suggested medical specialty based on the interview.'),
});
export type AiPatientInterviewOutput = z.infer<typeof AiPatientInterviewOutputSchema>;

export async function aiPatientInterview(input: AiPatientInterviewInput): Promise<AiPatientInterviewOutput> {
  return aiPatientInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPatientInterviewPrompt',
  input: {schema: AiPatientInterviewInputSchema},
  output: {schema: AiPatientInterviewOutputSchema},
  prompt: `You are an AI-powered general practitioner. Your role is to interview patients, gather information about their symptoms and medical history, and provide an initial assessment.

  Patient Name: {{{patientName}}}
  Initial Complaint: {{{initialComplaint}}}

  Based on the information provided, conduct an interactive interview with the patient to gather more details about their symptoms, medical history, and any other relevant information. Ask clarifying questions and probe for more information as needed. Once you have gathered sufficient information, provide a summary of the interview and suggest a medical specialty that the patient should consult for further evaluation. Ensure the output is structured according to the AiPatientInterviewOutputSchema.
  `,
});

const aiPatientInterviewFlow = ai.defineFlow(
  {
    name: 'aiPatientInterviewFlow',
    inputSchema: AiPatientInterviewInputSchema,
    outputSchema: AiPatientInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
