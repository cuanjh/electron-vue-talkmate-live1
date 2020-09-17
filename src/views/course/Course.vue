<template>
  <el-container id="course-container" class="course-container">
    <el-header class="course-header">
      <div class="year-month">
        <div class="date">{{year}}.{{(month + '').length == 1 ? '0' + month : month}}</div>
        <div class="rili-container">
          <div class="rili" @click="isShowRili = !isShowRili">
            <i></i>
            <span>日历</span>
          </div>
          <transition name="fade" mode="out-in">
            <div class="rili-panel" v-show="isShowRili">
              <div class="rect"></div>
              <div class="top">
                <div class="date">{{year}}.{{(month + '').length == 1 ? '0' + month : month}}</div>
                <div class="switch">
                  <i @click="prevMonth()"></i>
                  <i @click="nextMonth()"></i>
                </div>
              </div>
              <div class="rili-weeks">
                <ul>
                  <li>Mon</li>
                  <li>Tue</li>
                  <li>Wed</li>
                  <li>Thu</li>
                  <li>Fri</li>
                  <li>Sat</li>
                  <li>Sun</li>
                </ul>
              </div>
              <div class="rili-days">
                <div class="row" v-for="(row, ri) in generateRili" :key="'row' + ri">
                  <div class="col"
                    v-for="(col, ci) in row"
                    :key="'col' + ri + '-' + ci"
                    @click="switchDay(col.day)">
                    <span
                      :class="['day',
                        {'cur': '' + year + (month-1) + col.day == '' + (new Date()).getFullYear()
                        + (new Date()).getMonth() + (new Date()).getDate()},
                        {'active': col.day == activeIndex}]">{{ col.day ?
                        (('' + year + (month -1)+ col.day == '' + (new Date()).getFullYear()
                        + (new Date()).getMonth() + (new Date()).getDate()) ? '今' : col.day) : ''}}
                    </span>
                    <span class="dot" v-show="col.isHaveCourse"></span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <el-button type="text" class="device-test" @click="deviceTest">设备监测</el-button>
        <a href="javascript:;"
          class="mock-classroom" @click="mockClassroom">
          <i></i><span>模拟教室</span>
        </a>
      </div>
      <div class="days-container">
        <div class="days">
         <div
            :class="['item',
            {'cur': '' + year + (month-1) + i.day == '' + (new Date()).getFullYear()
            + (new Date()).getMonth() + (new Date()).getDate()
            && (new Date()).getDate() != activeIndex},
            {'active': i.day == activeIndex}]"
            v-for="i in days"
            :key="i.day"
            @click="switchDay(i.day)">
            <div class="week">{{weeks[(new Date(year, month-1, i.day)).getDay()]}}</div>
            <div class="day">{{i.day}}</div>
            <div class="dot" v-show="i.isHaveCourse"></div>
          </div>
        </div>
        <div class="prev" @click="prev"><i></i></div>
        <div class="next" @click="next"><i></i></div>
      </div>
    </el-header>
    <el-main class="main-content">
      <div class="course-list">
        <div class="item" v-for="item in curCourseList" :key="item.uuid">
          <div class="title"><i></i><span>{{item.module_name}}</span></div>
          <div class="sub-title">课时{{item.listOrder}}：{{item.title}}</div>
          <div class="start-date"><i></i><span>上课时间：{{item.period}}</span></div>
          <div class="course-state">
            <i></i>
            <span>课程状态：<b :class="{'isTimer': item.isTimer }">
              {{item.stateDesc}}</b>
            </span>
          </div>
          <div class="bottom">
            <el-button
              v-if="item.state == -1"
              type="plain"
              class="btnPlayback"
              size="mini"
              @click="handlePlayback(item)">课程回放
            </el-button>
            <el-button
              v-else
            type="primary"
            :class="{'disabled': item.disabled }"
            size="mini" @click="entryClassroom(item)">进入教室</el-button>
          </div>
        </div>
      </div>
    </el-main>
    <device-testing ref="deviceTesting"></device-testing>
    <room ref="room"></room>
  </el-container>
</template>

<script>
import moment from 'moment';

import {
  getLiveCourseList,
} from '@/api/live';

import DeviceTesting from '@/components/DeviceTesting/DeviceTesting.vue';
import Room from '../room/Room.vue';

export default {
  data() {
    return {
      isShowRili: false,
      curDate: new Date(),
      activeIndex: (new Date()).getDate(),
      year: (new Date()).getFullYear(),
      month: ((new Date())).getMonth() + 1,
      weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      courseList: [],
      curCourseList: [],
      timers: [],
    };
  },
  components: {
    DeviceTesting,
    Room,
  },
  computed: {
    days() {
      const date = new Date(this.year, this.month, 0);
      const list = [];
      for (let i = 1; i < date.getDate(); i += 1) {
        const obj = {
          day: i,
          isHaveCourse: false,
        };
        if (this.courseList.length) {
          const findIndex = this.courseList.findIndex((item) => {
            const ret = item.date === `${this.year}-${this.addZero(this.month)}-${this.addZero(i)}`;
            return ret;
          });
          if (findIndex > -1) {
            obj.isHaveCourse = true;
          }
        }
        list.push(obj);
      }
      return list;
    },
    generateRili() {
      const rili = [];
      let obj = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < this.days.length; i += 1) {
        let week = new Date(this.year, this.month - 1, (i + 1)).getDay();
        for (let j = 0; j < 7; j += 1) {
          if (week === 0) {
            week = 7;
          }
          if (j === week - 1) {
            obj[j] = {
              day: i + 1,
              isHaveCourse: false,
            };
            if (this.courseList.length) {
              const findIndex = this.courseList.findIndex((item) => {
                const ret = item.date === `${this.year}-${this.addZero(this.month)}-${this.addZero(i + 1)}`;
                return ret;
              });
              if (findIndex > -1) {
                obj[j].isHaveCourse = true;
              }
            }
          }
        }
        if (week === 7 || this.days.length === i + 1) {
          rili.push(obj);
          obj = [0, 0, 0, 0, 0, 0, 0];
        }
      }
      return rili;
    },
  },
  mounted() {
    this.loadData();
    document.body.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.isShowRili = false;
      }
    });
    if (this.activeIndex > 7) {
      const curDom = document.querySelectorAll('.days .item')[this.activeIndex - 1];
      console.log(curDom.offsetLeft);
      const offsetLeft = curDom.offsetLeft - 44;
      document.querySelector('.days').scrollLeft = offsetLeft;
    }
  },
  watch: {
    activeIndex() {
      this.getCurCourseList();
    },
  },
  methods: {
    loadData() {
      const params = {
        start_date: `${this.year}-${this.addZero(this.month)}-01`,
        end_date: `${this.year}-${this.addZero(this.month)}-${this.days.length}`,
        page_index: 1,
        page_size: 9999,
        user_id: this.$store.getters.userId,
      };
      getLiveCourseList(params).then((res) => {
        console.log(res);
        if (res.success && res.data) {
          this.courseList = res.data;
        } else {
          this.courseList = [];
        }
        this.getCurCourseList();
      });
    },
    getCurCourseList() {
      this.curCourseList = [];
      if (this.timers.length) {
        for (let i = 0; i < this.timers.length; i += 1) {
          clearInterval(this.timers[i]);
        }
      }
      let timerNum = -1;
      if (this.courseList.length) {
        this.courseList.forEach((item) => {
          if (item.date === `${this.year}-${this.addZero(this.month)}-${this.addZero(this.activeIndex)}`) {
            const obj = item;
            obj.isTimer = false;
            switch (item.state) {
              case 0:
                obj.stateDesc = '未开始';
                obj.disabled = true;
                obj.period = `${moment(new Date(item.startTime * 1000)).format('HH:mm')}-${moment(new Date(item.EndTime * 1000)).format('HH:mm')}`;
                break;
              case -1:
                obj.stateDesc = '已下课';
                obj.period = `${moment(new Date(item.realStartTime * 1000)).format('HH:mm')}-${moment(new Date(item.realEndTime * 1000)).format('HH:mm')}`;
                break;
              default:
                obj.stateDesc = '上课中';
                obj.period = `${moment(new Date(item.realStartTime * 1000)).format('HH:mm')}-${moment(new Date(item.EndTime * 1000)).format('HH:mm')}`;
                break;
            }
            this.curCourseList.push(obj);
            const count = this.curCourseList.length;
            if (item.state === 0) {
              let leftTime = item.startTime * 1000 - (new Date()).getTime();
              if (leftTime < 0) {
                this.$set(this.curCourseList[count - 1], 'disabled', false);
              }
              if (leftTime > 0 && leftTime < 24 * 60 * 60 * 1000) {
                let stateDesc = `倒计时 ${this.generateHHMMSS(leftTime)}`;
                this.$set(this.curCourseList[count - 1], 'stateDesc', stateDesc);
                this.$set(this.curCourseList[count - 1], 'isTimer', true);
                if (leftTime < 30 * 60 * 1000) {
                  this.$set(this.curCourseList[count - 1], 'disabled', false);
                }
                timerNum += 1;
                let timer = null;
                this.timers[timerNum] = setInterval(() => {
                  leftTime = item.startTime * 1000 - (new Date()).getTime();
                  stateDesc = `倒计时 ${this.generateHHMMSS(leftTime)}`;
                  this.$set(this.curCourseList[count - 1], 'stateDesc', stateDesc);
                  if (leftTime <= 0) {
                    clearInterval(timer);
                    this.$set(this.curCourseList[count - 1], 'isTimer', false);
                  }
                }, 1000);
                timer = this.timers[timerNum];
              }
            }
          }
        });
      }
    },
    entryClassroom(item) {
      console.log(item);
      this.$store.commit('SET_CURLIVECOURSE', item);
      this.$refs.room.show();
      // parent.window.store.set('liveCourseInfo', JSON.stringify(item));
      // parent.window.entryClassroom();
    },
    handlePlayback(item) {
      console.log(item);
    },
    switchDay(i) {
      if (!i) return;
      this.activeIndex = i;
      const domObj = document.querySelector('.days');
      let sl = domObj.scrollLeft;
      console.log('scrollLeft', sl);
      const dayObj = document.querySelectorAll('.days .item')[i - 1];
      const dayOffsetLeft = dayObj.offsetLeft;
      let flag = 'left';
      if (sl - dayOffsetLeft < 0) {
        flag = 'right';
      }
      const intervalInstance = setInterval(() => {
        if (flag === 'left') {
          sl -= 6;
        } else {
          sl += 6;
        }
        if ((flag === 'left' && sl <= dayOffsetLeft) || (flag === 'right' && sl >= dayOffsetLeft)) {
          clearInterval(intervalInstance);
          document.querySelector('.days').scrollLeft = dayOffsetLeft;
        }
        document.querySelector('.days').scrollLeft = sl;
      }, 1);
      this.isShowRili = false;
    },
    prev() {
      this.scrollAnimate('left');
    },
    next() {
      this.scrollAnimate('right');
    },
    scrollAnimate(flag) {
      const domObj = document.querySelector('.days');
      let sl = domObj.scrollLeft;
      const sw = domObj.scrollWidth;
      const ow = domObj.offsetWidth;
      let count = 0;
      const size = 7;
      if (flag === 'left' && sl === 0) {
        this.prevMonth();
      } else if (flag === 'right' && sw === ow + sl) {
        this.nextMonth();
      } else {
        const intervalInstance = setInterval(() => {
          if (flag === 'left') {
            sl -= size;
          } else {
            sl += size;
          }
          document.querySelector('.days').scrollLeft = sl;
          count += size;
          if (count === 140 * 7) {
            clearInterval(intervalInstance);
            count = 0;
          }
        }, 1);
      }
    },
    prevMonth() {
      switch (this.month) {
        case 1:
          this.month = 12;
          this.year -= 1;
          break;
        default:
          this.month -= 1;
          break;
      }
      this.activeIndex = 1;
      document.querySelector('.days').scrollLeft = 0;
      this.loadData();
    },
    nextMonth() {
      switch (this.month) {
        case 12:
          this.month = 1;
          this.year += 1;
          break;
        default:
          this.month += 1;
          break;
      }
      this.activeIndex = 1;
      document.querySelector('.days').scrollLeft = 0;
      this.loadData();
    },
    deviceTest() {
      this.$refs.deviceTesting.show();
    },
    mockClassroom() {
      // this.trtcCloud.startMicDeviceTest(300);
      // parent.window.store.set('liveCourseInfo', '');
      // parent.window.mockClassroom();
    },
    addZero(i) {
      return i < 10 ? `0${i}` : i.toString();
    },
    countDown(endtime) {
      const nowtime = new Date();
      const lefttime = parseInt(endtime - nowtime.getTime() / 1000, 10);
      let d = parseInt(lefttime / (24 * 60 * 60), 10);
      let h = parseInt((lefttime / (60 * 60)) % 24, 10);
      let m = parseInt((lefttime / 60) % 60, 10);
      let s = parseInt(lefttime % 60, 10);
      d = this.addZero(d);
      h = this.addZero(h);
      m = this.addZero(m);
      s = this.addZero(s);
      document.querySelector('.count').innerHTML = `活动倒计时  ${d}天 ${h} 时 ${m} 分 ${s} 秒`;
      if (lefttime <= 0) {
        document.querySelector('.count').innerHTML = '活动已结束';
        return;
      }
      setTimeout(this.countDown, 1000);
    },
    generateHHMMSS(leftTime) {
      const hh = this.addZero(Math.floor((leftTime / 1000 / 60 / 60) % 24));
      const mm = this.addZero(Math.floor((leftTime / 1000 / 60) % 60));
      const ss = this.addZero(Math.floor(((leftTime / 1000) % 60)));
      return `${hh}:${mm}:${ss}`;
    },
  },
};
</script>

<style lang="less" scoped>
.course-header {
  height: 247px !important;
  background: #ffffff;
  border-radius: 0px 6px 0px 0px;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.03);
}

.year-month {
  margin-top: 32px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.rili-container {
  position: relative;
}

.rili-panel {
  position: absolute;
  width: 386px;
  background: #FFFFFF;
  box-shadow: 0px 6px 34px 0px rgba(0,33,69,0.12);
  border-radius: 12px;
  z-index: 1;
  padding: 30px 22px 12px;
  margin-top: 5px;
}

.rili-panel .rect {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-radius: 2px;
  transform: translateX(50px) translateY(-34px) rotate(45deg) ;
}

.rili-panel .top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.rili-panel .top .date {
  font-size: 36px;
  font-family: YouSheBiaoTiHei;
  color: #000000;
}

.rili-panel .top .switch {
  display: flex;
  flex-direction: row;
}

.rili-panel .top .switch i{
  width: 34px;
  height: 34px;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
}

.rili-panel .top .switch i:first-child {
  background-image: url(../../assets/images/course/icon-rili-prev.svg);
  margin-right: 10px;
}

.rili-panel .top .switch i:last-child {
  background-image: url(../../assets/images/course/icon-rili-next.svg);
}

.rili-panel .rili-weeks {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0,0,0,.4);
  margin-top: 30px;
}

.rili-panel .rili-weeks ul {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.rili-panel .rili-weeks ul li {
  width: 32px;
  text-align: center;
}

.rili-days {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.rili-days .row{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.rili-days .row .col{
  width: 32px;
  height: 42px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rili-days .row .col .day {
  width: 100%;
  height: 32px;
  font-size: 14px;
  border-radius: 50%;
  font-family: GoogleSans, GoogleSans-Medium;
  font-weight: 500;
  color: #000000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: all .3s linear;
}

.rili-days .row .col .cur {
  border-radius: 50%;
  background: rgba(0,122,255,0.07);
  font-size: 14px;
  font-family: YouSheBiaoTiHei;
  color: #007aff;
}

.rili-days .row .col .active {
  border-radius: 50%;
  background: rgba(0,122,255,1);
  font-size: 14px;
  font-family: GoogleSans, GoogleSans-Medium;
  font-weight: 500;
  color: #ffffff;
}
.rili-days .row .col .dot {
  width: 3px;
  height: 3px;
  background: #007aff;
  border-radius: 50%;
  margin-top: 2px;
}

.year-month .rili {
  width: 98px;
  height: 34px;
  background: rgba(0,122,255, .03);
  border-radius: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 30px;
  cursor: pointer;
}
.year-month .rili i {
  width: 18px;
  height: 18px;
  background-image: url('../../assets/images/course/icon-rili.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 6px;
}

.year-month .rili span {
  width: 32px;
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  line-height: 22px;
}

.year-month .device-test {
  font-size: 18px;
  font-weight: 500;
  color: #007aff;
  margin-left: 46px;
  padding: 0;
}

.year-month .date {
  width: 167px;
  height: 28px;
  font-size: 36px;
  font-family: YouSheBiaoTiHei;
  color: #000000;
  line-height: 28px;
}

.year-month .mock-classroom {
  position: absolute;
  width: 152px;
  height: 56px;
  background: #d72a65;
  border-radius: 27px 27px 27px 33px;
  top: -5px;
  right: 43px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.year-month .mock-classroom:hover {
  background: rgba(215,42,101,.8)
}

.year-month .mock-classroom i {
  width: 22px;
  height: 22px;
  background-image: url('../../assets/images/course/icon-jiaoshi.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 11px;
}

.year-month .mock-classroom span {
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
}

.days {
  position: relative;
  width: 100%;
  overflow-x: scroll;
  display: -webkit-box;
  display: flex;
  -webkit-flex-wrap:nowrap;
  flex-wrap:nowrap;
  -webkit-justify-content:space-between;
  justify-content:space-between;
  margin-top: 36px;
  transition: all .3s linear;
}

.days::-webkit-scrollbar {
  display: none;
}

.days .item {
  width: 118px;
  height: 131px;
  /* background: rgba(0,0,0,0.1); */
  border-radius: 16px;
  padding: 0 10px;
  text-align: center;
  -webkit-flex:1 0 auto;
  flex:1 0 auto;
  margin-right: 22px;
  cursor: pointer;
  user-select: none;
  transition: all .3s ease-in-out;
  -webkit-transition: all .3s ease-in-out;
}

.days .week {
  font-size: 20px;
  font-weight: 400;
  opacity: 0.4;
  color: rgba(0,0,0, 1);
  margin-top: 16px;
  height: 28px;
  line-height: 28px;
  transition: all .3s ease-in-out;
  -webkit-transition: all .3s ease-in-out;
}

.days .day {
  height: 39px;
  font-size: 30px;
  font-family: YouSheBiaoTiHei;
  color: #000000;
  line-height: 39px;
  margin-top: 16px;
  transition: all .3s ease-in-out;
  -webkit-transition: all .3s ease-in-out;
}

.days .dot {
  width: 9px;
  height: 9px;
  background: rgba(0,0,0,.4);
  margin: 7px auto 0;
  border-radius: 50%;
  transition: all .3s ease-in-out;
  -webkit-transition: all .3s ease-in-out;
}
.days .active {
  background: #007aff;
}

.days .active .week{
  color: rgba(255, 255, 255, 1);
}

.days .active .day{
  color: #FFFFFF;
}

.days .active .dot{
  background: #FFFFFF;
}

.days .cur .week{
  color: #007AFF;
}

.days .cur .day{
  color: #007AFF;
}

.days .cur .dot{
  background: #007AFF;
}

.days-container {
  position: relative;
  padding: 0 24px;
}
.days-container .prev {
  position: absolute;
  display: inline-block;
  width: 50px;
  height: 50px;
  /* background: red; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  left: -26px;
  top: 42px;
}

.days-container .prev i {
  width: 16px;
  height: 18px;
  display: inline-block;
  background-image: url('../../assets/images/course/icon-prev.svg');
  background-repeat: no-repeat;
  background-size: cover;
}
.days-container .next {
  position: absolute;
  display: inline-block;
  width: 50px;
  height: 50px;
  /* background: red; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  right: -26px;
  top: 42px;
}

.days-container .next i {
  width: 16px;
  height: 18px;
  display: inline-block;
  background-image: url('../../assets/images/course/icon-next.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.el-main {
  padding: 8px 0 0 25px;
}

.course-container .course-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-top: 20px;
  margin-bottom: 50px;
}

.course-list .item {
  margin-right: 20px;
  margin-bottom: 20px;
  padding-top: 24px;
  padding-left: 24px;
  position: relative;
  width: 457px;
  height: 199px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.06);
}

.course-list .item .title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.course-list .item .title i {
  width: 18px;
  height: 18px;
  background-image: url('../../assets/images/course/icon-biaoti.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 17px;
}

.course-list .item .title span{
  font-size: 18px;
  font-weight: 500;
  color: #000000;
}

.course-list .item .sub-title {
  font-size: 16px;
  font-weight: 500;
  color: #717ca0;
  padding-left: 35px;
  min-height: 36px;
}

.course-list .item .start-date {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
}

.course-list .item .start-date i {
  width: 20px;
  height: 20px;
  background-image: url('../../assets/images/course/icon-shijian.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 15px;
}

.course-list .item .start-date span {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
}

.course-list .item .course-state {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
}

.course-list .item .course-state i {
  width: 20px;
  height: 20px;
  background-image: url('../../assets/images/course/icon-zhuangtai.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 15px;
}

.course-list .item .course-state span {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
}

.course-list .item .course-state span .isTimer {
  color: rgba(215,42,101,1);
}

.course-list .item .bottom {
  text-align: right;
}

.course-list .item .bottom .el-button {
  margin-top: 16px;
  margin-right: 25px;
  width: 92px;
  height: 32px;
  background: #007aff;
  border-radius: 16px;
  box-shadow: 0px 3px 7px -1px rgba(0,122,255,0.27);
}

.course-list .item .bottom .btnPlayback {
  border: 1px solid #007aff;
  background: #FFFFFF;
  color: #007aff;
}

.course-list .item .bottom .disabled {
  background: #d0d0da;
  color: #FFFFFF;
  box-shadow: 0px 3px 7px -1px rgba(145,148,168,0.27);
  border: 0;
}
</style>
