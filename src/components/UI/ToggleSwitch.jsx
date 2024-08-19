import React from "react"
import s from "./ToggleSwitch.module.css"
import cn from "classnames"

export function ToggleSwitch({ onChange, isDisabled = false }) {
  return (
    <label className={s.switch}>
      <input onChange={onChange} type="checkbox" disabled={isDisabled} />
      <span className={cn(s.slider, { [s.sliderDisabled]: isDisabled })} />
    </label>
  )
}
