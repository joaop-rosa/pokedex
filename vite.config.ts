import path from "node:path";
import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react(), svgr(), generouted()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./"),
			},
		},
		server: {
			port: parseInt(env.PORT || env.VITE_PORT || "3000"),
		},
	};
});
