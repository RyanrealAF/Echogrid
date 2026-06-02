'use server';
/**
 * @fileOverview This flow suggests creative textual descriptions and visual concepts for a given song section's 'production' cues.
 *
 * - suggestVisualTreatmentsForProductionCue - A function that handles the suggestion process.
 * - SuggestVisualTreatmentsForProductionCueInput - The input type for the suggestVisualTreatmentsForProductionCue function.
 * - SuggestVisualTreatmentsForProductionCueOutput - The return type for the suggestVisualTreatmentsForProductionCue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVisualTreatmentsForProductionCueInputSchema = z.object({
  productionCue: z
    .string()
    .describe(
      "A production cue (e.g., 'vinylcrackle', 'beatdrop', 'helicopterdistant')."
    ),
});
export type SuggestVisualTreatmentsForProductionCueInput = z.infer<
  typeof SuggestVisualTreatmentsForProductionCueInputSchema
>;

const SuggestVisualTreatmentsForProductionCueOutputSchema = z.object({
  textualDescription: z
    .string()
    .describe(
      "A creative textual description of the production cue's visual impact."
    ),
  visualConcepts: z
    .array(z.string())
    .describe(
      "A list of distinct visual concepts or animations that could represent the production cue."
    ),
  colorSuggestions: z
    .array(z.string())
    .describe(
      "Suggested HEX color codes or color palettes that evoke the feeling of the production cue."
    ),
});
export type SuggestVisualTreatmentsForProductionCueOutput = z.infer<
  typeof SuggestVisualTreatmentsForProductionCueOutputSchema
>;

export async function suggestVisualTreatmentsForProductionCue(
  input: SuggestVisualTreatmentsForProductionCueInput
): Promise<SuggestVisualTreatmentsForProductionCueOutput> {
  return suggestVisualTreatmentsForProductionCueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVisualTreatmentsForProductionCuePrompt',
  input: {schema: SuggestVisualTreatmentsForProductionCueInputSchema},
  output: {schema: SuggestVisualTreatmentsForProductionCueOutputSchema},
  prompt: `You are a creative visualizer designer assistant for a music visualizer app. Your task is to suggest creative and evocative textual descriptions and visual concepts for a given song's production cue.

The production cue is: "{{{productionCue}}}"

Based on this cue, provide:
1. A creative textual description of how this cue could visually feel or impact the user.
2. A list of distinct visual concepts or animations that represent this cue.
3. Suggested HEX color codes or color palettes that evoke the feeling of this cue, adhering to a 'cinematic grime' and 'glowing neon within shadows' aesthetic.

Example for 'beatdrop':
{
  "textualDescription": "A sudden, powerful impact that ripples through the visual field, like a sonic wave expanding from the center.",
  "visualConcepts": [
    "A sharp, outward burst of luminous violet lines from the center of the screen.",
    "The entire waveform momentarily compresses and then expands with a bright flash.",
    "Text elements experience a brief, rhythmic scale-up and fade effect, pulsing with the beat."
  ],
  "colorSuggestions": ["#774ADD", "#1A161E", "#8CCBFF"]
}
`,
});

const suggestVisualTreatmentsForProductionCueFlow = ai.defineFlow(
  {
    name: 'suggestVisualTreatmentsForProductionCueFlow',
    inputSchema: SuggestVisualTreatmentsForProductionCueInputSchema,
    outputSchema: SuggestVisualTreatmentsForProductionCueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
