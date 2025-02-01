
export function formatMoney(number, decimals = 2) {
  if (typeof number !== "number" || isNaN(number)) {
    throw new Error("Input must be a valid number");
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}
