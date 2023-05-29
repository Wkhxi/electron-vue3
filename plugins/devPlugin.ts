import type { ViteDevServer } from "vite";
import type { AddressInfo } from 'net';


/**
 * vite插件的作用：
 * 监听vite启动的时候 去触发 electron 启动 mainEntry.ts
 * 并且传入 mainEntry.ts 中监听的从vite 传入的启动地址
 */

/**
 * 主进程内可以自由的使用 Electron 和 Node.js 的内置模块
 */
export const devPlugin = () => {
  return {
    name: "dev-plugin",
    // configureServer 钩子 会在vite启动http服务时执行
    // 是用于配置开发服务器的钩子
    configureServer(server: ViteDevServer) { // httpServer： 调试 Vue 页面的 http 服务，如：http://127.0.0.1:5173/
      // esbuild 模块完成了主进程 ts 代码的编译工作
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"], // 不会构建 原样输出
      });
      server.httpServer?.once("listening", () => { // 监听 httpServer 的 listening 事件来判断httpServer是否成功启动
        // 如果成功启动，那就去启动electron

        // require("child_process").spawn(command[, args][, options]) 启动一个子进程来执行命令
        // command 要执行的命令
        // 字符串参数列表
        // 配置项
        const { spawn } = require("child_process"); // node脚本去执行一个控制输入的指令
        const addressInfo = server.httpServer?.address() as AddressInfo;
        const httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        // params1，require("electron")： electron.exe 的文件路径，node_modules\electron\dist\electron.exe
        // params2，Vue 页面的 http 地址
        // params3, 配置对象
        console.log('dev', require("electron"), httpAddress, process.cwd(), addressInfo)
        const electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          cwd: process.cwd(), // 子进程的当前工作目录，process.cwd() 返回的值就是当前项目的根目录
          stdio: "inherit", // 子进程的标准输入输出配置，子进程的控制台输出数据同步到主进程的控制台，这样我们在主进程中 console.log 的内容就可以在 VSCode 的控制台上看到了
        });

        // 当 electron 子进程退出的时候，我们要关闭vite的http服务，并控制 父进程退出
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};



/**
 * 将常用的 Node.js 和 electron 内置模块 提供给 vite-plugin-optimizer
 * 想新增模块，需修改此方法
 */
export const getReplacer = () => {
  const externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  const result: SimpleKeyValueObject = {};
  for (const item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    const electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};


interface SimpleKeyValueObject {
  [key: string]: any
}
