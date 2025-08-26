
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
  numStamps: z.number().describe('The number of stamps to complete the habit.'),
  timePeriodDays: z.number().describe('The number of days to complete the habit.'),
});

export type ExtractHabitDetailsOutput = z.infer<
  typeof ExtractHabitDetailsOutputSchema
>;

export async function extractHabitDetails(
  condition: string
): Promise<ExtractHabitDetailsOutput> {
  const result = await extractHabitDetailsFlow(condition);
  if (!result) {
    throw new Error('Failed to extract habit details');
  }
  return result;
}

const prompt = ai.definePrompt({
  name: 'extractHabitDetailsPrompt',
  input: { schema: z.string() },
  output: { schema: ExtractHabitDetailsOutputSchema },
  prompt: `You are an expert at extracting structured information from text.
From the following user-provided condition for a habit, extract the total number of stamps (tasks) to complete and the total time period in days.

If the user provides an end date, calculate the number of days from today. Today is ${new Date().toDateString()}.
If the user provides a duration (e.g., "in 30 days", "in 2 months"), convert that to a total number of days. Assume 30 days in a month.

Condition: {{{input}}}
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
