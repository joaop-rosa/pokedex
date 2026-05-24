import cn from "classnames";
import { useBattle } from "../../hooks/useBattle";
import { useSocket } from "../../hooks/useSocket";
import s from "./BattleActions.module.css";

export function BattleActions() {
	const {
		battle,
		battleAction,
		isWaitingOponentMove,
		changePokemonAction,
		finishBattle,
	} = useSocket();
	const { isOver, battleId, winner } = battle;
	const {
		selectedMove,
		selectedPokemon,
		getActivePokemon,
		myUser,
		setSelectedMove,
		hasToChangePokemon,
		hasOpponentToChangePokemon,
	} = useBattle();

	function handleAttack() {
		battleAction(battleId, "ATTACK", selectedMove);
	}

	function handleChangePokemon() {
		battleAction(battleId, "CHANGE", selectedPokemon);
	}

	function renderAttackSelection() {
		const { movesSelected: moves } = getActivePokemon(myUser.party);
		return (
			<div className={s.attackSelectionWrapper}>
				{Object.values(moves).map((move, index) => {
					if (move) {
						return (
							<button
								type="button"
								className={cn(s.buttonAttack, {
									[s.buttonAttackSelected]: selectedMove?.name === move.name,
								})}
								onClick={() => setSelectedMove(move)}
								key={move.name}
							>
								{move.name}
							</button>
						);
					}
					// biome-ignore lint/suspicious/noArrayIndexKey: empty slot key
					return <span key={`empty-move-${index}`}>------</span>;
				})}
			</div>
		);
	}

	function renderBottomSection() {
		if (isOver) {
			return (
				<>
					<p>{winner} venceu a partida</p>
					<button
						type="button"
						onClick={finishBattle}
						className={s.finishButton}
					>
						Finalizar batalha
					</button>
				</>
			);
		}

		if (hasToChangePokemon) {
			return (
				<>
					<p>Selecione outro pokemon para continuar</p>
					<button
						type="button"
						onClick={() =>
							changePokemonAction(battleId, String(selectedPokemon.id))
						}
						className={cn(s.actionsButton, s.changePokemonButton)}
						disabled={!selectedPokemon}
					>
						Change Pokemon
					</button>
				</>
			);
		}

		if (hasOpponentToChangePokemon) {
			return <p>Aguardando o oponente selecionar outro pokemon...</p>;
		}

		if (isWaitingOponentMove) {
			return <p>Aguardando o oponente fazer a ação...</p>;
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
							type="button"
							className={cn(s.actionsButton, s.attackButton)}
							onClick={handleAttack}
							disabled={!selectedMove}
						>
							Attack
						</button>
						<button
							type="button"
							className={cn(s.actionsButton, s.changePokemonButton)}
							disabled={!selectedPokemon}
							onClick={handleChangePokemon}
						>
							Change Pokemon
						</button>
					</div>
				</div>
			</>
		);
	}

	return <div className={s.bottomSection}>{renderBottomSection()}</div>;
}
