import React from "react"
import s from "./PokemonDetailed.module.css"
export default function PokemonDetailed({ pokemon }) {
  return (
    <div className={s.backdrop}>
      <div className={s.contentWrapper}>
        <div className={s.container}>
          <div className={s.content}></div>
        </div>
      </div>
    </div>
  )
}
