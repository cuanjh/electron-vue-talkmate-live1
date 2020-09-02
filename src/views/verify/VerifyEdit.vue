<template>
  <el-container>
    <el-header class="add-identify-header">
      <div class="title">
        输入认证信息，开启精彩直播！
      </div>
      <div class="right">
        <a href="javascript:;">《教师使用指南》</a>
        <span>专属客服微信：quanqiushuo</span>
      </div>
    </el-header>
    <el-main class="main-content">
      <div class="title">这里是全球说教师直播平台，你可以在这里直播课程、管理课程，成为正式的直播教师前，您需要填写以下资料：</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        size="small"
        label-width="90px"
        class="add-identify-form">
        <div class="form-row">
          <div class="form-col">
            <div class="form-item-user">
              <edit-photo></edit-photo>
              <edit-nickname></edit-nickname>
            </div>
            <el-form-item label="真实姓名" prop="real_name">
              <el-input v-model="ruleForm.real_name"></el-input>
            </el-form-item>
            <el-form-item class="IDType" label="证件类型" prop="identity_card">
              <el-select v-model="ruleForm.certificate_type" placeholder="请选择证件类型">
                <el-option label="身份证" value="1"></el-option>
                <el-option label="护照" value="2"></el-option>
              </el-select>
              <el-input
              v-model="ruleForm.identity_card"
              :maxlength="ruleForm.certificate_type == 1 ? 18 : 30"></el-input>
            </el-form-item>
            <el-form-item prop="nationality">
              <label slot="label">国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;籍</label>
              <el-input v-model="ruleForm.nationality"></el-input>
            </el-form-item>
            <el-form-item prop="gender">
              <label slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</label>
              <el-select v-model="ruleForm.gender" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="birth_date">
              <label slot="label">出生日期</label>
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.birth_date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="现居住地" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="授课昵称" prop="live_nickname">
              <el-input v-model="ruleForm.live_nickname"></el-input>
            </el-form-item>
            <el-form-item label="直播语种" prop="lan_code">
              <el-select multiple v-model="ruleForm.lan_code" filterable placeholder="请选择直播语种">
                <el-option
                v-for="item in langs"
                :key="item.lan_code"
                :label="item.title['zh-CN']"
                :value="item.lan_code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="个人简介" prop="introduction">
              <el-input
              type="textarea"
              :rows="4"
              placeholder="建议写擅长语种、科目、喜好、经验等"
              v-model="ruleForm.introduction"></el-input>
            </el-form-item>
            <el-form-item class="agreement" prop="isCheckedAgreement">
              <el-checkbox v-model="ruleForm.isCheckedAgreement">
                <div class="desc" v-html="protocolDesc"></div>
              </el-checkbox>
            </el-form-item>
          </div>

          <div class="form-col">
            <div class="ID-images">
              <el-form-item width="auto" prop="certificate_front">
                <el-upload
                  class="upload-demo"
                  action="#"
                  accept="image/jpeg,image/jpg,image/png"
                  :on-change="changeUploadFront"
                  :show-file-list="false"
                  :auto-upload="false"
                >
                  <div class="item" v-if="ruleForm.certificate_front">
                    <el-image
                      style="width: 100%; height: 100%;"
                      :src="uploadDomain + ruleForm.certificate_front"
                      fit="cover"></el-image>
                  </div>
                  <div class="item" v-else>
                    <div class="title">
                      {{ ruleForm.certificate_type == 1 ? '上传手持身份证照' : '上传手持护照' }}
                    </div>
                    <div class="desc">
                      {{  ruleForm.certificate_type == 1 ? '请手持身份证上传，此处上传有国徽面' : '请手持护照上传，此处上传正面' }}
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item width="auto" prop="certificate_back">
                <el-upload
                  class="upload-demo"
                  action="#"
                  accept="image/jpeg,image/jpg,image/png"
                  :on-change="changeUploadBack"
                  :show-file-list="false"
                  :auto-upload="false"
                >
                <div class="item" v-if="ruleForm.certificate_back">
                    <el-image
                      style="width: 100%; height: 100%;"
                      :src="uploadDomain + ruleForm.certificate_back" fit="cover"></el-image>
                </div>
                <div class="item" v-else>
                  <div class="title">
                    {{  ruleForm.certificate_type == 1 ? '上传手持身份证照' : '上传手持护照' }}
                  </div>
                  <div class="desc">
                    {{  ruleForm.certificate_type == 1 ? '请手持身份证上传，此处上传有头像面' : '请手持护照上传，此处上传反面' }}
                  </div>
                </div>
              </el-upload>
              </el-form-item>
            </div>
            <div class="handler-btns">
              <el-button type="primary" @click="submitForm('ruleForm')">提交审核</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

import config from '@/utils/config';
import EditPhoto from '@/components/EditPhoto/EditPhoto.vue';
import EditNickname from '@/components/EditNickname/EditNickname.vue';

import {
  getQiniuUploadToken,
  getCourseLangs,
  addIdentifyInfo,
  editIdentifyInfo,
  editUserNickname,
} from '@/api/live';

import uploadQiniu from '@/utils/uploadQiniu';

export default {
  data() {
    return {
      uploadDomain: config.uploadDomain,
      identifyInfo: this.userInfo,
      langs: [],
      isEditNN: false,
      token: '',
      status: '',
      protocolDesc: '勾选代表同意<a href="javascript:;">《全球说直播课教师合作协议》</a>，同时给您开通全球说账号， 需要您同意全球说<a href="javascript:;">《用户协议》</a>和全球说<a href="javascript:;">《隐私政策》</a>，以上内容承诺真实有效。',
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
        lan_code: [],
        introduction: '',
        isCheckedAgreement: '',
        certificate_front: '',
        certificate_back: '',
      },
      rules: {
        real_name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        certificate_type: [
          { required: true, message: '请选择证件类型', trigger: 'change' },
        ],
        identity_card: [
          { required: true, message: '请输入证件号', trigger: 'blur' },
        ],
        nationality: [
          { required: true, message: '请输入国籍', trigger: 'blur' },
        ],
        live_nickname: [
          { required: true, message: '请输入授课昵称', trigger: 'blur' },
        ],
        lan_code: [
          { required: true, message: '请选择直播语种', trigger: 'change' },
        ],
        isCheckedAgreement: [
          { required: true, message: '请勾选协议', trigger: 'change' },
        ],
        certificate_front: [
          { required: true, message: '请上传证件正面', trigger: 'change' },
        ],
        certificate_back: [
          { required: true, message: '请上传证件反面', trigger: 'change' },
        ],
      },
    };
  },
  components: {
    EditPhoto,
    EditNickname,
  },
  mounted() {
    getQiniuUploadToken().then((res) => {
      if (res.success) {
        this.token = res.token;
      }
    });
    getCourseLangs().then((res) => {
      if (res.success) {
        this.langs = res.data.allLangs.sort((a, b) => {
          const o = b.is_hot - a.is_hot;
          return o;
        });
        console.log(this.langs);
      }
    });

    if (this.userInfo) {
      console.log(this.userInfo);
      this.status = this.userInfo.status;
      this.ruleForm.user_id = this.userInfo.user_id;
      this.ruleForm.photo = this.userInfo.photo;
      this.ruleForm.nickname = this.userInfo.nickname;
      this.ruleForm.phonenumber = this.userInfo.phonenumber;
      this.ruleForm.real_name = this.userInfo.real_name;
      this.ruleForm.certificate_type = this.userInfo.certificate_type ? this.userInfo.certificate_type : '1';
      this.ruleForm.identity_card = this.userInfo.identity_card;
      this.ruleForm.nationality = this.userInfo.nationality;
      this.ruleForm.gender = this.userInfo.gender;
      this.ruleForm.birth_date = this.userInfo.birth_date;
      this.ruleForm.address = this.userInfo.address;
      this.ruleForm.live_nickname = this.userInfo.live_nickname;
      if (this.userInfo.lan_code) {
        this.ruleForm.lan_code = this.userInfo.lan_code;
      }
      this.ruleForm.introduction = this.userInfo.introduction;
      this.ruleForm.certificate_front = this.userInfo.certificate_front;
      this.ruleForm.certificate_back = this.userInfo.certificate_back;
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const obj = {
            user_id: this.ruleForm.user_id,
            real_name: this.ruleForm.real_name,
            certificate_type: this.ruleForm.certificate_type,
            identity_card: this.ruleForm.identity_card,
            nationality: this.ruleForm.nationality,
            gender: this.ruleForm.gender,
            birth_date: this.ruleForm.birth_date ? moment(this.ruleForm.birth_date).format('YYYY-MM-DD') : '',
            address: this.ruleForm.address,
            live_nickname: this.ruleForm.live_nickname,
            lan_code: this.ruleForm.lan_code,
            introduction: this.ruleForm.introduction,
            certificate_front: this.ruleForm.certificate_front,
            certificate_back: this.ruleForm.certificate_back,
          };
          let res = null;
          if (this.status === 0) {
            res = await addIdentifyInfo(obj);
          } else {
            res = await editIdentifyInfo(obj);
          }
          if (res.success) {
            this.$message({
              type: 'success',
              message: '提交审核成功',
            });
            this.$router.push({ path: '/verify/detail' });
          }
          return true;
        }
        console.log('error submit!!');
        return false;
      });
    },
    // 上传正面
    changeUploadFront(file) {
      this.changeUpload('certificate_front', file);
    },
    // 上传反面
    changeUploadBack(file) {
      this.changeUpload('certificate_back', file);
    },
    changeUpload(feild, file) {
      const date = new Date();
      const dateStr = moment(date).format('YYYY/MM/DD');
      const i = file.name.lastIndexOf('.');
      const ext = file.name.substring(i + 1);
      const url = `liveroom/images/${dateStr}/${file.uid}.${ext}`;
      uploadQiniu(file.raw, this.token, url).then((res) => {
        console.log(this.uploadDomain + res.key);
        this.$set(this.ruleForm, feild, res.key);
      });
    },
    // 更新用户昵称
    updateNickname() {
      editUserNickname({
        user_id: this.ruleForm.user_id,
        nickname: this.ruleForm.nickname,
      });
    },
    setEditNickname() {
      this.isEditNN = !this.isEditNN;
      if (this.isEditNN) {
        this.$refs.nickname.focus();
      } else {
        this.$refs.nickname.blur();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.add-identify-header {
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

.add-identify-header .title {
  padding-left: 20px;
  font-size: 36px;
  font-family: YouSheBiaoTiHei;
  color: #000000;
}

.add-identify-header .right {
  font-size: 16px;
  font-weight: 400;
  color: #000000;
}

.add-user-identify > .el-main {
  padding: 20px 0 40px 40px;
}

.main-content > .title {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 22px;
}

.add-identify-form {
  margin-top: 60px;
}

.form-row {
  display: flex;
  flex-direction: row;
}

.form-row .form-col:first-child {
  width: 500px;
}

.form-row .form-col:last-child {
  margin-left: 70px;
}
.add-identify-form .form-item-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 47px;
}

.add-identify-form .el-form-item {
  margin-bottom: 24px;
}

.add-identify-form .el-select {
  width: 100%;
}

.IDType .el-select {
  width: 109px;
  margin-right: 20px;
}

.handler-btns {
  text-align: center;
  margin-top: 272px;
}

.handler-btns .el-button {
  width: 150px;
}

.ID-images .item {
  width: 370px;
  height: 233px;
  background: rgba(68,114,196,0.05);
  border: 1px dashed rgba(0,0,0,0.21);
  border-radius: 6px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ID-images .item:first-child {
  margin-bottom: 5px;
}

.ID-images .item .title{
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}

.ID-images .item .title::before {
  content: '*';
  color: #F56C6C;
}

.ID-images .item .desc{
  opacity: 0.4;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  line-height: 20px;
  margin-top: 40px;
}

.agreement {
  color: #000000;
  font-weight: 400;
  margin-top: 70px !important;
}
.agreement .el-radio {
  margin-right: 0;
  margin-top: 2px;
}

.agreement .desc {
  width: 497px;
  height: 34px;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  line-height: 17px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

<style lang="less">
.add-identify-form {
  .el-input--small .el-input__inner {
    height: 36px;
    line-height: 36px;
  }

  .el-form-item__label {
    color: #000000;
    font-weight: 500;
    font-size: 16px;
  }

  .el-form-item__content {
    width: 370px;
    margin-left: 148px !important;
  }
}

.IDType {
  .el-input {
    flex: 1;
  }

  .el-form-item__content {
    display: flex;
    flex-direction: row;
  }
}

.ID-images {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}

.agreement {
  .el-form-item__content {
    margin-left: 0px !important;
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .agreement .el-radio__inner {
    width: 12px;
    height: 12px;
  }
  .agreement .el-radio__label {
    font-size: 12px;
  }
}
</style>
