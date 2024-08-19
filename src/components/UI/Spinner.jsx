import React from "react"
import s from "./Spinner.module.css"
import { ReactComponent as Pokeball } from "../../assets/icons/pokeball.svg"
import cn from "classnames"

export function Spinner({ containerClassname }) {
  return (
    <div className={cn(s.spinnerWrapper, containerClassname)}>
      <Pokeball className={s.spinner} />
    </div>
  )
}
