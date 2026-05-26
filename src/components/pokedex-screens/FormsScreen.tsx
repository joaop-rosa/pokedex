import { upperFirst } from "lodash";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { Carousel } from "../UI/Carousel";
import s from "./FormsScreen.module.css";

export function FormsScreen() {
	const { selectedPokemon, setSelectedPokemon, speciesInfo } = useSelectedPokemon();
	if (!selectedPokemon) return null;

	const initialIndex =
		speciesInfo?.variations.findIndex((p) => p.id === selectedPokemon?.id) || 0;

	return (
		<div className={s.variationsWrapper}>
			<Carousel initialIndex={initialIndex}>
				{speciesInfo?.variations.map((variation) => {
					return (
						<button
							type="button"
							onClick={() => setSelectedPokemon(variation)}
							key={variation.name}
							className={s.variation}
						>
							<img
								draggable={false}
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
			</Carousel>
		</div>
	);
}
