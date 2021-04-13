<template>
  <el-aside width="320px">
    <div class="chat-container">
      <div class="title">
        聊天
      </div>
      <div class="content">
        <div class="message-list">
          <div class="message-list-wrap">
            <div class="message-box" v-for="(m, index) in msgs" :key="'msg' + index">
              <div v-if="m.extra">
                <div class="message-item" v-if="parseInt(m.extra.coins) == 0">
                  <el-avatar :size="24" :src="m.extra.photo"></el-avatar>
                  <div class="content">
                    <span
                      :class="['name', m.extra.role]"> {{m.extra.userName}}
                      <span class="role" v-if="m.extra.role != 'student'">
                        {{ m.extra.role == 'teacher' ? '老师' : '管理员'}}
                      </span>
                    </span>
                    <span class="msg">{{ m.content }}</span>
                  </div>
                </div>
                <div :class="['message-item-coin', 'coin-' +  m.extra.coins ]" v-else>
                  <div class="user-info">
                    <el-avatar :size="24" :src="m.extra.photo"></el-avatar>
                    <span class="name">{{ m.extra.userName }}</span>
                    <span class="coins" v-if="m.extra"><i></i>{{ m.extra.coins }}</span>
                  </div>
                  <div class="msg">
                    {{ m.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="publish">
        <div class="msg">
          <el-input type="textarea" placeholder="请输入" v-model="chatMsg"></el-input>
        </div>
        <div class="handler">
          <el-checkbox v-model="disableSendMsg">全体禁言</el-checkbox>
          <a href="javascript:;" class="pictures"><i></i></a>
          <a href="javascript:;" class="faces"><i></i></a>
          <a href="javascript:;" :class="['send', {'disabled': !(chatMsg && isPushing)}]"
            @click="sendMsg">发送</a>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script>
import {
  getIMUserToken,
  liveComment,
  liveCommentList,
} from '@/api/live';
import config from '@/utils/config';

const RongIMLib = require('@rongcloud/imlib-v4');

export default {
  props: ['muteLocalAudio', 'isPushing'],
  data() {
    return {
      course: null,
      chatMsg: '',
      ryim: null,
      ryChatRoom: null,
      ryToken: '',
      conversation: null,
      disableSendMsg: false,
      msgs: [],
      lastMessageUId: '',
    };
  },
  mounted() {
    // 直接初始化
    window.RongIMLib.RongIMEmoji.init();
    this.msgs = [];
    this.course = this.$store.state.live.curOnduty;
    liveCommentList({
      courseUUID: this.course.uuid,
      startTime: this.course.startTime,
      endTime: (new Date()).getTime() / 1000,
      user_id: this.$store.getters.userId,
      verify: this.$store.getters.verify,
    }).then((r) => {
      console.log(r);
      if (r.data && r.data.length > 0) {
        r.data.forEach((item) => {
          const extra = {
            coins: item.coins,
            role: item.role,
            userName: item.authorInfo.nickname,
            photo: item.authorInfo.photo,
          };
          const obj = {
            content: window.RongIMLib.RongIMEmoji.symbolToEmoji(item.comment),
            extra,
          };
          this.msgs.push(obj);
        });
      }
      setTimeout(() => {
        this.scrollList();
      }, 100);
    });
  },
  methods: {
    scrollList() {
      const listEle = document.querySelector('.message-list');
      listEle.scrollTop = listEle.scrollHeight;
    },
    show() {
      this.initRongyun();
    },
    close() {
      this.quitChatRoom();
      this.disconnectRY();
    },
    getExistedConversationList() {
      return this.msgs;
    },
    // 发送消息
    sendMsg() {
      if (!(this.chatMsg && this.isPushing)) return;
      const obj = {
        role: 'teacher',
        isMember: true,
        coins: 0,
        photo: this.$store.getters.photo,
        userName: this.$store.getters.userInfo.live_nickname,
      };
      this.ryChatRoom.send({
        messageType: 'app:ChatroomMsgv1', // 填写开发者定义的 messageType
        content: { // 填写开发者定义的消息内容
          content: this.chatMsg,
          extra: JSON.stringify(obj),
        },
        // isPersited: true, // 是否存储在服务端,默认为 true
        // isCounted: true, // 是否计数. 计数消息接收端接收后未读数加 1，默认为 true
      }).then((message) => {
        // console.log('发送 app:ChatroomMsgv1 消息成功', message);
        this.msgs.push({
          content: window.RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content),
          extra: JSON.parse(message.content.extra, 10),
        });
        liveComment({
          courseUUID: this.course.uuid,
          comment: window.RongIMLib.RongIMEmoji.emojiToSymbol(this.chatMsg),
          coins: 0,
          teacherUserId: this.$store.getters.userId,
          user_id: this.$store.getters.userId,
          verify: this.$store.getters.verify,
        });
        this.chatMsg = '';
        setTimeout(() => {
          this.scrollList();
        }, 100);
      });
    },
    // 初始化融云
    initRongyun() {
      const that = this;
      if (!this.ryim) {
        this.ryim = RongIMLib.init({ appkey: config.ryAppkey });
        // 添加事件监听
        this.ryim.watch({
          // 监听会话列表变更事件
          conversation(event) {
            // 假定存在 getExistedConversationList 方法，以获取当前已存在的会话列表数据
            const conversationList = that.getExistedConversationList();
            // 发生变更的会话列表
            const { updatedConversationList } = event;
            // 通过 im.Conversation.merge 计算最新的会话列表
            const latestConversationList = that.ryim.Conversation
              .merge({ conversationList, updatedConversationList });
            console.log(latestConversationList);
          },
          // 监听消息通知
          message(event) {
            // 新接收到的消息内容
            const { message } = event;
            console.log('message', message);
            if (message && that.lastMessageUId !== message.messageUId) {
              console.log('messageUId', message.messageUId);
              that.msgs.push({
                content: window.RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content),
                extra: JSON.parse(message.content.extra),
              });
              that.lastMessageUId = message.messageUId;
              setTimeout(() => {
                that.scrollList();
              }, 100);
            }
          },
          // 监听 IM 连接状态变化
          status(event) {
            console.log('connection status:', event.status);
          },
          // 监听聊天室 KV 数据变更
          chatroom(event) {
            /**
             * 聊天室 KV 存储数据更新
             * @example
             * [
             *  {
             *    "key": "name",
             *    "value": "我是小融融",
             *    "timestamp": 1597591258338,
             *    "chatroomId": "z002",
             *    "type": 1 // 1: 更新（ 含:修改和新增 ）、2: 删除
             *  },
             * ]
             */
            const { updatedEntries } = event;
            console.log(updatedEntries);
          },
          expansion(event) {
            /**
             * 更新的消息拓展数据
             * @example {
             *    expansion: { key: 'value' },      // 设置或更新的扩展值
             *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
             * }
             */
            const { updatedExpansion } = event;
            console.log('updatedExpansion', updatedExpansion);
            /**
             * 删除的消息拓展数据
             * @example {
             *    deletedKeys: ['key1', 'key2'],    // 设置或更新的扩展值
             *    messageUId: 'URIT-URIT-ODMF-DURR' // 设置或更新扩展的消息 uid
             * }
             */
            const { deletedExpansion } = event;
            console.log('deletedExpansion', deletedExpansion);
          },
        });
      }
      console.log('verify', that.$store.getters.verify);
      getIMUserToken({
        user_id: that.$store.getters.userId,
        verify: that.$store.getters.verify,
      }).then((res) => {
        if (res.success) {
          this.ryToken = res.token;
          this.connectRY();
        }
      });
    },
    // 连接融云服务器
    connectRY() {
      // im 来自 RongIMLib.init 返回的实例，例如：var im = RongIMLib.init({ appkey: ' ' });
      this.ryim.connect({ token: this.ryToken }).then((user) => {
        console.log('链接成功, 链接用户 id 为: ', user.id);
        this.ryChatRoom = this.ryim.ChatRoom.get({
          id: this.course.uuid,
        });
        this.joinChatRoom();
      }).catch((error) => {
        console.log('链接失败: ', error.code, error.msg);
      });
    },
    // 断开连接融云服务器
    disconnectRY() {
      if (this.ryim) {
        this.ryim.disconnect().then(() => {
          // console.log('断开链接成功');
        });
      }
    },
    // 加入聊天室
    joinChatRoom() {
      this.ryChatRoom.join({
        count: -1,
      }).then(() => {
        // console.log('加入聊天室成功');
      });
    },
    // 退出聊天室
    quitChatRoom() {
      if (this.ryChatRoom) {
        this.ryChatRoom.quit().then(() => {
          // console.log('退出聊天室成功');
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-aside {
  background: #ffffff;
  border-radius: 6px 0px 0px 0px;
  box-shadow: 0px 2px 44px 0px rgba(0,0,0,0.1);
  z-index: 1;
  display: flex;
  flex-direction: column;
  -webkit-app-region: drag;
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-app-region: no-drag;
}

.chat-container .title {
  text-align: center;
  height: 50px;
  border-bottom: 1px solid rgba(151,151,151,.4);
  font-size: 22px;
  font-weight: 500;
  color: #000000;
  line-height: 50px;
}

.chat-container .content {
  flex: 1;
  position: relative;
}

.chat-container .content * {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
}

.message-list {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  font-size: 12px;
  overflow-x: hidden;
  overflow-y: auto;
}

.chat-container .content .message-list .message-list-wrap {
  height: 100%;
  width: 100%;
  padding-top: 30px;
  padding-bottom: 40px;
}

.message-list .message-box {
  margin: 0 16px 20px;
}

.message-list .message-item {
  display: flex;
  align-items: flex-start;
}

.message-list .message-item .content {
  margin-left: 8px;
  display: inline-block;
  line-height: 18px;
}
.message-list .message-item .content .name{
  font-size: 12px;
  font-weight: 500;
  color: #185fc3;
}

.message-list .message-item .content .name span {
  margin-left: 6px;
  margin-right: 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 500;
  color: #ffffff;
  padding: 2px 6px;
}

.message-list .message-item .content .teacher {
  color: rgba(236,43,85,1);
}

.message-list .message-item .content .teacher span {
  background: linear-gradient(137deg,#f74471 12%, #da2a56 95%);
}

.message-list .message-item .content .admin {
  color: rgba(48,187,145,1);
}

.message-list .message-item .content .admin span {
  background: #30bb91;
}

.message-list .message-item .content .msg {
  font-size: 12px;
  font-weight: 400;
  color: #060606;
}

 .message-list .message-item-coin {
  width: 100%;
  height: 80px;
  background: rgba(37,122,241, .7);
  border-radius: 8px;
  padding: 14px 16px;
}

.message-list .coin-2000 {
  background: rgba(105,159,57,.8);
}

.message-list .coin-3000 {
  background: rgba(234,61,120,.8);
}

.message-list .message-item-coin .user-info {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
}

.message-list .message-item-coin .user-info .name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
}

.message-list .message-item-coin .user-info .coins {
  right: 0;
  position: absolute;
  font-size: 14px;
  font-family: GoogleSans, GoogleSans-Medium;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.message-list .message-item-coin .user-info .coins i {
  width: 22px;
  height: 22px;
  background-image: url('../../assets/images/room/icon-coin.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 6px;
}

.message-list .message-item-coin .msg {
  margin-top: 12px;
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  line-height: 12px;
}
.chat-container .publish {
  padding: 16px;
}

.chat-container .publish .msg .el-textarea textarea{
  background: #ffffff;
  border: 1px solid rgba(151,151,151,0.6);
  border-radius: 8px;
  box-shadow: 0px 1px 30px 0px rgba(0,0,0,0.11) inset;
}

.chat-container .publish .handler {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
}

.chat-container .publish .handler .el-checkbox {
  font-size: 16px;
  font-weight: 500;
  color: #b6b9c2;
}
.chat-container .publish .handler .pictures {
  width: 31px;
  height: 31px;
  margin-left: 20px;
}

.chat-container .publish .handler .pictures i {
  width: 100%;
  height: 100%;
  display: inline-block;
  background-image: url('../../assets/images/room/icon-tupian.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.chat-container .publish .handler .faces {
  width: 34px;
  height: 34px;
  margin-left: 20px;
}

.chat-container .publish .handler .faces i {
  width: 100%;
  height: 100%;
  display: inline-block;
  background-image: url('../../assets/images/room/icon-face.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.chat-container .publish .handler .send {
  width: 64px;
  height: 34px;
  background: #1296db;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  line-height: 34px;
  text-align: center;
  margin-left: 20px;
  transition: all .3 linear;
}

.chat-container .publish .handler .disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
</style>
