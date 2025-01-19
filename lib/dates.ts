

export function formatDateToLocaleString(date: Date) {
  return date.toLocaleString("en-CA", {
    year: 'numeric',
    month: 'numeric', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}