import { useContext } from "react"
import { PokemonListContext } from "../context/PokemonListProvider"

const usePokemonList = () => useContext(PokemonListContext)

export { usePokemonList }
