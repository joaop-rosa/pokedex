import cn from "classnames";
import { upperFirst } from "lodash";
import { useBattle } from "../../hooks/useBattle";
import s from "./BattleField.module.css";

export function BattleField() {
	const {
		selectedPokemon,
		getActivePokemon,
		myUser,
		setSelectedPokemon,
		opponent,
	} = useBattle();

	// Render party miniatures (the small pokeballs/sprites indicating party health)
	function renderPartyMiniatures(party, isMyParty = false) {
		return party
			.filter((pokemon) => !pokemon.isActive)
			.map((pokemon) => {
				if (isMyParty) {
					return (
						<button
							type="button"
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
								alt="pokemon miniature"
							/>
						</button>
					);
				}
				return (
					<img
						key={pokemon.id}
						className={cn(s.miniaturesImages, {
							[s.miniaturesImagesDisabled]: pokemon.currentLife <= 0,
						})}
						src={pokemon.sprites.miniature}
						alt=""
					/>
				);
			});
	}

	// Render Player HUD
	function renderHUD(player, isOpponent: boolean) {
		if (!player?.party) return null;
		
		const activePokemon = getActivePokemon(player.party);
		if (!activePokemon) return null;

		const hpPercent = (activePokemon.currentLife / activePokemon.stats.hp) * 100;
		let hpColorClass = s.healthBarGreen;
		if (hpPercent <= 20) hpColorClass = s.healthBarRed;
		else if (hpPercent <= 50) hpColorClass = s.healthBarYellow;

		return (
			<div className={cn(s.hudContainer, isOpponent ? s.hudOpponent : s.hudPlayer)}>
				<div className={s.hudHeader}>
					<h2 className={s.pokemonName}>{upperFirst(activePokemon.name)}</h2>
					<span className={s.pokemonLevel}>Lv50</span>
				</div>
				<div className={s.healthBarWrapper}>
					<div className={s.hpLabel}>HP</div>
					<div className={s.healthBarTrack}>
						<div 
							className={cn(s.healthBarFill, hpColorClass)} 
							style={{ width: `${Math.max(0, hpPercent)}%` }}
						/>
					</div>
				</div>
				<p className={s.healthBarText}>
					{Math.max(0, activePokemon.currentLife)} / {activePokemon.stats.hp}
				</p>
				<div className={s.miniaturesContainer}>
					{renderPartyMiniatures(player.party, !isOpponent)}
				</div>
			</div>
		);
	}

	const myActivePokemon = myUser?.party ? getActivePokemon(myUser.party) : null;
	const oppActivePokemon = opponent?.party ? getActivePokemon(opponent.party) : null;

	return (
		<div className={s.arenaContainer}>
			{/* Opponent Side (Top Right Sprite, Top Left HUD) */}
			{oppActivePokemon && (
				<div className={s.opponentSide}>
					{renderHUD(opponent, true)}
					<div className={s.spriteWrapperOpponent}>
						<div className={s.groundShadow} />
						<img
							className={s.spriteImageOpponent}
							src={oppActivePokemon.sprites.front}
							alt={oppActivePokemon.name}
						/>
					</div>
				</div>
			)}

			{/* Player Side (Bottom Left Sprite, Bottom Right HUD) */}
			{myActivePokemon && (
				<div className={s.playerSide}>
					<div className={s.spriteWrapperPlayer}>
						<div className={s.groundShadow} />
						<img
							className={s.spriteImagePlayer}
							src={myActivePokemon.sprites.back || myActivePokemon.sprites.front}
							alt={myActivePokemon.name}
						/>
					</div>
					{renderHUD(myUser, false)}
				</div>
			)}
		</div>
	);
}
