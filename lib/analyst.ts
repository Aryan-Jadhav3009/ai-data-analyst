import type { QueryResult } from "./api"

export type VisualizationType = "metric" | "bar" | "line" | "table"

export type VisualizationData = {
  type: VisualizationType
  labelColumn?: string
  valueColumn?: string
  data?: Array<{
    label: string
    value: number
  }>
  value?: number
}

/**
 * Converts values returned by the API into a number when they are
 * unambiguously numeric.
 */
function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === "string" && value.trim() !== "") {
    const number = Number(value)
    return Number.isFinite(number) ? number : null
  }

  return null
}

/**
 * Returns true only when the value is actually date/time-like.
 *
 * We deliberately do not use column names such as "date", "month",
 * or "time" to determine this.
 */
function isDateLike(value: unknown): boolean {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime())
  }

  if (typeof value !== "string") {
    return false
  }

  const text = value.trim()

  if (!text) {
    return false
  }

  const isoDate =
    /^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(text)

  const slashDate =
    /^\d{4}\/\d{1,2}\/\d{1,2}(?:[\s].*)?$/.test(text)

  return isoDate || slashDate
}

/**
 * Determines whether a query result has an unambiguous visualization.
 *
 * This function uses only the returned columns and values.
 * It does not use the user's question or infer business semantics.
 */
export function analyzeResult(
  result: QueryResult
): VisualizationData {
  const { columns, rows } = result

  if (!columns.length || !rows.length) {
    return { type: "table" }
  }

  /*
   * Single value result.
   *
   * Example:
   * columns = ["total_customers"]
   * rows = [[4]]
   */
  if (columns.length === 1 && rows.length === 1) {
    const value = toFiniteNumber(rows[0]?.[0])

    if (value !== null) {
      return {
        type: "metric",
        value,
      }
    }

    return { type: "table" }
  }

  /*
   * Generic two-column visualization.
   *
   * We only consider it if:
   * - there are at least two rows
   * - first column contains labels/date-like values
   * - second column is entirely numeric
   */
  if (columns.length === 2 && rows.length >= 2) {
    const labels = rows.map((row) => row?.[0])
    const values = rows.map((row) => toFiniteNumber(row?.[1]))

    if (
      labels.every(
        (label) =>
          label !== null &&
          label !== undefined &&
          String(label).trim() !== ""
      ) &&
      values.every((value): value is number => value !== null)
    ) {
      const data = rows.map((row, index) => ({
        label: String(row[0]),
        value: values[index],
      }))

      /*
       * A line chart is only appropriate when the first column
       * contains actual date/time-like values.
       */
      const dateLikeCount = labels.filter(isDateLike).length

      if (dateLikeCount === labels.length) {
        return {
          type: "line",
          labelColumn: columns[0],
          valueColumn: columns[1],
          data,
        }
      }

      /*
       * Otherwise this is a generic categorical → numeric result.
       * A bar chart does not require us to know what the values mean.
       */
      return {
        type: "bar",
        labelColumn: columns[0],
        valueColumn: columns[1],
        data,
      }
    }
  }

  /*
   * More complex result shapes are deliberately left as tables.
   * We don't have enough information to safely choose a chart.
   */
  return { type: "table" }
}