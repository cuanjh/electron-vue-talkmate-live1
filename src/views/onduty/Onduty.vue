<template>
  <div class="el-container">
    <div class="el-main">
      <el-calendar v-model="calendarVal">
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p>{{date.getDate()}}</p>
          <div class="item"
            v-for="item in calendarData[data.day]"
            :key="item.uuid"
            @click="entryRoom(item)">
            {{item.range }}
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import {
  getLiveCourseList,
} from '@/api/live';

export default {
  data() {
    return {
      calendarVal: new Date(),
      list: [],
    };
  },
  mounted() {
    this.loadData();
  },
  computed: {
    calendarData() {
      const obj = {};
      if (this.list && this.list.length > 0) {
        this.list.forEach((item) => {
          obj[item.date] = this.dayOndutys(item.date);
        });
      }
      return obj;
    },
  },
  watch: {
    calendarVal(newVal, oldVal) {
      if (newVal.getMonth() !== oldVal.getMonth()) {
        this.loadData();
      }
    },
  },
  methods: {
    loadData() {
      const year = this.calendarVal.getFullYear();
      const month = this.calendarVal.getMonth() + 1;
      const params = {
        start_date: `${year}-${this.addZero(month)}-01`,
        end_date: `${year}-${this.addZero(month)}-${new Date(year, month, 0).getDate()}`,
        species: 1, // 值班
        page_index: 1,
        page_size: 9999,
        user_id: this.$store.getters.userId,
      };
      getLiveCourseList(params).then((res) => {
        // console.log(res);
        if (res.success && res.data) {
          this.list = res.data;
        } else {
          this.list = [];
        }
      });
    },
    addZero(num) {
      return num > 9 ? num : `0${num}`;
    },
    dayOndutys(day) {
      const arr = [];
      if (this.list && this.list.length > 0) {
        const result = this.list.filter((item) => item.date === day);
        if (result && result.length > 0) {
          result.forEach((r) => {
            arr.push({
              range: `${moment(r.startTime * 1000).format('HH:mm:ss').slice(0, 5)} - ${moment(r.EndTime * 1000).format('HH:mm:ss').slice(0, 5)}`,
              uuid: r.uuid,
            });
          });
        }
      }
      return arr;
    },
    entryRoom(item) {
      const curCourse = this.list.find((l) => l.uuid === item.uuid);
      this.$store.commit('SET_LIVEINFO', { key: 'curOnduty', value: curCourse });
      this.$router.push({ path: '/onduty/room' });
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  background: #ffffff;
  -webkit-app-region: drag;
}

.el-main {
  -webkit-app-region: no-drag;
}

.item {
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, .1);
  padding: 4px;
  font-size: 14px;
  text-align: center;
  margin: 4px 0;
}
</style>

<style lang="less">
.el-calendar-table .el-calendar-day {
  min-height: 85px;
  height: auto;
}
</style>
