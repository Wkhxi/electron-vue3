import { app, BrowserWindow, ipcMain } from "electron"


export class CommonWindowEvent {

  private static getWin(event: any) {
    console.log('getWin', event)
    // 返回 BrowserWindow | null - 返回拥有给定 webContents 的窗口，否则如果内容不属于一个窗口，返回null
    return BrowserWindow.fromWebContents(event.sender)
  }

  /**
   *  browserView实例方法
   *  minimize 最小化窗口
   *  maximize 最大化窗口
   *  unmaximize 取消窗口最大化
   *  hide 隐藏窗口
   *  show 显示并聚焦于窗口
   *  close 尝试关闭窗口
   *  isResizable 用户是否可以手动调整窗口大小 返回boolean
   */
  public static listen() {

    console.log('listen')
    ipcMain.handle("minimizeWindow", (e) => { // e -- IpcMainInvokeEvent
      // this.getWin(e) -- 发送消息的 webContents 所对应的 browserView
      this.getWin(e)?.minimize(); // this 即 listen的this 即 CommonWindowEvent类
    });

    ipcMain.handle("maxmizeWindow", (e) => {
      this.getWin(e)?.maximize();
    });

    ipcMain.handle("unmaximizeWindow", (e) => {
      this.getWin(e)?.unmaximize();
    });

    ipcMain.handle("hideWindow", (e) => {
      this.getWin(e)?.hide();
    });

    ipcMain.handle("showWindow", (e) => {
      console.log('showWindow', e, this.getWin(e))
      this.getWin(e)?.show();
    });

    ipcMain.handle("closeWindow", (e) => {
      this.getWin(e)?.close();
    });
    ipcMain.handle("resizable", (e) => {
      return this.getWin(e)?.isResizable();
    });
    ipcMain.handle("getPath", (e, name: any) => {
      return app.getPath(name);
    });
  }

  public static regWinEvent(win: BrowserWindow) {
    /**
     * 监听窗口的最大化或还原事件
     * 通知渲染进程 显示不同的 icon
     */
    win.on("maximize", () => {
      win.webContents.send("windowMaximized");
    });
    win.on("unmaximize", () => {
      win.webContents.send("windowUnmaximized");
    });


    /**
     * 主窗口创建成功是时为主窗口注册该回调
     * 为主窗口（win = mainWindow） 注册打开子窗口的回调函数
     *
     * win.webContents.setWindowOpenHandler  最终解释权和完全权限
     * 渲染进程中请求创建一个新窗口之前被调用
     * 拦截窗口创建
     * 设置窗口配置属性 -- overrideBrowserWindowOptions
     *
     * 返回值 { action: "allow", overrideBrowserWindowOptions: yourWindowConfig }
     * action: "allow" -- 允许窗口打开
     * action: "deny" -- 阻止窗口打开
     *
     *
     * 默认可以将 show设置为true
     * 根据具体的页面业务，可以手动控制其显示时机
     */
    win.webContents.setWindowOpenHandler((params) => {
      /**
       * params
       *
       * url -- window.open()传入的url
       * frameName -- window.open()传入的name
       * features -- window.open()提供 逗号 分割的窗口特征列表
       */

      //基础的窗口配置对象
      const config = {
        frame: false,
        show: true,
        parent: null,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          allowRunningInsecureContent: true,
          contextIsolation: false,
          webviewTag: true,
          spellCheck: false,
          disableHtmlFullscreenWindowResize: true,
          nativeWindowOpen: true
        }
      }

      const features = JSON.parse(params.features)

      // 以 features/features.webPreferences 中的配置为准，并将额外配置合并过来
      // 根据渲染进程中传递的参数 来自定义配置
      for (const p in features) {
        if (p === 'webPreferences') {
          for (const q in features.webPreferences) {
            config.webPreferences[q] = features.webPreferences[q]
          }
        } else {
          config[p] = features[p]
        }
      }

      // 子窗口是否为一个模态窗口
      if (config['modal'] === true) config.parent = win;

      return { action: 'allow', overrideBrowserWindowOptions: config }
    })

  }
}