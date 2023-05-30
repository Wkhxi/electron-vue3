# electron-vue-test

### 目录结构
```
electron-vue-test
├─ dist                                       # 打包过程的临时产物
│  ├─ assets
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ mainEntry.js
│  └─ package.json
├─ plugins                                    # 开发环境 Vite 插件和打包 Vite 插件
│  ├─ buildPlugin.ts
│  └─ devPlugin.ts
├─ public
│  └─ favicon.ico
├─ release                                    # 安装包
│  ├─ win-unpacked
│  ├─ builder-debug.yml
│  ├─ builder-effective-config.yaml
│  ├─ latest.yml
│  ├─ test2023 Setup 0.0.0.exe
│  └─ test2023 Setup 0.0.0.exe.blockmap
├─ resource                                   # 外部资源 应用程序图标、第三方类库
│
├─ src
│  ├─ common                                  # 主进程和渲染进程都会用到的公共代码，如一些公用方法
│  ├─ main                                    # 主进程
│  │  ├─ CustomScheme.ts
│  │  └─ mainEntry.ts
│  ├─ model                                   # 应用程序的模型文件，如消息类、会话类、用户设置类
│  └─ renderer                                # 渲染进程
│     ├─ assets                               # 字体图标、公共样式、图片
│     ├─ Component                            # 公共组件
│     ├─ store                                # 数据状态
│     ├─ Window                               # 不同窗口入口组件，通过 vue-router 导航，这个目录下的子目录存放对应窗口的子组件
│     ├─ App.vue                              # 渲染进程的入口组件
│     └─ main.ts                              # 渲染进程入口
│
├─ index.html                                 # 渲染进程的入口页面
├─ env.d.ts
├─ env.d.ts
├─ package.json
├─ pnpm-lock.yaml
├─ README.md
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts


```


### 设计要点
```

1. vite插件：
      - 构建electron开发环境
      - electron打包

2. 自定义标题栏
      - 最大化
      - 最小化
      - 还原
      - 鼠标拖动

3. 白屏优化

4. 窗口加载慢优化
      - 窗口池
      - window.open




```


