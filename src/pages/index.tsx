import { useCallback, useEffect, useState } from "react";
import ArrowUp from "../assets/icons/arrow-up.svg?react";
import pikachuNotFound from "../assets/img/pikachu-not-found.png";
import { CardPokemon } from "../components/CardPokemon";
import { Party } from "../components/Party";
import { PokemonDetailed } from "../components/PokemonDetailed";
import PokemonFilter from "../components/PokemonFilter";
import { Header } from "../components/UI/Header";
import { Spinner } from "../components/UI/Spinner";
import { usePokemonList } from "../hooks/usePokemonList";
import s from "./index.module.css";

export default function Home() {
	const {
		POKEMONS_PER_PAGE,
		setPageSize,
		isReady,
		isEmpty,
		isListLoading,
		pokemonList,
	} = usePokemonList();
	const [isButtonToTopVisible, setIsButtonToTopVisible] = useState(false);

	useEffect(() => {
		function checkToActivateButtonToTopVisible() {
			if (window.scrollY > 500) {
				setIsButtonToTopVisible(true);
			} else {
				setIsButtonToTopVisible(false);
			}
		}

		function checkScrollEnd() {
			const scrollPosition = window.scrollY + window.innerHeight;
			const documentHeight = document.documentElement.offsetHeight;

			if (scrollPosition >= documentHeight - 100) {
				setPageSize((prev) => prev + POKEMONS_PER_PAGE);
			}
		}

		function handleScroll() {
			checkToActivateButtonToTopVisible();
			checkScrollEnd();
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [POKEMONS_PER_PAGE, setPageSize]);

	const handleButtonToTop = useCallback(async () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, []);

	const renderPokemonList = () => {
		if (isListLoading) {
			return <Spinner containerClassname={s.spinner} />;
		}

		if (isEmpty) {
			return (
				<>
					<img
						className={s.pikachuNotFound}
						src={pikachuNotFound}
						loading="lazy"
						alt="Pikachu com uma lupa"
					/>
					<p className={s.listEmpty}>Nenhum pokemon encontrado</p>
				</>
			);
		}

		return (
			<div className={s.pokemonList}>
				{pokemonList.map((pokemon) => {
					return <CardPokemon key={pokemon.id} pokemon={pokemon} />;
				})}
			</div>
		);
	};

	if (!isReady) {
		return <Spinner />;
	}

	return (
		<section className={s.sectionHome}>
			<div className={s.container}>
				<Header />
				<PokemonFilter />

				{renderPokemonList()}
			</div>

			{isButtonToTopVisible ? (
				<button
					id="buttonToTop"
					type="button"
					onClick={handleButtonToTop}
					className={s.buttonToTop}
				>
					<ArrowUp className={s.arrowUp} />
				</button>
			) : null}

			<PokemonDetailed />

			<Party />
		</section>
	);
}
