<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import BarTop from "../../../Component/BarTop.vue";
import { ipcRenderer } from "electron";

// const handleAddProcess = () => {
//   ipcRenderer.invoke("addNewWindow")
// }

</script>

<template>
  <div>联系人</div>
  <!-- <button @click="handleAddProcess">新建一个渲染进程</button> -->
  <div class="contact-board">
    <BarTop />
  </div>
</template>

<style scoped lang="scss">
.contact-board {
  flex: 1;
}
</style>
