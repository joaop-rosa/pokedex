import axios from "axios"
import { useState, useEffect } from "react"
import { CardPokemon } from "../card-pokemon/card-pokemon.component"
import './home.styles.css'
export function Home() {
    const [listaPokemons, setListaPokemons] = useState([])

    useEffect(() => {
        async function fetchPokemons() {
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=151')
            setListaPokemons(response.data.results)
        }
        fetchPokemons()
    }, [])

    return (
        <div className="div-home">
            <div className="div-header">
                <h1>Pokedex</h1>
            </div>
            <div className="div-lista-pokemons container padding-header">
                {
                    listaPokemons.map((pokemon, index) => {
                        return <CardPokemon key={index} pokemon={pokemon} />
                    })
                }
            </div>
        </div>
    )
}