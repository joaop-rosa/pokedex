import cn from "classnames";
import { useState } from "react";
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
		setSelectedPokemon,
		hasToChangePokemon,
		hasOpponentToChangePokemon,
	} = useBattle();

	const [menuMode, setMenuMode] = useState<"FIGHT" | "POKEMON">("FIGHT");

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
								<span className={s.attackPp}>
									PP {move.pp}/{move.pp}
								</span>
							</button>
						);
					}
					return (
						<button
							type="button"
							// biome-ignore lint/suspicious/noArrayIndexKey: Empty slots don't have unique IDs
							key={`empty-move-${index}`}
							className={cn(s.buttonAttack, s.buttonEmpty)}
							disabled
						>
							-
						</button>
					);
				})}
			</div>
		);
	}

	function renderPokemonSelection() {
		const party = myUser?.party || [];
		return (
			<div className={s.pokemonGrid}>
				{party.map((pokemon) => {
					const isDead = pokemon.currentLife <= 0;
					return (
						<button
							type="button"
							key={pokemon.id}
							disabled={isDead || pokemon.isActive}
							className={cn(s.buttonAttack, s.buttonPokemon, {
								[s.buttonAttackSelected]: selectedPokemon?.id === pokemon.id,
							})}
							onClick={() => setSelectedPokemon(pokemon)}
						>
							<img
								src={pokemon.sprites.miniature}
								className={cn(s.miniatureSprite, { [s.miniatureDead]: isDead })}
								alt={pokemon.name}
							/>
							<div className={s.pokemonInfoWrapper}>
								<span className={s.attackName}>{pokemon.name}</span>
								<span className={s.attackPp}>
									HP: {Math.max(0, pokemon.currentLife)}/{pokemon.stats.hp}
								</span>
							</div>
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
					<p>{winner} won the battle</p>
					<button
						type="button"
						onClick={finishBattle}
						className={s.finishButton}
					>
						Finish battle
					</button>
				</>
			);
		}

		if (hasToChangePokemon) {
			return (
				<div className={s.consoleSplit}>
					<div className={s.narrativeBox}>
						<p className={s.narrativeBoxMessage}>
							Select another pokemon to continue
						</p>
						<button
							type="button"
							onClick={() =>
								changePokemonAction(battleId, String(selectedPokemon?.id || ""))
							}
							className={cn(s.actionsButton, s.changePokemonButtonAlt)}
							disabled={!selectedPokemon}
						>
							Switch Pokémon
						</button>
					</div>
					<div className={s.actionBox}>{renderPokemonSelection()}</div>
				</div>
			);
		}

		if (hasOpponentToChangePokemon) {
			return (
				<div className={s.narrativeBox}>
					<p>Waiting for the opponent to select another pokemon...</p>
				</div>
			);
		}

		if (isWaitingOponentMove) {
			return (
				<div className={s.narrativeBox}>
					<p>Waiting for opponent's action...</p>
				</div>
			);
		}

		return (
			<div className={s.consoleSplit}>
				<div className={s.narrativeBox}>
					<p className={s.narrativeBoxMessage}>
						What will{" "}
						{myUser?.party ? getActivePokemon(myUser.party)?.name : "you"} do?
					</p>

					<div className={s.mainMenuButtons}>
						<button
							type="button"
							className={cn(s.menuButton, {
								[s.menuButtonActive]: menuMode === "FIGHT",
							})}
							onClick={() => setMenuMode("FIGHT")}
						>
							Fight
						</button>
						<button
							type="button"
							className={cn(s.menuButton, {
								[s.menuButtonActive]: menuMode === "POKEMON",
							})}
							onClick={() => setMenuMode("POKEMON")}
						>
							Pokémon
						</button>
					</div>

					{menuMode === "FIGHT" && selectedMove && (
						<div className={s.confirmActionArea}>
							<button
								type="button"
								className={cn(s.actionsButton, s.attackButton)}
								onClick={handleAttack}
							>
								Confirm Attack
							</button>
						</div>
					)}

					{menuMode === "POKEMON" && selectedPokemon && (
						<div className={s.confirmActionArea}>
							<button
								type="button"
								className={cn(s.actionsButton, s.changePokemonButtonAlt)}
								onClick={handleChangePokemon}
							>
								Confirm Switch
							</button>
						</div>
					)}
				</div>
				<div className={s.actionBox}>
					{menuMode === "FIGHT"
						? renderAttackSelection()
						: renderPokemonSelection()}
				</div>
			</div>
		);
	}

	return <div className={s.bottomSection}>{renderBottomSection()}</div>;
}
