import cn from "classnames";
import { useEffect } from "react";
import { useSelectedPokemon } from "../hooks/useSelectedPokemon";
import { PokedexButtons } from "./PokedexButtons";
import { PokedexScreen } from "./PokedexScreen";
import s from "./PokemonDetailed.module.css";
import { PokedexInfoScreen } from "./pokedex-screens/PokedexInfoScreen";

export function PokemonDetailed() {
	const { selectedPokemon, setSelectedPokemon } = useSelectedPokemon();

	// TODO - lock scroll
	useEffect(() => {
		if (selectedPokemon) {
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [selectedPokemon]);

	return (
		<>
			<div
				className={cn(s.contentWrapper, {
					[s.contentWrapperActive]: selectedPokemon,
				})}
			>
				<div className={s.container}>
					<div className={s.content}>
						<PokedexScreen />
						<PokedexInfoScreen />
						<PokedexButtons />
					</div>
				</div>
			</div>
			{/* biome-ignore lint/a11y/useSemanticElements: this is a backdrop */}
			<div
				id="backdrop"
				role="button"
				tabIndex={0}
				onClick={() => setSelectedPokemon(null)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") setSelectedPokemon(null);
				}}
				className={cn(s.backdrop, { [s.backdropActive]: selectedPokemon })}
			/>
		</>
	);
}
