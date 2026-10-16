import { z } from "zod";

export const spotInputSchema = z.object({
	series: z.string().min(1),
	title: z.string().min(1),
	plusCode: z.string().min(1),
	description: z.string().min(1).nullable(),
	tags: z.string().min(1).nullable(),
	image: z.string().min(1).nullable(),
	anonymous: z.boolean().nullable(),
});

export interface SpotData {
	series: Series;
	title: string;
	lat: number;
	lng: number;
	description: string | null;
	tags: string[];
	imageBytes: Uint8Array | null;
	anonymous: boolean;
	discordUsername: string;
	discordUserId: string;
}

export const seriesSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string(),
});

export const seriesJSONSchema = z.object({ series: z.array(seriesSchema) });
export const tagsSchema = z.array(z.string());

export const featureSchema = z.object({
	type: z.literal("Feature"),
	id: z.string(),
	geometry: z.object({
		type: z.literal("Point"),
		coordinates: z.array(z.number()).length(2),
	}),
	properties: z.object({
		title: z.string(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		image: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

export const featureViewSchema = featureSchema.extend({
	properties: featureSchema.shape.properties.extend({
		series: seriesSchema,
	}),
});

export const featureCollectionSchema = z.object({
	type: z.literal("FeatureCollection"),
	features: z.array(featureSchema),
});

export const featureResSchema = z.object({
	type: z.literal("FeatureCollection"),
	features: z.array(featureViewSchema),
});

export const geocodeResSchema = z.object({
	location: z.object({ lat: z.number(), lon: z.number() }).nullable(),
});

export type SpotInput = z.infer<typeof spotInputSchema>;
export type Series = z.infer<typeof seriesSchema>;
export type SeriesJSON = z.infer<typeof seriesJSONSchema>;
export type Tags = z.infer<typeof tagsSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type FeatureCollection = z.infer<typeof featureCollectionSchema>;
export type FeatureView = z.infer<typeof featureViewSchema>;
export type FeatureRes = z.infer<typeof featureResSchema>;
export type GeocodeRes = z.infer<typeof geocodeResSchema>;
