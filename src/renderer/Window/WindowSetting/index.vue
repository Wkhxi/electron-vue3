<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import BarTop from "../../Component/BarTop.vue";
import { dialogReady } from "../../../common/Dialog"
import { onMounted, onUnmounted } from "vue";

const msgHandler = (e: any) => {
  console.log('dialog msgHandler', e, new Date().getTime())
  window.opener.postMessage({ msgName: "hello", value: "msg from your child" })
}

/**
 * 当子窗口渲染完毕时
 */
onMounted(() => {
  console.log('onMounted dialog', window, new Date().getTime())
  // 子窗口自己添加监听
  window.addEventListener("message", msgHandler)
  // 给子窗口的父窗口发送消息
  dialogReady()
})


// onUnmounted(() => {
//   console.log('onUnmounted dialog')
//   window.removeEventListener("message", msgHandler)
// })

</script>

<template>
  <BarTop title="设置" />
  <div class="setting-body">
    <div class="menu-box">
      <div class="menu-item">账号设置</div>
      <div class="menu-item">消息通知</div>
      <div class="menu-item">通用设置</div>
      <div class="menu-item">文件管理</div>
      <div class="menu-item">快捷键</div>
      <div class="menu-item">关于微信</div>
    </div>
    <div class="page-box">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  flex-direction: column;
  background: rgb(245, 245, 245);
}
</style>
<style scoped lang="scss">
.setting-body {
  display: flex;
  flex: 1;
  box-sizing: border-box;
  padding-top: 50px;
}
.menu-box {
  width: 120px;
  border-right: 1px solid rgb(227, 227, 227);
  .menu-item {
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
}
.page-box {
  flex: 1;
}
</style>
