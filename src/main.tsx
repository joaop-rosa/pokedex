import { Routes } from "@generouted/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Global Styles
import "./assets/global/global.css";
import "./assets/global/variables.css";

// biome-ignore lint/style/noNonNullAssertion: root is present in index.html
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Routes />
	</StrictMode>,
);
