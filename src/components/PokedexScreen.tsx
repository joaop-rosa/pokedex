import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { upperFirst } from "lodash";
import type React from "react";
import FemaleIcon from "../assets/icons/female.svg?react";
import MaleIcon from "../assets/icons/male.svg?react";
import Rotate from "../assets/icons/rotate.svg?react";
import background from "../assets/img/detailed-background.png";
import {
	POSITION_VARIATIONS,
	SEX_VARIATIONS,
	SPRITE_VARIATIONS,
} from "../context/SelectedPokemonProvider";
import { useSelectedPokemon } from "../hooks/useSelectedPokemon";
import s from "./PokedexScreen.module.css";
import { ToggleSwitch } from "./UI/ToggleSwitch";

export function PokedexScreen() {
	const {
		selectedPokemon,
		speciesInfo,
		positionVariation,
		infoScreenContent,
		setInfoScreenContent,
		isFemale,
		isBack,
		isShiny,
		setSexVariation,
		setPositionVariation,
		setSpriteVariation,
	} = useSelectedPokemon();

	const isHero = infoScreenContent === null;

	function renderImage() {
		if (!selectedPokemon?.sprites?.frontAnimated) {
			return selectedPokemon?.sprites?.front;
		}

		if (speciesInfo?.hasFemale && isFemale) {
			if (isBack && isShiny) {
				return selectedPokemon?.sprites.backAnimatedFemaleShiny;
			}
			if (isBack) {
				return selectedPokemon?.sprites.backAnimatedFemale;
			}
			if (isShiny) {
				return selectedPokemon?.sprites.frontAnimatedFemaleShiny;
			}
			return selectedPokemon?.sprites.frontAnimatedFemale;
		}

		if (isBack && isShiny) {
			return selectedPokemon.sprites.backAnimatedShiny;
		}
		if (isBack) {
			return selectedPokemon.sprites.backAnimated;
		}
		if (isShiny) {
			return selectedPokemon.sprites.frontAnimatedShiny;
		}

		return selectedPokemon.sprites.frontAnimated;
	}

	function handleSexSwitch(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.checked) {
			return setSexVariation(SEX_VARIATIONS.FEMALE);
		}
		return setSexVariation(SEX_VARIATIONS.MALE);
	}

	function handleRotateButton() {
		if (positionVariation === POSITION_VARIATIONS.FRONT) {
			return setPositionVariation(POSITION_VARIATIONS.BACK);
		}
		setPositionVariation(POSITION_VARIATIONS.FRONT);
	}

	function handleShinyToggle() {
		if (isShiny) {
			setSpriteVariation(SPRITE_VARIATIONS.DEFAULT);
		} else {
			setSpriteVariation(SPRITE_VARIATIONS.SHINY);
		}
	}

	function renderShinyButton() {
		const isDisabled = () => {
			if (!selectedPokemon?.sprites?.frontAnimatedShiny) return true;
			if (
				!selectedPokemon?.sprites?.backAnimatedFemaleShiny &&
				isFemale &&
				isBack
			)
				return true;
			return false;
		};

		return (
			<button
				type="button"
				className={cn(s.shinyButton, {
					[s.shinyButtonDisabled]: isDisabled(),
					[s.shinyButtonActive]: isShiny,
				})}
				onClick={handleShinyToggle}
				disabled={isDisabled()}
				title="Toggle Shiny"
			>
				✨
			</button>
		);
	}

	function renderRotateButton() {
		const isDisabled = () => {
			if (
				!selectedPokemon?.sprites?.backAnimatedFemaleShiny &&
				isFemale &&
				isShiny
			)
				return true;
			if (!selectedPokemon?.sprites?.backAnimatedShiny && isShiny) return true;
			if (!selectedPokemon?.sprites?.backAnimatedFemale && isFemale)
				return true;
			if (!selectedPokemon?.sprites?.backAnimated) return true;
			return false;
		};

		return (
			<button
				type="button"
				className={cn(s.rotateButton, {
					[s.rotateButtonDisabled]: isDisabled(),
				})}
				onClick={handleRotateButton}
				disabled={isDisabled()}
			>
				<Rotate className={s.rotateIcon} />
			</button>
		);
	}

	function renderToggleSwitchSex() {
		const isDisabled = () => {
			if (
				!speciesInfo?.hasFemale ||
				!selectedPokemon?.sprites?.frontAnimatedFemale
			)
				return true;
			if (
				!selectedPokemon?.sprites?.backAnimatedFemaleShiny &&
				isBack &&
				isShiny
			)
				return true;
			return false;
		};

		return (
			<div
				className={cn(s.toggleSwitchWrapper, {
					[s.toggleSwitchWrapperDisabled]: isDisabled(),
				})}
			>
				<MaleIcon className={s.sexIcon} />
				<ToggleSwitch onChange={handleSexSwitch} isDisabled={isDisabled()} />
				<FemaleIcon className={s.sexIcon} />
			</div>
		);
	}

	const type1 = selectedPokemon?.types?.[0];
	const glowStyle = type1
		? ({ "--glow-color": `var(--color-${type1})` } as React.CSSProperties)
		: {};

	return (
		<motion.div
			layout
			animate={{
				borderRadius: isHero ? "15px 15px 15px 60px" : "15px 15px 15px 15px",
			}}
			transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
			className={cn(s.screenWrapper, { [s.compactMode]: !isHero })}
			style={{
				overflow: "hidden",
				minHeight: isHero ? 350 : 90,
				maxHeight: isHero ? 350 : 90,
				padding: isHero ? "20px 30px 10px 30px" : "10px 30px",
				marginBottom: isHero ? 20 : 15,
			}}
		>
			<motion.div
				layout
				transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
				className={s.screen}
				style={glowStyle}
				onClick={!isHero ? () => setInfoScreenContent(null) : undefined}
				whileTap={!isHero ? { scale: 0.98 } : undefined}
			>
				{selectedPokemon ? (
					<>
						<AnimatePresence>
							{isHero && (
								<motion.img
									layout
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ type: "spring", bounce: 0, duration: 0.5 }}
									src={background}
									className={s.background}
									alt=""
								/>
							)}
						</AnimatePresence>

						<motion.div
							layout
							transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
							className={s.photoPokemonWrapper}
						>
							<AnimatePresence mode="popLayout">
								{isHero ? (
									<motion.img
										key="hero-img"
										layoutId={`pokemon-image-${selectedPokemon.id}`}
										transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
										className={s.photoPokemon}
										src={renderImage()}
										alt={`Foto do pokemon ${selectedPokemon?.name}`}
									/>
								) : (
									<motion.img
										key="icon-img"
										layoutId={`pokemon-image-${selectedPokemon.id}`}
										transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
										className={s.iconPokemon}
										src={
											selectedPokemon?.sprites?.icon ||
											selectedPokemon?.sprites?.miniature ||
											renderImage()
										}
										alt={`Ícone do pokemon ${selectedPokemon?.name}`}
									/>
								)}
							</AnimatePresence>
						</motion.div>

						<motion.div
							layout
							transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
							className={s.pokemonInfoWrapper}
						>
							<motion.p
								layout
								transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
								className={s.pokemonName}
							>
								{upperFirst(selectedPokemon.name)}
							</motion.p>
							<motion.p
								layout
								transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
								className={s.pokemonId}
							>
								{`#${selectedPokemon.id}`}
							</motion.p>
						</motion.div>
					</>
				) : null}
			</motion.div>

			<AnimatePresence>
				{isHero && (
					<motion.div
						layout
						className={s.screenButtons}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { duration: 0, delay: 0 } }}
						exit={{ opacity: 0, transition: { duration: 0, delay: 0 } }}
					>
						{renderShinyButton()}
						{renderRotateButton()}
						{renderToggleSwitchSex()}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
