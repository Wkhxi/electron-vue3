<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import ChatSearch from "./ChatSearch.vue";
import { useChatStore } from "../../../../store/chat";
import ChatItem from "./ChatItem.vue"
const store = useChatStore()
const { selectItem } = store
const { data } = store


onMounted(() => {
  selectItem(data[2])
});

// test
// const test = reactive({ name: { age: 1 }, arr: [{ x: 1 },2,3], age: 18 })
// const { name, arr } = test
// let { age } = test
// let { x } = arr[0]

// console.log(test, name, arr, age, x)

// const handleChange= () => {
//   const index = new Date().getTime()
//   name[index] = 1
//   arr.push(1)
//   age++
//   x++
//   console.log('handleChange')
// }
</script>

<template>
  <div class="chat-list">
    <ChatSearch />
    <!-- <div>{{ name }}</div>
    <div>{{ arr }}</div>
    <div>{{ age }}</div>
    <div>{{ x }}</div> -->
    <!-- <button @click="handleChange">-1</button> -->
    <div class="list-box">
      <ChatItem v-for="item in data" :key="item.id" :data="item" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-list {
  width: 250px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.list-box {
  background: rgb(230, 229, 229);
  background-image: linear-gradient(to bottom right, rgb(235, 234, 233), rgb(240, 240, 240));
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  border-right: 1px solid rgb(214, 214, 214);
}
</style>
