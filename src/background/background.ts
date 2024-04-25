import { filterPageElClassMap } from '../utils'

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('activeInfo', activeInfo)
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    // 你可以在这里检查标签页的URL等属性
    if (tab.url && tab.url.includes('https://www.zhipin.com')) {
      const tabUrl = tab.url.split('?')?.[0] ?? ''
      const filterPageEl = filterPageElClassMap[tabUrl as keyof typeof filterPageElClassMap]
      console.log('filterPageEl', filterPageEl, activeInfo)

      activeInfo.tabId && chrome.tabs.sendMessage(activeInfo.tabId, {
        type: 'page-container',
        filterPageEl,
      }).catch((error) => {
        console.error(error)
      })
    }
  })
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id && tab.id !== activeInfo.tabId) { // 检查不是当前激活的标签
        chrome.tabs.sendMessage(tab.id, { type: 'stop-timer', filterPageEl: null })
      }
    })
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://www.zhipin.com')) {
    const tabUrl = tab.url.split('?')?.[0] ?? ''
    const filterPageEl = filterPageElClassMap[tabUrl as keyof typeof filterPageElClassMap]
    tabId && chrome.tabs.sendMessage(tabId, { filterPageEl }).then((response) => {
      if (chrome.runtime.lastError)
        console.error('Error sending message:', chrome.runtime.lastError)
      else
        console.log('Message sent!', response)
    })
  }
})

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log('remove', removeInfo, tabId)
  tabId && chrome.tabs.sendMessage(tabId, { type: 'stop-timer', filterPageEl: null })
})

// 监听窗口焦点变化事件
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // 所有窗口失去焦点，向所有标签发送停止定时器的消息
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        tab.id && chrome.tabs.sendMessage(tab.id, { type: 'stop-timer', filterPageEl: null })
      })
    })
  }
})
