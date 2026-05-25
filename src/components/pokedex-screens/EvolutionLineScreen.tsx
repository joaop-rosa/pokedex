import { upperFirst } from "lodash";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { Carousel } from "../UI/Carousel";
import s from "./EvolutionLineScreen.module.css";

export function EvolutionLineScreen() {
	const { selectedPokemon, speciesInfo, setSelectedPokemon } =
		useSelectedPokemon();

	return (
		<div className={s.variationsWrapper}>
			<Carousel>
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
									className={s.variationImage}
									src={variation.sprites.front}
									alt={`Foto do pokemon ${selectedPokemon.name}`}
								/>
								<div className={s.variationInfos}>
									<p>{upperFirst(variation.name)}</p>
								</div>
							</button>
						</div>
					);
				})}
			</Carousel>
		</div>
	);
}
