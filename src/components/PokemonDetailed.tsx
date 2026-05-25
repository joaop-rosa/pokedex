import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useMedia } from "react-use";
import { useSelectedPokemon } from "../hooks/useSelectedPokemon";
import { PokedexScreen } from "./PokedexScreen";
import s from "./PokemonDetailed.module.css";
import { PokemonTabs } from "./PokemonTabs";
import { PokedexInfoScreen } from "./pokedex-screens/PokedexInfoScreen";

export function PokemonDetailed() {
	const { selectedPokemon, setSelectedPokemon } = useSelectedPokemon();
	const isMobile = useMedia("(max-width: 1024px)", false);
	const dragControls = useDragControls();

	const handleClose = useCallback(() => {
		setSelectedPokemon(null);
	}, [setSelectedPokemon]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleClose]);

	useEffect(() => {
		if (selectedPokemon) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [selectedPokemon]);

	const initialPos = isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 };
	const animatePos = { x: 0, y: 0 };
	const exitPos = isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 };

	const dragDirection = isMobile ? "y" : "x";
	const dragConstraints = isMobile
		? { top: 0, bottom: 0 }
		: { left: 0, right: 0 };
	const dragElastic = isMobile ? { top: 0, bottom: 1 } : { left: 0, right: 1 };

	return (
		<AnimatePresence>
			{selectedPokemon && (
				<>
					<motion.div
						className={s.backdrop}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
					/>
					<motion.div
						className={s.contentWrapper}
						initial={initialPos}
						animate={animatePos}
						exit={exitPos}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						drag={dragDirection}
						dragControls={dragControls}
						dragListener={!isMobile} // On desktop, drag anywhere. On mobile, only handle.
						dragConstraints={dragConstraints}
						dragElastic={dragElastic}
						onDragEnd={(_e, { offset, velocity }) => {
							if (isMobile) {
								if (offset.y > 100 || velocity.y > 500) handleClose();
							} else {
								if (offset.x > 100 || velocity.x > 500) handleClose();
							}
						}}
					>
						<button
							type="button"
							className={s.closeButton}
							onClick={handleClose}
							aria-label="Close details"
						>
							<FaTimes />
						</button>

						{isMobile && (
							<div
								className={s.dragHandleWrapper}
								onPointerDown={(e) => dragControls.start(e)}
							>
								<div className={s.dragHandle} />
							</div>
						)}

						<div
							className={s.container}
						>
							<div className={s.content}>
								<PokedexScreen />
								<PokemonTabs />
								<PokedexInfoScreen />
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
