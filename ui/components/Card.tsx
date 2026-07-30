import { X } from "lucide-solid";
import { Show } from "solid-js";
import type { Series, SpotFeature } from "../types.ts";

interface Props {
	feature: SpotFeature;
	series: Series[];
	onClose: () => void;
}

const Card = (props: Props) => {
	const spotSeries = () =>
		props.series.find((s) => s.id === props.feature.properties.series);

	return (
		<article>
			<button type="button" onClick={props.onClose} aria-label="閉じる">
				<X />
			</button>
			<Show when={spotSeries()}>
				<h3>{spotSeries()?.name}</h3>
			</Show>
			<h2>{props.feature.properties.title}</h2>
			<Show when={props.feature.properties.image}>
				<img
					src={props.feature.properties.image}
					alt={props.feature.properties.title}
				/>
			</Show>
			<p>{props.feature.properties.description}</p>
			<Show when={props.feature.properties.episode}>
				<p>
					<small>エピソード: {props.feature.properties.episode}</small>
				</p>
			</Show>
		</article>
	);
};

export default Card;
