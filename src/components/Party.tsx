import cn from "classnames";
import { upperFirst } from "lodash";
import { useState } from "react";
import ArrowRight from "../assets/icons/arrow-right.svg?react";
import { renderTypeClassnames } from "../contants/types";
import { useParty } from "../hooks/useParty";
import s from "./Party.module.css";

export function Party() {
	const { party, removePokemonFromParty } = useParty();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={s.party}>
			<div className={cn(s.partyContent, { [s.partyContentOpen]: isOpen })}>
				<a className={s.lobbyLink} href="/lobby">
					Go to lobby
				</a>
				{party.length ? (
					party.map((pokemon) => {
						return (
							<div
								key={pokemon.partyId}
								className={cn(
									s.partyPokemon,
									renderTypeClassnames(pokemon?.types?.[0], s),
								)}
							>
								<button
									type="button"
									className={s.buttonClose}
									onClick={() => removePokemonFromParty(pokemon)}
								>
									X
								</button>
								<img
									loading="lazy"
									className={s.photoPokemon}
									src={pokemon.sprites.front}
									alt={`Foto do pokemon ${pokemon.name}`}
								/>
								<div className={s.pokemonNameWrapper}>
									{upperFirst(pokemon.name)}
								</div>
							</div>
						);
					})
				) : (
					<p>Party is empty</p>
				)}
			</div>
			<button
				type="button"
				className={s.partyButtonOpen}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<ArrowRight
					className={cn(s.partyButtonOpenIcon, {
						[s.partyButtonCloseIcon]: isOpen,
					})}
				/>
			</button>
		</div>
	);
}
