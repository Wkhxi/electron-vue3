import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

/**
 * 1. autoUpdater 发现服务端有更新的安装包，将安装包下载到本地
 * 2，安装包下载完成 update-downloaded 事件触发，提示 用户升级
 * 3. 用户确认升级后，退出当前应用并安装新的安装包
 *
 * 4. 新版本安装包下载完成后，会有一个 sha512值 校验
 *        1. electron-updater 计算出下载的新版本安装包的 sha512 值
 *        2. 将其与 yml 中的 sha512 对比
 *        3. 相等则验证通过，不等则验证不通过
 *
 * 5. 验证通过， child-process 模块启动这个新的安装文件 完成升级
 */
export class Updater {
  static check() {
    // 询问服务器是否有更新
    // setFeedURL 之后
    /**
     * 1. 请求 yml 文件内容
     * 2. 文件中版本号与当前版本号比较，如果文件中版本号比当前版本号新，就下载新版本
     */
    autoUpdater.checkForUpdates()

    // update-downloaded 在更新下载完成的时候触发
    autoUpdater.on('update-downloaded', async () => {
      await dialog.showMessageBox({
        message: '有可用的升级'
      })

      // 重启应用并在下载后安装更新
      // 1. 关闭所有应用程序窗口
      // 2. 调用 app.quit()
      autoUpdater.quitAndInstall()
    })
  }
}
