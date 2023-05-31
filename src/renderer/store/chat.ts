import { defineStore } from "pinia";
import { ref } from "vue";
import { ModelChat } from "../../model/ModelChat";
import { useMessageStore } from "./message"

// 初始化数据
const initData = () => {
  const result = [];
  for (let i = 0; i < 10; i++) {
    const model = new ModelChat();
    model.fromName = "聊天对象" + i;
    model.sendTime = "昨天";
    model.lastMsg = "这是此会话的最后一条消息" + i;
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
    result.push(model);
  }
  return result;
};

export const useChatStore = defineStore("chat", () => {
  const data = ref<ModelChat[]>(initData()); // 初始化的会话数组 [new Modal()]
  const selectItem = (item: ModelChat) => {
    if (item.isSelected) return;
    // 1. 全部置为false
    // 2. 选择的置为true
    // 这个逻辑需要优化
    data.value.forEach((v) => (v.isSelected = false));
    item.isSelected = true;

    const messageStore = useMessageStore();
    messageStore.initData(item);

  };


  return { data, selectItem };
});


