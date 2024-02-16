import { useContext, useMemo, useState } from "react"
import s from "./Party.module.css"
import { PartyContext } from "../context/PartyProvider"
import cn from "classnames"
import { ReactComponent as ArrowRight } from "../assets/icons/arrow-right.svg"

const MAX_PARTY_LENGTH = 6

export function Party() {
  const { party } = useContext(PartyContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={s.party}>
      <div className={cn(s.partyContent, { [s.partyContentOpen]: isOpen })}>
        {party.length ? (
          party.map((pokemon, index) => {
            return (
              <div key={index} className={s.partyPokemon}>
                {pokemon.name}
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
