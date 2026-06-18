const urlBar = document.getElementById('url-bar')
const backBtn = document.getElementById('back-btn')
const forwardBtn = document.getElementById('forward-btn')
const refreshBtn = document.getElementById('refresh-btn')
const newTabBtn = document.getElementById('new-tab-btn')

urlBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') navigate(urlBar.value)
})

urlBar.addEventListener('focus', () => {
  urlBar.select()
})

function navigate(input) {
  const raw = input.trim()
  let url

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    url = raw
  } else if (raw.includes('.') && !raw.includes(' ')) {
    url = 'https://' + raw
  } else {
    url = 'https://www.google.com/search?q=' + encodeURIComponent(raw)
  }

  const tab = getActiveTab()
  if (tab) tab.webview.loadURL(url)
}

backBtn.addEventListener('click', () => {
  const tab = getActiveTab()
  if (tab && tab.webview.canGoBack()) tab.webview.goBack()
})

forwardBtn.addEventListener('click', () => {
  const tab = getActiveTab()
  if (tab && tab.webview.canGoForward()) tab.webview.goForward()
})

refreshBtn.addEventListener('click', () => {
  const tab = getActiveTab()
  if (!tab) return
  if (refreshBtn.textContent === '✕') {
    tab.webview.stop()
  } else {
    tab.webview.reload()
  }
})

newTabBtn.addEventListener('click', () => createTab())

createTab()
