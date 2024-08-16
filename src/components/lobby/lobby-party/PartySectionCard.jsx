import { upperFirst } from "lodash"
import s from "./PartySectionCard.module.css"
import { useMemo, useState } from "react"
import { useApi } from "../../../hooks/useApi"
import { MOVE_SELECT_PROPS } from "../../../context/PartyProvider"
import { useParty } from "../../../hooks/useParty"

export function PartySectionCard({ pokemon }) {
  const [selectedMove, setSelectedMove] = useState(null)
  const { fetchMove } = useApi()
  const { editPokemonFromParty } = useParty()

  const flatMoveList = useMemo(() => {
    return Object.keys(pokemon.moves)
      .map((key) => pokemon.moves[key])
      .flat(Infinity)
      .filter((move, index, movesArray) => {
        return movesArray.findIndex((m) => m.name === move.name) === index
      })
  }, [pokemon.moves])

  const [movesSelected, setMovesSelected] = useState(pokemon.movesSelected)

  async function handleSelect(event) {
    const move = flatMoveList.find((m) => event.target.value === m.name)
    const mappedMove = await fetchMove(move.url)
    // event.target.name === MOVE_SELECT_PROPS.ABILITY
    //   ? pokemon.abilities[
    //       pokemon.abilities.findIndex(
    //         (ability) => ability.name === event.target.value
    //       )
    //     ]
    //   : await fetchMove(event.target.value)

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

  function renderOptions() {
    return (
      <>
        <option disabled value="">
          Selecione o ataque
        </option>
        {flatMoveList.map((move) => (
          <option key={move.name} value={move.name}>
            {move.name}
          </option>
        ))}
      </>
    )
  }

  return (
    <div className={s.pokemonCard}>
      <img
        src={pokemon.sprites.front}
        alt={`Foto do pokemon ${pokemon.name}`}
        className={s.pokemonPhoto}
      />
      <div className={s.pokemonCardInfoWrapper}>
        <h2>{upperFirst(pokemon.name)}</h2>
        <div className={s.attackSelectWrapper}>
          <select
            onChange={handleSelect}
            name={MOVE_SELECT_PROPS.ATTACK1}
            value={movesSelected[MOVE_SELECT_PROPS.ATTACK1]?.name ?? ""}
          >
            {renderOptions()}
          </select>
          <select
            onChange={handleSelect}
            name={MOVE_SELECT_PROPS.ATTACK2}
            value={movesSelected[MOVE_SELECT_PROPS.ATTACK2]?.name ?? ""}
          >
            {renderOptions()}
          </select>
          <select
            onChange={handleSelect}
            name={MOVE_SELECT_PROPS.ATTACK3}
            value={movesSelected[MOVE_SELECT_PROPS.ATTACK3]?.name ?? ""}
          >
            {renderOptions()}
          </select>
          <select
            onChange={handleSelect}
            name={MOVE_SELECT_PROPS.ATTACK4}
            value={movesSelected[MOVE_SELECT_PROPS.ATTACK4]?.name ?? ""}
          >
            {renderOptions()}
          </select>
          {/* <select onChange={handleSelect} name={MOVE_SELECT_PROPS.ABILITY}>
            {pokemon.abilities.map((ability) => (
              <option key={ability.name} value={ability.name}>
                {upperFirst(ability.name)}
              </option>
            ))}
          </select> */}
        </div>
      </div>

      <div className={s.attackPreview}></div>
    </div>
  )
}
