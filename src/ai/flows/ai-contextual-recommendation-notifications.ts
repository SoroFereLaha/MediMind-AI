
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
  age: z.number().optional().describe("The patient's age."),
  sex: z.string().optional().describe("The patient's sex (e.g., Male, Female, Other)."),
  currentActivityLevel: z.string().optional().describe("The patient's current general activity level (e.g., Sedentary, Light, Moderate, Active)."),
  recentSleepQuality: z.string().optional().describe("The patient's recent sleep quality (e.g., Poor, Average, Good)."),
  location: z.string().optional().describe("The patient's current location (e.g., city or general area) for context like local weather or health advisories, if applicable to your general knowledge."),
  timeOfDay: z.string().optional().describe("The current time of day (e.g., Morning, Afternoon, Evening) for time-specific advice."),
  medications: z.string().optional().describe("A list of current medications and supplements the patient is taking."),
  weightKg: z.number().optional().describe("The patient's current weight in kilograms."),
  heightCm: z.number().optional().describe("The patient's current height in centimeters."),
  healthGoals: z.string().optional().describe("The patient's primary health goals (e.g., lose weight, manage stress)."),
  stressLevel: z.string().optional().describe("The patient's recent stress level (e.g., Low, Medium, High)."),
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
  prompt: `You are an AI health assistant. Provide AI-driven contextual recommendations and notifications.
Consider the following patient information:
- Symptoms: {{{symptoms}}}
- Medical History: {{{medicalHistory}}}
{{#if age}}- Age: {{{age}}}{{/if}}
{{#if sex}}- Sex: {{{sex}}}{{/if}}
{{#if medications}}- Current Medications: {{{medications}}}{{/if}}
{{#if weightKg}}- Weight: {{{weightKg}}} kg{{/if}}
{{#if heightCm}}- Height: {{{heightCm}}} cm{{/if}}
{{#if healthGoals}}- Health Goals: {{{healthGoals}}}{{/if}}
{{#if currentActivityLevel}}- Current Activity Level: {{{currentActivityLevel}}}{{/if}}
{{#if recentSleepQuality}}- Recent Sleep Quality: {{{recentSleepQuality}}}{{/if}}
{{#if stressLevel}}- Recent Stress Level: {{{stressLevel}}}{{/if}}
{{#if location}}- Current Location Context: {{{location}}} (use for weather-dependent advice if applicable, or local health alerts if relevant and you have that capability as a general AI){{/if}}
{{#if timeOfDay}}- Current Time of Day Context: {{{timeOfDay}}} (use to make recommendations more timely, e.g., morning routine, evening wind-down){{/if}}

Based on this, provide recommendations to proactively address potential health concerns, suggest lifestyle adjustments, and schedule timely follow-ups if necessary.
If some optional information is not provided, make the best recommendations you can with the available data.
Consider potential interactions if medications are listed. Calculate BMI if weight and height are provided and use it in your recommendations if relevant.
Tailor advice to the stated health goals.
Adapt recommendations based on activity level, sleep quality, and stress level.`,
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

