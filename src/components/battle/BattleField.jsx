import cn from "classnames"
import s from "./BattleField.module.css"
import { upperFirst } from "lodash"
import { useBattle } from "../../hooks/useBattle"

export function BattleField({ isOpponent }) {
  const {
    selectedPokemon,
    getActivePokemon,
    myUser,
    setSelectedPokemon,
    opponent,
  } = useBattle()

  function renderPartyMiniatures(party, isMyParty = false) {
    return party
      .filter((pokemon) => !pokemon.isActive)
      .map((pokemon) => {
        if (isMyParty) {
          return (
            <button
              key={pokemon.id}
              disabled={pokemon.currentLife <= 0}
              className={cn(s.buttonPokemonMiniature, {
                [s.selectedButtonPokemonMiniature]:
                  pokemon.id === selectedPokemon?.id,
              })}
              onClick={() => setSelectedPokemon(pokemon)}
            >
              <img
                className={s.miniaturesImages}
                src={pokemon.sprites.miniature}
                alt=""
              />
            </button>
          )
        }
        return (
          <img
            disabled={pokemon.currentLife <= 0}
            key={pokemon.id}
            className={cn(s.miniaturesImages, {
              [s.miniaturesImagesDisabled]: pokemon.currentLife <= 0,
            })}
            src={pokemon.sprites.miniature}
            alt=""
          />
        )
      })
  }

  function renderInfos(player) {
    const activePokemon = getActivePokemon(player.party)

    return (
      <>
        <p>
          {player.name} <span>({player.socketId})</span>
        </p>
        <h2>{upperFirst(activePokemon.name)}</h2>
        <div className={s.healthBarWrapper}>
          <progress
            className={cn(s.healthBar, {
              [s.healthBarRed]:
                (activePokemon.currentLife / activePokemon.stats.hp) * 100 <=
                30,
              [s.healthBarGreen]:
                (activePokemon.currentLife / activePokemon.stats.hp) * 100 >=
                70,
            })}
            max={activePokemon.stats.hp}
            value={activePokemon.currentLife}
          />
          <p className={s.healthBarText}>
            {activePokemon.currentLife >= 0 ? activePokemon.currentLife : 0} /
            {activePokemon.stats.hp}
          </p>
        </div>
      </>
    )
  }

  return (
    <div className={cn(s.field, { [s.opponentField]: isOpponent })}>
      <div className={s.infosWrapper}>
        <div
          className={cn(s.pokemonInfos, {
            [s.opponentPokemonInfos]: isOpponent,
          })}
        >
          {isOpponent ? renderInfos(opponent) : renderInfos(myUser)}
        </div>

        <div
          className={cn(s.miniaturesWrapper, {
            [s.opponentMiniaturesWrapper]: isOpponent,
          })}
        >
          {isOpponent
            ? renderPartyMiniatures(opponent.party)
            : renderPartyMiniatures(myUser.party, true)}
        </div>
      </div>
      <img
        className={s.activePokemonImage}
        src={
          isOpponent
            ? getActivePokemon(opponent.party).sprites.front
            : getActivePokemon(myUser.party).sprites.back
        }
        alt=""
      />
    </div>
  )
}
