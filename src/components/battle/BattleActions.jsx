import cn from "classnames"
import { useSocket } from "../../hooks/useSocket"
import { useBattle } from "../../hooks/useBattle"
import s from "./BattleActions.module.css"

export function BattleActions() {
  const {
    battle,
    battleAction,
    isWaitingOponentMove,
    changePokemonAction,
    finishBattle,
  } = useSocket()
  const { isOver, battleId, winner } = battle
  const {
    selectedMove,
    selectedPokemon,
    getActivePokemon,
    myUser,
    setSelectedMove,
    hasToChangePokemon,
    hasOpponentToChangePokemon,
  } = useBattle()

  function handleAttack() {
    battleAction(battleId, "ATTACK", selectedMove)
  }

  function handleChangePokemon() {
    battleAction(battleId, "CHANGE", selectedPokemon)
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
            <span>
              PP: {selectedMove?.pp || "----"} / {selectedMove?.pp || "----"}
            </span>
            <span>Power: {selectedMove?.power || "----"}</span>
            <span>Accuracy: {selectedMove?.accuracy || "----"}</span>
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

  return <div className={s.bottomSection}>{renderBottomSection()}</div>
}
