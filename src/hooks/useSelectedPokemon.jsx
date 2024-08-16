import { useContext } from "react"
import { SelectedPokemonContext } from "../context/SelectedPokemonProvider"

const useSelectedPokemon = () => useContext(SelectedPokemonContext)

export { useSelectedPokemon }
