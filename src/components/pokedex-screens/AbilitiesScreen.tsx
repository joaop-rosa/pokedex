import { upperFirst } from "lodash";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { Accordion } from "../UI/Accordion";
import s from "./AbilitiesScreen.module.css";

export function AbilitiesScreen() {
	const { selectedPokemon } = useSelectedPokemon();

	return (
		<div className={s.abilitiesWrapper}>
			{selectedPokemon.abilities.map((ability) => (
				<Accordion
					key={ability.name}
					header={
						<div className={s.abilityHeader}>
							<div className={s.abilityHeaderInfo}>
								<h4>
									{upperFirst(ability.name)}
									{ability.isHidden ? <span> (hidden)</span> : null}
								</h4>
								<p>{ability.effectShortDescription}</p>
							</div>
							<span className={s.abilityButtonOpen}>+</span>
						</div>
					}
					content={
						<div className={s.abilityContent}>
							<p>{ability.effectDescription}</p>
							<p>{ability.effectException}</p>
						</div>
					}
				/>
			))}
		</div>
	);
}
