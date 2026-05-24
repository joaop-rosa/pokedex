import cn from "classnames";
import { useState } from "react";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import { MoveItem } from "./MoveItem";
import s from "./MovesScreen.module.css";

export function MovesScreen() {
	const { selectedPokemon } = useSelectedPokemon();
	const [selectedMethod, setSelectedMethod] = useState("LEVEL UP");

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
				{selectedPokemon.moves[selectedMethod].map((move) => (
					<MoveItem key={move.name} move={move} />
				))}
			</div>
		</div>
	);
}
