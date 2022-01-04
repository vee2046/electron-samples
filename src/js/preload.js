const {
  contextBridge,
  ipcRenderer,
} = require('electron')
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    // 访问node进程
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

// 在window下暴露一个对象myAPI， 在html环境内， 可以使用window.myAPI调用
contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
  openWin(url) {
    console.log('in myAPI openWin url = ', url)
  },
})

// dark mode
contextBridge.exposeInMainWorld('darkMode', {
  async toggle() {
    let r = await ipcRenderer.invoke('dark-mode:toggle', 'call toggle');
    console.log('on preload.js toggle r=', r)
    return r;
  },
  system: () => ipcRenderer.send('dark-mode:system'),
  async getMode() {
    let r = await ipcRenderer.invoke('dark-mode:info', 1);
    return r;
  }
})