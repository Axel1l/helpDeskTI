export function formatDate(date) {
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' años'

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' meses'

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' días'

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' horas'

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutos'

  return Math.floor(seconds) + ' segundos'
}