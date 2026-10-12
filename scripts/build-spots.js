import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";

function readSpotLines(seriesId) {
	const dir = `public/spots/${seriesId}`;
	if (!existsSync(dir)) return [];

	const lines = [];
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
		lines.push(JSON.stringify(feature));
	}
	return lines;
}

function main() {
	const seriesJson = JSON.parse(readFileSync("public/series.json", "utf-8"));

	mkdirSync("public/generated", { recursive: true });

	for (const s of seriesJson.series) {
		const lines = readSpotLines(s.id);

		writeFileSync(
			`public/generated/${s.id}.geojsonl`,
			lines.length > 0 ? `${lines.join("\n")}\n` : "",
		);
	}
}

main();
