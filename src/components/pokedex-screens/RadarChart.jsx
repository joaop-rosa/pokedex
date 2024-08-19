import React, { useEffect, useRef } from "react"
import s from "./RadarChart.module.css"
import * as d3 from "d3"
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon"

function getAngleForIndex(i, sides) {
  return (i / sides) * 2 * Math.PI
}

function radarShapeGenerator(sides, radius) {
  const polygon = d3
    .radialLine()
    .angle((_, i) => getAngleForIndex(i, sides))
    .curve(d3.curveLinearClosed)
    .radius(() => radius)
  // .defined((d, i) => i % 10 !/= 0),
  return polygon({ length: sides })
}

function radarAxisGenerator(i, sides, radius) {
  const axis = d3
    .radialLine()
    .angle(() => getAngleForIndex(i, sides))
    .curve(d3.curveLinear)
    .radius((d, _) => d)

  return axis([0, radius])
}

function getLabelFromQuadrant(i, sides) {
  // Note that our starting point isn't "positive x" as on a normal unit circle
  // It's pi/2, or positive y on the normal unit circle
  // We don't re-scale because we generate this value, we know its bounds
  const rads = getAngleForIndex(i, sides)

  // left
  if ((rads > Math.PI / 4) & (rads < (3 * Math.PI) / 4)) {
    return "start"
    // right
  } else if ((rads > (5 * Math.PI) / 4) & (rads < (7 * Math.PI) / 4)) {
    return "end"
  } else {
    return "middle"
  }
}

function getOffsetFromQuadrant(i, sides, offset) {
  // Note that our starting point isn't "positive x" as on a normal unit circle
  // It's pi/2, or positive y from the normal unit circle
  // We don't re-scale because we generate this value, we know its bounds
  const rads = getAngleForIndex(i, sides)

  // bottom we push out a bit more
  if ((rads > (3 * Math.PI) / 4) & (rads < (5 * Math.PI) / 4)) {
    return offset + 13
  } else {
    return offset
  }
}

function radarFillGenerator(sides) {
  const fill = d3
    .radialArea()
    .angle((d, i) => getAngleForIndex(i, sides))
    .innerRadius(0)
    .outerRadius((d, i) => d.value)
    .curve(d3.curveLinearClosed)
  return fill
}

const STATS_NAMES = {
  hp: "HP",
  "special-attack": "Spc. Atk.",
  "special-defense": "Spc. Def.",
  speed: "Speed",
  attack: "Attack",
  defense: "Defense",
}

export function RadarChart() {
  const { selectedPokemon } = useSelectedPokemon()
  const { stats } = selectedPokemon
  const chartRef = useRef()

  useEffect(() => {
    const width = 310
    const height = 220
    const radius = 80
    const sides = 6
    const traitMin = 0
    const traitMax = 200
    const textOffset = 20

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 25 220 250")

    // linear scale from 0 to the Radius
    // give it a value in trait-space and it gives you the radius
    const scaleTrait = d3
      .scaleLinear()
      .domain([traitMin, traitMax])
      .range([0, radius])

    const statsMapped = Object.keys(stats).map((statKey) => ({
      label: `${STATS_NAMES[statKey]} (${stats[statKey]})`,
      value: scaleTrait(stats[statKey]),
    }))

    //outline
    svg
      .append("g")
      .append("path")
      .attr("d", (d) => radarShapeGenerator(sides, radius))
      .attr("stroke", "white")
      .attr("fill", "none")
      .attr(
        "transform",
        `translate(${Math.floor(height / 2)}, ${Math.floor(width / 2)})`
      )

    //axesLines
    svg
      .append("g")
      .selectAll("path")
      .data(Array.from({ length: sides }, (_, i) => i))
      .join("path")
      .attr("d", (d) => radarAxisGenerator(d, sides, radius))
      .attr("stroke", "white")
      .attr("fill", "none")
      .attr(
        "transform",
        `translate(${Math.floor(height / 2)}, ${Math.floor(width / 2)})`
      )

    // Labels
    svg
      .append("g")
      .selectAll("text")
      .data(statsMapped)
      .join("text")
      .attr("text-anchor", (d, i) => getLabelFromQuadrant(i, sides))
      .attr("font-family", "verdana")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .attr(
        "x",
        (d, i) =>
          Math.sin(getAngleForIndex(i, sides)) *
          scaleTrait(traitMax + getOffsetFromQuadrant(i, sides, textOffset))
      )
      .attr(
        "y",
        (d, i) =>
          -1 *
          Math.cos(getAngleForIndex(i, sides)) *
          scaleTrait(traitMax + getOffsetFromQuadrant(i, sides, textOffset))
      )
      .text((d) => d.label)
      .attr(
        "transform",
        `translate(${Math.floor(height / 2)}, ${Math.floor(width / 2)})`
      )

    // Fill
    svg
      .append("g")
      .append("path")
      .attr("d", radarFillGenerator(sides)(statsMapped))
      .attr("stroke", "white")
      .attr("fill", "lightcoral")
      .attr("fill-opacity", "0.7")
      .attr(
        "transform",
        `translate(${Math.floor(height / 2)}, ${Math.floor(width / 2)})`
      )

    // Points
    svg
      .append("g")
      .selectAll("circle")
      .data(statsMapped)
      .join("circle")
      .attr("fill", "red")
      .attr("cx", (d, i) => Math.sin(getAngleForIndex(i, sides)) * d.value)
      .attr("cy", (d, i) => -1 * Math.cos(getAngleForIndex(i, sides)) * d.value)
      .attr("r", 2)
      .attr(
        "transform",
        `translate(${Math.floor(height / 2)}, ${Math.floor(width / 2)})`
      )

    chartRef.current.innerHTML = svg.node().outerHTML
  }, [stats])

  return <div className={s.chartWrapper} ref={chartRef} />
}
