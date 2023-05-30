<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ipcRenderer } from "electron";
import { onMounted } from "vue";
import BarLeft from "../../Component/BarLeft.vue";

onMounted(() => {
  console.log('onMounted', ipcRenderer)
  ipcRenderer.invoke("showWindow");
});
</script>

<template>
  <BarLeft />
  <div class="page-box">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.page-box {
  flex: 1;
  height: 100%;
  border-top: 1px solid #e6e6e6;
  box-sizing: border-box;
  display: flex;
  margin-top: -1px;
}
</style>
