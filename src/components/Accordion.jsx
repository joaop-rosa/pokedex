import cn from "classnames"
import React, { useState } from "react"
import s from "./Accordion.module.css"

export function Accordion({ content, header, containerClassname, onClick }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn(s.accordion, containerClassname)}>
      <button
        onClick={() => {
          if (!isOpen) onClick?.()
          setIsOpen((prev) => !prev)
        }}
        className={s.accordionHeader}
      >
        {header}
      </button>
      <div
        className={cn(s.accordionContent, { [s.accordionContentOpen]: isOpen })}
      >
        {content}
      </div>
    </div>
  )
}
