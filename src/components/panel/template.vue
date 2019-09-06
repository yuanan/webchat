<template>
  <div class="webchat-panel" v-if="isShow" ref="panel">
    <div class="card">
      <div class="head">
        <span class="title">消息列表</span>
        <span class="icon" @click="hide">
          <svg-close></svg-close>
        </span>
      </div>
      <div class="body">
        <div class="message-list">
          <ul>
            <li v-for="(data, index) in messages" :key="index">
              <div class="item">
                <div class="userInfo">
                  <div class="avatar">
                    <img
                      src="http://thirdwx.qlogo.cn/mmopen/vi_32/iaRuICOwCymMKjbxt4Gl0ibQtib2rUVjv1H58W96jZ5jFQGw1Nzz3Ptsia58M3aVTntmTAGZ3oMSiaNe9snhKvWXPIA/132"
                      alt
                    />
                  </div>
                  <div class="nickname">戴博</div>
                  <div class="time">10:49</div>
                  <div class="reply" @click="onReply(data)" v-if="data.content.body.type <= 4">回复</div>
                </div>
                <div class="content">
                  <div class="com-text" v-if="data.content.body.type == 1">
                    <div v-html="data.content.body.text"></div>
                  </div>
                  <div class="com-img" v-if="data.content.body.type == 2">
                    <img :src="data.content.body.imageUrl" alt="">
                  </div>
                  <div class="com-voice" v-if="data.content.body.type == 3">
                    <audio :src="data.content.body.voiceUrl" controls="controls" ></audio>
                  </div>
                  <div class="com-video" v-if="data.content.body.type == 4">
                    <video :src="data.content.body.videoUrl" :poster="data.content.body.videoImageUrl" controls="controls" ></video>
                  </div>
                  <div class="com-card" v-if="false">
                    <div class="poster">
                      <img src="" alt="">
                    </div>
                    <div class="text">
                      12313123123213
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
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
