import cn from "classnames";
import { motion } from "framer-motion";
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
		<motion.div layout transition={{ type: "spring", bounce: 0.15, duration: 0.8 }} className={s.tabsWrapper}>
			{TABS.map((tab) => {
				const isActive = infoScreenContent === tab.value;
				return (
					<motion.button
						type="button"
						key={tab.name}
						disabled={tab.isDisabled}
						whileTap={tab.isDisabled ? undefined : { scale: 0.95 }}
						className={cn(s.tab, {
							[s.tabActive]: isActive,
							[s.tabDisabled]: tab.isDisabled,
						})}
						onClick={() => setInfoScreenContent(isActive ? null : tab.value)}
					>
						{tab.name}
					</motion.button>
				);
			})}
		</motion.div>
	);
}
