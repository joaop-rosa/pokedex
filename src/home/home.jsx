import axios from "axios"
import { useState, useEffect, useCallback } from "react"
import s from "./home.module.css"
import pikachuNotFound from "../assets/img/pikachu-not-found.png"
import { ReactComponent as ArrowUp } from "../assets/icons/arrow-up.svg"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import { CardPokemon } from "../card-pokemon/card-pokemon"
import { Spinner } from "../components/Spinner"
import _, { toInteger, upperCase, upperFirst } from "lodash"
import cn from "classnames"
import { GENERATIONS, LAST_POKEMON_NUMBER } from "../contants/generations"
import { POKEMON_TYPES, renderTypeClassnames } from "../contants/types"
import PokemonDetailed from "../components/PokemonDetailed"
import { MOVE_LEARN_METHOD } from "../contants/moves"

const POKEMONS_PER_PAGE = 12

export function Home() {
  const [pokemonFullList, setPokemonFullList] = useState([])
  const [pokemonByTypeFullList, setPokemonByTypeFullList] = useState([])
  const [pokemonList, setPokemonList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [selectedType, setSelectedType] = useState([])
  const [pageSize, setPageSize] = useState(POKEMONS_PER_PAGE)
  const [inputTextFilter, setInputTextFilter] = useState("")
  const [selectedGeneration, setSelectedGeneration] = useState(null)
  const [isListLoading, setIsListLoading] = useState(true)
  const [isButtonToTopVisible, setIsButtonToTopVisible] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  const fetchTypes = useCallback(async () => {
    const response = await axios.get(`${URL_BASE_ENDPOINT}/type`)
    setTypeList(
      response.data.results
        .map((type) => type.name)
        .filter((type) => Object.values(POKEMON_TYPES).includes(type))
    )
  }, [])

  const fetchPokemonsFullList = useCallback(async () => {
    const response = await axios.get(
      `${URL_BASE_ENDPOINT}/pokemon/?limit=${LAST_POKEMON_NUMBER}&offset=0`
    )
    const mappedResponse = response.data.results.map((pokemon) => ({
      name: pokemon.name,
      id: toInteger(pokemon.url.match(/\/(\d+)\/$/)[1]),
    }))

    setPokemonFullList(mappedResponse)
  }, [])

  useEffect(() => {
    function checkToActivateButtonToTopVisible() {
      if (window.scrollY > 500) {
        setIsButtonToTopVisible(true)
      } else {
        setIsButtonToTopVisible(false)
      }
    }

    function checkScrollEnd() {
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.offsetHeight

      if (scrollPosition >= documentHeight - 100) {
        setPageSize((prev) => prev + POKEMONS_PER_PAGE)
      }
    }

    function handleScroll() {
      checkToActivateButtonToTopVisible()
      checkScrollEnd()
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    fetchTypes()
  }, [fetchTypes])

  useEffect(() => {
    fetchPokemonsFullList()
  }, [fetchPokemonsFullList])

  const applyBasicFilter = useCallback(
    (list) => {
      let tempList = [...list]
      tempList = list.filter((pokemon) =>
        pokemon.name.includes(inputTextFilter.toLowerCase())
      )
      if (selectedGeneration) {
        tempList = tempList.filter(
          (pokemon) =>
            pokemon.id >= selectedGeneration.start &&
            pokemon.id <= selectedGeneration.final
        )
      }

      return tempList
    },
    [inputTextFilter, selectedGeneration]
  )

  const fetchDetailedPokemon = useCallback(async (pokemonName) => {
    const response = await axios.get(
      `${URL_BASE_ENDPOINT}/pokemon/${pokemonName}`
    )

    const abilitiesMapped = await Promise.all(
      response.data.abilities.map(async (ability) => {
        const { data: abilityData } = await axios.get(ability.ability.url)
        const abilityMapped = {
          effectDescription:
            abilityData.effect_entries[
              abilityData.effect_entries.findIndex(
                (entry) => entry.language.name === "en"
              )
            ]?.effect,
          effectShortDescription:
            abilityData.flavor_text_entries[
              abilityData.flavor_text_entries.findIndex(
                (entry) => entry.language.name === "en"
              )
            ].flavor_text,
          effectException: abilityData.effect_changes.length
            ? abilityData.effect_changes[0].effect_entries[
                abilityData.effect_entries.findIndex(
                  (entry) => entry.language.name === "en"
                )
              ].effect
            : null,
        }

        return {
          name: ability.ability.name,
          isHidden: ability.is_hidden,
          ...abilityMapped,
        }
      })
    )

    const movesMapped = response.data.moves.reduce((acc, move) => {
      const moveMapped = {
        name: upperFirst(move.move.name),
        url: move.move.url,
        level: move.version_group_details.at(-1).level_learned_at,
      }

      const method = upperCase(
        move.version_group_details.at(-1).move_learn_method.name
      )

      if (!acc[method]) {
        return {
          ...acc,
          [method]: [moveMapped],
        }
      }

      return {
        ...acc,
        [method]: [...acc[method], moveMapped],
      }
    }, {})

    const detailsMapped = {
      sprites: {
        front: response.data.sprites.other["official-artwork"].front_default,
        back: response.data.sprites.other["official-artwork"].back_default,
        frontAnimated: response.data.sprites.other.showdown.front_default,
        backAnimated: response.data.sprites.other.showdown.back_default,
        frontAnimatedFemale: response.data.sprites.other.showdown.front_female,
        backAnimatedFemale: response.data.sprites.other.showdown.back_female,
        frontAnimatedShiny: response.data.sprites.other.showdown.front_shiny,
        backAnimatedShiny: response.data.sprites.other.showdown.back_shiny,
        frontAnimatedFemaleShiny:
          response.data.sprites.other.showdown.front_shiny_female,
        backAnimatedFemaleShiny:
          response.data.sprites.other.showdown.back_shiny_female,
      },
      types: response.data.types.reduce(
        (acc, type) => [...acc, type.type.name],
        []
      ),
      id: response.data.id,
      name: response.data.name,
      stats: response.data.stats.reduce(
        (acc, stat) => ({ ...acc, [stat.stat.name]: stat.base_stat }),
        {}
      ),
      weight: (toInteger(response.data.weight) * 1000) / 10000,
      height: toInteger(response.data.height) * 10,
      abilities: abilitiesMapped,
      otherParams: response.data,
      moves: movesMapped,
    }

    return detailsMapped
  }, [])

  const fetchPokemonByType = useCallback(async () => {
    if (selectedType.length) {
      const responseType1 = await axios.get(
        `${URL_BASE_ENDPOINT}/type/${selectedType[0]}`
      )

      const pokemonType1ListMapped = responseType1.data.pokemon
        .map((pokemon) => ({
          name: pokemon.pokemon.name,
          id: toInteger(pokemon.pokemon.url.match(/\/(\d+)\/$/)[1]),
        }))
        .filter((pokemon) => pokemon.id < LAST_POKEMON_NUMBER)

      if (selectedType.length > 1) {
        const responseType2 = await axios.get(
          `${URL_BASE_ENDPOINT}/type/${selectedType[1]}`
        )

        const pokemonType2ListMapped = responseType2.data.pokemon
          .map((pokemon) => ({
            name: pokemon.pokemon.name,
            id: toInteger(pokemon.pokemon.url.match(/\/(\d+)\/$/)[1]),
          }))
          .filter((pokemon) => pokemon.id < LAST_POKEMON_NUMBER)

        const pokemonListByTypeJoined = [
          ...pokemonType1ListMapped,
          ...pokemonType2ListMapped,
        ]

        //Remove duplicated pokemons
        const pokemonListByType = pokemonListByTypeJoined.filter(
          (pokemon, index, self) =>
            index ===
            self.findIndex((selfPokemon) => selfPokemon.name === pokemon.name)
        )

        const pokemonListByTypeFiltered = applyBasicFilter(pokemonListByType)

        setIsListLoading(true)

        const pokemonDetailedListByTypePromised = Promise.all(
          pokemonListByTypeFiltered.map(async (pokemon) => {
            return await fetchDetailedPokemon(pokemon.name)
          })
        )

        pokemonDetailedListByTypePromised.then((pokemonDetailedListByType) => {
          //Keep only pokemons with the two types
          const pokemonDetailedListFilteredBy2Types =
            pokemonDetailedListByType.filter((pokemon) =>
              selectedType.every((type) => pokemon.types.includes(type))
            )

          setPokemonByTypeFullList(pokemonDetailedListFilteredBy2Types)
        })
      } else {
        setPokemonByTypeFullList(pokemonType1ListMapped)
      }
    }
  }, [applyBasicFilter, fetchDetailedPokemon, selectedType])

  useEffect(() => {
    fetchPokemonByType()
  }, [fetchPokemonByType, selectedType])

  useEffect(() => {
    setIsListLoading(true)
    setPageSize(POKEMONS_PER_PAGE)
    if (selectedType.length > 1) {
      setPokemonList(pokemonByTypeFullList)
    } else if (selectedType.length) {
      setPokemonList(applyBasicFilter(pokemonByTypeFullList))
    } else {
      setPokemonList(applyBasicFilter(pokemonFullList))
    }
    setIsListLoading(false)
  }, [
    applyBasicFilter,
    fetchDetailedPokemon,
    fetchPokemonByType,
    pokemonByTypeFullList,
    pokemonFullList,
    selectedType,
  ])

  const handleButtonType = useCallback((event) => {
    const typeClicked = event.target.name
    setSelectedType((prev) => {
      if (prev.includes(typeClicked)) {
        return prev.filter((type) => type !== typeClicked)
      }

      if (prev.length === 2) {
        return [typeClicked]
      }

      return [...prev, typeClicked]
    })
  }, [])

  const handlePokemonName = useCallback((event) => {
    const inputValue = event.target.value
    const onChange = _.debounce(() => {
      setInputTextFilter(inputValue)
    }, 1200)
    onChange()
  }, [])

  const handleGeneration = useCallback(
    (generation) => {
      if (
        selectedGeneration &&
        selectedGeneration.number === generation.number
      ) {
        setSelectedGeneration(null)
      } else {
        setSelectedGeneration(generation)
      }
    },
    [selectedGeneration]
  )

  const handleButtonToTop = useCallback(async () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  const renderPokemonList = () => {
    if (isListLoading) {
      return <Spinner />
    }

    if (pokemonList.length) {
      return (
        <div className={s.pokemonList}>
          {pokemonList.slice(0, pageSize).map((pokemon, index) => {
            return (
              <CardPokemon
                setSelectedPokemon={setSelectedPokemon}
                key={pokemon.id}
                fetchDetailedPokemon={fetchDetailedPokemon}
                pokemon={pokemon}
              />
            )
          })}
        </div>
      )
    }

    if (!isListLoading && !pokemonList.length) {
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
      )
    }
  }

  return (
    <section className={s.sectionHome}>
      <div className={s.container}>
        <div className={s.header}>
          <h1>Pokedex</h1>
        </div>

        <input
          type="text"
          className={s.inputText}
          onChange={handlePokemonName}
          placeholder="Digite o nome do pokemon"
        />
        <div className={s.filtersWrapper}>
          <button
            onClick={() => setIsFiltersOpen((prev) => !prev)}
            className={s.buttonOpenFilters}
          >
            Ver mais filtros
          </button>
          <div className={cn(s.filters, { [s.filtersOpen]: isFiltersOpen })}>
            <div className={s.typesFilterWrapper}>
              {typeList.map((type) => {
                return (
                  <button
                    key={type}
                    className={cn(s.buttonTypeFilter, {
                      [s.buttonTypeFilterSelected]: selectedType.includes(type),
                      ...renderTypeClassnames(type, s),
                    })}
                    onClick={handleButtonType}
                    name={type}
                  >
                    {type.toUpperCase()}
                  </button>
                )
              })}
            </div>
            <div className={s.generationWrapper}>
              {GENERATIONS.map((generation) => (
                <button
                  className={cn(s.generation, {
                    [s.generationSelected]:
                      selectedGeneration?.number === generation.number,
                  })}
                  key={generation.number}
                  onClick={() => handleGeneration(generation)}
                >
                  {`Geração ${generation.number}`}
                </button>
              ))}
            </div>
          </div>
        </div>
        {renderPokemonList()}
      </div>

      {isButtonToTopVisible ? (
        <button onClick={handleButtonToTop} className={s.buttonToTop}>
          <ArrowUp className={s.arrowUp} />
        </button>
      ) : null}

      <PokemonDetailed
        pokemon={selectedPokemon}
        fetchDetailedPokemon={fetchDetailedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />
    </section>
  )
}
