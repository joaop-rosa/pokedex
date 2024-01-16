import React from "react"
import s from "./ToggleSwitch.module.css"

export default function ToggleSwitch() {
  return (
    <label className={s.switch}>
      <input type="checkbox" />
      <span className={s.slider} />
    </label>
  )
}
