
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
  prompt: `You are an expert at extracting structured information from natural language.
Your task is to parse the user's habit condition and extract two key pieces of information:
1.  \`numStamps\`: The total number of tasks or actions required.
2.  \`timePeriodDays\`: The total duration for the habit in days.

IMPORTANT:
- Today's date is ${new Date().toDateString()}.
- If the user provides a target date (e.g., "by September 7th"), you MUST calculate the number of days from today to that date.
- If the user provides a duration (e.g., "in 2 months"), convert it to days. Assume 1 month = 30 days.
- Look for phrases that indicate the number of tasks, like "complete 12 projects", "run 10 times", "meditate for 15 sessions".

Here are some examples:
- Condition: "buy a canon g7x if you complete 12 design projects by 7th September"
  - numStamps: 12
  - timePeriodDays: [calculate days from today to Sept 7]
- Condition: "Go on a vacation if I read 5 books in the next 2 months"
  - numStamps: 5
  - timePeriodDays: 60
- Condition: "Finish the main story of a video game in 30 days"
  - numStamps: 1 (since it's one main goal)
  - timePeriodDays: 30

Now, parse the following condition:
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
