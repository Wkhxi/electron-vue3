<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import BarTop from '../../../Component/BarTop.vue'
import { ipcRenderer } from 'electron'
import { ModelChat } from '../../../../model/ModelChat'
import { ModelMessage } from '@/model/ModelMessage'
import { db } from '@/common/db'

// const handleAddProcess = () => {
//   ipcRenderer.invoke("addNewWindow")
// }

const insertData = async () => {
  let model = new ModelChat()
  model.fromName = '聊天对象'
  model.sendTime = Date.now()
  model.lastMsg = '这是此会话的最后一条消息'
  model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
  // 数据库Chat表中插入一行数据，插入对象 model 需要与 数据库列字段同名
  const res = await db('Chat').insert(model)
  console.log('insertData', res)
}

const insertMultiData = async () => {
  let result = []
  for (let i = 0; i < 10; i++) {
    let model = new ModelChat()
    model.fromName = '聊天对象' + i
    model.sendTime = Date.now()
    model.lastMsg = '这是此会话的最后一条消息' + i
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
    result.push(model)
  }
  result[5].isSelected = true
  const res = await db('Chat').insert(result)
  console.log('insertMultiData', res)
}

const selectData = async () => {
  const res = await db('Chat').where({ id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3` }).first()
  console.log('selectData', res)
}

const updateData = async () => {
  const res = await db('Chat')
    .update({ fromName: '王勃', lastMsg: '落霞与孤鹜齐飞，秋水共长天一色。' })
    .where({ id: `f793443d-f6b9-4100-b021-1c98985f451b` })
  console.log('updateData', res)
}

const deleteData = async () => {
  // db('Chat')
  //   .where({ id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3` })
  //   .delete()
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err))
  const res = await db('Chat').where({ id: `de1a46c9-1ab3-4007-afb8-7c1b67902d3c` }).delete()
  console.log('deleteData', res)
}

const transaction = async () => {
  try {
    // trx 就是 一个 数据库事务对象
    await db.transaction(async (trx) => {
      let chat = new ModelChat()
      chat.fromName = '聊天对象aaa'
      chat.sendTime = Date.now()
      chat.lastMsg = '这是此会话的最后一条消息'
      chat.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
      await trx('Chat').insert(chat)
      // throw "throw a error";

      let message = new ModelMessage()
      message.fromName = '聊天对象'
      message.chatId = chat.id
      message.createTime = Date.now()
      message.isInMsg = true
      message.messageContent = '这是我发给你的消息'
      message.receiveTime = Date.now()
      message.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
      await trx('Message').insert(message)
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>联系人</div>
  <!-- <button @click="handleAddProcess">新建一个渲染进程</button> -->
  <div class="contact-board">
    <BarTop />
    <div>
      <button @click="insertData">增加一行数据</button>
      <button @click="insertMultiData">增加多行数据</button>
      <button @click="selectData">查询符合条件数据的第一行数据</button>
      <button @click="updateData">更新数据</button>
      <button @click="deleteData">删除数据</button>

      <button @click="transaction">使用事务</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact-board {
  flex: 1;
}
</style>
