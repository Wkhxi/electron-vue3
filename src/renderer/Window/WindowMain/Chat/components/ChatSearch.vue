<template>
  <div class="chat-search">
    <div class="search-icon"><i class="icon icon-sousuo"></i></div>
    <div class="input-box" contenteditable="true" placeholder="搜索"></div>
    <div class="search-btn">+</div>
  </div>
</template>


<script lang="ts" setup></script>


<style lang="scss" scoped>
.chat-search {
  display: flex;
  background: rgb(247, 247, 247);
  height: 54px;
  -webkit-app-region: drag;
  box-sizing: border-box;
  padding-top: 23px;
  padding-left: 12px;
  padding-right: 12px;
  position: relative;
  border-right: 1px solid rgb(214, 214, 214);
}
.search-icon {
  position: absolute;
  left: 13px;
  top: 24px;
  width: 23px;
  text-align: center;
  color: #666;
  i {
    font-size: 10px;
  }
}
.input-box {
  -webkit-app-region: no-drag;
  flex: 1;
  margin-right: 8px;
  height: 23px;
  line-height: 22px;
  background: rgb(226, 226, 226);
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid rgb(226, 226, 226);
  border-radius: 3px;
  outline: none;
  padding-left: 23px;
  font-size: 12px;
  padding-right: 6px;
  font-family: "Microsoft Yahei", -apple-system, Ubuntu, sans-serif;
  &:focus {
    background: #fff;
  }
  /* 输入框为空时显示 placeholder */
  &:empty:before {
    content: attr(placeholder);
    color: #888;
  }
  /* 输入框获取焦点时移除 placeholder */
  &:focus:before {
    content: none;
  }
}
.search-btn {
  -webkit-app-region: no-drag;
  width: 24px;
  height: 23px;
  background: rgb(226, 226, 226);
  font-size: 18px;
  text-align: center;
  line-height: 22px;
  border-radius: 3px;
  color: #888;
  cursor: pointer;
  box-sizing: border-box;
  &:hover {
    background: rgb(209, 209, 209);
  }
}
</style>
