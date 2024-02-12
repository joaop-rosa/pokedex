import React, { useCallback, useState } from "react"
import s from "./PokemonFilter.module.css"
import cn from "classnames"
import { renderTypeClassnames } from "../contants/types"
import { GENERATIONS } from "../contants/generations"
import _ from "lodash"

export default function PokemonFilter({
  typeList,
  selectedGeneration,
  setInputTextFilter,
  setSelectedGeneration,
  setSelectedType,
  selectedType,
  setIsListLoading,
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const handlePokemonName = useCallback(
    (event) => {
      const inputValue = event.target.value
      const onChange = _.debounce(() => {
        setInputTextFilter(inputValue)
      }, 1200)
      onChange()
      setIsListLoading(true)
    },
    [setInputTextFilter, setIsListLoading]
  )

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

      setIsListLoading(true)
    },
    [selectedGeneration, setIsListLoading, setSelectedGeneration]
  )

  const handleButtonType = useCallback(
    (event) => {
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
    },
    [setSelectedType]
  )

  return (
    <>
      <input
        type="text"
        className={s.inputText}
        onChange={handlePokemonName}
        placeholder="Digite o nome do pokemon"
      />
      <div className={s.filtersWrapper}>
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
                {`Generation ${generation.number}`}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          className={s.buttonOpenFilters}
        >
          {isFiltersOpen ? "Fechar busca detalhada" : "Abrir busca detalhada"}
        </button>
      </div>
    </>
  )
}
