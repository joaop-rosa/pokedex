import cn from "classnames";
import { upperFirst } from "lodash";
import { useBattle } from "../../hooks/useBattle";
import s from "./BattleField.module.css";

export function BattleField() {
	const { getActivePokemon, myUser, opponent } = useBattle();

	// Render party miniatures (the small pokeballs indicating party health)
	function renderPartyMiniatures(party) {
		return party
			.filter((pokemon) => !pokemon.isActive)
			.map((pokemon) => {
				const isDead = pokemon.currentLife <= 0;
				return (
					<img
						key={pokemon.id}
						className={cn(s.miniaturesImages, {
							[s.miniaturesImagesDisabled]: isDead,
						})}
						src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
						alt="pokeball"
						title={pokemon.name}
					/>
				);
			});
	}

	// Render Player HUD
	function renderHUD(player, isOpponent: boolean) {
		if (!player?.party) return null;

		const activePokemon = getActivePokemon(player.party);
		if (!activePokemon) return null;

		const hpPercent =
			(activePokemon.currentLife / activePokemon.stats.hp) * 100;
		let hpColorClass = s.healthBarGreen;
		if (hpPercent <= 20) hpColorClass = s.healthBarRed;
		else if (hpPercent <= 50) hpColorClass = s.healthBarYellow;

		return (
			<div
				className={cn(s.hudContainer, isOpponent ? s.hudOpponent : s.hudPlayer)}
			>
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
					{renderPartyMiniatures(player.party)}
				</div>
			</div>
		);
	}

	const myActivePokemon = myUser?.party ? getActivePokemon(myUser.party) : null;
	const oppActivePokemon = opponent?.party
		? getActivePokemon(opponent.party)
		: null;

	return (
		<div className={s.arenaContainer}>
			{/* Sprites layer */}
			{oppActivePokemon && (
				<div className={s.spriteWrapperOpponent}>
					<div className={s.groundShadow} />
					<img
						className={s.spriteImageOpponent}
						src={oppActivePokemon.sprites.battleFront}
						alt={oppActivePokemon.name}
					/>
				</div>
			)}
			{myActivePokemon && (
				<div className={s.spriteWrapperPlayer}>
					<div className={s.groundShadow} />
					<img
						className={s.spriteImagePlayer}
						src={myActivePokemon.sprites.battleBack}
						alt={myActivePokemon.name}
					/>
				</div>
			)}

			{/* HUDs layer */}
			{oppActivePokemon && renderHUD(opponent, true)}
			{myActivePokemon && renderHUD(myUser, false)}
		</div>
	);
}
