import { useContext, useState } from "react"
import s from "./Party.module.css"
import { PartyContext } from "../context/PartyProvider"
import cn from "classnames"
import { ReactComponent as ArrowRight } from "../assets/icons/arrow-right.svg"
import { upperFirst } from "lodash"
import { renderTypeClassnames } from "../contants/types"

export function Party() {
  const { party, removePokemonFromParty } = useContext(PartyContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={s.party}>
      <div className={cn(s.partyContent, { [s.partyContentOpen]: isOpen })}>
        <a href="/lobby">Go to lobby</a>
        {party.length ? (
          party.map((pokemon) => {
            return (
              <div
                key={pokemon.partyId}
                className={cn(
                  s.partyPokemon,
                  renderTypeClassnames(pokemon?.types?.[0], s)
                )}
              >
                <button
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
            )
          })
        ) : (
          <p>Party is empty</p>
        )}
      </div>
      <button
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
  )
}
