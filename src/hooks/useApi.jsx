import axios from "axios"
import { upperFirst } from "lodash"
import { useCallback } from "react"

export function useApi() {
  const fetchMove = useCallback(async (moveUrl) => {
    const { data } = await axios.get(moveUrl)

    const moveMapped = {
      name: upperFirst(data.name),
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

    return moveMapped
  }, [])

  return { fetchMove }
}
