'use server';
/**
 * @fileOverview AI avatar creation flow to transform an image into various professional personas.
 *
 * - aiAvatarCreation - A function that handles the avatar creation process.
 * - AiAvatarCreationInput - The input type for the aiAvatarCreation function.
 * - AiAvatarCreationOutput - The return type for the aiAvatarCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAvatarCreationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  profession: z.string().describe('The desired profession for the avatar.'),
});
export type AiAvatarCreationInput = z.infer<typeof AiAvatarCreationInputSchema>;

const AiAvatarCreationOutputSchema = z.object({
  avatarDataUri: z.string().describe('The generated avatar as a data URI.'),
});
export type AiAvatarCreationOutput = z.infer<typeof AiAvatarCreationOutputSchema>;

export async function aiAvatarCreation(input: AiAvatarCreationInput): Promise<AiAvatarCreationOutput> {
  return aiAvatarCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAvatarCreationPrompt',
  input: {schema: AiAvatarCreationInputSchema},
  output: {schema: AiAvatarCreationOutputSchema},
  prompt: `You are an AI that can transform a user's photo into an avatar representing a specific profession.

  The user will provide a photo and the desired profession. Your task is to generate a new image that depicts the user as a professional in that field.

  Here is the user's photo: {{media url=photoDataUri}}
  The desired profession is: {{{profession}}}

  Create a professional avatar that reflects the specified profession using the provided image.
  Make sure the generated image is realistic and suitable for professional use.
`,
});

const aiAvatarCreationFlow = ai.defineFlow(
  {
    name: 'aiAvatarCreationFlow',
    inputSchema: AiAvatarCreationInputSchema,
    outputSchema: AiAvatarCreationOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: `Create a realistic avatar of the person in the photo as a {{{profession}}}`},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

    return { avatarDataUri: media!.url };
  }
);
