import { createSignal, For } from "solid-js";
import type { Feature, FeatureView, Series } from "../../src/schema.ts";

interface Props {
	series: Series[];
	selectedSeries: string[];
	features: FeatureView[];
	onSeriesToggle: (id: string) => void;
	onSeriesClear: () => void;
	onFeatureSelect: (f: Feature) => void;
}

const inactiveStyle = {
	background: "var(--pico-card-background-color)",
	color: "var(--pico-muted-color)",
	"border-color": "var(--pico-muted-border-color)",
	"box-shadow": "none",
};

const Filter = (props: Props) => {
	const [results, setResults] = createSignal<Feature[]>([]);

	const search = (q: string) => {
		const lower = q.toLowerCase();

		const filtered = props.features.filter((f) =>
			f.properties.title.toLowerCase().includes(lower),
		);
		setResults(filtered);

		const exact = props.features.find((f) => f.properties.title === q);
		if (exact) {
			props.onFeatureSelect(exact);
		}
	};

	return (
		<article
			style={{
				position: "fixed",
				left: "16px",
				right: "16px",
				bottom: "16px",
				"z-index": 1,
				display: "flex",
				"flex-wrap": "wrap",
				gap: "16px",
				"align-items": "center",
			}}
		>
			<input
				type="text"
				placeholder="スポットを検索..."
				list="search-results"
				onInput={(e) => search(e.currentTarget.value)}
			/>
			<datalist id="search-results">
				<For each={results()}>
					{(f) => <option value={f.properties.title} />}
				</For>
			</datalist>
			<button
				type="button"
				style={props.selectedSeries.length === 0 ? {} : inactiveStyle}
				onClick={props.onSeriesClear}
			>
				すべて
			</button>
			<For each={props.series}>
				{(s) => {
					const isActive = () => props.selectedSeries.includes(s.id);
					return (
						<button
							type="button"
							style={
								isActive()
									? { background: s.color, "border-color": s.color }
									: inactiveStyle
							}
							onClick={() => props.onSeriesToggle(s.id)}
						>
							{s.name}
						</button>
					);
				}}
			</For>
		</article>
	);
};

export default Filter;
