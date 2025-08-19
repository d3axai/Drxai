// src/ai/flows/background-replacement.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for replacing the background of an image using AI.
 *
 * - `backgroundReplacement`: A function that takes an image and a background prompt and returns a new image with the replaced background.
 * - `BackgroundReplacementInput`: The input type for the `backgroundReplacement` function.
 * - `BackgroundReplacementOutput`: The output type for the `backgroundReplacement` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BackgroundReplacementInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  backgroundPrompt: z.string().describe('A description of the desired background.'),
});
export type BackgroundReplacementInput = z.infer<typeof BackgroundReplacementInputSchema>;

const BackgroundReplacementOutputSchema = z.object({
  replacedPhotoDataUri: z
    .string()
    .describe(
      'A photo with the background replaced, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // intentionally escaped, not a template string
    ),
});
export type BackgroundReplacementOutput = z.infer<typeof BackgroundReplacementOutputSchema>;

export async function backgroundReplacement(input: BackgroundReplacementInput): Promise<BackgroundReplacementOutput> {
  return backgroundReplacementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'backgroundReplacementPrompt',
  input: {schema: BackgroundReplacementInputSchema},
  output: {schema: BackgroundReplacementOutputSchema},
  prompt: `Replace the background of the photo with a scene described as "{{{backgroundPrompt}}}".

Use the following photo as input: {{media url=photoDataUri}}

Return the new photo with the replaced background as a data URI in the output.`, // Ensure correct Handlebars usage
});

const backgroundReplacementFlow = ai.defineFlow(
  {
    name: 'backgroundReplacementFlow',
    inputSchema: BackgroundReplacementInputSchema,
    outputSchema: BackgroundReplacementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
