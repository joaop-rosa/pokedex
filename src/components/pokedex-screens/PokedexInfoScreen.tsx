import cn from "classnames";
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

	function renderInfoScreen() {
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
		<div
			className={cn(s.infoScreen, {
				[s.infoScreenActive]: selectedPokemon,
			})}
		>
			{selectedPokemon && (
				<div className={s.infoScreenContentWrapper}>
					{!isLoadingScreen ? (
						renderInfoScreen()
					) : (
						<Spinner containerClassname={s.spinnerScreen} />
					)}
				</div>
			)}
		</div>
	);
}
