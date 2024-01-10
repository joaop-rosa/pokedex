export const renderTypeClassnames = (pokemonType, style) => {
  return Object.values(POKEMON_TYPES).reduce((acc, type) => {
    return {
      ...acc,
      [style[`${type}Type`]]: type === pokemonType,
    }
  }, {})
}

export const POKEMON_TYPES = {
  NORMAL: "normal",
  FIRE: "fire",
  WATER: "water",
  GRASS: "grass",
  FLYING: "flying",
  FIGHTING: "fighting",
  POISON: "poison",
  ELECTRIC: "electric",
  GROUND: "ground",
  ROCK: "rock",
  PSYCHIC: "psychic",
  ICE: "ice",
  BUG: "bug",
  GHOST: "ghost",
  STEEL: "steel",
  DRAGON: "dragon",
  DARK: "dark",
  FAIRY: "fairy",
}
