import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "@generouted/react-router";

// Global Styles
import "./assets/global/global.css";
import "./assets/global/variables.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Routes />
	</StrictMode>,
);
