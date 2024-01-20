import React from "react"
import s from "./ToggleSwitch.module.css"

export default function ToggleSwitch({ onChange }) {
  return (
    <label className={s.switch}>
      <input onChange={onChange} type="checkbox" />
      <span className={s.slider} />
    </label>
  )
}
