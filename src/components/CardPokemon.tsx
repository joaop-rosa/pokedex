import cn from "classnames";
import { noop, upperFirst } from "lodash";
import { renderTypeClassnames } from "../contants/types";
import { useDetailedPokemonQuery } from "../hooks/useApi";
import { useParty } from "../hooks/useParty";
import { useSelectedPokemon } from "../hooks/useSelectedPokemon";
import s from "./CardPokemon.module.css";
import { Spinner } from "./UI/Spinner";

export function CardPokemon({ pokemon }) {
	const { isPartyFull, addPokemonToParty } = useParty();
	const { setSelectedPokemon } = useSelectedPokemon();

	const hasSprites = !!pokemon.sprites;

	const { data: fetchedData } = useDetailedPokemonQuery(
		hasSprites ? undefined : pokemon.name,
	);

	const pokemonData = hasSprites ? pokemon : fetchedData;

	function handleCard(event) {
		if (event.target.id !== "buttonAddParty") {
			setSelectedPokemon(pokemonData);
		}
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: card is interactive
		// biome-ignore lint/a11y/noStaticElementInteractions: card is interactive
		<div className={s.cardPokemon} onClick={pokemonData ? handleCard : noop}>
			<div
				className={cn(
					s.cardPokemonContent,
					renderTypeClassnames(pokemonData?.types?.[0], s),
				)}
			>
				{!pokemonData?.sprites ? (
					<Spinner />
				) : (
					<>
						<div className={s.cardPokemonHeader}>
							<h3 className={s.numberPokemon}>{`#${pokemonData.id}`}</h3>
							{!isPartyFull ? (
								<button
									type="button"
									onClick={() => addPokemonToParty(pokemonData)}
									className={s.addPartyButton}
									id="buttonAddParty"
								>
									Add to party +
								</button>
							) : null}
						</div>
						<div className={s.pokemonPhotoWrapper}>
							<img
								loading="lazy"
								className={s.photoPokemon}
								src={pokemonData.sprites.front}
								alt={`Foto do pokemon ${pokemonData.name}`}
							/>
						</div>

						<div className={s.typesWrapper}>
							{pokemonData.types.map((type) => (
								<div
									key={type}
									className={cn(s.type, renderTypeClassnames(type, s))}
								>
									<p className={s.typeName}>{type.toUpperCase()}</p>
								</div>
							))}
						</div>
						<div className={s.namePokemonWrapper}>
							<h2 className={s.namePokemon}>{upperFirst(pokemonData.name)}</h2>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
