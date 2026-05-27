import { useQueryClient } from "@tanstack/react-query";
import { upperFirst } from "lodash";
import { useMemo, useState } from "react";
import Select, { type StylesConfig } from "react-select";
import { MOVE_SELECT_PROPS } from "../../../context/PartyProvider";
import { fetchMoveFn } from "../../../hooks/useApi";
import { useParty } from "../../../hooks/useParty";
import s from "./PartySectionCard.module.css";

const customSelectStyles: StylesConfig = {
	control: (provided, state) => ({
		...provided,
		backgroundColor: "var(--color-battle-prep-input-bg)",
		borderColor: state.isFocused
			? "var(--color-battle-prep-neon)"
			: "var(--color-battle-prep-card-border)",
		boxShadow: state.isFocused
			? "0 0 10px var(--color-battle-prep-neon)"
			: "none",
		"&:hover": {
			borderColor: "var(--color-battle-prep-neon)",
		},
		borderRadius: "8px",
		cursor: "pointer",
		minHeight: "40px",
	}),
	singleValue: (provided) => ({
		...provided,
		color: "var(--white)",
		textTransform: "capitalize",
	}),
	menu: (provided) => ({
		...provided,
		backgroundColor: "var(--color-battle-prep-input-bg)",
		border: "1px solid var(--color-battle-prep-card-border)",
		borderRadius: "8px",
		overflow: "hidden",
		zIndex: 10,
	}),
	menuPortal: (base) => ({ ...base, zIndex: 9999 }),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected
			? "var(--color-battle-prep-neon)"
			: state.isFocused
				? "var(--white-alpha-10)"
				: "transparent",
		color: "var(--white)",
		cursor: "pointer",
		textTransform: "capitalize",
		"&:active": {
			backgroundColor: "var(--color-battle-prep-neon)",
		},
	}),
	placeholder: (provided) => ({
		...provided,
		color: "var(--white-alpha-40)",
	}),
	input: (provided) => ({
		...provided,
		color: "var(--white)",
	}),
};

export function PartySectionCard({ pokemon }) {
	const [_selectedMove, setSelectedMove] = useState(null);
	const queryClient = useQueryClient();
	const { editPokemonFromParty } = useParty();

	const flatMoveList = useMemo(() => {
		return Object.keys(pokemon.moves)
			.flatMap((key) => pokemon.moves[key])
			.filter((move, index, movesArray) => {
				return movesArray.findIndex((m) => m.name === move.name) === index;
			});
	}, [pokemon.moves]);

	const moveOptions = useMemo(() => {
		return flatMoveList.map((move) => ({
			value: move.name,
			label: move.name,
		}));
	}, [flatMoveList]);

	const [movesSelected, setMovesSelected] = useState(pokemon.movesSelected);

	const selectedMoveNames = [
		movesSelected[MOVE_SELECT_PROPS.ATTACK1]?.name,
		movesSelected[MOVE_SELECT_PROPS.ATTACK2]?.name,
		movesSelected[MOVE_SELECT_PROPS.ATTACK3]?.name,
		movesSelected[MOVE_SELECT_PROPS.ATTACK4]?.name,
	].filter(Boolean);

	const numSelectedMoves = selectedMoveNames.length;
	const isClearable = numSelectedMoves > 1;

	const getAvailableOptions = (currentSlotName) => {
		const currentMoveName = movesSelected[currentSlotName]?.name;
		return moveOptions.filter(
			(option) =>
				!selectedMoveNames.includes(option.value) ||
				currentMoveName === option.value,
		);
	};

	async function handleSelect(selectedOption, actionMeta) {
		if (!selectedOption) {
			// Clear the move
			const newMovesSelected = {
				...movesSelected,
				[actionMeta.name]: null,
			};
			editPokemonFromParty({
				...pokemon,
				movesSelected: newMovesSelected,
			});
			setMovesSelected(newMovesSelected);
			return;
		}

		const move = flatMoveList.find((m) => selectedOption.value === m.name);
		const mappedMove = await queryClient.fetchQuery({
			queryKey: ["move", move.url],
			queryFn: () => fetchMoveFn(move.url),
		});

		const newMovesSelected = {
			...movesSelected,
			[actionMeta.name]: mappedMove,
		};

		editPokemonFromParty({
			...pokemon,
			movesSelected: newMovesSelected,
		});
		setSelectedMove(mappedMove);
		setMovesSelected(newMovesSelected);
	}

	function getSelectedOption(name) {
		const move = movesSelected[name];
		if (!move) return null;
		return { value: move.name, label: move.name };
	}

	return (
		<div className={s.pokemonCard}>
			<div className={s.pokemonCardHeader}>
				<img
					src={pokemon.sprites.front}
					alt={`Foto do pokemon ${pokemon.name}`}
					className={s.pokemonPhoto}
				/>
				<h2 className={s.pokemonName}>{upperFirst(pokemon.name)}</h2>
			</div>

			<div className={s.attackSelectWrapper}>
				<Select
					name={MOVE_SELECT_PROPS.ATTACK1}
					value={getSelectedOption(MOVE_SELECT_PROPS.ATTACK1)}
					onChange={handleSelect}
					options={getAvailableOptions(MOVE_SELECT_PROPS.ATTACK1)}
					styles={customSelectStyles}
					placeholder="Select move..."
					isClearable={isClearable}
					menuPortalTarget={document.body}
					menuPosition="fixed"
				/>
				<Select
					name={MOVE_SELECT_PROPS.ATTACK2}
					value={getSelectedOption(MOVE_SELECT_PROPS.ATTACK2)}
					onChange={handleSelect}
					options={getAvailableOptions(MOVE_SELECT_PROPS.ATTACK2)}
					styles={customSelectStyles}
					placeholder="Select move..."
					isClearable={isClearable}
					menuPortalTarget={document.body}
					menuPosition="fixed"
				/>
				<Select
					name={MOVE_SELECT_PROPS.ATTACK3}
					value={getSelectedOption(MOVE_SELECT_PROPS.ATTACK3)}
					onChange={handleSelect}
					options={getAvailableOptions(MOVE_SELECT_PROPS.ATTACK3)}
					styles={customSelectStyles}
					placeholder="Select move..."
					isClearable={isClearable}
					menuPortalTarget={document.body}
					menuPosition="fixed"
				/>
				<Select
					name={MOVE_SELECT_PROPS.ATTACK4}
					value={getSelectedOption(MOVE_SELECT_PROPS.ATTACK4)}
					onChange={handleSelect}
					options={getAvailableOptions(MOVE_SELECT_PROPS.ATTACK4)}
					styles={customSelectStyles}
					placeholder="Select move..."
					isClearable={isClearable}
					menuPortalTarget={document.body}
					menuPosition="fixed"
				/>
			</div>
			<div className={s.attackPreview}></div>
		</div>
	);
}
