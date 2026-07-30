import * as maplibregl from "maplibre-gl";
import { createEffect, onMount } from "solid-js";
import type { Series, SpotFeature } from "../types.ts";

const SOURCE_ID = "spots";
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const JAPAN_CENTER: [number, number] = [138, 36];
const JAPAN_ZOOM = 5;

interface Props {
	features: () => SpotFeature[];
	series: Series[];
	onFeatureClick: (feature: SpotFeature) => void;
}

const MapView = (props: Props) => {
	let container: HTMLDivElement | undefined;
	let map: maplibregl.Map | undefined;
	let ready = false;

	function layerId(seriesId: string): string {
		return `spots-${seriesId}`;
	}

	function addSeriesLayers(seriesList: Series[]) {
		for (const s of seriesList) {
			const id = layerId(s.id);
			map?.addLayer({
				id,
				type: "circle",
				source: SOURCE_ID,
				filter: ["==", ["get", "series"], s.id],
				paint: {
					"circle-radius": 8,
					"circle-color": s.color,
					"circle-stroke-width": 2,
					"circle-stroke-color": "#ffffff",
				},
			});

			map?.on("click", id, (e) => {
				if (!e.features || e.features.length === 0) return;
				const f = e.features[0];
				if (f.geometry.type !== "Point") return;
				if (!f.properties) return;
				props.onFeatureClick({
					type: "Feature",
					geometry: { type: "Point", coordinates: f.geometry.coordinates },
					properties: {
						title: f.properties.title,
						description: f.properties.description,
						episode: f.properties.episode,
						image: f.properties.image,
						series: f.properties.series,
					},
				});
			});

			map?.on("mouseenter", id, () => {
				if (map) map.getCanvas().style.cursor = "pointer";
			});

			map?.on("mouseleave", id, () => {
				if (map) map.getCanvas().style.cursor = "";
			});
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
			center: JAPAN_CENTER,
			zoom: JAPAN_ZOOM,
		});

		map.addControl(new maplibregl.NavigationControl(), "top-left");

		map.on("load", () => {
			map?.addSource(SOURCE_ID, {
				type: "geojson",
				data: { type: "FeatureCollection", features: props.features() },
			});

			addSeriesLayers(props.series);
			ready = true;
		});
	});

	createEffect(() => {
		const features = props.features();
		if (!ready) return;
		const source = map?.getSource(SOURCE_ID);
		if (source instanceof maplibregl.GeoJSONSource) {
			source.setData({ type: "FeatureCollection", features });
		}
	});

	return <div ref={container} class="map-container" />;
};

export default MapView;
