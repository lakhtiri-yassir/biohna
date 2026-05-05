export function requireFields(body, fieldNames) {
  const missing = []
  for (const field of fieldNames) {
    if (!body[field] && body[field] !== 0 && body[field] !== false) {
      missing.push(field)
    }
  }
  return missing
}

export function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5
}