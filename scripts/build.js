import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";

function readSpotFeatures(seriesId, release) {
	const dir = `public/spots/${seriesId}`;
	if (!existsSync(dir)) return [];

	const features = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;

		const uuid = entry.name;
		const spotPath = `${dir}/${uuid}/spot.json`;
		if (!existsSync(spotPath)) continue;

		const feature = JSON.parse(readFileSync(spotPath, "utf-8"));
		if (feature.properties.image) {
			feature.properties.image = feature.properties.image.map(
				(filename) => `spots/${seriesId}/${uuid}/${filename}`,
			);
		}

		if (release) {
			delete feature.properties.author;
		}
		features.push(feature);
	}
	return features;
}

function main() {
	const args = process.argv.slice(2);
	const release = args.includes("--release");
	const outDir = release ? "release-data" : "generated";

	const data = JSON.parse(readFileSync("public/series.json", "utf-8"));

	mkdirSync(outDir, { recursive: true });

	for (const s of data.series) {
		const features = readSpotFeatures(s.id, release);

		writeFileSync(
			`${outDir}/${s.id}.geojson`,
			JSON.stringify({ type: "FeatureCollection", features }),
		);
	}
}

main();
