import React, { useEffect } from "react"
import s from "./PokemonDetailed.module.css"
import cn from "classnames"
import { useSelectedPokemon } from "../hooks/useSelectedPokemon"
import { PokedexInfoScreen } from "./pokedex-screens/PokedexInfoScreen"
import { PokedexButtons } from "./PokedexButtons"
import { PokedexScreen } from "./PokedexScreen"

export function PokemonDetailed() {
  const { selectedPokemon, setSelectedPokemon, setSpeciesInfo } =
    useSelectedPokemon()

  // TODO - lock scroll
  useEffect(() => {
    if (selectedPokemon) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
      setSpeciesInfo(null)
    }
  }, [selectedPokemon, setSelectedPokemon, setSpeciesInfo])

  return (
    <>
      <div
        className={cn(s.contentWrapper, {
          [s.contentWrapperActive]: selectedPokemon,
        })}
      >
        <div className={s.container}>
          <div className={s.content}>
            <PokedexScreen />
            <PokedexInfoScreen />
            <PokedexButtons />
          </div>
        </div>
      </div>
      <div
        id="backdrop"
        onClick={() => setSelectedPokemon(null)}
        className={cn(s.backdrop, { [s.backdropActive]: selectedPokemon })}
      />
    </>
  )
}
