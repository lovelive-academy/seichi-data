import { z } from "zod";
import type { Series, SpotFeature } from "../types.ts";

const seriesSchema = z.object({
	series: z.array(
		z.object({ id: z.string(), name: z.string(), color: z.string() }),
	),
});

const pointFeatureSchema = z.object({
	geometry: z.object({
		type: z.literal("Point"),
		coordinates: z.array(z.number()),
	}),
	properties: z.object({
		title: z.string(),
		description: z.string(),
		episode: z.string().optional(),
		image: z.string().optional(),
	}),
});

const featureCollectionSchema = z.object({
	features: z.array(z.unknown()),
});

export async function loadSeriesAndFeatures(): Promise<{
	series: Series[];
	features: SpotFeature[];
}> {
	const seriesRes = await fetch("/series.json");
	const { series } = seriesSchema.parse(await seriesRes.json());

	const features: SpotFeature[] = [];
	for (const s of series) {
		const geoRes = await fetch(`/${s.id}.geojson`);
		const { features: raw } = featureCollectionSchema.parse(
			await geoRes.json(),
		);
		for (const f of raw) {
			const parsed = pointFeatureSchema.safeParse(f);
			if (!parsed.success) continue;
			features.push({
				type: "Feature",
				geometry: parsed.data.geometry,
				properties: { ...parsed.data.properties, series: s.id },
			});
		}
	}

	return { series, features };
}
