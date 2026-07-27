function anonymizeIp(ip) {
  if (!ip) return ip
  if (ip.includes(':')) {
    const parts = ip.split(':')
    for (let i = 5; i < parts.length; i++) parts[i] = '0'
    return parts.join(':')
  }
  const parts = ip.split('.')
  if (parts.length === 4) {
    parts[3] = '0'
    return parts.join('.')
  }
  return ip
}

module.exports = { anonymizeIp }
