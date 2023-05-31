<script setup lang="ts">
import BarTop from "../../../../Component/BarTop.vue";
import type { ModelChat } from "../../../../../model/ModelChat"
import { useChatStore } from "../../../../store/chat"
import { useMessageStore } from "../../../../store/message"
import MessageItem from "./MessageItem.vue";
import { storeToRefs } from "pinia";

// const chatStore = useChatStore();
const messageStore = useMessageStore();

const { data: messageData } = storeToRefs(messageStore)

// let curId = "";

// 订阅Store内数据的变化
// 用于监听 state 里面的值是否发生了变化
// chatStore.$subscribe((mutations, state) => {
//   console.log('$subscribe', mutations, state)

//   /**
//    * mutation
//    *    events: 当前state改变的具体数据，包括改变前的值和改变后的值等等数据
//    *    storeId：是当前store的id
//    *    type：数据变化是通过什么途径
//    *          “direct” ：通过 action 变化的
//    *          ”patch object“ ：通过 $patch 传递对象的方式改变的
//    *          “patch function” ：通过 $patch 传递函数的方式改变的
//    */
//   let item = state.data.find((v) => v.isSelected) as ModelChat;
//   // console.log('item', item)
//   if (item.id != curId) {
//     messageStore.initData(item);
//     curId = item.id;
//   }
// });

</script>

<template>
  <div class="message-board">
    <BarTop />
    <div class="message-list">
      <MessageItem :data="item" v-for="item in messageData" :key="item.id" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-board {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;

  .message-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgb(245, 245, 245);
  }
}
</style>
