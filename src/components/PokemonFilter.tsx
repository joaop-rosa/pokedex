import cn from "classnames";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { GENERATIONS } from "../contants/generations";
import { usePokemonList } from "../hooks/usePokemonList";
import s from "./PokemonFilter.module.css";

export default function PokemonFilter() {
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [localSearch, setLocalSearch] = useState("");
	const [openDropdown, setOpenDropdown] = useState<
		"types" | "generations" | null
	>(null);
	const dropdownsRef = useRef<HTMLDivElement>(null);

	const {
		typeList,
		selectedGeneration,
		setTextFilter,
		setSelectedGeneration,
		setSelectedType,
		selectedType,
	} = usePokemonList();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent | TouchEvent) {
			if (
				dropdownsRef.current &&
				!dropdownsRef.current.contains(event.target as Node)
			) {
				setOpenDropdown(null);
				event.stopPropagation();
				event.preventDefault();
			}
		}

		if (openDropdown !== null) {
			document.addEventListener("click", handleClickOutside, true);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [openDropdown]);

	const hasActiveFilters =
		selectedType.length > 0 || selectedGeneration !== null;

	const debouncedSetTextFilter = useMemo(
		() => _.debounce((val) => setTextFilter(val), 500),
		[setTextFilter],
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setLocalSearch(value);
		debouncedSetTextFilter(value);
	};

	const handleClearSearch = () => {
		setLocalSearch("");
		debouncedSetTextFilter("");
	};

	const handleClearFilters = () => {
		setSelectedType([]);
		setSelectedGeneration(null);
	};

	const toggleDropdown = (dropdown: "types" | "generations") => {
		setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
	};

	const handleGeneration = useCallback(
		(generation: (typeof GENERATIONS)[0]) => {
			if (
				selectedGeneration &&
				selectedGeneration.number === generation.number
			) {
				setSelectedGeneration(null);
			} else {
				setSelectedGeneration(generation);
			}
		},
		[selectedGeneration, setSelectedGeneration],
	);

	const handleButtonType = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const typeClicked = event.currentTarget.name;
			setSelectedType((prev) => {
				if (prev.includes(typeClicked)) {
					return prev.filter((type) => type !== typeClicked);
				}

				if (prev.length === 2) {
					return [typeClicked];
				}

				return [...prev, typeClicked];
			});
		},
		[setSelectedType],
	);

	return (
		<>
			<div className={s.searchRow}>
				<div className={s.inputContainer}>
					<FaSearch className={s.searchIcon} />
					<input
						type="text"
						className={s.inputText}
						value={localSearch}
						onChange={handleSearchChange}
						placeholder="Search Pokémon by name..."
					/>
					{localSearch && (
						<FaTimes className={s.clearIcon} onClick={handleClearSearch} />
					)}
				</div>
				{hasActiveFilters && !isFiltersOpen && (
					<button
						type="button"
						onClick={handleClearFilters}
						className={s.clearFiltersShortcutBtn}
						title="Clear Filters"
						aria-label="Clear Filters"
					>
						<FaTimes />
					</button>
				)}
				<button
					type="button"
					onClick={() => setIsFiltersOpen((prev) => !prev)}
					className={s.filterToggleBtn}
					aria-label="Toggle filters"
				>
					<FaFilter />
				</button>
			</div>

			<div className={s.filtersWrapper}>
				<div className={cn(s.filters, { [s.filtersOpen]: isFiltersOpen })}>
					<div className={s.dropdownsRow} ref={dropdownsRef}>
						{/* Dropdown de Tipos */}
						<div className={s.dropdownContainer}>
							<button
								type="button"
								className={s.dropdownHeader}
								onClick={() => toggleDropdown("types")}
							>
								Types {selectedType.length > 0 && `(${selectedType.length})`}
								<FaChevronDown
									className={cn(s.chevron, {
										[s.chevronOpen]: openDropdown === "types",
									})}
								/>
							</button>
							{openDropdown === "types" && (
								<div className={s.dropdownMenu}>
									<div className={s.typesFilterWrapper}>
										{typeList.map((type) => {
											const isSelected = selectedType.includes(type);
											return (
												<button
													type="button"
													key={type}
													className={cn(s.buttonTypeFilter, {
														[s.buttonTypeFilterSelected]: isSelected,
														[s[`${type}Type`]]: isSelected,
													})}
													style={{
														borderColor: `var(--color-${type})`,
														color: isSelected
															? "var(--white)"
															: `var(--color-${type})`,
													}}
													onClick={handleButtonType}
													name={type}
												>
													{type.toUpperCase()}
												</button>
											);
										})}
									</div>
								</div>
							)}
						</div>

						{/* Dropdown de Gerações */}
						<div className={s.dropdownContainer}>
							<button
								type="button"
								className={s.dropdownHeader}
								onClick={() => toggleDropdown("generations")}
							>
								Generation{" "}
								{selectedGeneration ? selectedGeneration.number : "All"}
								<FaChevronDown
									className={cn(s.chevron, {
										[s.chevronOpen]: openDropdown === "generations",
									})}
								/>
							</button>
							{openDropdown === "generations" && (
								<div className={s.dropdownMenu}>
									<div className={s.generationWrapper}>
										{GENERATIONS.map((generation) => (
											<button
												type="button"
												className={cn(s.generation, {
													[s.generationSelected]:
														selectedGeneration?.number === generation.number,
												})}
												key={generation.number}
												onClick={() => handleGeneration(generation)}
											>
												{`Gen ${generation.number}`}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					<button
						type="button"
						onClick={handleClearFilters}
						className={s.clearFiltersBtn}
					>
						Clear Filters
					</button>
				</div>
			</div>
		</>
	);
}
