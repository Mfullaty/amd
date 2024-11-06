import { convertNumber } from "./convertNumber";

export function formatMoney(number, decimals = 2) {
  if (typeof number !== "number" || isNaN(number)) {
    throw new Error("Input must be a valid number");
  }

  if (number >= 1000000) {
    return convertNumber(number);
  } else {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  }
}
