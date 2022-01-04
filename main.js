try {
	// 热更新
    require('electron-reloader')(module);
} catch (_) { }

const {
	app,
	BrowserWindow,
	ipcMain,
	nativeTheme,
} = require('electron')
const path = require('path')

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		nodeIntegration: true,
		contextIsolation: false,
		webPreferences: {
			preload: path.join(__dirname, 'src/js/preload.js')
		}
	})

	win.loadFile('src/index.html')

	// 预加载js中可调用事件
	ipcMain.handle('dark-mode:toggle', (event, message) => {
		console.log('call dark-mode:toggle-----> message= 2', message)
		if (nativeTheme.shouldUseDarkColors) {
			nativeTheme.themeSource = 'light'
		} else {
			nativeTheme.themeSource = 'dark'
		}
		return nativeTheme.shouldUseDarkColors
	})

	ipcMain.on('dark-mode:system', (event, message) => {
		nativeTheme.themeSource = 'system'
	})

	ipcMain.handle('dark-mode:info', (event, message) => {
		console.log('call dark-mode:info-----> message', message)
		return nativeTheme.shouldUseDarkColors
	})
	// 打开开发工具   好像是无用代码
	// mainWindow.webContents.openDevTools()
}
app.whenReady().then(() => {
	createWindow()
	// macOs 激活状态时至少有一个窗口在
	app.on('activate', function() {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})
app.on('window-all-closed', function() {
	// window or liux 关闭窗口
	if (process.platform !== 'darwin') app.quit()
})
