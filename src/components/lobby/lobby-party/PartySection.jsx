import { useParty } from "../../../hooks/useParty"
import s from "./PartySection.module.css"
import { PartySectionCard } from "./PartySectionCard"

export function PartySection() {
  const { party } = useParty()

  return (
    <div className={s.partyWrapper}>
      {party.map((pokemon) => (
        <PartySectionCard key={pokemon.partyId} pokemon={pokemon} />
      ))}
    </div>
  )
}
