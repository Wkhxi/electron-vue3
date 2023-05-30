<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { createDialog } from "../../common/Dialog"
const route = useRoute();

const mainWindowRoutes = ref([
  { path: `/WindowMain/Chat`, isSelected: true, icon: `icon-chat`, iconSelected: `icon-chat` },
  { path: `/WindowMain/Contact`, isSelected: false, icon: `icon-tongxunlu1`, iconSelected: `icon-tongxunlu` },
  { path: `/WindowMain/Collection`, isSelected: false, icon: `icon-shoucang1`, iconSelected: `icon-shoucang` },
]);

watch(
  () => route,
  () => mainWindowRoutes.value.forEach((v) => (v.isSelected = v.path === route.fullPath)),
  {
    immediate: true,
    deep: true,
  }
);


const handleOpenSettingWindow = async() => {
  // const config = { modal: true, width: 2002, webPreferences: { webviewTag: false } };
  /**
   * window.open 为url 创建一个新的BrowserWindow 实例，并返回一个代理至 window.open 以让页面对其进行有限的控制
   * window.open 打开子窗口速度只有几百毫秒，因为新窗口不会创建新的进程（一个窗口崩溃会导致其他窗口一起崩溃，主窗口不受影响）
   * window.open创建的窗口跟在浏览器创建一个悬浮Dom的原理一样
   */
  // 第三个参数本应该 是 符合浏览器规范的一些 key-value 的配置
  // 这里 传递的是 electron的窗口配置
  // window.open(`/WindowSetting/AccountSetting`, "_blank", JSON.stringify(config));


  const config = {
    modal: true,
    width: 800,
    webPreferences: {
      webViewTag: false
    }
  }
  const dialog = await createDialog(`/WindowSetting/AccountSetting`, config)
  console.log('mainWindow ~', dialog, window, new Date().getTime())
  const msg = {
    msgName: 'hello',
    value: 'msg from your parent'
  }
  // 给dialog子窗口发送消息
  dialog.postMessage(msg)
}

const msgHandler = (e: any) => {
  console.log("mainWindow listener ~", e.data)
}
/**
 * 此监听 持续监听子窗口发送的消息
 */
window.addEventListener("message", msgHandler)

// onUnmounted(() => {
//   console.log('onUnmounted mainWindow')
//   window.removeEventListener("message", msgHandler)
// })
</script>


<template>
  <div class="bar-left">
    <div class="user-icon">
      <img src="../assets/avatar.jpg" alt="" />
    </div>
    <div class="menu">
      <router-link v-for="(item, index) in mainWindowRoutes" :key="index" :to="item.path" :class="[`menu-item`, { selected: item.isSelected }]">
        <i :class="[`icon`, item.isSelected ? item.iconSelected : item.icon]"></i>
      </router-link>
    </div>
    <div class="setting" @click="handleOpenSettingWindow">
      <div class="menu-item">
        <i class="icon icon-setting"></i>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.bar-left {
  width: 54px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(46, 46, 46);
  -webkit-app-region: drag; // 鼠标在该div上可以 1. 按住不动可以移动窗口 2. 双击可以放大或者还原窗口
  // 如果不希望子标签有次功能可在子标签上设置 -webkit-app-region: no-drag;
}
.user-icon {
  height: 84px;
  padding-top: 36px;
  box-sizing: border-box;
  img {
    width: 34px;
    height: 34px;
    margin-left: 10px;
  }
}
.menu {
  flex: 1;
}
.menu-item {
  height: 44px;
  line-height: 44px;
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
  display: block;
  text-decoration: none;
  color: rgb(126, 126, 126);
  cursor: pointer;
  -webkit-app-region: no-drag;
  i {
    font-size: 22px;
  }
  &:hover {
    color: rgb(141, 141, 141);
  }
}
.selected {
  color: rgb(7, 193, 96);
  &:hover {
    color: rgb(7, 193, 96);
  }
}
.setting {
  margin-bottom: 5px;
}
</style>
