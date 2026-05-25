import { upperFirst } from "lodash";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { Carousel } from "../UI/Carousel";
import s from "./EvolutionLineScreen.module.css";

export function EvolutionLineScreen() {
	const { selectedPokemon, speciesInfo, setSelectedPokemon } =
		useSelectedPokemon();

	const initialIndex =
		speciesInfo?.evolutionLine.findIndex(
			(p) => p.id === selectedPokemon?.id,
		) || 0;

	return (
		<div className={s.variationsWrapper}>
			<Carousel initialIndex={initialIndex} noGap>
				{speciesInfo?.evolutionLine.map((variation, index) => {
					return (
						<div key={variation.name} className={s.evolutionItemWrapper}>
							{index > 0 && (
								<FaAngleDoubleRight className={s.evolutionArrow} size={20} />
							)}
							<button
								type="button"
								onClick={() => setSelectedPokemon(variation)}
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
									{variation.evolutionLevel ? (
										<span className={s.level}>Lv. {variation.evolutionLevel}</span>
									) : (
										<span className={s.level}>Base</span>
									)}
								</div>
							</button>
						</div>
					);
				})}
			</Carousel>
		</div>
	);
}
