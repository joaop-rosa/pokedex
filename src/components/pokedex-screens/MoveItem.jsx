import React, { useState } from "react"
import { Accordion } from "../UI/Accordion"
import { Spinner } from "../UI/Spinner"
import { upperCase, upperFirst } from "lodash"
import s from "./MoveItem.module.css"
import { renderTypeClassnames } from "../../contants/types"
import cn from "classnames"
import { useApi } from "../../hooks/useApi"

export function MoveItem({ move }) {
  const [moveContent, setMoveContent] = useState(null)
  const { fetchMove } = useApi()

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

  async function handleFetchMove() {
    if (!moveContent) {
      const moveDetailed = await fetchMove(move.url)
      setMoveContent(moveDetailed)
    }
  }
  return (
    <Accordion
      header={
        <div className={s.moveHeader}>
          <h4>{upperFirst(move.name)}</h4>
          <span className={s.moveButtonOpen}>+</span>
        </div>
      }
      onClick={handleFetchMove}
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
