export const timeAgo = (timeStr) => {
  const time = new Date(timeStr)
  let delta = (new Date().getTime() - time) / 1000
  if (delta < 60) {
    return Math.floor(delta) + ' seconds ago'
  }
  // minutes
  delta = delta / 60
  if (delta < 60) {
    return Math.floor(delta) + ' minutes ago'
  }
  // hours
  delta = delta / 60
  if (delta < 24) {
    return Math.floor(delta) + ' hrs ago'
  }
  delta = delta / 24
  if (delta < 7) {
    return Math.floor(delta) + ' days ago'
  }
  delta = delta / 7
  if (delta < 4) {
    return Math.floor(delta) + ' weeks ago'
  }
  return time.toLocaleDateString()
}
