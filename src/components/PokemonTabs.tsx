import cn from "classnames";
import { INFOS_VARIATION } from "../context/SelectedPokemonProvider";
import { useSelectedPokemon } from "../hooks/useSelectedPokemon";
import s from "./PokemonTabs.module.css";

export function PokemonTabs() {
	const {
		selectedPokemon,
		speciesInfo,
		infoScreenContent,
		setInfoScreenContent,
		isLoadingScreen,
	} = useSelectedPokemon();

	const TABS = [
		{
			name: "General",
			value: INFOS_VARIATION.DEFAULT,
			isDisabled: false,
		},
		{
			name: "Stats",
			value: INFOS_VARIATION.STATS,
			isDisabled: false,
		},
		{
			name: "Evolution",
			value: INFOS_VARIATION.EVOLUTION_LINE,
			isDisabled: false,
		},
		{
			name: "Moves",
			value: INFOS_VARIATION.MOVES,
			isDisabled: Object.keys(selectedPokemon?.moves ?? {}).length === 0,
		},
		{
			name: "Abilities",
			value: INFOS_VARIATION.ABILITIES,
			isDisabled: false,
		},
		{
			name: "Forms",
			value: INFOS_VARIATION.FORMS,
			isDisabled: isLoadingScreen || speciesInfo?.variations.length === 1,
		},
	];

	return (
		<div className={s.tabsWrapper}>
			{TABS.map((tab) => (
				<button
					type="button"
					key={tab.name}
					disabled={tab.isDisabled}
					className={cn(s.tab, {
						[s.tabActive]: infoScreenContent === tab.value,
						[s.tabDisabled]: tab.isDisabled,
					})}
					onClick={() => setInfoScreenContent(tab.value)}
				>
					{tab.name}
				</button>
			))}
		</div>
	);
}
