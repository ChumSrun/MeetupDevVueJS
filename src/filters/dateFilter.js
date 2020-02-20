const dateFilter = (value) => {
  return (new Date(value)).toLocaleString('en-US', {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default dateFilter;