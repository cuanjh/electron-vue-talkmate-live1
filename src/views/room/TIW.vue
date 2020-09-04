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
        <el-tooltip class="item" effect="dark" content="移动" placement="right">
          <li id="Edit"
          :class="['tool-default', 'tool-item', {'active': selBoardOption == 'drag'}]"
          @click="handleBoardOptions('drag')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="画笔" placement="right">
          <li id="Pen"
          :class="['tool-pen', 'tool-item', {'active': selBoardOption == 'pen'}]"
          @click="handleBoardOptions('pen')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="矩形" placement="right">
          <li id="Rect"
            :class="['tool-rect', 'tool-item', {'active': selBoardOption == 'rect'}]"
            @click="handleBoardOptions('rect')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="三角" placement="right" v-show="false">
          <li id="Triangle" class="tool-triangle tool-item "></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="圆形" placement="right">
          <li id="Circle"
            :class="['tool-circle', 'tool-item', {'active': selBoardOption == 'circle'}]"
            @click="handleBoardOptions('circle')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="实线" placement="right">
          <li id="Line"
            :class="['tool-line', 'tool-item', {'active': selBoardOption == 'line'}]"
            @click="handleBoardOptions('line')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="虚线" placement="right">
          <li id="Dashed"
            :class="['tool-dashed', 'tool-item', {'active': selBoardOption == 'dashed'}]"
            @click="handleBoardOptions('dashed')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="文字输入" placement="right">
          <li id="IText"
            :class="['tool-text', 'tool-item', {'active': selBoardOption == 'text'}]"
            @click="handleBoardOptions('text')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="箭头" placement="right">
          <li id="Arrow"
            :class="['tool-arrow', 'tool-item', {'active': selBoardOption == 'arrow'}]"
            @click="handleBoardOptions('arrow')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="橡皮擦" placement="right">
          <li id="Eraser"
            :class="['tool-eraser', 'tool-item', {'active': selBoardOption == 'eraser'}]"
            @click="handleBoardOptions('eraser')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="激光笔" placement="right">
          <li id="Pointer"
            :class="['tool-pointer', 'tool-item', {'active': selBoardOption == 'laser'}]"
            @click="handleBoardOptions('laser')"></li>
          </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清屏" placement="right">
          <li id="clearAll"
            :class="['tool-clear', 'tool-item', {'active': selBoardOption == 'clearAll'}]"
            @click="handleBoardOptions('clearAll')"></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="保存板书" placement="right" v-show="false">
          <li id="snapshot" class="tool-snapshot tool-item "></li>
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
      <div id="paint_box">
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
  </div>
</template>

<script>
export default {
  props: ['boardData'],
  data() {
    return {
      colorMenus: ['#0091DB', '#FD15AF', '#000000', '#FFFFFF', '#18BF00', '#FF453F', '#FFA500', '#9C9C9C', '#FFFF00'],
      selColorMenu: '#FF453F',
      isShowColorMenu: false,
      isShowPageMenu: false,
      selBoardOption: '',
      currentFileId: null, // 当前文件Id
      fileInfoList: [], // 所有文件信息
    };
  },
  methods: {
    onSetBrushColor() {},
    onClickBoardTab() {},
    onDeleteFileById() {},
    onClickBoardPage() {},
    handleBoardOptions() {},
    openFiles() {},
    prevBoard() {},
    prevStep() {},
    nextStep() {},
    nextBoard() {},
  },
};
</script>

<style lang="less" scoped>
.tiw-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.tiw-container .toolbar {
  display: flex;
  flex-direction: column;
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
  background: url('../../assets/images/room/toolbar-tiw.png') no-repeat 0 0/52px;
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
  /* flex: 1; */
  margin: 0 auto;
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
</style>
