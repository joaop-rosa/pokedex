import { useContext } from "react"
import s from "./PartySection.module.css"
import { PartyContext } from "../context/PartyProvider"
import { PartySectionCard } from "./PartySectionCard"

export function PartySection() {
  const { party } = useContext(PartyContext)

  return (
    <div className={s.partyWrapper}>
      {party.map((pokemon) => (
        <PartySectionCard key={pokemon.partyId} pokemon={pokemon} />
      ))}
    </div>
  )
}
