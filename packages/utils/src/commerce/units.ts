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
  { label: "Ounce", value: "oz" },
]

export const WEIGHT_UNITS = [
  { label: "Pound", value: "lb" },
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Ounce", value: "oz" },
]

export const PRODUCT_UNITS = [
  ...MEASURE_UNITS,
  ...WEIGHT_UNITS.filter(
    (weightUnit) =>
      !MEASURE_UNITS.some((measureUnit) => measureUnit.value === weightUnit.value)
  ),
]
