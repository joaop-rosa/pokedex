import cn from "classnames";
import { useEffect, useState } from "react";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { MoveItem } from "./MoveItem";
import s from "./MovesScreen.module.css";

export function MovesScreen() {
	const { selectedPokemon } = useSelectedPokemon();
	const [selectedMethod, setSelectedMethod] = useState("level-up");

	const pokemonId = selectedPokemon?.id;
	const moves = selectedPokemon?.moves;

	// biome-ignore lint/correctness/useExhaustiveDependencies: is necessary
	useEffect(() => {
		if (!moves) return;
		const keys = Object.keys(moves);
		if (keys.length > 0 && !keys.includes(selectedMethod)) {
			setSelectedMethod(keys[0]);
		}
	}, [pokemonId, moves, selectedMethod]);

	if (!selectedPokemon) return null;

	return (
		<div className={s.movesWrapper}>
			<div className={s.movesMethodsWrapper}>
				{Object.keys(selectedPokemon.moves).map((moveKey) => (
					<button
						type="button"
						key={moveKey}
						className={cn(s.movesMethodButton, {
							[s.movesMethodButtonSelected]: moveKey === selectedMethod,
						})}
						onClick={() => setSelectedMethod(moveKey)}
					>
						{moveKey}
					</button>
				))}
			</div>
			<div className={s.movesContentWrapper}>
				{selectedPokemon.moves[selectedMethod]?.map((move) => (
					<MoveItem key={move.name} move={move} />
				))}
			</div>
		</div>
	);
}
