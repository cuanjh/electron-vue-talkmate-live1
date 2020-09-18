<template>
  <el-container id="user-identify-detail" class="user-identify-detail" v-show="isShow">
    <el-header class="detail-identify-header">
      <div class="title">
        个人信息设置
      </div>
      <div class="right">
        <a href="javascript:;">《教师使用指南》</a>
        <span>专属客服微信：quanqiushuo</span>
      </div>
    </el-header>
    <el-main class="main-content">
      <div class="title" v-if="status == 1 || status == 2">
        <i :class="[{
          'el-icon-success success': status == 1,
          'el-icon-warning warning': status == 2
        }]"></i>{{ title }}</div>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        size="small"
        label-width="84px"
        class="detail-identify-form">
        <div class="form-row">
          <div class="form-col">
              <div class="form-item-user">
                <edit-photo></edit-photo>
                <edit-nickname></edit-nickname>
              </div>
            <el-form-item label="真实姓名：">
              <div class="text">{{ ruleForm.real_name }}</div>
              <div class="verified" v-show="status == 3"><i></i>已认证</div>
            </el-form-item>
            <el-form-item
              :label="ruleForm.certificate_type == '1' ? '身份证号：' : '护照编号：'">
              {{ ruleForm.identity_card }}
            </el-form-item>
            <el-form-item>
              <label for="nationality" slot="label">国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;籍：</label>
              {{ ruleForm.nationality }}
            </el-form-item>
            <el-form-item>
              <label for="nationality" slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</label>
              {{ ruleForm.gender }}
            </el-form-item>
            <el-form-item>
              <label for="nationality" slot="label">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄：</label>
              {{ ruleForm.birth_date }}
            </el-form-item>
            <el-form-item label="现居住地：">
              {{ ruleForm.address }}
            </el-form-item>
            <el-form-item label="直播昵称：">
              {{ ruleForm.live_nickname }}
            </el-form-item>
            <el-form-item label="直播语种：">
              {{ ruleForm.lan_code }}
            </el-form-item>
            <el-form-item label="个人简介：">
              {{ ruleForm.introduction }}
            </el-form-item>
          </div>
          <div class="form-col">
            <div class="ID-images">
              <div class="item">
                <el-image
                  v-if="ruleForm.certificate_front"
                  style="width: 100%; height: 100%;"
                  :src="uploadDomain + ruleForm.certificate_front" fit="cover"></el-image>
              </div>
              <div class="item">
                <el-image
                  v-if="ruleForm.certificate_back"
                  style="width: 100%; height: 100%;"
                  :src="uploadDomain + ruleForm.certificate_back" fit="cover"></el-image>
              </div>
            </div>
            <div class="ID-images-desc">
              {{ruleForm.certificate_type == '1' ? '身份证' : '护照'}}信息已上传
            </div>
            <el-form-item label-width="auto" class="handler-btns">
              <el-button
                :disabled="status == 3"
                type="primary"
                size="large"
                @click="submitForm()">修改</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import {
  getCourseLangs,
} from '@/api/live';
import moment from 'moment';
import config from '@/utils/config';
import getAge from '@/utils/getAge';

import EditPhoto from '@/components/EditPhoto/EditPhoto.vue';
import EditNickname from '@/components/EditNickname/EditNickname.vue';

export default {
  data() {
    return {
      isShow: false,
      langs: [],
      token: '',
      uploadDomain: config.uploadDomain,
      status: '',
      title: '资料提交成功，审核专员将会在24小时之内完成审核请耐心等待。',
      ruleForm: {
        user_id: '',
        photo: '',
        nickname: '',
        phonenumber: '',
        real_name: '',
        certificate_type: '1',
        identity_card: '',
        nationality: '',
        gender: '',
        birth_date: '',
        address: '',
        live_nickname: '',
        lan_code: '',
        introduction: '',
        isCheckedAgreement: '',
        certificate_front: '',
        certificate_back: '',
      },
    };
  },
  components: {
    EditPhoto,
    EditNickname,
  },
  mounted() {
    getCourseLangs().then((res) => {
      if (res.success) {
        this.langs = res.data.allLangs;
        this.loadData();
      }
    });
  },
  methods: {
    loadData() {
      this.$store.dispatch('GetUserInfo', {
        user_id: this.$store.getters.userId,
      }).then(() => {
        const identifyInfo = this.$store.getters.userInfo;
        if (identifyInfo) {
          console.log(identifyInfo);
          this.status = identifyInfo.status;
          if (this.status === 2) {
            this.title = '审核不通过';
          }
          this.ruleForm.user_id = identifyInfo.user_id;
          this.ruleForm.photo = identifyInfo.photo;
          this.ruleForm.nickname = identifyInfo.nickname;
          this.ruleForm.phonenumber = identifyInfo.phonenumber;
          this.ruleForm.real_name = identifyInfo.real_name;
          this.ruleForm.certificate_type = identifyInfo.certificate_type ? identifyInfo.certificate_type : '1';
          this.ruleForm.identity_card = identifyInfo.identity_card;
          this.ruleForm.nationality = identifyInfo.nationality;
          this.ruleForm.gender = identifyInfo.gender === 1 ? '男' : '女';
          this.ruleForm.birth_date = getAge(moment(identifyInfo.birth_date).format('YYYY-MM-DD'));
          this.ruleForm.address = identifyInfo.address;
          this.ruleForm.live_nickname = identifyInfo.live_nickname;
          const langs = [];
          if (identifyInfo.lan_code.length && this.langs.length) {
            identifyInfo.lan_code.forEach((item) => {
              const lang = this.langs.find((l) => {
                const ret = l.lan_code === item;
                return ret;
              });
              langs.push(lang.title['zh-CN']);
            });
          }
          this.ruleForm.lan_code = langs.length ? langs.join('、') : '';
          this.ruleForm.introduction = identifyInfo.introduction;
          this.ruleForm.certificate_front = identifyInfo.certificate_front;
          this.ruleForm.certificate_back = identifyInfo.certificate_back;
        }
        this.isShow = true;
      });
    },
    submitForm() {
      this.$router.push({ path: '/verify/edit' });
    },
  },
};
</script>

<style lang="less" scoped>
.detail-identify-header {
  width: 100%;
  height: 98px !important;
  background: #ffffff;
  border-radius: 0px 6px 0px 0px;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.detail-identify-header .title {
  padding-left: 20px;
  font-size: 36px;
  font-family: YouSheBiaoTiHei;
  color: #000000;
}

.detail-identify-header .right {
  font-size: 16px;
  font-weight: 400;
  color: #000000;
}

.el-main {
  -webkit-app-region: no-drag;
}

.main-content > .title {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 22px;
  padding-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title i {
  margin-right: 12px;
  text-align: center;
  font-weight: 500;
  font-size: 20px;
}

.success {
  color: #1AAD19;
}

.warning {
  color: #E6A23C;
}

.detail-identify-form {
  margin-top: 40px;
  padding: 0 25px;
}

.form-row {
  display: flex;
  flex-direction: row;
}

.form-row .form-col:first-child {
  width: 580px;
}

.form-row .form-col:last-child {
  margin-left: 70px;
}

.form-item-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 47px;
}

.el-form-item {
  margin-bottom: 20px !important;
}

.verified {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 60px;
}

.verified i {
  width: 21px;
  height: 24px;
  background-image: url('../../assets/images/common/icon-verified.svg');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 6px;
}

.ID-images {
  width: 302px;
  height: 389px;
  border: 3px dashed rgba(151,151,151,.12);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ID-images .item {
  width: 253px;
  height: 160px;
  background: rgba(0, 0, 0, .1);
  border: 1px dashed rgba(0,0,0,0.21);
  margin: 0 auto;
}

.ID-images .item:first-child {
  margin-bottom: 20px;
}

.ID-images-desc {
  opacity: 0.4;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  line-height: 17px;
  text-align: center;
  margin-top: 15px;
}

.handler-btns {
  text-align: center;
  margin-top: 130px;
}

.handler-btns .el-button {
  width: 150px;
  margin: 0 auto;
}
</style>

<style lang="less">
.form-item-user {
  .el-form-item__label {
    padding-right: 0 !important;
  }
}
.detail-identify-form {
  .el-form-item__content {
    color: rgba(0, 0, 0, .4);
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
}
.handler-btns {
  .el-form-item__content {
    margin-left: 0;
  }
}
</style>
