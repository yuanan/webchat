<template>
  <div class="webchat-dialog" v-if="isShow" ref="dialog">
    <div class="head">
      <div class="title">
        你正在与
        <span class="server-name">{{ receiver.nickName }}</span> 聊天
      </div>
      <div class="btn-close" @click="hide">
        <svg-close></svg-close>
      </div>
    </div>
    <div class="message-content-area" ref="content">
      <div class="message-list">
        <ul>
          <li :class="data.type" v-for="(data, index) in messages" :key="index">
            <div class="message-content">
              <div class="com-text" v-if="data.content.body.type == 1">
                <div v-html="data.content.body.text"></div>
              </div>
              <div class="com-img" v-if="data.content.body.type == 2">
                <img :src="data.content.body.imageUrl" alt />
              </div>
              <div class="com-voice" v-if="data.content.body.type == 3">
                <audio :src="data.content.body.voiceUrl" controls="controls"></audio>
              </div>
              <div class="com-video" v-if="data.content.body.type == 4">
                <video
                  :src="data.content.body.videoUrl"
                  :poster="data.content.body.videoImageUrl"
                  controls="controls"
                ></video>
              </div>
              <div class="com-card" v-if="false"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="message-area" @touchstart="focus">
      <textarea ref="message" name="message" id="message" placeholder="写些什么..." v-model="content"></textarea>
      <div class="btn-send" @click="onSendMsg">
        <svg-send></svg-send>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./controller.js";
export default controller;
</script>

<style lang="less">
@import url("./var.less");
@import url("./style.less");
@import url("./mstyle.less");
</style>
