import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { upperFirst } from "lodash";
import { useEffect, useState } from "react";
import { MdCatchingPokemon, MdClose, MdDeleteOutline } from "react-icons/md";
import { renderTypeClassnames } from "../contants/types";
import { MAX_PARTY_LENGTH } from "../context/PartyProvider";
import { useParty } from "../hooks/useParty";
import s from "./Party.module.css";

export function Party() {
	const { party, removePokemonFromParty } = useParty();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add("party-open");
		} else {
			document.body.classList.remove("party-open");
		}
		return () => document.body.classList.remove("party-open");
	}, [isOpen]);

	// Sempre renderizar 6 slots (MAX_PARTY_LENGTH)
	const slots = Array.from({ length: MAX_PARTY_LENGTH });

	return (
		<div className={s.root}>
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Overlay for mobile to close when clicking outside */}
						<motion.div
							className={s.overlay}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
						/>

						<motion.div
							className={s.panel}
							initial={{ opacity: 0, y: "100%" }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: "100%" }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							drag="y"
							dragConstraints={{ top: 0, bottom: 0 }}
							dragElastic={{ top: 0, bottom: 0.5 }}
							onDragEnd={(_e, info) => {
								if (info.offset.y > 100 || info.velocity.y > 500) {
									setIsOpen(false);
								}
							}}
						>
							<div className={s.dragHandle}>
								<div className={s.dragIndicator} />
							</div>

							<div className={s.panelHeader}>
								<h2 className={s.panelTitle}>Your Team</h2>
								<button
									type="button"
									className={s.closeButton}
									onClick={() => setIsOpen(false)}
									title="Close"
								>
									<MdClose size={24} />
								</button>
							</div>

							<div className={s.slotsList}>
								{slots.map((_, index) => {
									const pokemon = party[index];

									if (pokemon) {
										return (
											<div
												key={pokemon.partyId}
												className={cn(
													s.slot,
													s.slotOccupied,
													renderTypeClassnames(pokemon?.types?.[0], s),
												)}
											>
												<div className={s.pokemonInfo}>
													<div className={s.spriteWrapper}>
														<img
															className={s.sprite}
															src={
																pokemon.sprites.icon ||
																pokemon.sprites.miniature ||
																pokemon.sprites.front
															}
															alt={pokemon.name}
														/>
													</div>
													<div className={s.pokemonDetails}>
														<span className={s.pokemonName}>
															{upperFirst(pokemon.name)}
														</span>
														<span className={s.pokemonId}>
															#{String(pokemon.id).padStart(3, "0")}
														</span>
													</div>
												</div>
												<button
													type="button"
													className={s.removeButton}
													onClick={() => removePokemonFromParty(pokemon)}
													title="Remove Pokémon"
												>
													<MdDeleteOutline size={20} />
												</button>
											</div>
										);
									}

									// Empty Slot
									return (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: Empty slots don't have unique IDs
											key={`empty-${index}`} // eslint-disable-line react/no-array-index-key
											className={cn(s.slot, s.slotEmpty)}
										>
											<div className={s.emptyIconWrapper}>
												<MdCatchingPokemon className={s.emptyIcon} size={24} />
											</div>
											<span className={s.emptyText}>Empty Slot</span>
										</div>
									);
								})}
							</div>

							<div className={s.panelFooter}>
								{party.length === 0 ? (
									<button type="button" className={s.lobbyLink} disabled>
										Go to Lobby
									</button>
								) : (
									<a className={s.lobbyLink} href="/lobby">
										Go to Lobby
									</a>
								)}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			<button
				type="button"
				className={cn(s.fab, { [s.fabHiddenMobile]: isOpen })}
				onClick={() => setIsOpen((prev) => !prev)}
				title="View Team"
			>
				<MdCatchingPokemon size={36} className={s.fabIcon} />
				<span className={s.badge}>
					{party.length}/{MAX_PARTY_LENGTH}
				</span>
			</button>
		</div>
	);
}
