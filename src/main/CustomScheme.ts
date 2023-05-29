import { protocol } from "electron";
import fs from "fs";
import path from "path";

// 为自定义的app协议提供特权
const schemeConfig = { standard: true, supportFetchAPI: true, bypassCSP: true, corsEnabled: true, stream: true };
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: schemeConfig }]);

export class CustomScheme {
  // 根据文件扩展名获取 mime-type
  private static getMimeType(extension: string) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }

  /**
   * protocol.registerStreamProtocol 注册自定义app协议
   * 
   * 当你的静态文件比较大时，不必读出整个文件再给出响应
   * 
   * 注册的是registerStringProtocol，那么当接到请求的时候，我们就得把目标文件全部读完，再做出响应，不但会占用更多内存，而且搞不好会阻塞主进程，一旦占用了内存，就要等待V8来释放这部分内存，而且释放时机是不可预估的
   * 使用registerStreamProtocol，那么我就会通过文件流来分片读取文件，读取一片数据就响应一片数据，虽然也会占用内存，但占用的内存会小很多，释放也会更及时
   */
  static registerScheme() {
    // 为名为 app 的 scheme 注册一个回调函数
    // 加载类似 app://index.html 时 回调执行
    protocol.registerStreamProtocol("app", (request, callback) => {
      // request.url 请求的文件路径
      let pathName = new URL(request.url).pathname; // //index.html
      let extension = path.extname(pathName).toLowerCase(); // .html
      if (extension == "") {
        pathName = "index.html";
        extension = ".html";
      }
      const tarFile = path.join(__dirname, pathName);
      console.log('tarFile', request, pathName, tarFile)
      callback({
        statusCode: 200,
        headers: { "content-type": this.getMimeType(extension) },
        data: fs.createReadStream(tarFile), // 目标文件的可读数据流
      });
    });
  }
}