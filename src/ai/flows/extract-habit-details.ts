
'use server';
/**
 * @fileOverview A flow for extracting habit details from a text description.
 *
 * - extractHabitDetails - A function that extracts the number of stamps and time period.
 * - ExtractHabitDetailsOutput - The return type for the extractHabitDetails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { fromZodError } from 'zod-validation-error';

const ExtractHabitDetailsOutputSchema = z.object({
  number_of_stamps: z.number().describe('The number of stamps to complete the habit.'),
  time_period_days: z.number().describe('The number of days to complete the habit.'),
});

// This is the type that the rest of the application will use.
export type ExtractHabitDetailsOutput = {
  numStamps: number;
  timePeriodDays: number;
};

export async function extractHabitDetails(
  condition: string
): Promise<ExtractHabitDetailsOutput> {
  const result = await extractHabitDetailsFlow(condition);
  if (!result) {
    throw new Error('Failed to extract habit details');
  }
   // Map the AI's output to the format the application expects.
  return {
    numStamps: result.number_of_stamps,
    timePeriodDays: result.time_period_days,
  };
}

const prompt = ai.definePrompt({
  name: 'extractHabitDetailsPrompt',
  input: { schema: z.string() },
  output: { schema: ExtractHabitDetailsOutputSchema },
  prompt: `You are given a condition in natural language about completing a task within a time limit.
Extract the following fields:

1. number_of_stamps →
   - If the condition mentions a recurring rate (e.g., "per day", "every day", "daily"), multiply the rate by the number of days in the time period.
     Example: "save Rs.500 per day till October 30" → if the period is 64 days, number_of_stamps = 64.
   - If the condition mentions a total goal (e.g., "12 projects", "5 workouts"), set this directly to that number.

2. time_period_days →
   - Convert the time range into the total number of days between today’s date (${new Date().toISOString().split('T')[0]}) and the target end date mentioned.
   - If the condition specifies a month-end (e.g., "till November"), use the last day of that month as the end date.

Return the output **strictly in JSON** format.

Input condition: "{{{input}}}"
`,
});

const extractHabitDetailsFlow = ai.defineFlow(
  {
    name: 'extractHabitDetailsFlow',
    inputSchema: z.string(),
    outputSchema: ExtractHabitDetailsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('No output from prompt');
      }
      return output;
    } catch (e) {
      if (e instanceof z.ZodError) {
        throw fromZodError(e);
      }
      throw e;
    }
  }
);
