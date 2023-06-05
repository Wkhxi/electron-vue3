import type { Knex } from 'knex'
import knex from 'knex'
import fs from 'fs'
import path from 'path'

/**
 * 数据库访问类
 * 第一次引入数据库访问类，执行初始化操作
 */
let dbInstance: Knex | null = null

if (!dbInstance) {
  // windows process.env.APPDATA 当前用户的应用程序数据文件夹   C:\Users\[UserName]\AppData\Roaming
  // mac process.env.HOME 当前登录用户的 home 目录路径    /Users/[username]
  /**
   * 1. 检查 C:\Users\[username]\AppData\Roaming\[appname]\db.db文件是否存在
   * 2. 如果不存在，我们就从应用程序安装目录 C:\Program Files\[appname]\resources\db.db拷贝一份到该路径下
   *
   * 为什么一定要将其拷贝到C:\Users\[username]\AppData\Roaming\[appname]\db.db下，而不是直接访问安装目录下的数据库呢？
   * 这样做的原因：当用户升级应用程序时安装目录下的文件都会被删除，每次升级应用 数据库数据就都没了
   */
  let dbPath =
    process.env.APPDATA ||
    (process.platform == 'darwin'
      ? process.env.HOME + '/Library/Preferences'
      : process.env.HOME + '/.local/share')
  dbPath = path.join(dbPath, 'electron-vue3/db.db')
  const dbIsExist = fs.existsSync(dbPath)
  if (!dbIsExist) {
    const resourceDbPath = path.join(process.execPath, '../resources/db.db')
    // process.execPath D:\coding\electron\electron-vue3\node_modules\.pnpm\electron@24.2.0\node_modules\electron\dist\electron.exe
    // D:\coding\electron\electron-vue3\node_modules\.pnpm\electron@24.2.0\node_modules\electron\dist\resources\db.db
    // C:\Users\wkh\AppData\Roaming\electron-vue3\db.db
    console.log('process.execPath', process.execPath, resourceDbPath, dbPath)
    // 假设数据库是项目的前置，所以这里使用的是同步操作来初始化数据库
    fs.copyFileSync(resourceDbPath, dbPath)
  }

  dbInstance = knex({
    client: 'better-sqlite3',
    connection: { filename: dbPath },
    useNullAsDefault: true // 把开发者未明确提供的数据配置为 Null
  })
}

export const db = dbInstance
