import { ModelChat } from "../../model/ModelChat";
import { ModelMessage } from "../../model/ModelMessage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessageStore = defineStore("message", () => {
  const data = ref<ModelMessage[]>([]);
  const msg1 = `你好`;
  const msg2 = `hello`;

  const initData = (chat: ModelChat) => {
    const result = [];
    for (let i = 0; i < 10; i++) {
      const model = new ModelMessage();
      model.createTime = Date.now();
      model.isInMsg = i % 2 === 0;
      model.messageContent = model.isInMsg ? msg1 : msg2;
      model.fromName = model.isInMsg ? chat.fromName : "我";
      model.avatar = chat.avatar;
      model.chatId = chat.id;
      result.push(model);
    }
    data.value = result;

    // console.log('useMessageStore', data.value)
  };
  return { data, initData };
});
