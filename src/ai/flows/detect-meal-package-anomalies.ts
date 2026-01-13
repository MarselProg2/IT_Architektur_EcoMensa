'use server';
/**
 * @fileOverview An anomaly detection AI agent for meal package consumption.
 *
 * - detectMealPackageAnomalies - A function that handles the anomaly detection process.
 * - DetectMealPackageAnomaliesInput - The input type for the detectMealPackageAnomalies function.
 * - DetectMealPackageAnomaliesOutput - The return type for the detectMealPackageAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMealPackageAnomaliesInputSchema = z.object({
  mealPackageName: z.string().describe('The name of the meal package to analyze.'),
  historicalData: z.string().describe('Historical data of meal package consumption (e.g., JSON format).'),
  currentStock: z.number().describe('The current stock of the meal package.'),
  expectedStock: z.number().describe('The expected stock of the meal package based on historical data.'),
});
export type DetectMealPackageAnomaliesInput = z.infer<
  typeof DetectMealPackageAnomaliesInputSchema
>;

const DetectMealPackageAnomaliesOutputSchema = z.object({
  isAnomaly: z.boolean().describe('Whether an anomaly in meal package consumption is detected.'),
  anomalyExplanation: z
    .string()
    .describe('Explanation of the anomaly, including potential reasons.'),
  suggestedActions: z.string().describe('Suggested actions to address the anomaly.'),
});
export type DetectMealPackageAnomaliesOutput = z.infer<
  typeof DetectMealPackageAnomaliesOutputSchema
>;

export async function detectMealPackageAnomalies(
  input: DetectMealPackageAnomaliesInput
): Promise<DetectMealPackageAnomaliesOutput> {
  return detectMealPackageAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMealPackageAnomaliesPrompt',
  input: {schema: DetectMealPackageAnomaliesInputSchema},
  output: {schema: DetectMealPackageAnomaliesOutputSchema},
  prompt: `You are an expert in anomaly detection, specializing in meal package consumption analysis for university mensas.

You will analyze the provided historical data and current stock information to identify any anomalies in consumption patterns.

Based on your analysis, you will determine if an anomaly exists, explain the potential reasons for the anomaly, and suggest actions to address it.

Meal Package Name: {{{mealPackageName}}}
Historical Data: {{{historicalData}}}
Current Stock: {{{currentStock}}}
Expected Stock: {{{expectedStock}}}

Respond in a structured JSON format:
{
  "isAnomaly": true/false,
  "anomalyExplanation": "Explanation of the anomaly",
  "suggestedActions": "Suggested actions to address the anomaly"
}`,
});

const detectMealPackageAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectMealPackageAnomaliesFlow',
    inputSchema: DetectMealPackageAnomaliesInputSchema,
    outputSchema: DetectMealPackageAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
