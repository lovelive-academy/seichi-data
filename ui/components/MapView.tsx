import * as maplibregl from "maplibre-gl";
import { createEffect, onMount } from "solid-js";
import type { FeatureView } from "../../src/schema.ts";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

interface Props {
	features: FeatureView[];
	selected: FeatureView | null;
	onFeatureClick: (feature: FeatureView) => void;
}

const MapView = (props: Props) => {
	let container: HTMLDivElement | undefined;
	let map: maplibregl.Map | undefined;
	let markers: maplibregl.Marker[] = [];

	function clearMarkers() {
		for (const marker of markers) {
			marker.remove();
		}
		markers = [];
	}

	function addMarkers(features: FeatureView[]) {
		if (!map) return;

		for (const feature of features) {
			const color = feature.properties.series.color;
			const [lng, lat] = feature.geometry.coordinates;

			const marker = new maplibregl.Marker({ color })
				.setLngLat([lng, lat])
				.addTo(map);

			marker.getElement().style.cursor = "pointer";
			marker.getElement().addEventListener("click", () => {
				props.onFeatureClick(feature);
			});

			markers.push(marker);
		}
	}

	onMount(() => {
		if (!container) return;
		maplibregl.setWorkerUrl(
			"https://esm.sh/maplibre-gl@6.0.0/dist/maplibre-gl-worker.mjs",
		);
		map = new maplibregl.Map({
			container,
			style: MAP_STYLE,
			center: [137.5, 36.5],
			zoom: 5,
		});

		map.on("load", () => {
			addMarkers(props.features);
		});
	});

	createEffect(() => {
		const features = props.features;
		if (!map?.loaded()) return;
		clearMarkers();
		addMarkers(features);
	});

	createEffect(() => {
		const f = props.selected;
		if (!f || !map) return;
		const [lng, lat] = f.geometry.coordinates;
		map.flyTo({ center: [lng, lat], zoom: 15 });
	});

	return <div ref={container} class="map-container" />;
};

export default MapView;
