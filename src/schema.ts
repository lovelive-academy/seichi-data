import { z } from "zod";

export const spotInputSchema = z.object({
	series: z.string().min(1),
	title: z.string().min(1),
	plusCode: z.string().min(1),
	description: z.string().min(1).nullable(),
	imageOptionId: z.string().nullable(),
});

export type SpotInput = z.infer<typeof spotInputSchema>;

export interface SpotData {
	series: string;
	seriesName: string;
	title: string;
	lat: number;
	lng: number;
	description: string | null;
	imageBytes: Uint8Array | null;
	discordUsername: string;
	discordUserId: string;
}
