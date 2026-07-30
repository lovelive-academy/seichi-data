import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [devtools(), solidPlugin()],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
		rollupOptions: {
			external: ["maplibre-gl"],
			output: {
				paths: {
					"maplibre-gl": "https://esm.sh/maplibre-gl@6.0.0",
				},
			},
		},
	},
});
