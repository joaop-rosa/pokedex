import cn from "classnames";
import { useBattle } from "../../hooks/useBattle";
import { useSocket } from "../../hooks/useSocket";
import type { MoveDetailed } from "../../types/pokemon";
import s from "./BattleActions.module.css";

export function BattleActions() {
	const {
		battle,
		battleAction,
		isWaitingOponentMove,
		changePokemonAction,
		finishBattle,
	} = useSocket();
	const { isOver, battleId, winner } = battle || {};
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
		if (battleId) battleAction(battleId, "ATTACK", selectedMove);
	}

	function handleChangePokemon() {
		if (battleId) battleAction(battleId, "CHANGE", selectedPokemon);
	}

	function renderAttackSelection() {
		const activePokemon = getActivePokemon(myUser?.party || []);
		const moves = activePokemon?.moves || {};
		const moveList = Object.values(moves) as unknown as (MoveDetailed | null)[];

		return (
			<div className={s.actionGrid}>
				{moveList.map((move, index) => {
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
								<span className={s.attackName}>{move.name}</span>
								<span className={s.attackPp}>PP {move.pp}/{move.pp}</span>
							</button>
						);
					}
					return (
						<button type="button" key={`empty-move-${index}`} className={cn(s.buttonAttack, s.buttonEmpty)} disabled>
							-
						</button>
					);
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
				<div className={s.narrativeBox}>
					<p>Selecione outro pokemon para continuar</p>
					<button
						type="button"
						onClick={() =>
							changePokemonAction(battleId, String(selectedPokemon?.id || ""))
						}
						className={cn(s.actionsButton, s.changePokemonButton)}
						disabled={!selectedPokemon}
					>
						Change Pokemon
					</button>
				</div>
			);
		}

		if (hasOpponentToChangePokemon) {
			return (
				<div className={s.narrativeBox}>
					<p>Aguardando o oponente selecionar outro pokemon...</p>
				</div>
			);
		}

		if (isWaitingOponentMove) {
			return (
				<div className={s.narrativeBox}>
					<p>Aguardando o oponente fazer a ação...</p>
				</div>
			);
		}

		return (
			<div className={s.consoleSplit}>
				<div className={s.narrativeBox}>
					<p>O que {myUser?.party ? getActivePokemon(myUser.party)?.name : "você"} fará?</p>
					
					{selectedMove && (
						<div className={s.confirmActionArea}>
							<button
								type="button"
								className={cn(s.actionsButton, s.attackButton)}
								onClick={handleAttack}
							>
								Confirmar Ataque
							</button>
						</div>
					)}
					
					<button
						type="button"
						className={cn(s.actionsButton, s.changePokemonButtonAlt)}
						disabled={!selectedPokemon}
						onClick={handleChangePokemon}
					>
						Trocar Pokémon
					</button>
				</div>
				<div className={s.actionBox}>
					{renderAttackSelection()}
				</div>
			</div>
		);
	}

	return <div className={s.bottomSection}>{renderBottomSection()}</div>;
}
