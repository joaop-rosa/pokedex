import { upperFirst } from "lodash";
import { useEffect, useRef } from "react";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { Carousel } from "../UI/Carousel";
import s from "./FormsScreen.module.css";

export function FormsScreen() {
	const { selectedPokemon, setSelectedPokemon, speciesInfo } =
		useSelectedPokemon();
	const activeRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (activeRef.current) {
			activeRef.current.scrollIntoView({ behavior: 'instant', inline: 'center' });
		}
	}, []);

	return (
		<div className={s.variationsWrapper}>
			<Carousel>
				{speciesInfo?.variations.map((variation) => {
					return (
						<button
							type="button"
							onClick={() => setSelectedPokemon(variation)}
							key={variation.name}
							className={s.variation}
							ref={selectedPokemon?.id === variation.id ? activeRef : null}
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
			</Carousel>
		</div>
	);
}
