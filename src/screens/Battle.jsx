import React, { useContext, useMemo, useState } from "react"
import { SocketContext } from "../context/SocketProvider"
import cn from "classnames"
import { Spinner } from "../components/Spinner"

import s from "./Battle.module.css"
import { upperFirst } from "lodash"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Battle() {
  const {
    battle,
    username,
    battleAction,
    isWaitingOponentMove,
    changePokemonAction,
    finishBattle,
    isConnected,
  } = useContext(SocketContext)
  const [opponent, setOpponent] = useState(null)
  const [myUser, setMyUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMove, setSelectedMove] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const { owner, userInvited, isOver, battleId, winner } = battle
  const navigate = useNavigate()
  const hasToChangePokemon = useMemo(() => {
    if (!isLoading) {
      return getActivePokemon(myUser?.party).currentLife <= 0
    }

    return false
  }, [isLoading, myUser])
  const hasOpponentToChangePokemon = useMemo(() => {
    if (!isLoading) {
      return getActivePokemon(opponent?.party).currentLife <= 0
    }

    return false
  }, [isLoading, opponent])

  useEffect(() => {
    if (isConnected && owner && userInvited) {
      const isOwner = owner.name === username

      if (isOwner) {
        setMyUser(owner)
        setOpponent(userInvited)
        setIsLoading(false)
        return
      }

      setMyUser(userInvited)
      setOpponent(owner)
      setIsLoading(false)
      setSelectedMove(null)
      setSelectedPokemon(null)
    }

    if (isConnected && !owner && !userInvited) {
      navigate("/lobby")
    }
  }, [isConnected, navigate, owner, userInvited, username])

  function getActivePokemon(party) {
    return party.find((pokemon) => pokemon.isActive)
  }

  function renderPartyMiniatures(party, isMyParty = false) {
    return party
      .filter((pokemon) => !pokemon.isActive)
      .map((pokemon) => {
        if (isMyParty) {
          return (
            <button
              disabled={pokemon.currentLife <= 0}
              className={cn(s.buttonPokemonMiniature, {
                [s.selectedButtonPokemonMiniature]:
                  pokemon.id === selectedPokemon?.id,
              })}
              onClick={() => setSelectedPokemon(pokemon)}
            >
              <img
                key={pokemon.name}
                className={s.miniaturesImages}
                src={pokemon.sprites.miniature}
                alt=""
              />
            </button>
          )
        }
        return (
          <img
            key={pokemon.name}
            className={s.miniaturesImages}
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
        <progress
          className={s.healthBar}
          max={activePokemon.stats.hp}
          value={activePokemon.currentLife ?? activePokemon.stats.hp}
        />
      </>
    )
  }

  function renderField(isOpponent = false) {
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

  function renderAttackSelection() {
    const { moves } = getActivePokemon(myUser.party)
    return (
      <div className={s.attackSelectionWrapper}>
        {Object.values(moves).map((move, index) => {
          if (move) {
            return (
              <button
                className={cn(s.buttonAttack, {
                  [s.buttonAttackSelected]: selectedMove?.name === move.name,
                })}
                onClick={() => setSelectedMove(move)}
                key={move.name}
              >
                {move.name}
              </button>
            )
          }
          return <span key={index}>------</span>
        })}
      </div>
    )
  }

  function renderAttackSelectedInfos() {
    return (
      <>
        <span>
          PP: {selectedMove?.pp || "----"} / {selectedMove?.pp || "----"}
        </span>
        <span>Power: {selectedMove?.power || "----"}</span>
        <span>Accuracy: {selectedMove?.accuracy || "----"}</span>
      </>
    )
  }

  function handleAttack() {
    battleAction(battleId, "ATTACK", selectedMove)
  }

  function handleChangePokemon() {
    battleAction(battleId, "CHANGE", selectedPokemon)
  }

  if (isLoading) {
    return <Spinner />
  }

  function renderBottomSection() {
    if (isOver) {
      return (
        <>
          <p>{winner} venceu a partida</p>
          <button onClick={finishBattle} className={s.finishButton}>
            Finalizar batalha
          </button>
        </>
      )
    }

    if (hasToChangePokemon) {
      return (
        <>
          <p>Selecione outro pokemon para continuar</p>
          <button
            onClick={() => changePokemonAction(battleId, selectedPokemon.id)}
            className={cn(s.actionsButton, s.changePokemonButton)}
            disabled={!selectedPokemon}
          >
            Change Pokemon
          </button>
        </>
      )
    }

    if (hasOpponentToChangePokemon) {
      return <p>Aguardando o oponente selecionar outro pokemon...</p>
    }

    if (isWaitingOponentMove) {
      return <p>Aguardando o oponente fazer a ação...</p>
    }

    return (
      <>
        {renderAttackSelection()}
        <div className={s.confirmsSection}>
          <div className={s.attackSelectedInfosWrapper}>
            {renderAttackSelectedInfos()}
          </div>

          <div className={s.actionsConfirmWrapper}>
            <button
              className={cn(s.actionsButton, s.attackButton)}
              onClick={handleAttack}
              disabled={!selectedMove}
            >
              Attack
            </button>
            <button
              className={cn(s.actionsButton, s.changePokemonButton)}
              disabled={!selectedPokemon}
              onClick={handleChangePokemon}
            >
              Change Pokemon
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={s.sectionBattle}>
      <div className={s.container}>
        {renderField(true)}
        {renderField()}
        <div className={s.bottomSection}>{renderBottomSection()}</div>
      </div>
    </div>
  )
}
