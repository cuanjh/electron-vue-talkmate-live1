<template>
  <el-dialog
    class="dialog-files"
    :visible.sync="dialogVisibleFiles"
    :modal-append-to-body="false"
    :show-close="false"
    width="50%">
    <div slot="title">
      <div class="dialog-title-bar">
        <div class="title">我的课件</div>
        <div class="operate">
          <i class="refresh el-icon-refresh" @click="refreshCourseFiles"></i>
          <i class="close el-icon-close" @click="closeFileDialog"></i>
        </div>
      </div>
    </div>
    <div class="operate">
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="changeUploadFile"
        :show-file-list="false"
        :auto-upload="false"
        :multiple="false">
        <el-button type="primary" icon="el-icon-upload" size="small">上传课件</el-button>
      </el-upload>
    </div>
    <el-table
      :data="courseFiles"
      style="width: 100%">
      <el-table-column
        label="文件名称"
        width="250">
        <template slot-scope="scope">
          <span class="file-title">
            <i :class="{
              'ppt': scope.row.title.indexOf('ppt') > -1,
              'word': scope.row.title.indexOf('doc') > -1,
              'mp4': scope.row.title.indexOf('mp4') > -1}">
            </i>
          {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="页数">
        <template slot-scope="scope">
          {{ scope.row.event_data ? scope.row.event_data.pages : 0 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        :formatter="formatterFileSize">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text"
            :disabled="!scope.row.event_data ||
            fileInfoList.filter(item => { return scope.row.event_data
              && item.title === scope.row.event_data.title }).length > 0"
            @click="openFile(scope.row)">{{fileInfoList.filter(item => { return scope.row.event_data
            && item.title === scope.row.event_data.title }).length > 0
            ? '已打开' : '打开'}}</el-button>
          <el-button type="text" :disabled="fileInfoList.filter(item => {
            return scope.row.event_data && item.title === scope.row.event_data.title }).length > 0"
            @click="delFile(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import moment from 'moment';

import rand from '@/utils/rand';
import fileSize from '@/utils/fileSize';

import {
  courseFileList,
  delCourseFile,
  getQiniuUploadToken,
  createFilesTranscode,
  describeTranscode,
} from '@/api/live';

import uploadQiniu from '@/utils/uploadQiniu';

export default {
  props: ['fileInfoList'],
  data() {
    return {
      dialogVisibleFiles: false,
      token: '',
      courseFiles: [],
    };
  },
  methods: {
    show() {
      getQiniuUploadToken().then((res) => {
        if (res.success) {
          this.token = res.token;
        }
      });
      this.loadFiles();
      this.dialogVisibleFiles = true;
    },
    loadFiles() {
      this.courseFiles = [];
      courseFileList({ live_uuid: this.$store.getters.curLiveCourse.uuid }).then((res) => {
        console.log(res);
        if (res.success && res.data) {
          this.courseFiles = res.data;
        }
      });
    },
    refreshCourseFiles() {
      this.loadFiles();
    },
    closeFileDialog() {
      this.dialogVisibleFiles = false;
    },
    changeUploadFile(file) {
      console.log(file);
      const date = new Date();
      const dateStr = moment(date).format('YYYY/MM/DD');
      const i = file.name.lastIndexOf('.');
      const name = file.name.substring(0, i);
      const ext = file.name.substring(i + 1);
      const url = `liveroom/files/${this.roomId}/${dateStr}/${name}_${rand(2)}.${ext}`;
      let fileType = '';
      switch (ext.toLowerCase()) {
        case 'ppt':
        case 'pptx':
          fileType = 'ppt';
          break;
        case 'doc':
        case 'docx':
          fileType = 'word';
          break;
        case 'pdf':
          fileType = 'pdf';
          break;
        case 'mp4':
          fileType = 'video';
          break;
        case 'mp3':
          fileType = 'audio';
          break;
        default:
          fileType = 'image';
          break;
      }
      uploadQiniu(file.raw, this.token, url).then(() => {
        const obj = {
          file_url: url,
          live_uuid: this.$store.getters.curLiveCourse.uuid,
          size: file.size,
          title: file.name,
          type: fileType,
        };
        console.log(obj);
        createFilesTranscode(obj).then((r) => {
          this.loadFiles();
          if (r.success && r.data) {
            const timerFiles = setInterval(() => {
              describeTranscode({ task_id: r.data.TaskId }).then((r1) => {
                if (r1.success && r1.data) {
                  if (r1.data.Progress === 100) {
                    clearInterval(timerFiles);
                    this.loadFiles();
                  }
                }
              });
              console.log('timerFiles');
            }, 5000);
          }
        });
      });
    },
    formatterFileSize(row, column, cellValue) {
      return fileSize(cellValue);
    },
    openFile(row) {
      if (!row.event_data) {
        return;
      }
      const config = {
        url: row.event_data.result_url,
        title: row.event_data.title,
        pages: row.event_data.pages,
        resolution: row.event_data.resolution,
      };
      console.log('transcodeFile:', config);
      this.$emit('openFile', config);
      this.dialogVisibleFiles = false;
    },
    delFile(row) {
      this.$confirm('确认要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delCourseFile({ live_uuid: row.live_uuid, uuid: row.uuid }).then((res) => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.loadFileList();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-files .operate {
  text-align: right;
}

.dialog-title-bar {
  background: #eeeeee;
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-radius: 6px 6px 0 0;
}

.dialog-title-bar .title {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
}

.dialog-title-bar .operate i{
  color: rgba(0,0,0,.4);
  font-weight: bolder;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.dialog-title-bar .operate .close {
  margin-left: 20px;
}

.file-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.file-title i {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
}

.file-title .ppt {
  background-image: url('../../assets/images/room/icon-ppt.svg');
}

.file-title .word {
  background-image: url('../../assets/images/room/icon-word.svg');
}

.file-title .mp4 {
  background-image: url('../../assets/images/room/icon-mp4.svg');
}
</style>

<style lang="less">
.dialog-files .el-dialog__header{
  padding: 0;
}
</style>
