import { upperFirst } from "lodash"
import s from "./PartySectionCard.module.css"
import { useContext, useMemo, useState } from "react"
import { useApi } from "../hooks/useApi"
import { PartyContext } from "../context/PartyProvider"

const MOVE_SELECT_PROPS = {
  ATTACK1: "ATTACK1",
  ATTACK2: "ATTACK2",
  ATTACK3: "ATTACK3",
  ATTACK4: "ATTACK4",
  ABILITY: "ABILITY",
}

export function PartySectionCard({ pokemon }) {
  const [selectedMove, setSelectedMove] = useState(null)
  const { fetchMove } = useApi()
  const { editPokemonFromParty } = useContext(PartyContext)

  const flatMoveList = useMemo(() => {
    return Object.keys(pokemon.moves)
      .map((key) => pokemon.moves[key])
      .flat(Infinity)
      .filter((move, index, movesArray) => {
        return movesArray.findIndex((m) => m.name === move.name) === index
      })
  }, [pokemon.moves])

  const [movesSelected, setMovesSelected] = useState(
    pokemon?.movesSelected ?? {
      [MOVE_SELECT_PROPS.ABILITY]: pokemon.abilities[0],
      [MOVE_SELECT_PROPS.ATTACK1]: null,
      [MOVE_SELECT_PROPS.ATTACK2]: null,
      [MOVE_SELECT_PROPS.ATTACK3]: null,
      [MOVE_SELECT_PROPS.ATTACK4]: null,
    }
  )

  async function handleSelect(event) {
    // Ajustar para fetch de ability
    const mappedMove = await fetchMove(event.target.value)
    const newMovesSelected = {
      ...movesSelected,
      [event.target.name]: mappedMove,
    }
    editPokemonFromParty({
      ...pokemon,
      movesSelected: newMovesSelected,
    })
    setSelectedMove(mappedMove)
    setMovesSelected(newMovesSelected)
  }

  return (
    <div className={s.pokemonCard}>
      <img
        src={pokemon.sprites.front}
        alt={`Foto do pokemon ${pokemon.name}`}
      />
      <h2>{upperFirst(pokemon.name)}</h2>
      <div className={s.attackSelectWrapper}>
        <select onChange={handleSelect} name={MOVE_SELECT_PROPS.ATTACK1}>
          {flatMoveList.map((move) => (
            <option key={move.name} value={move.url}>
              {move.name}
            </option>
          ))}
        </select>
        <select onChange={handleSelect} name={MOVE_SELECT_PROPS.ATTACK2}>
          {flatMoveList.map((move) => (
            <option key={move.name} value={move.url}>
              {move.name}
            </option>
          ))}
        </select>
        <select onChange={handleSelect} name={MOVE_SELECT_PROPS.ATTACK3}>
          {flatMoveList.map((move) => (
            <option key={move.name} value={move.url}>
              {move.name}
            </option>
          ))}
        </select>
        <select onChange={handleSelect} name={MOVE_SELECT_PROPS.ATTACK4}>
          {flatMoveList.map((move) => (
            <option key={move.name} value={move.url}>
              {move.name}
            </option>
          ))}
        </select>
        <select onChange={handleSelect} name={MOVE_SELECT_PROPS.ABILITY}>
          {pokemon.abilities.map((ability) => (
            <option key={ability.name} value={ability.name}>
              {upperFirst(ability.name)}
            </option>
          ))}
        </select>
      </div>
      <div className={s.attackPreview}></div>
    </div>
  )
}
