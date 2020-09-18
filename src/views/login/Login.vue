<template>
  <el-container class="login-container">
    <div id="login-modal" v-show="isShow" class="login-modal">
      <div class="login-wrapper">
        <div class="logo-bg"></div>
        <div class="login">
          <el-form
            class="login-form"
            autoComplete="on"
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            label-position="left">
            <h3 class="title">全球说教师直播平台{{ version }}</h3>
            <el-form-item prop="phone">
              <div class="login-input phone">
                <i></i>
                <el-input
                  name="phone"
                  type="text"
                  v-model="loginForm.phone"
                  autoComplete="on"
                  placeholder="请输入手机号" />
              </div>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <div class="login-input verifyCode">
                <i></i>
                <el-input
                  name="verifyCode"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.verifyCode"
                  autoComplete="on"
                  placeholder="输入4位验证码">
                </el-input>
                <el-button
                  type="text"
                  :class="['btnVerifyCode',
                  {'active': loginForm.phone.length === 11 && time === 60}]"
                  :disabled="!(loginForm.phone.length === 11 && time === 60)"
                  @click="getCode"
                  v-text="time === 60 ? message : time + 's'" />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                :class="['btnLogin',
                  {'btnActive': loginForm.phone.length == 11 && loginForm.verifyCode.length == 4}]"
                :disabled="!(loginForm.phone.length == 11 && loginForm.verifyCode.length == 4)"
                :loading="loading"
                @click.native.prevent="handleLogin">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="icons">
            <i class="el-icon-minus" @click="hide"></i>
            <i class="el-icon-close" @click="close"></i>
          </div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import {
  getSendSmsCode,
} from '@/api/login';

const { ipcRenderer } = window.require('electron');

export default {
  data() {
    return {
      isShow: false,
      message: '获取验证码',
      isNC: false,
      time: 60,
      timer: null, // 定时器
      loginForm: {
        phone: '13810413536',
        verifyCode: '',
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        verifyCode: [{ required: true, trigger: 'blur', message: '请输入4位验证码' }],
      },
      loading: false,
      version: '',
    };
  },
  mounted() {
    this.isShow = true;
    // getLangs().then((res) => {
    //   console.log(res);
    // });
    // 创建TRTC对象
    // trtcCloud = new TRTCCloud();
    // this.version = trtcCloud.getSDKVersion();
    // this.ncCaptchaVerify()
  },
  computer: {
    isGetCode() {
      return this.loginForm.phone.length === 11 && this.time === 60;
    },
  },
  methods: {
    getCode() {
      const obj = {
        phonenumber: this.loginForm.phone,
        codeLen: 4,
      };
      getSendSmsCode(obj).then((res) => {
        if (res.success) {
          this.timer = setInterval(() => {
            this.time -= 1;
            if (this.time === 0) {
              this.time = 60;
              this.message = '重新获取';
              clearInterval(this.timer);
            }
          }, 1000);
        }
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const obj = {
            phonenumber: this.loginForm.phone,
            code: this.loginForm.verifyCode,
          };
          this.$store.dispatch('Login', obj).then((res) => {
            if (res.success) {
              this.isShow = false;
              this.$store.dispatch('GetUserInfo', { user_id: this.$store.getters.userId })
                .then((res2) => {
                  if (res2.success) {
                    this.loading = false;
                    setTimeout(() => {
                      switch (res2.data.status) {
                        case 0:
                          this.$router.push({ path: '/verify/edit' });
                          break;
                        case 1:
                        case 2:
                          this.$router.push({ path: '/verify/detail' });
                          break;
                        default:
                          this.$router.push({ path: '/course/rili' });
                          break;
                      }
                      ipcRenderer.send('loginSuccess');
                    }, 100);
                  }
                });
            }
          }).catch(() => {
            this.loading = false;
          });
          return true;
        }
        console.log('error submit!!');
        return false;
      });
    },
    hide() {
      ipcRenderer.send('winMin');
    },
    close() {
      ipcRenderer.send('winClose', true);
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  background: #FFFFFF;
  width: 100%;
  height: -webkit-fill-available;
  align-items: center;
  justify-content: center;
}
.login-modal {
  width: 700px;
  height: 473px;
  .login-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    margin: auto;
    position: relative;
  }
}

.logo-bg {
  width: 266px;
  height: 100%;
  background-image: url('../../assets/images/login/logo-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0px 0px;
}

.login {
  flex: 1;
  background: #ffffff;
  padding: 0 72px;
}

.login-form {
  padding-top: 84px;
}
.login-form .title {
  font-size: 25px;
  font-weight: 500;
  height: 36px;
  line-height: 36px;
  color: #000000;
  text-align: center;
  margin-bottom: 50px;
}

.login-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, .2);
  -webkit-app-region: no-drag;
}

.login-input > .el-input {
  font-size: 16px;
  font-weight: 400;
  width: 190px;
}

.login-input > i {
  margin-left: 20px;
}

.phone > i {
  display: inline-block;
  width: 17px;
  height: 28px;
  background-image: url('../../assets/images/login/icon-phone.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.verifyCode > i {
  display: inline-block;
  width: 18px;
  height: 20px;
  background-image: url('../../assets/images/login/icon-verifyCode.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.verifyCode .btnVerifyCode {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, .4);
}
.verifyCode .active {
  color: #007AFF;
}
.verifyCode .btnVerifyCode:disabled {
  /* color: #fff;
  cursor: not-allowed;
  background-color: #D6DFE4; */
}

.btnLogin {
  width: 100%;
  margin-top: 80px;
  height: 45px;
  background: #cbd1da !important;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff !important;
  line-height: 25px;
  -webkit-app-region: no-drag;
}

.btnActive {
  background-color: #007AFF !important;
}

.icons {
  position: absolute;
  top: 28px;
  right: 11px;
  -webkit-app-region: no-drag;
}

.icons i {
  margin-right: 17px;
  cursor: pointer;
}
</style>

<style lang="less">
.login-form {
  .el-input__inner {
    color: #000000;
    border: 0;
  }

  .el-input__inner::placeholder {
    color: rgba(0, 0, 0, .4);
  }
}
</style>
