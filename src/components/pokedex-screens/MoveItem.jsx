import axios from "axios"
import React, { useCallback, useState } from "react"
import { Accordion } from "../Accordion"
import { Spinner } from "../Spinner"
import { noop, upperCase, upperFirst } from "lodash"
import s from "./MoveItem.module.css"
import { renderTypeClassnames } from "../../contants/types"
import cn from "classnames"

export function MoveItem({ move }) {
  const [moveContent, setMoveContent] = useState(null)

  const fetchMove = useCallback(async () => {
    const { data } = await axios.get(move.url)

    const moveMapped = {
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

    setMoveContent(moveMapped)
  }, [move.url])

  function renderMoveContent() {
    const fixNull = (number) => {
      if (!number) return "--"
      return number
    }

    return (
      <div className={s.moveContent}>
        <p className={s.moveInfo}>
          <strong>Power: </strong>
          {fixNull(moveContent.power)}
        </p>
        <p className={s.moveInfo}>
          <strong>Accuracy: </strong>
          {fixNull(moveContent.accuracy)}
        </p>
        <p className={s.moveInfo}>
          <strong>PP: </strong>
          {fixNull(moveContent.pp)}
        </p>
        <p className={s.moveInfo}>
          <strong>Type: </strong>
          <span
            className={cn(
              s.moveInfoType,
              renderTypeClassnames(moveContent.type, s)
            )}
          >
            {upperCase(moveContent.type)}
          </span>
        </p>
        <p className={s.moveInfo}>
          <strong>Damage class: </strong>
          {moveContent.damageClass}
        </p>
        {moveContent.priority ? (
          <p className={s.moveInfo}>
            <strong>Has priority</strong>
          </p>
        ) : null}
        <p className={s.moveInfo}>{moveContent.description}</p>
      </div>
    )
  }

  return (
    <Accordion
      header={
        <div className={s.moveHeader}>
          <h4>{upperFirst(move.name)}</h4>
          <span className={s.moveButtonOpen}>+</span>
        </div>
      }
      onClick={moveContent ? noop : fetchMove}
      containerClassname={s.move}
      content={
        moveContent ? (
          renderMoveContent()
        ) : (
          <Spinner containerClassname={s.spinner} />
        )
      }
    />
  )
}
