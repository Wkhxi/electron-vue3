
import path from "path";
import fs from "fs";

/**
 * 1. 创造编译结束的钩子函数
 * 2. 制作应用安装包 -- electron-builder
 * 3. 主进程生产环境加载本地文件
 */

// pnpm install electron-builder -D
class BuildInstance {

  // 编译主进程代码, 为生产环境编译代码
  // Vite 在编译之前会清空 dist 目录
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"],
      bundle: true,
      platform: "node",
      minify: true, // 生成压缩后的代码
      outfile: "./dist/mainEntry.js",
      external: ["electron"]
    });
  }


  // 启动应用程序时，本质 通过 electron 启动一个 Node.js 的项目
  // 会 根据当前项目中的package.json 再生成一个package.json文件
  // 注明 主进程的入口文件，移除没用的配置
  preparePackageJson() {
    const pkgJsonPath = path.join(process.cwd(), "package.json");
    // 同步读取 package.json 文件，并反序列化
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    // 去掉electron版本号的^，避免 electron-builder 无法识别
    const electronConfig = localPkgJson.devDependencies.electron.replace("^", "");

    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
    const tarJsonPath = path.join(process.cwd(), "dist", "package.json");

    // 同步写入 新的 package.json 文件
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    // 同步创建 node_modules 目录
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
  }


  // 调用 electron-builder api构建安装包
  /**
   * 1. 检查 输出目录下的 package.json 文件 的 dependencies ，如果存在就安装这些依赖
   * 2. 根据 options 配置信息就行打包
   * 3. 根据 asar 判断 是否需要把输出目录下的文件合并成一个 asar 文件
   * 4. 把 electron 可执行程序、其依赖的动态链接库、二进制资源拷贝到安装包生成目录下的 win-ia32-unpacked 子目录内
   * 5. 使用一个二进制资源修改器修改 electron.exe 的文件名和属性信息
   * 6. electron-builder 会使用 7z 压缩工具，把子目录 win-ia32-unpacked 下的内容压缩成一个名为 test2023-1.3.6-ia32.nsis.7z 的压缩包
   * 7. 使用 nsis 工具生成卸载程序的可执行文件，卸载程序会根据win-ia32-unpacked 目录下所有文件的相对路径删除我们的文件，同时清除注册表信息
   * 8. 使用 nsis 工具生成安装程序的可执行文件，把压缩包和卸载程序当作资源写入这个安装程序的可执行文件中，当用户执行该可执行文件时，会读取这些资源并将其释放到指定的安装目录下
   */
  buildInstaller() {
    const options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"), // 生成的安装包的位置
          app: path.join(process.cwd(), "dist"), // 静态文件目录
        },
        files: ["**"],
        extends: null,
        productName: "test2023", // 应用名
        appId: "com.test2023.desktop", // 确认后不要变动
        asar: true, // 是否使用electron的存档格式将应用程序的源代码打包到存档中
        nsis: { // 开源的 Windows 系统下安装程序制作程序，提供了安装、卸载、系统设置、文件解压缩等功能
          oneClick: false, // 是否一键安装
          perMachine: true, // 是否开启安装时权限限制
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          // 卸载时删除用户数据
          deleteAppDataOnUninstall: true,
          createDesktopShortcut: true,  // 创建桌面图标
          createStartMenuShortcut: true,  // 创建开始菜单图标
          shortcutName: "test2023",
        },
        publish: [{ provider: "generic", url: "http://localhost:5500/" }], // 更新服务器地址
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }




}

/**
 * rollup插件 - 制作安装包
 * closeBundle 钩子 在vite编码完成之后，即 npm run build 之后（在dist目录下生成一系列文件后）调用，将dist下的文件打包为一个应用程序安装包
*/
export const buildPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle: () => {
      const buildObj = new BuildInstance();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    },
  };
};