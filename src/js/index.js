init();

async function init() {
  _getModeName(await window.darkMode.getMode())
  document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    _getModeName(isDarkMode)
  })

  document.getElementById('reset-to-system').addEventListener('click', async () => {
    await window.darkMode.system()
    refreshModeName('系统当前模式')
  })
}

function _getModeName(isDarkMode) {
  refreshModeName(isDarkMode ? '深色Dark' : '浅色Light')
}

function refreshModeName(name) {
  document.getElementById('mode-name').innerHTML = name;
}