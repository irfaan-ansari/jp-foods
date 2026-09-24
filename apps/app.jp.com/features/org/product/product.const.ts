import { BadgeStatus } from "@/features/shared/shared.type"

export const STATUS: Record<string, BadgeStatus> = {
  all: {
    label: "All",
    value: "",
    color: "#71717A",
  },
  active: {
    label: "Active",
    value: "active",
    color: "#22C55E",
  },
  private: {
    label: "Private",
    value: "private",
    color: "#8B5CF6", // Violet
  },
  draft: {
    label: "Draft",
    value: "draft",
    color: "#F59E0B", // Amber
  },
  archived: {
    label: "Archived",
    value: "archived",
    color: "#64748B", // Slate
  },
}

export const MEASURE_UNITS = [
  { label: "Case", value: "case" },
  { label: "Each", value: "each" },
  { label: "Pound", value: "lb" },
  { label: "Bag", value: "bag" },
  { label: "Jug", value: "jug" },
  { label: "Count", value: "count" },
  { label: "Box", value: "box" },
  { label: "Pack", value: "pack" },
  { label: "Carton", value: "carton" },
  { label: "Tray", value: "tray" },
  { label: "Bottle", value: "bottle" },
  { label: "Can", value: "can" },
  { label: "Piece", value: "piece" },
  { label: "Dozen", value: "dozen" },
  { label: "Gallon", value: "gallon" },
  { label: "Quart", value: "quart" },
  { label: "Liter", value: "liter" },
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Ounce", value: "oz" },
]

export const WEIGHT_UNITS = [
  { label: "Pound", value: "lb" },
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Ounce", value: "oz" },
]
