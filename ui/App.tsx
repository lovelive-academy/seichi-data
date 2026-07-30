import { createSignal, onMount, Show } from "solid-js";
import Card from "./components/Card.tsx";
import FilterBar from "./components/FilterBar.tsx";
import Header from "./components/Header.tsx";
import MapView from "./components/MapView.tsx";
import type { Series, SpotFeature } from "./types.ts";
import { loadSeriesAndFeatures } from "./utils/data.ts";

const App = () => {
	const [series, setSeries] = createSignal<Series[]>([]);
	const [allFeatures, setAllFeatures] = createSignal<SpotFeature[]>([]);
	const [filterSeries, setFilterSeries] = createSignal("");
	const [selected, setSelected] = createSignal<SpotFeature | null>(null);

	onMount(async () => {
		const { series, features } = await loadSeriesAndFeatures();
		setSeries(series);
		setAllFeatures(features);
	});

	const filtered = () => {
		const sid = filterSeries();
		if (!sid) return allFeatures();
		return allFeatures().filter((f) => f.properties.series === sid);
	};

	return (
		<div class="viewer">
			<Header />
			<main>
				<FilterBar
					series={series()}
					seriesId={filterSeries()}
					features={filtered()}
					onSeriesChange={setFilterSeries}
					onSelect={setSelected}
				/>
				<div class="map-area">
					<Show when={series().length > 0}>
						<MapView
							features={filtered}
							series={series()}
							selected={selected()}
							onFeatureClick={setSelected}
						/>
					</Show>
					<Show when={selected()}>
						{(feature) => (
							<Card
								feature={feature()}
								series={series()}
								onClose={() => setSelected(null)}
							/>
						)}
					</Show>
				</div>
			</main>
		</div>
	);
};

export default App;
