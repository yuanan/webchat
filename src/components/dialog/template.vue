<template>
  <div class="dialog" v-if="isShow">
    <div class="head">
      <div class="title">
        你正在与<span class="server-name"> 客服001 </span>聊天
      </div>
    </div>
    <div class="message-area">
      <textarea name="message" id="message" aria-label="写些什么..."></textarea>
      <div class="btn-send">
        <svg-send></svg-send>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./controller.js";
export default controller;
</script>

<style lang="less" scoped>
@import url("./style.less");
</style>