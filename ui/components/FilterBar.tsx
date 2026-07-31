import { createSignal, For, Show } from "solid-js";
import type { Feature, FeatureView, Series } from "../../src/schema.ts";

interface Props {
	series: Series[];
	currentSeries: string;
	features: FeatureView[];
	onSeriesChange: (v: string) => void;
	onFeatureSelect: (f: Feature) => void;
}

const FilterBar = (props: Props) => {
	const [results, setResults] = createSignal<Feature[]>([]);

	const search = (q: string) => {
		const lower = q.toLowerCase();
		if (!lower) {
			setResults([]);
			return;
		}
		setResults(
			props.features.filter((f) =>
				f.properties.title.toLowerCase().includes(lower),
			),
		);
	};

	const handleSelect = (f: Feature) => {
		setResults([]);
		props.onFeatureSelect(f);
	};

	return (
		<div>
			<div style={{ display: "flex", gap: "12px" }}>
				<select
					value={props.currentSeries}
					onInput={(e) => props.onSeriesChange(e.currentTarget.value)}
				>
					<option value="">すべてのシリーズ</option>
					<For each={props.series}>
						{(s) => <option value={s.id}>{s.name}</option>}
					</For>
				</select>
				<div style={{ position: "relative", flex: "1" }}>
					<input
						type="text"
						placeholder="スポットを検索..."
						style={{ width: "100%" }}
						onInput={(e) => search(e.currentTarget.value)}
					/>
					<Show when={results().length > 0}>
						<ul class="search-dropdown">
							<For each={results()}>
								{(f) => (
									<li>
										<a onClick={() => handleSelect(f)}>{f.properties.title}</a>
									</li>
								)}
							</For>
						</ul>
					</Show>
				</div>
			</div>
		</div>
	);
};

export default FilterBar;
