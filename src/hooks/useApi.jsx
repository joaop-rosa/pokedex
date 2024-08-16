import axios from "axios"
import { toInteger, upperCase, upperFirst } from "lodash"
import { useCallback } from "react"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import { POKEMON_TYPES } from "../contants/types"
import { LAST_POKEMON_NUMBER } from "../contants/generations"

export function useApi() {
  const fetchMove = useCallback(async (moveUrl) => {
    const { data } = await axios.get(moveUrl)

    const moveMapped = {
      name: upperFirst(data.name),
      priority: !!data.priority,
      pp: data.pp,
      power: data.power,
      accuracy: data.accuracy,
      type: data.type.name,
      damageClass: upperFirst(data.damage_class.name),
      description:
        data.flavor_text_entries[
          data.flavor_text_entries.findLastIndex(
            (entry) => entry.language.name === "en"
          )
        ].flavor_text,
    }

    return moveMapped
  }, [])

  const fetchTypes = useCallback(async () => {
    const response = await axios.get(`${URL_BASE_ENDPOINT}/type`)
    return response.data.results
      .map((type) => type.name)
      .filter((type) => Object.values(POKEMON_TYPES).includes(type))
  }, [])

  const fetchDetailedPokemon = useCallback(async (pokemonName) => {
    const response = await axios.get(
      `${URL_BASE_ENDPOINT}/pokemon/${pokemonName}`
    )

    const abilitiesMapped = await Promise.all(
      response.data.abilities?.map(async (ability) => {
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
        back: response.data.sprites.back_default,
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
        miniature: response.data.sprites.front_default,
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

  const fetchPokemonsFullList = useCallback(async () => {
    const response = await axios.get(
      `${URL_BASE_ENDPOINT}/pokemon/?limit=${LAST_POKEMON_NUMBER}&offset=0`
    )
    return response.data.results.map((pokemon) => ({
      name: pokemon.name,
      id: toInteger(pokemon.url.match(/\/(\d+)\/$/)[1]),
    }))
  }, [])

  const fetchPokemonByType = useCallback(
    async (selectedType = []) => {
      const getPokemonListByType = async (type) => {
        const responseType1 = await axios.get(
          `${URL_BASE_ENDPOINT}/type/${type}`
        )

        return responseType1.data.pokemon
          .map(({ pokemon }) => ({
            name: pokemon.name,
            id: toInteger(pokemon.url.match(/\/(\d+)\/$/)[1]),
          }))
          .filter((pokemon) => pokemon.id < LAST_POKEMON_NUMBER)
      }
      const pokemonType1ListMapped = await getPokemonListByType(selectedType[0])

      if (selectedType.length === 1) {
        return pokemonType1ListMapped
      }

      const pokemonType2ListMapped = await getPokemonListByType(selectedType[1])

      const pokemonListByTypeJoined = [
        ...pokemonType1ListMapped,
        ...pokemonType2ListMapped,
      ].filter(
        (pokemon, index, self) =>
          index ===
          self.findIndex((selfPokemon) => selfPokemon.name === pokemon.name)
      )

      const pokemonListDetailed = await Promise.all(
        pokemonListByTypeJoined.map(
          async (pokemon) => await fetchDetailedPokemon(pokemon.id)
        )
      )

      return pokemonListDetailed.filter(
        (pokemon) =>
          pokemon &&
          pokemon.types.includes(selectedType[0]) &&
          pokemon.types.includes(selectedType[1])
      )
    },
    [fetchDetailedPokemon]
  )

  const fetchPokemonSpecies = useCallback(
    async (pokemon) => {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon-species/${pokemon.id}/`
      )

      const description = response.data.flavor_text_entries

      const varietiesMapped = await Promise.all(
        response.data.varieties.map(async (variation) => {
          return await fetchDetailedPokemon(
            toInteger(variation.pokemon.url.match(/\/(\d+)\/$/)[1])
          )
        })
      )

      const { data: evolutionLine } = await axios.get(
        response.data.evolution_chain.url
      )

      async function evolutionLineMap(evolutionLine) {
        if (!evolutionLine.evolves_to.length) {
          return [
            await fetchDetailedPokemon(
              toInteger(evolutionLine.species.url.match(/\/(\d+)\/$/)[1])
            ),
          ]
        }

        return [
          await fetchDetailedPokemon(
            toInteger(evolutionLine.species.url.match(/\/(\d+)\/$/)[1])
          ),
          ...(await Promise.all(
            evolutionLine.evolves_to.map((pokemon) => {
              return evolutionLineMap(pokemon)
            })
          ).then((res) => res.flat(Infinity))),
        ]
      }

      const evolutionLineMapped = await evolutionLineMap(evolutionLine.chain)

      return {
        variations: varietiesMapped,
        evolutionLine: evolutionLineMapped,
        hasFemale: response.data.has_gender_differences,
        isLegendary: response.data.is_legendary,
        isMythical: response.data.is_mythical,
        description:
          description[
            description.findIndex((entry) => entry.language.name === "en")
          ].flavor_text,
      }
    },
    [fetchDetailedPokemon]
  )

  return {
    fetchMove,
    fetchDetailedPokemon,
    fetchTypes,
    fetchPokemonsFullList,
    fetchPokemonByType,
    fetchPokemonSpecies,
  }
}
