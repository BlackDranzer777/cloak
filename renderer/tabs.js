const tabs = []
let activeTabId = null
let tabCounter = 0

function createTab(url = 'https://example.com') {
  const id = ++tabCounter

  const webview = document.createElement('webview')
  webview.src = url
  document.getElementById('webview-container').appendChild(webview)

  const tabEl = document.createElement('div')
  tabEl.className = 'tab'
  tabEl.dataset.tabId = id
  tabEl.innerHTML = `<span class="tab-title">New Tab</span><button class="tab-close">&#215;</button>`
  document.getElementById('tabs').appendChild(tabEl)

  const tab = { id, url, title: 'New Tab', webview, tabEl }
  tabs.push(tab)

  tabEl.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab-close')) switchTab(id)
  })

  tabEl.querySelector('.tab-close').addEventListener('click', (e) => {
    e.stopPropagation()
    closeTab(id)
  })

  webview.addEventListener('did-navigate', (e) => {
    tab.url = e.url
    addToHistory(e.url, tab.title)
    if (activeTabId === id) syncToolbar(tab)
  })

  webview.addEventListener('did-navigate-in-page', (e) => {
    if (!e.isMainFrame) return
    tab.url = e.url
    if (activeTabId === id) syncToolbar(tab)
  })

  webview.addEventListener('page-title-updated', (e) => {
    tab.title = e.title
    tabEl.querySelector('.tab-title').textContent = e.title
  })

  webview.addEventListener('did-start-loading', () => {
    if (activeTabId === id) document.getElementById('refresh-btn').textContent = '✕'
  })

  webview.addEventListener('did-stop-loading', () => {
    if (activeTabId === id) document.getElementById('refresh-btn').innerHTML = '&#8635;'
  })

  webview.addEventListener('new-window', (e) => {
    createTab(e.url)
  })

  switchTab(id)
  return tab
}

function switchTab(id) {
  tabs.forEach(t => {
    t.webview.classList.remove('active')
    t.tabEl.classList.remove('active')
  })

  const tab = tabs.find(t => t.id === id)
  if (!tab) return

  tab.webview.classList.add('active')
  tab.tabEl.classList.add('active')
  activeTabId = id
  syncToolbar(tab)
}

function closeTab(id) {
  const idx = tabs.findIndex(t => t.id === id)
  if (idx === -1) return

  const tab = tabs[idx]
  tab.webview.remove()
  tab.tabEl.remove()
  tabs.splice(idx, 1)

  if (tabs.length === 0) {
    createTab()
  } else if (activeTabId === id) {
    switchTab(tabs[Math.min(idx, tabs.length - 1)].id)
  }
}

function getActiveTab() {
  return tabs.find(t => t.id === activeTabId) || null
}

function syncToolbar(tab) {
  document.getElementById('url-bar').value = tab.url
  document.getElementById('back-btn').disabled = !tab.webview.canGoBack()
  document.getElementById('forward-btn').disabled = !tab.webview.canGoForward()
}
