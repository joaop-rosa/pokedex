import React from "react"
import s from "./Header.module.css"

export function Header() {
  return (
    <div className={s.header}>
      <h1>
        <a href="/">Pokedex</a>
      </h1>
    </div>
  )
}
