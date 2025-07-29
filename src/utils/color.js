// export function red_green_light(value) {
//   let color = 'var(--text_deep)';
//   if (typeof value === 'undefined' || value === null) return 'var(--text_light)';
//   const numericPart = String(value).match(/^[-+]?\d*\.?\d+/);
//   const numericValue = numericPart ? parseFloat(numericPart[0]) : NaN;
//   if (numericValue > 0) {
//     color = 'var(--data_red)';
//   } else if (numericValue < 0) {
//     color = 'var(--data_green)';
//   }
//   return color;
// }

export function red_green_deep(value) {
  let color = 'var(--text_deep)';
  if (typeof value === 'undefined' || value === null || value === '--') return 'var(--text_light)';
  const numericPart = String(value).match(/^[-+]?\d*\.?\d+/);
  const numericValue = numericPart ? parseFloat(numericPart[0]) : NaN;
  if (numericValue > 0) {
    color = 'var(--data_red)';
  } else if (numericValue < 0) {
    color = 'var(--data_green)';
  }
  return color;
}
