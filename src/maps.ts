const ALLOWED_MAPS_HOSTS = new Set([
	"maps.app.goo.gl",
	"www.google.com",
	"maps.google.com",
	"google.com",
]);

export async function parseGoogleMapsUrl(
	url: string,
): Promise<{ lat: number; lng: number } | null> {
	let parsedUrl: URL;
	try {
		parsedUrl = new URL(url);
	} catch {
		return null;
	}

	if (!ALLOWED_MAPS_HOSTS.has(parsedUrl.hostname)) {
		return null;
	}

	let resolvedUrl = url;

	if (parsedUrl.hostname === "maps.app.goo.gl") {
		const response = await fetch(url, { method: "HEAD", redirect: "follow" });
		resolvedUrl = response.url;
	}

	// @lat,lng,zoom
	const embedMatch = resolvedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
	if (embedMatch) {
		return { lat: parseFloat(embedMatch[1]), lng: parseFloat(embedMatch[2]) };
	}

	// ?q=lat,lng
	try {
		const urlObj = new URL(resolvedUrl);
		const q = urlObj.searchParams.get("q");
		if (q) {
			const parts = q.split(",");
			if (parts.length >= 2) {
				const lat = parseFloat(parts[0]);
				const lng = parseFloat(parts[1]);
				if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
					return { lat, lng };
				}
			}
		}
	} catch {
		// invalid URL
	}

	return null;
}
