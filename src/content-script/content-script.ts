document.addEventListener('click', (event) => {
  console.log('页面被点击', event)
  // 可以在这里添加更多的处理逻辑
})
let requestFrameId: number | null = null
const handleJobList = (filterPageEl: string) => {
  const el = document.querySelector(filterPageEl)
  console.log('el', el)
  if (el) {
    const children = el.children
    Array.from(children).forEach((child) => {
      console.log('child', child)
      if (child && child.children?.[0].classList.contains('job-tag-icon'))
        (child as HTMLElement).style.display = 'none'
    })
  }
  requestAnimationFrame(() => handleJobList(filterPageEl))
}
chrome.runtime.onMessage.addListener((message) => {
  console.log('message', message)
  if (message.filterPageEl) {
    console.log('here000', message.filterPageEl)
    if (requestFrameId) {
      cancelAnimationFrame(requestFrameId)
      requestFrameId = null
    }
    console.log('here', message.filterPageEl)
    requestFrameId = requestAnimationFrame(() => handleJobList(message.filterPageEl))
  }
  else {
    console.log('失活')
    requestFrameId && cancelAnimationFrame(requestFrameId)
    requestFrameId = null
  }

  return true
})
