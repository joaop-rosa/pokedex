import cn from "classnames";
import { noop, upperFirst } from "lodash";
import { useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import { renderTypeClassnames } from "../contants/types";
import { useDetailedPokemonQuery } from "../hooks/useApi";
import { useParty } from "../hooks/useParty";
import { useSelectedPokemon } from "../hooks/useSelectedPokemon";
import s from "./CardPokemon.module.css";
import { Spinner } from "./UI/Spinner";

export function CardPokemon({ pokemon }) {
	const { isPartyFull, addPokemonToParty } = useParty();
	const { setSelectedPokemon } = useSelectedPokemon();
	const [isAdded, setIsAdded] = useState(false);

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

	async function handleAddParty(e) {
		e.stopPropagation();
		if (isPartyFull || isAdded) return;
		await addPokemonToParty(pokemonData);
		setIsAdded(true);
		setTimeout(() => {
			setIsAdded(false);
		}, 2000);
	}

	function handleMouseMove(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
		e.currentTarget.style.setProperty("--mouse-y", `${y}px`);

		const rotateX = (y / rect.height - 0.5) * -15;
		const rotateY = (x / rect.width - 0.5) * 15;
		e.currentTarget.style.setProperty("--rotate-x", `${rotateX}deg`);
		e.currentTarget.style.setProperty("--rotate-y", `${rotateY}deg`);
	}

	function handleMouseLeave(e) {
		e.currentTarget.style.setProperty("--rotate-x", "0deg");
		e.currentTarget.style.setProperty("--rotate-y", "0deg");
	}

	const type1 = pokemonData?.types?.[0];
	const type2 = pokemonData?.types?.[1];

	const gradientStyle = type1
		? {
				background: type2
					? `linear-gradient(135deg, var(--color-${type1}) 0%, var(--color-${type2}) 100%)`
					: `linear-gradient(135deg, var(--color-${type1}) 0%, rgba(0,0,0,0.15) 100%)`,
			}
		: {};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: card is interactive
		// biome-ignore lint/a11y/noStaticElementInteractions: card is interactive
		<div
			className={s.cardPokemon}
			onClick={pokemonData ? handleCard : noop}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<div className={s.cardPokemonContent} style={gradientStyle}>
				{!pokemonData?.sprites ? (
					<Spinner />
				) : (
					<>
						<div className={s.cardPokemonHeader}>
							<h3 className={s.numberPokemon}>{`#${pokemonData.id}`}</h3>
							{!isPartyFull ? (
								<button
									type="button"
									onClick={handleAddParty}
									className={cn(s.addPartyButton, { [s.added]: isAdded })}
									id="buttonAddParty"
									title={isAdded ? "Added!" : "Add to party"}
								>
									<span className={s.addPartyIcon}>
										{isAdded ? <FaCheck /> : <FaPlus />}
									</span>
									<span className={s.addPartyText}>
										{isAdded ? "Added!" : "Add to party"}
									</span>
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
									style={{ backgroundColor: `var(--color-${type})` }}
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
