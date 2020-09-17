<template>
  <div class="tiw-container">
    <div class="toolbar">
      <ul class="tool-options">
        <li class="tool-size">
          <ul class="size-menu" v-show="false">
            <li class="size-item active" data-index="1">A <div class="line"></div></li>
            <li class="size-item " data-index="2">A <div class="line"></div></li>
            <li class="size-item " data-index="3">A <div class="line"></div></li>
            <li class="size-item " data-index="4">A <div class="line"></div></li>
            <li class="size-item " data-index="5">A <div class="line"></div></li>
          </ul>
        </li>
        <li class="tool-color"
          @mouseenter="isShowColorMenu=true"
          @mouseleave="isShowColorMenu=false">
          <transition name="fade" mode="out-in">
            <ul class="color-menu" v-show="isShowColorMenu">
              <li
                :class="['color-item', {'active': selColorMenu == color}]"
                v-for="color in colorMenus"
                :key="color"
                :data-index="color"
                @click="onSetBrushColor(color)">
                <div class="circle"></div>
              </li>
            </ul>
          </transition>
        </li>
        <el-divider></el-divider>
        <el-tooltip
          v-for="t in tools"
          :key="t.id" class="item"
          effect="dark"
          :content="t.content"
          placement="right">
          <li :id="t.id"
          :class="['tool-item', t.cls, {'active': selBoardOption == t.operate}]"
          v-show="t.isShow"
          @click="handleBoardOptions(t.operate)"></li>
        </el-tooltip>
      </ul>
      <ul class="room-toolbar" v-show="false">
        <li id="selector_switch" class="tool-select tool-item"></li>
        <li id="trophy_switch" class="tool-trophy tool-item"></li>
      </ul>
    </div>
    <div class="tiw-content">
      <div class="top-bar">
        <div class="left">
          <i class="el-icon-caret-left prev"></i>
          <i class="el-icon-caret-right next"></i>
          <a
            @click="onClickBoardTab(file)"
            :class="['btn-tiw', {'active': currentFileId == file.fid }]"
            href="javascript:;" v-for="(file, index) in fileInfoList"
            :key="'file' + index">
            <span>{{ file.title == '#DEFAULT' ? '白板' : file.title }}</span>
            <i class="el-icon-close" v-if="index > 0" @click="onDeleteFileById(file.fid)"></i>
          </a>
        </div>
        <div class="right">
          <div class="media">
            <i></i>多媒体
          </div>
          <div class="line"></div>
          <div class="files" @click="openFiles">
            <i></i>打开课件
          </div>
        </div>
      </div>
      <div id="paint_box" v-show="isShowPaintBox"
        :style="{width: boardSize.width + 'px', height: boardSize.height + 'px'}">
      </div>
      <div id="course_pages" class="course-pages"
        v-show="currentFileId && currentFileId !== '#DEFAULT'">
        <div class="left">
          <div class="c-select wb-page-select" @mouseleave="isShowPageMenu = false">
              <div class="c-select_selection"
              @click="isShowPageMenu = true">
                {{ boardData.current + '/' + boardData.total}}
                <i class="el-icon-arrow-up"></i></div>
              <transition name="fade" mode="out-in">
                <ul role="listbox"
                  class="u-scrollbar c-select_dropdown-menu" v-show="isShowPageMenu">
                  <li v-for="(c, i) in boardData.total"
                    :key="c" @click="onClickBoardPage(i)"
                    class="c-select_dropdown-menu_item">{{ c + '/' + boardData.total}}</li>
                </ul>
              </transition>
            </div>
        </div>
        <div class="center">
          <el-tooltip class="item" effect="dark" content="上一页" placement="top">
            <a class="page-turn" @click="prevBoard"><i class="el-icon-arrow-left"></i></a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="上一步" placement="top">
            <a class="step-turn" @click="prevStep"><i class="el-icon-caret-left"></i></a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下一步" placement="top">
            <a class="step-turn" @click="nextStep"><i class="el-icon-caret-right"></i></a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下一页" placement="top">
            <a class="page-turn" @click="nextBoard"><i class="el-icon-arrow-right"></i></a>
          </el-tooltip>
        </div>
        <div class="right"></div>
      </div>
    </div>
    <files ref="files" :fileInfoList="fileInfoList" @openFile="openFile"/>
  </div>
</template>

<script>
import Files from './Files.vue';

let teduBoard = null;

export default {
  data() {
    return {
      tiwWidth: 0,
      tiwHeight: 0,
      isShowPaintBox: true,
      tools: [
        {
          id: 'Drag', cls: 'tool-default', operate: 'drag', content: '移动', isShow: true,
        },
        {
          id: 'Pen', cls: 'tool-pen', operate: 'pen', content: '画笔', isShow: true,
        },
        {
          id: 'Rect', cls: 'tool-rect', operate: 'rect', content: '矩形', isShow: true,
        },
        {
          id: 'Triangle', cls: 'tool-triangle', operate: 'triangle', content: '三角', isShow: false,
        },
        {
          id: 'Circle', cls: 'tool-circle', operate: 'circle', content: '圆形', isShow: true,
        },
        {
          id: 'Line', cls: 'tool-line', operate: 'line', content: '实线', isShow: true,
        },
        {
          id: 'Dashed', cls: 'tool-dashed', operate: 'dashed', content: '虚线', isShow: true,
        },
        {
          id: 'IText', cls: 'tool-text', operate: 'text', content: '文字输入', isShow: true,
        },
        {
          id: 'Arrow', cls: 'tool-arrow', operate: 'arrow', content: '箭头', isShow: true,
        },
        {
          id: 'Eraser', cls: 'tool-eraser', operate: 'eraser', content: '橡皮擦', isShow: true,
        },
        {
          id: 'Pointer', cls: 'tool-pointer', operate: 'laser', content: '激光笔', isShow: true,
        },
        {
          id: 'ClearAll', cls: 'tool-clear', operate: 'clearAll', content: '清屏', isShow: true,
        },
        {
          id: 'Snapshot', cls: 'tool-snapshot', operate: 'snapshot', content: '保存板书', isShow: false,
        },
      ],
      colorMenus: ['#0091DB', '#FD15AF', '#000000', '#FFFFFF', '#18BF00', '#FF453F', '#FFA500', '#9C9C9C', '#FFFF00'],
      selColorMenu: '#FF453F',
      isShowColorMenu: false,
      isShowPageMenu: false,
      selBoardOption: '',

      currentFileId: null, // 当前文件Id
      fileInfoList: [], // 所有文件信息
      thumbUrls: [], // 缩略图

      // board(白板操作)
      boardData: {
        currentBoardId: null, // 当前白板ID
        boardIdlist: [], // 白板ID列表
        current: 0, // 当前白板index
        total: 0, // 总页数
      },
    };
  },
  components: {
    Files,
  },
  mounted() {
    window.onresize = () => {
      this.resize();
    };
  },
  watch: {
    boardSize(nVal, oVal) {
      console.log(nVal, oVal);
      if (nVal.width !== oVal.width || nVal.height !== oVal.height) {
        if (teduBoard) {
          teduBoard.resize();
        }
      }
    },
  },
  computed: {
    boardSize() {
      let width = this.tiwWidth;
      let height = parseInt((9 * width) / 16, 10);
      if (height > this.tiwHeight) {
        height = this.tiwHeight;
        width = parseInt((16 * height) / 9, 10);
      }
      if (width > this.tiwWidth) {
        width = this.tiwWidth;
        height = parseInt((9 * width) / 16, 10);
      }
      return {
        height,
        width,
      };
    },
  },
  methods: {
    show(params) {
      console.log(params);
      this.resize();
      const initParams = {
        id: 'paint_box', // dom节点id
        classId: params.roomId, // 课堂 ID，32位整型，取值范围[1, 4294967294]
        sdkAppId: params.sdkAppId, // 整数
        userId: this.$store.getters.userId, // 字符串
        userSig: params.userSig, // 字符串
        ratio: '16:9',
        smoothLevel: 0,
        boardContentFitMode: 1,
        toolType: 1,
        progressEnable: true,
        progressBarUrl: 'https://resources-tiw.qcloudtrtc.com/board/icons/Gear-0.2s-48px.png',
      };
      teduBoard = new window.TEduBoard(initParams);
      // 监听白板事件
      this.subscribe();
      // console.log(teduBoard);
    },
    resize() {
      if (document.querySelector('.self-dialog')) {
        this.tiwWidth = document.querySelector('.self-dialog').clientWidth - 428;
        this.tiwHeight = document.querySelector('.self-dialog').clientHeight - 246;
      }
    },
    // 监听白板事件
    subscribe() {
      // 撤销状态改变
      teduBoard.on(window.TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable) => {
        this.canUndo = enable ? 1 : 0;
        console.log('======================:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销');
      });

      // 重做状态改变
      teduBoard.on(window.TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable) => {
        this.canRedo = enable ? 1 : 0;
        console.log('======================:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复');
      });

      // 新增白板
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDBOARD, (boardIds, fid) => {
        console.log('======================:  ', 'TEB_ADDBOARD', ' boardIds:', boardIds, ' fid:', fid);
        this.proBoardData();
      });

      // 白板同步数据回调(收到该回调时需要将回调数据通过信令通道发送给房间内其他人，接受者收到后调用AddSyncData接口将数据添加到白板以实现数据同步)
      // TIC已经处理好了，可忽略该事件
      teduBoard.on(window.TEduBoard.EVENT.TEB_SYNCDATA, (data) => {
        console.log('======================:  ', 'TEB_SYNCDATA', data);
      });

      // 收到白板初始化完成事件后，表示白板已处于正常工作状态（此时白板为空白白板，历史数据尚未拉取完成）
      teduBoard.on(window.TEduBoard.EVENT.TEB_INIT, () => {
        console.log('======================:  ', 'TEB_INIT');
        console.log('TIC', 'onTEBInit finished');
      });

      teduBoard.on(window.TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
        console.log('======================:  ', 'TEB_HISTROYDATA_SYNCCOMPLETED');
        console.log('TIC', 'onTEBHistory Sync Completed finished');
      });

      // 白板错误回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
        this.isShowPaintBox = false;
        console.error('======================:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg);
        this.$message({
          type: 'error',
          message: `onTEBError code=${code} msg:${msg}`,
        });
      });
      // 白板警告回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
        console.error('======================:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg);
        this.$message({
          type: 'error',
          message: `onTEBWarning code=${code} msg: ${msg}`,
        });
      });

      // 图片状态加载回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_IMAGE_STATUS_CHANGED, (status, data) => {
        console.log('======================:  ', 'TEB_IMAGE_STATUS_CHANGED', ' status:', status, ' data:', data);
      });

      // 删除白板页回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_DELETEBOARD, (boardIds, fid) => {
        console.log('======================:  ', 'TEB_DELETEBOARD', ' boardIds:', boardIds, ' fid:', fid);
        this.proBoardData();
      });

      // 跳转白板页回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
        console.log('======================:  ', 'TEB_GOTOBOARD', ' boardId:', boardId, ' fid:', fid);
        console.log(teduBoard.getFileInfo(fid));
        this.proBoardData();
      });

      // ppt动画步数改变回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_GOTOSTEP, (step, count) => {
        console.log('======================:  ', 'TEB_GOTOSTEP', ' step:', step, ' count:', count);
      });

      // 增加H5动画PPT文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDH5PPTFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDH5PPTFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 增加文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 增加转码文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDTRANSCODEFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDTRANSCODEFILE', ' fid:', fid, teduBoard.getCurrentFile());
        this.proBoardData();
      });
      // 增加Images文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDIMAGESFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDIMAGESFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 删除文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_DELETEFILE, (fid) => {
        console.log('======================:  ', 'TEB_DELETEFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 文件上传状态
      teduBoard.on(window.TEduBoard.EVENT.TEB_FILEUPLOADSTATUS, (status, data) => {
        console.log('======================:  ', 'TEB_FILEUPLOADSTATUS', status, data);
        if (status === 1) {
          this.notify('上传成功');
        } else {
          this.notify('上传失败');
        }
        document.getElementById('file_input').value = '';
      });

      // 切换文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_SWITCHFILE, (fid) => {
        console.log('======================:  ', 'TEB_SWITCHFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 上传背景图片的回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_SETBACKGROUNDIMAGE, (fileName, fileUrl, userData) => {
        console.log('======================:  ', 'TEB_SETBACKGROUNDIMAGE', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
      });

      // 增加图片元素
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDIMAGEELEMENT, (fileName, fileUrl, userData) => {
        console.log('======================:  ', 'TEB_ADDIMAGEELEMENT', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
      });

      // 文件上传进度
      teduBoard.on(window.TEduBoard.EVENT.TEB_FILEUPLOADPROGRESS, (data) => {
        console.log('======================:  ', 'TEB_FILEUPLOADPROGRESS:: ', data);
        this.$message({
          type: 'success',
          message: `上传进度: ${parseInt(data.percent * 100, 10)}%`,
        });
      });

      // H5背景加载状态
      teduBoard.on(window.TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
        console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
      });

      // 转码进度
      teduBoard.on(window.TEduBoard.EVENT.TEB_TRANSCODEPROGRESS, (res) => {
        console.log('=======  TEB_TRANSCODEPROGRESS 转码进度：', JSON.stringify(res));
        if (res.code) {
          this.$message({
            type: 'error',
            message: `转码失败code: ${res.code} message: ${res.message}`,
          });
        } else {
          let config = null;
          switch (res.status) {
            case 'ERROR':
              this.$message({
                type: 'error',
                message: '转码失败',
              });
              break;
            case 'UPLOADING':
              this.$message({
                type: 'success',
                message: `上传中，当前进度: ${parseInt(res.progress, 10)}%`,
              });
              break;
            case 'CREATED':
              this.$message({
                type: 'success',
                message: '创建转码任务',
              });
              break;
            case 'QUEUED':
              this.$message({
                type: 'success',
                message: '正在排队等待转码',
              });
              break;
            case 'PROCESSING':
              this.$message({
                type: 'success',
                message: `转码中，当前进度: ${res.progress}%`,
              });
              break;
            default:
              this.$message({
                type: 'success',
                message: '转码完成',
              });
              config = {
                url: res.resultUrl,
                title: res.title,
                pages: res.pages,
                resolution: res.resolution,
              };
              console.log('transcodeFile:', config);
              teduBoard.addTranscodeFile(config);
              break;
          }
        }
      });

      // 框选如果有选中内容则会触发此事件
      // teduBoard.on(TEduBoard.EVENT.TEB_RECTSELECTED, () => {
      //   this.teduBoard.clear(false, true); // 清空选中的内容
      // });

      // 监听增加元素事件
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDELEMENT, ({
        id,
        userData,
      }) => {
        console.log('id:', id, ' userData:', userData);
      });
    },
    /**
     * 白板事件回调处理
     * @param {*} data
     */
    proBoardData() {
      this.fileInfoList = teduBoard.getFileInfoList();
      this.currentFileId = teduBoard.getCurrentFile();
      this.thumbUrls = teduBoard.getThumbnailImages(this.currentFileId);
      const fileInfo = teduBoard.getFileInfo(this.currentFileId);
      if (fileInfo) {
        this.boardData = {
          currentBoardId: this.currentFileId,
          boardIdlist: teduBoard.getFileBoardList(this.currentFileId),
          current: fileInfo.currentPageIndex + 1,
          total: fileInfo.pageCount,
        };
      }
    },
    // 设置画笔颜色
    onSetBrushColor(color) {
      this.selColorMenu = color;
      teduBoard.setBrushColor(color);
    },
    onDeleteFileById(fid) {
      if (fid === '#DEFAULT') {
        this.$message({
          type: 'error',
          message: '缺省文件 不能删除!',
        });
        return;
      }
      teduBoard.deleteFile(fid);
    },
    onClickBoardTab(targetTab) {
      teduBoard.switchFile(targetTab.fid);
    },
    onClickBoardPage(index) {
      const fileId = teduBoard.getCurrentFile();
      const boardList = teduBoard.getFileBoardList(fileId);
      const boardId = boardList[index];
      teduBoard.gotoBoard(boardId);
      this.isShowPageMenu = false;
    },
    // 白板相关操作
    handleBoardOptions(option) {
      this.selBoardOption = option;
      let boardToolType = '';
      switch (option) {
        // 画笔
        case 'drag':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_POINT_SELECT;
          teduBoard.setToolType(boardToolType);
          break;
        // 画笔
        case 'pen':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_PEN;
          teduBoard.setToolType(boardToolType);
          break;
        // 矩形
        case 'rect':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_RECT;
          teduBoard.setToolType(boardToolType);
          break;
        // 圆形
        case 'circle':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_OVAL;
          teduBoard.setToolType(boardToolType);
          break;
        // 实线
        case 'line':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_LINE;
          teduBoard.setToolType(boardToolType);
          teduBoard.setLineStyle({
            lineType: window.TEduBoard.LINE_TYPE.TEDU_BOARD_LINE_TYPE_SOLID,
            endArrowType: window.TEduBoard.ARROW_TYPE.TEDU_BOARD_ARROW_TYPE_NONE,
          });
          break;
        // 虚线
        case 'dashed':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_LINE;
          teduBoard.setToolType(boardToolType);
          teduBoard.setLineStyle({
            lineType: window.TEduBoard.LINE_TYPE.TEDU_BOARD_LINE_TYPE_DOTTED,
            endArrowType: window.TEduBoard.ARROW_TYPE.TEDU_BOARD_ARROW_TYPE_NONE,
          });
          break;
        // 文字输入
        case 'text':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_TEXT;
          teduBoard.setToolType(boardToolType);
          break;
        // 箭头
        case 'arrow':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_LINE;
          teduBoard.setToolType(boardToolType);
          teduBoard.setLineStyle({
            lineType: window.TEduBoard.LINE_TYPE.TEDU_BOARD_LINE_TYPE_SOLID,
            endArrowType: window.TEduBoard.ARROW_TYPE.TEDU_BOARD_ARROW_TYPE_NORMAL,
          });
          break;
        // 橡皮擦
        case 'eraser':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_ERASER;
          teduBoard.setToolType(boardToolType);
          break;
        // 激光笔
        case 'laser':
          boardToolType = window.TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_LASER;
          teduBoard.setToolType(boardToolType);
          break;
        // 清屏
        case 'clearAll':
          teduBoard.clear();
          break;
        default:
          break;
      }
    },
    openFiles() {
      const course = this.$store.getters.curLiveCourse;
      if (!course) {
        this.$message({
          type: 'warning',
          message: '体验课不能打开课件！',
        });
        return;
      }
      this.$refs.files.show();
      // this.loadFileList();
      // this.dialogVisibleFiles = true;
    },
    openFile(config) {
      teduBoard.addTranscodeFile(config);
    },
    // 动画上一步
    prevStep() {
      teduBoard.prevStep();
    },

    // 动画下一步
    nextStep() {
      teduBoard.nextStep();
    },

    /**
     * 上一页
     */
    prevBoard() {
      teduBoard.prevBoard();
    },

    /**
     * 下一页
     */
    nextBoard() {
      teduBoard.nextBoard();
    },
  },
};
</script>

<style lang="less" scoped>
.tiw-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding-bottom: 36px;
}

.tiw-container .toolbar {
  display: flex;
  flex-direction: column;
}

#paint_box {
  background: #FFFFFF;
  margin: 0 auto;
}

.el-divider {
  margin: 10px 0;
}

.toolbar .tool-options {
  position: relative;
  color: #9e9e9e;
  background: #fff;
  border-radius: 0 4px 4px 0;
  border: 1px solid #fff;
  box-shadow: 5px 10px 20px 2px rgba(0,0,0,.1);
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.toolbar .tool-options {
  height: 100%;
}

.toolbar .tool-item, .tool-color, .tool-size {
  width: 24px;
  height: 24px;
  list-style: none;
  text-align: center;
  cursor: pointer;
  position: relative;
  background: url('../../assets/images/room/toolbar-tiw.png') no-repeat 0 0 e('/') 52px;
}

.tool-color {
  background-position: 0 -28px;
}

.toolbar .tool-default {
  background-position: 0 -56px;
}
.toolbar .tool-pen {
  background-position: 0 -84px;
}

.toolbar .tool-rect {
  background-position: 0 -112px;
}

.toolbar .tool-triangle {
  background-position: 0 -140px;
}

.toolbar .tool-circle {
  background-position: 0 -168px;
}

.toolbar .tool-line {
  background-position: 0 -196px;
}

.toolbar .tool-dashed {
  background-position: 0 -224px;
}

.toolbar .tool-text {
  background-position: 0 -252px;
}

.toolbar .tool-arrow {
  background-position: 0 -280px;
}

.toolbar .tool-eraser {
  background-position: 0 -308px;
}

.toolbar .tool-pointer {
  background-position: 0 -336px;
}

.toolbar .tool-clear {
  background-position: 0 -364px;
}

.toolbar .tool-snapshot {
  background-position: 0 -392px;
}

.toolbar .tool-select {
  background-position: 0 -420px;
}

.toolbar .tool-trophy {
  background-position: 0 -448px;
}

.tool-options .active {
  background-position-x: -28px;
  background-color: #dad5ff;
  border-radius: 4px;
}

.tool-item:hover, .tool-size:hover, .tool-color:hover{
  background-position-x: -28px;
}

.tiw-content {
  flex: 1;
  margin: 0 36px;
  background: #f8f8f8;
  border-radius: 6px;
  box-shadow: 0px 2px 44px 0px rgba(0,0,0,0.1);
  /* z-index: 1; */
}

.tiw-content .top-bar {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #FFFFFF;
  border-radius: 6px 6px 0 0;
}
.tiw-content .top-bar .left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.tiw-content .top-bar .left i {
  color: #2c2c2c4d;
  font-size: 22px;
}

.tiw-content .top-bar .left .btn-tiw {
  height: 30px;
  background: #ffffff;
  border: 1px solid #979797;
  border-radius: 8px;
  padding: 0 10px;
  margin: 0 10px;
  font-size: 16px;
  font-weight: 500;
  color: #09264e;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tiw-content .top-bar .left .btn-tiw span {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.tiw-content .top-bar .left .btn-tiw i {
  font-size: 18px;
  margin-left: 5px;
}

.tiw-content .top-bar .left .active {
  background: #185fc3;
  color: #ffffff;
}

.tiw-content .top-bar .left .active i {
  color: #ffffff;
}
.course-name {
  width: 160px;
  height: 35px;
  background: #ffffff;
  border: 1px solid #979797;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  color:rgba(0,0,0,0.6);
  line-height: 35px;
  position: relative;
  padding-left: 20px;
  margin-left: 12px;
}

.course-name-close {
  position: absolute;
  right: 4px;
  top: 6px;
}

.right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.media {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, .4);
  margin-right: 32px;
}

.media i {
  width: 32px;
  height: 31px;
  background-image: url('../../assets/images/room/icon-media.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 13px;
}

.right .line {
  width: 1px;
  height: 32px;
  opacity: 0.4;
  border: .5px solid #979797;
}

.files {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, .7);
  display: flex;
  flex-direction: row;
  margin-left: 32px;
  cursor: pointer;
}

.files i {
  width: 32px;
  height: 29px;
  background-image: url('../../assets/images/room/icon-file.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 13px;
}

.color-menu {
  /* display: none; */
  position: absolute;
  left: 40px;
  top: -42px;
  width: 132px;
  padding: 7px;
  background: rgba(44,44,44,.88);
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  z-index: 9;
}

.color-menu::before {
  content: ' ';
  left: -6px;
  top: 50px;
  position: absolute;
  width: 0;
  height:0;
  border-top:6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid rgba(44,44,44,.88);
}

.color-menu .color-item {
  display: inline-block;
  padding: 6px;
  border-radius: 4px;
  line-height: 1;
}

.color-menu .color-item .circle {
  width: 24px;
  height: 24px;
  display: inline-block;
  background: #fff;
  border-radius: 50%;
}

.color-menu .color-item[data-index="#0091DB"] .circle {
  background: #0091db;
}

.color-menu .color-item[data-index="#FD15AF"] .circle {
  background: #fd15af;
}

.color-menu .color-item[data-index="#000000"] .circle {
  background: #000;
}

.color-menu .color-item[data-index="#FFFFFF"] .circle {
  background: #fff;
}

.color-menu .color-item[data-index="#18BF00"] .circle {
  background: #18bf00;
}

.color-menu .color-item[data-index="#FF453F"] .circle {
  background: #ff453f;
}

.color-menu .color-item[data-index="#FFA500"] .circle {
  background: orange;
}

.color-menu .color-item[data-index="#9C9C9C"] .circle {
  background: #9c9c9c;
}

.color-menu .color-item[data-index="#FFFF00"] .circle {
  background: #ff0;
}

.course-pages {
  width: 100%;
  height: 40px;
  margin: auto;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}

.course-pages .left {
  height: 100%;
  width: 30%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.course-pages .center {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.course-pages .right {
  height: 100%;
  width: 30%;
  position: relative;
}

.c-select {
  font-size: 12px;
  width: 80px;
  height: 20px;
}

.c-select, .c-select_dropdown-menu {
  border-radius: 10px;
  border: 1px solid rgba(151,151,151,1);
}

.wb-page-select {
  position: absolute;
  margin-left: 10px;
}

.c-select_selection {
  color: #000000;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  padding-right: 10px;
}

.c-select_selection i {
  position: absolute;
  right: 10px;
  top: 3px;
}

.c-select_dropdown-menu {
  position: absolute;
  width: calc(100% + 2px);
  max-height: 400px;
  bottom: -1px;
  left: -1px;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
}

.c-select_dropdown-menu_item {
  color: #6b6b6b;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  transition: background-color .3s ease;
}

.c-select_dropdown-menu_item:hover {
  background-color: #185fc3;
  color: #ffffff;
}

.course-pages .page-turn {
  position: relative;
  display: inline-block;
  width: 26px;
  height: 26px;
  margin: 0 20px;
  padding: 0;
  border: 1px solid #000000;
  color: #000000;
  border-radius: 50%;
  cursor: pointer;
}

.course-pages .page-turn:hover {
  border-color: #185fc3;
  color: #185fc3;
}

.course-pages .step-turn {
  margin: 0 10px;
  padding: 0;
  border: 0;
  cursor: pointer;
  font-size: 30px;
  line-height: 30px;
  color: #000000;
}

.course-pages .step-turn:hover {
  color: #185fc3;
}
</style>
