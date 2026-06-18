const browsingHistory = []

function addToHistory(url, title) {
  browsingHistory.unshift({ url, title, visitedAt: Date.now() })
  if (browsingHistory.length > 500) browsingHistory.pop()
}

function getHistory() {
  return [...browsingHistory]
}
