<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { ipcRenderer } from "electron";
defineProps<{ title?: string }>();

// 是否最大化
const isMaximized = ref(false);

const handleCloseWindow = () => {
  ipcRenderer.invoke("closeWindow");
};

/**
 * 1. 点击最大化按钮 触发最大化，主进程收到 maxmizeWindow，调用maximize实现窗口最大化
 *    窗口最大化 会 触发 win.on("maximize") 的监听，反过来通知渲染进程改变 icon
 * 2. 双击 触发最大化
 *    窗口最大化 会 触发 win.on("maximize") 的监听，反过来通知渲染进程改变 icon
 */
const handleMaximizeMainWin = () => {
  ipcRenderer.invoke("maxmizeWindow");
};
const handleMinimizeMainWindow = () => {
  ipcRenderer.invoke("minimizeWindow");
};
const handleUnmaximizeMainWindow = () => {
  ipcRenderer.invoke("unmaximizeWindow");
};

// ipc事件
const winMaximizeEvent = () => {
  isMaximized.value = true;
};
const winUnmaximizeEvent = () => {
  isMaximized.value = false;
};

onMounted(() => {
  ipcRenderer.on("windowMaximized", winMaximizeEvent);
  ipcRenderer.on("windowUnmaximized", winUnmaximizeEvent);
});


/**
 * 避免在切换路由的时候，反复通过ipcRenderer.on注册消息监听器，在组件的 onUnmounted 注销了消息监听器，避免事件泄漏
 */
onUnmounted(() => {
  ipcRenderer.off("windowMaximized", winMaximizeEvent);
  ipcRenderer.off("windowUnmaximized", winUnmaximizeEvent);
});

</script>

<template>
  <div class="top-bar">
    <div class="win-title">{{ title }}</div>
    <div class="win-tool">
      <div @click="handleMinimizeMainWindow">
        <i class="icon icon-minimize" />
      </div>
      <div v-if="isMaximized" @click="handleUnmaximizeMainWindow">
        <i class="icon icon-restore" />
      </div>
      <div v-else @click="handleMaximizeMainWin">
        <i class="icon icon-maximize" />
      </div>
      <div @click="handleCloseWindow">
        <i class="icon icon-close" />
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.top-bar {
  display: flex;
  height: 25px;
  line-height: 25px;
  -webkit-app-region: drag;
  width: 100%;
}
.win-title {
  flex: 1;
  padding-left: 12px;
  font-size: 14px;
  color: #888;
}
.win-tool {
  height: 100%;
  display: flex;
  -webkit-app-region: no-drag;
}
.win-tool div {
  height: 100%;
  width: 34px;
  text-align: center;
  color: #999;
  cursor: pointer;
  line-height: 25px;
}
.win-tool .icon {
  font-size: 10px;
  color: #666666;
  font-weight: bold;
}
.win-tool div:hover {
  background: #efefef;
}
.win-tool div:last-child:hover {
  background: #ff7875;
}
.win-tool div:last-child:hover i {
  color: #fff !important;
}
</style>
