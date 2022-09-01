import { useEffect } from 'react'
import './card-pokemon.component.styles.css'
import axios from 'axios'
import { useState } from 'react'

export function CardPokemon({ pokemon }) {

    const backgroundTipos = {
        normal: "#A4ACAF",
        fire: "#FD7D24",
        water: "#4592C4",
        grass: "#9BCC50",
        flying: "#3DC7EF",
        fighting: "#D56723",
        poison: "#B97FC9",
        electric: "#EED535",
        ground: "#F7DE3F",
        rock: "#A38C21",
        psychic: "#F366B9",
        ice: "#51C4E7",
        bug: "#729F3F",
        ghost: "#7B62A3",
        steel: "#9EB7B8",
        dragon: "#53A4CF",
        dark: "#707070",
        fairy: "#FDB9E9",
    }

    const [pokemonDetalhado, setPokemonDetalhado] = useState([])
    const [fotoPokemon, setFotoPokemon] = useState([])
    const [tipoPokemon, setTipoPokemon] = useState()

    useEffect(() => {
        async function fetchDetalhePokemon() {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            setFotoPokemon(response.data.sprites.versions["generation-v"]["black-white"].animated.front_default)
            setTipoPokemon(response.data.types[0].type.name)
            setPokemonDetalhado(response.data)
        }
        fetchDetalhePokemon()
    }, [])

    return (
        <div
            style={{ backgroundColor: backgroundTipos[Object.keys(backgroundTipos).find(tipo => tipo === tipoPokemon)] }}
            className="div-card-pokemon">
            <h3 className='numero-pokemon'>{`#${pokemonDetalhado.id}`}</h3>
            <div style={{
                backgroundImage: `url(${fotoPokemon})`,

            }} className="foto-pokemon" />
            <div className='div-nome-pokemon'>
                <h2 className='nome-pokemon'>{pokemon.name}</h2>
            </div>
        </div>
    )
}