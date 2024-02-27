import React, { useState } from "react"
import s from "./Lobby.module.css"
import { Header } from "../components/Header"
import { LobbySection } from "../components/LobbySection"
import { PartySection } from "../components/PartySection"
import cn from "classnames"

const SECTIONS = {
  PARTY: "PARTY",
  LOBBY: "LOBBY",
}

export function Lobby() {
  const [sectionSelected, setSectionSelected] = useState(SECTIONS.PARTY)

  function renderSection() {
    if (sectionSelected === SECTIONS.LOBBY) {
      return <LobbySection />
    }

    return <PartySection />
  }

  return (
    <section className={s.lobbySection}>
      <Header />
      <div className={s.container}>
        <div className={s.buttonsWrapper}>
          <button
            className={cn(s.changeSectionButton, {
              [s.changeSectionButtonSelected]:
                sectionSelected === SECTIONS.PARTY,
            })}
            onClick={() => setSectionSelected(SECTIONS.PARTY)}
          >
            Party
          </button>
          <button
            className={cn(s.changeSectionButton, {
              [s.changeSectionButtonSelected]:
                sectionSelected === SECTIONS.LOBBY,
            })}
            onClick={() => setSectionSelected(SECTIONS.LOBBY)}
          >
            Lobby
          </button>
        </div>
        <div className={s.sectionWrapper}>{renderSection()}</div>
      </div>
    </section>
  )
}
