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
  }
}