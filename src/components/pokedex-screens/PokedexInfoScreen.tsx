import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { INFOS_VARIATION } from "../../context/SelectedPokemonProvider";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { Spinner } from "../UI/Spinner";
import { AbilitiesScreen } from "./AbilitiesScreen";
import { DefaultScreen } from "./DefaultScreen";
import { EvolutionLineScreen } from "./EvolutionLineScreen";
import { FormsScreen } from "./FormsScreen";
import { MovesScreen } from "./MovesScreen";
import s from "./PokedexInfoScreen.module.css";
import { RadarChart } from "./RadarChart";

export function PokedexInfoScreen() {
	const { selectedPokemon, infoScreenContent, isLoadingScreen } =
		useSelectedPokemon();

	const isDataMode = infoScreenContent !== null;

	function renderInfoScreen() {
		if (!isDataMode) return null;
		switch (infoScreenContent) {
			case INFOS_VARIATION.FORMS:
				return <FormsScreen />;
			case INFOS_VARIATION.EVOLUTION_LINE:
				return <EvolutionLineScreen />;
			case INFOS_VARIATION.ABILITIES:
				return <AbilitiesScreen />;
			case INFOS_VARIATION.STATS:
				return <RadarChart />;
			case INFOS_VARIATION.MOVES:
				return <MovesScreen />;
			default:
				return <DefaultScreen />;
		}
	}

	return (
		<AnimatePresence>
			{selectedPokemon && (
				<motion.div
					layout
					initial={false}
					animate={{ opacity: 1, marginTop: 20 }}
					transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
					style={{
						height: isDataMode ? 350 : 25,
						overflow: "hidden",
						flexShrink: 0,
						width: "100%",
					}}
				>
					<motion.div
						layout
						transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
						className={cn(s.infoScreen, {
							[s.infoScreenActive]: selectedPokemon,
						})}
						style={{ height: isDataMode ? 350 : 25, margin: "0 auto" }}
					>
						<AnimatePresence>
							{isDataMode && (
								<motion.div
									key="content"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className={s.infoScreenContentWrapper}
								>
									{!isLoadingScreen ? (
										renderInfoScreen()
									) : (
										<Spinner containerClassname={s.spinnerScreen} />
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
