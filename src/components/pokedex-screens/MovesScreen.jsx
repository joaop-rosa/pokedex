import React, { useState } from "react"
import s from "./MovesScreen.module.css"
import cn from "classnames"
import { MoveItem } from "./MoveItem"

export function MovesScreen({ pokemon }) {
  const [selectedMethod, setSelectedMethod] = useState("LEVEL UP")

  return (
    <div className={s.movesWrapper}>
      <div className={s.movesMethodsWrapper}>
        {Object.keys(pokemon.moves).map((moveKey) => (
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
        {pokemon.moves[selectedMethod].map((move) => (
          <MoveItem key={move.name} move={move} />
        ))}
      </div>
    </div>
  )
}
