import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // vite在处理动态引入组件时，会把对应的组件编译到独立的源码文件中，比如 文件名.哈希值.js 的形式，实现控制最终编译产物的大小，避免启动时加载一个很大的js文件
    // { path: "/", redirect: "/WindowMain/Chat" },
    // {
    //   path: "/WindowMain",
    //   component: () => import("./Window/WindowMain.vue"),
    //   children: [
    //     { path: "Chat", component: () => import("./Window/WindowMain/Chat.vue") },
    //     { path: "Contact", component: () => import("./Window/WindowMain/Contact.vue") },
    //     { path: "Collection", component: () => import("./Window/WindowMain/Collection.vue") },
    //   ],
    // },
    // {
    //   path: "/WindowSetting",
    //   component: () => import("./Window/WindowSetting.vue"),
    //   children: [{ path: "AccountSetting", component: () => import("./Window/WindowSetting/AccountSetting.vue") }],
    // },
    // {
    //   path: "/WindowUserInfo",
    //   component: () => import("./Window/WindowUserInfo.vue"),
    // },
  ]
})

export default router
