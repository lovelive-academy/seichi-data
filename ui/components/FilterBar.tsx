import { For } from "solid-js";
import type { Series } from "../types.ts";

interface Props {
	series: Series[];
	seriesId: string;
	title: string;
	episode: string;
	accentColor: string | undefined;
	onSeriesChange: (v: string) => void;
	onTitleChange: (v: string) => void;
	onEpisodeChange: (v: string) => void;
}

const FilterBar = (props: Props) => (
	<div style={{ display: "flex", gap: "12px" }}>
		<select
			value={props.seriesId}
			onInput={(e) => props.onSeriesChange(e.currentTarget.value)}
		>
			<option value="">すべてのシリーズ</option>
			<For each={props.series}>
				{(s) => <option value={s.id}>{s.name}</option>}
			</For>
		</select>
		<input
			type="text"
			placeholder="施設名検索"
			value={props.title}
			onInput={(e) => props.onTitleChange(e.currentTarget.value)}
		/>
		<input
			type="text"
			placeholder="エピソード検索"
			value={props.episode}
			onInput={(e) => props.onEpisodeChange(e.currentTarget.value)}
		/>
	</div>
);

export default FilterBar;
