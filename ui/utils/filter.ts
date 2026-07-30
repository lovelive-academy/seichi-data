import type { SpotFeature } from "../types.ts";

export function filterFeatures(
	features: SpotFeature[],
	seriesId: string,
	title: string,
	episode: string,
): SpotFeature[] {
	const titleLower = title.toLowerCase();
	const episodeLower = episode.toLowerCase();

	return features.filter((f) => {
		if (seriesId && f.properties.series !== seriesId) return false;
		if (titleLower && !f.properties.title.toLowerCase().includes(titleLower))
			return false;
		if (episodeLower) {
			const ep = f.properties.episode?.toLowerCase() ?? "";
			if (!ep.includes(episodeLower)) return false;
		}
		return true;
	});
}
