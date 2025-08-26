
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
import { differenceInDays, parse } from 'date-fns';

const AIExtractionSchema = z.object({
  target_date: z.string().optional().describe('The target date mentioned in the text, in YYYY-MM-DD format. If no date is mentioned, this can be omitted.'),
  total_stamps: z.number().optional().describe('The total number of stamps/activities mentioned. Omit if a daily/recurring activity is mentioned.'),
  is_daily: z.boolean().describe('Set to true if the activity is described as daily or recurring per day.'),
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

  let timePeriodDays = 0;
  let numStamps = 0;

  if (result.target_date) {
    const today = new Date();
    // Set time to 00:00:00 to ensure full days are counted
    today.setHours(0, 0, 0, 0); 
    
    // The AI returns YYYY-MM-DD, which parse() understands correctly.
    const targetDate = parse(result.target_date, 'yyyy-MM-dd', new Date());
    targetDate.setHours(0,0,0,0);

    if (!isNaN(targetDate.getTime())) {
       timePeriodDays = differenceInDays(targetDate, today);
       // Add 1 to make the period inclusive of the end date
       if (timePeriodDays >= 0) {
         timePeriodDays += 1;
       }
    }
  }

  if (result.is_daily && timePeriodDays > 0) {
    numStamps = timePeriodDays;
  } else if (result.total_stamps) {
    numStamps = result.total_stamps;
  }
  
  // A fallback in case the AI provides a duration but not a stamp count.
  if (numStamps === 0 && timePeriodDays > 0 && !result.total_stamps) {
      numStamps = timePeriodDays;
  }


  return {
    numStamps: Math.max(0, numStamps),
    timePeriodDays: Math.max(0, timePeriodDays),
  };
}

const prompt = ai.definePrompt({
  name: 'extractHabitDetailsPrompt',
  input: { schema: z.string() },
  output: { schema: AIExtractionSchema },
  prompt: `You are an expert at extracting structured information from a user's description of a habit they want to track.
Today's date is ${new Date().toLocaleDateString('en-CA')}.
From the user's condition, extract the following information:

1.  **target_date**: Identify the end date for the habit. Convert it to YYYY-MM-DD format.
    - "till October 30th" -> Figure out the year, assume current year if not specified.
    - "complete by the end of November" -> Use the last day of November.
    - If no date is mentioned, omit this field.

2.  **total_stamps**: If the user mentions a specific total number of times they want to do something (e.g., "read 5 books", "complete 10 projects"), extract that number.
    - Do NOT provide this if the activity is daily (e.g., "run every day").

3.  **is_daily**: Determine if the task is a recurring daily activity.
    - "save $10 per day", "run every day", "practice daily" -> true.
    - "read 5 books by next month" -> false.

Return the output strictly in JSON format.

Input condition: "{{{input}}}"
`,
});

const extractHabitDetailsFlow = ai.defineFlow(
  {
    name: 'extractHabitDetailsFlow',
    inputSchema: z.string(),
    outputSchema: AIExtractionSchema,
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
