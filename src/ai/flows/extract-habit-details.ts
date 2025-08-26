
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
1.  \`timePeriodDays\`: The total duration for the habit in days.
2.  \`numStamps\`: The total number of tasks or actions required.

**THE MOST IMPORTANT RULE:**
- If the condition implies a daily action (e.g., "per day", "every day", "daily"), the \`numStamps\` MUST be exactly equal to the calculated \`timePeriodDays\`.

OTHER RULES:
- Today's date is ${new Date().toISOString().split('T')[0]}.
- If the user provides a target date (e.g., "by September 7th" or "till October 30"), you MUST calculate the number of days from today to that date. Use the current year. If the date has already passed this year, assume it's for the next year.
- If the user provides a duration (e.g., "in 2 months"), convert it to days. Assume 1 month = 30 days, 1 week = 7 days.
- If no specific number of tasks is mentioned and it is not a daily action, assume \`numStamps\` is 1 (for completing a single goal).

Here are some examples:
- Condition: "If I save up 500Rs per day till October 30"
  - timePeriodDays: [calculate days from today to Oct 30]
  - numStamps: [must be the same as timePeriodDays]
- Condition: "Go on a vacation if I read 5 books in the next 2 months"
  - timePeriodDays: 60
  - numStamps: 5
- Condition: "buy a canon g7x if you complete 12 design projects by 7th September"
  - timePeriodDays: [calculate days from today to Sept 7]
  - numStamps: 12
- Condition: "Finish the main story of a video game in 30 days"
  - timePeriodDays: 30
  - numStamps: 1

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
