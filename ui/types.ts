export interface Series {
	id: string;
	name: string;
	color: string;
}

export interface SpotProperties {
	title: string;
	description: string;
	episode?: string;
	image?: string;
	series: string;
}

export interface SpotFeature {
	type: "Feature";
	geometry: {
		type: "Point";
		coordinates: number[];
	};
	properties: SpotProperties;
}
