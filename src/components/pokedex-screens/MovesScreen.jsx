import React, { useState } from "react"
import s from "./MovesScreen.module.css"
import cn from "classnames"
import { MoveItem } from "./MoveItem"
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon"

export function MovesScreen() {
  const { selectedPokemon } = useSelectedPokemon()
  const [selectedMethod, setSelectedMethod] = useState("LEVEL UP")

  return (
    <div className={s.movesWrapper}>
      <div className={s.movesMethodsWrapper}>
        {Object.keys(selectedPokemon.moves).map((moveKey) => (
          <button
            key={moveKey}
            className={cn(s.moveMethod, {
              [s.moveMethodSelected]: moveKey === selectedMethod,
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
  )
}
