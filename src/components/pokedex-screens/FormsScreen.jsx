import { upperFirst } from "lodash"
import s from "./FormsScreen.module.css"
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon"

export function FormsScreen() {
  const { selectedPokemon, setSelectedPokemon, speciesInfo } =
    useSelectedPokemon()

  return (
    <div className={s.variationsWrapper}>
      {speciesInfo?.variations.map((variation) => {
        return (
          <button
            onClick={() => setSelectedPokemon(variation)}
            key={variation.name}
            className={s.variation}
          >
            <img
              className={s.variationImage}
              src={variation.sprites.front}
              alt={`Foto do pokemon ${selectedPokemon.name}`}
            />
            <div className={s.variationInfos}>
              <p>{upperFirst(variation.name)}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
