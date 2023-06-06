// Electron 的内置模块都是通过 CJS Module 的形式导出的
// 我们使用ESM引入 需要做相应处理
import { app, BrowserWindow, ipcMain } from 'electron'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true' // 设置渲染进程开发者调试工具 不显示警告
// import path from 'path'

import { CommonWindowEvent } from './CommonWindowEvents'
import { CustomScheme } from './CustomScheme'
import { Updater } from './Updater'

// const Database = require('better-sqlite3')
// const db = new Database('db.db', {
//   verbose: console.log,
//   nativeBinding: './node_modules/better-sqlite3/build/Release/better_sqlite3.node'
// })

/**
 * 每当有窗口创建成功就会触发
 * 主窗口 或 window.open 创建的子窗口都会
 */
app.on('browser-window-created', (e, win) => {
  // 当一个新的 webContents 被创建时触发
  // 为新创建的窗口添加 监听
  CommonWindowEvent.regWinEvent(win)
})

// 主窗口 设置为 全局变量，避免主窗口被垃圾回收
let mainWindow: BrowserWindow

// 主进程，通常是指 main.js 文件，是每个 Electron 应用的入口文件。 控制着整个应用的生命周期，从打开到关闭。 它也管理着系统原生元素比如菜单，菜单栏，Dock 栏，托盘等。 主进程负责创建 APP 的每一个渲染进程。 包含了全功能的 Node API。

// app 是electron的全局对象，可控制整个应用程序的生命周期
// whenReady事件 返回一个promise，等待捕获ready事件
app.whenReady().then(() => {
  const config = {
    frame: false, // 禁用标题栏
    show: false,
    webPreferences: {
      // 网页功能设置
      nodeIntegration: true, // 把Node.js 集成到渲染进程
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false, // 上下文隔离， 在同一个js上下文中使用 electron api
      webviewTag: true, // 是否启用 <webview> tag标签
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true // 是否阻止窗口在进入 HTML 全屏时调整大小
    }
  }

  // BrowserWindow 创建并控制浏览器窗口
  // 在 app 模块 emitted ready 事件之前，不能使用此模块
  // 暴露了各种方法来修改应用窗口的外观和行为,通过传入参数，来初始化需要的实例。
  mainWindow = new BrowserWindow(config)
  // 返回promise，页面加载完成后会resolve

  // mainWindow.once("ready-to-show", () => {
  //   mainWindow.show();
  // });

  console.log('mainEntry', mainWindow, process.argv)
  // mainWindow.loadURL(process.argv[2]);

  if (process.argv[2]) {
    // 当存在指定的命令行参数时，认为是开发环境
    mainWindow.loadURL(process.argv[2])
    mainWindow.webContents.openDevTools({ mode: 'undocked' }) // 使用指定的 dock state 打开开发者工具
  } else {
    // 生产环境 通过 app://scheme 加载页面
    CustomScheme.registerScheme()

    // mainWindow.loadFile(path) 加载本地界面
    mainWindow.loadURL(`app://index.html`)

    Updater.check()
  }

  CommonWindowEvent.listen()
})

// ipcMain.handle("addNewWindow", () => {
//   const config = {
//     frame: false,
//     show: false,
//     webPreferences: {
//       nodeIntegration: true,
//       webSecurity: false,
//       allowRunningInsecureContent: true,
//       contextIsolation: false,
//       webviewTag: true,
//       spellcheck: false,
//       disableHtmlFullscreenWindowResize: true
//     }
//   }
//   const newWindow = new BrowserWindow(config);
//   newWindow.loadURL(process.argv[2])
// })
