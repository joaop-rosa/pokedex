import { upperFirst } from "lodash";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import s from "./EvolutionLineScreen.module.css";

export function EvolutionLineScreen() {
	const { selectedPokemon, speciesInfo, setSelectedPokemon } =
		useSelectedPokemon();

	return (
		<div className={s.variationsWrapper}>
			{speciesInfo?.evolutionLine.map((variation) => {
				return (
					<button
						type="button"
						onClick={() => setSelectedPokemon(variation)}
						key={variation.name}
						className={s.variation}
					>
						<img
							className={s.variationImage}
							src={variation.sprites.front}
							alt={`Foto do pokemon ${selectedPokemon.name}`}
						/>
						<div className={s.variationInfos}>
							<p>{upperFirst(variation.name)}</p>
						</div>
					</button>
				);
			})}
		</div>
	);
}
