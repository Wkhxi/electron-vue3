
/**
 * window对象的 onload 和 document对象的 DOMContentLoaded 不能用来判断子窗口是否加载完成，因为此时业务代码还未执行完
 */
export const createDialog = (url: string, config: any): Promise<Window> => {
  return new Promise((resolve) => {

    // 新建的子窗口的引用
    const windowProxy = window.open(url, "_blank", JSON.stringify(config)) as Window;
    console.log('windowProxy', new Date().getTime())

    const readyHandler = (e: any) => {
      console.log('readyHandler', e, new Date().getTime())
      const msg = e.data; // 具体的消息内容
      if (msg["msgName"] === `__dialogReady`) {
        window.removeEventListener("message", readyHandler); // 子窗口创建成功后移除监听
        resolve(windowProxy);
      }
    };
    // 当前窗口 监听message事件 监听子窗口何时ready
    // 当新建的子窗口有消息发送 到 当前窗口时触发
    window.addEventListener("message", readyHandler);
  });
};

export const dialogReady = () => {
  console.log('dialogReady', window, new Date().getTime())

  const msg = { msgName: `__dialogReady` };

  // window.opener 返回打开当前窗口的那个窗口的引用，如果当前窗口不是由其他窗口打开的，则该属性返回 null
  // window A 中打开了 window B，B.opener 返回 A
  window.opener.postMessage(msg);
};
