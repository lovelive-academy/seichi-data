import { createSignal, onMount, Show } from "solid-js";
import FilterBar from "./components/FilterBar.tsx";
import Header from "./components/Header.tsx";
import MapView from "./components/MapView.tsx";
import Sidebar from "./components/Sidebar.tsx";
import type { Series, SpotFeature } from "./types.ts";
import { loadSeriesAndFeatures } from "./utils/data.ts";
import { filterFeatures } from "./utils/filter.ts";

const App = () => {
	const [series, setSeries] = createSignal<Series[]>([]);
	const [allFeatures, setAllFeatures] = createSignal<SpotFeature[]>([]);
	const [filterSeries, setFilterSeries] = createSignal("");
	const [filterTitle, setFilterTitle] = createSignal("");
	const [filterEpisode, setFilterEpisode] = createSignal("");
	const [selected, setSelected] = createSignal<SpotFeature | null>(null);

	onMount(async () => {
		const { series, features } = await loadSeriesAndFeatures();
		setSeries(series);
		setAllFeatures(features);
	});

	const filtered = () =>
		filterFeatures(
			allFeatures(),
			filterSeries(),
			filterTitle(),
			filterEpisode(),
		);

	const accentColor = () =>
		series().find((s) => s.id === filterSeries())?.color;

	return (
		<div class="viewer">
			<Header />
			<main>
				<FilterBar
					series={series()}
					seriesId={filterSeries()}
					title={filterTitle()}
					episode={filterEpisode()}
					accentColor={accentColor()}
					onSeriesChange={setFilterSeries}
					onTitleChange={setFilterTitle}
					onEpisodeChange={setFilterEpisode}
				/>
				<div class="map-area">
					<MapView
						features={filtered}
						series={series()}
						onFeatureClick={setSelected}
					/>
					<Show when={selected()}>
						{(feature) => (
							<Sidebar
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
