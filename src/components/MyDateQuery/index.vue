<template>
  <!--筛选条件-->
  <el-card shadow="always" class="filter-box mb-15">
    <div class="fl">
      <span>查询日期：</span>
      <el-radio-group v-model="value">
        <el-radio-button label="1">今日</el-radio-button>
        <el-radio-button label="2">昨日</el-radio-button>
        <el-radio-button label="3">本月</el-radio-button>
        <el-radio-button label="4">上月</el-radio-button>
      </el-radio-group>
    </div>
    <div class="fr">
      <span>其他日期：</span>
      <el-date-picker
        v-model="picker"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
  </el-card>
</template>

<script>
  const moment = require('moment');

  export default {
    name: "MyDateQuery",
    data() {
      return {
        value: '',
        picker: '',
        start_time: this.formatDate(),
        end_time: this.formatDate({ is_start: false }),
      }
    },
    computed: {
      date() {
        return [this.start_time, this.end_time];
      }
    },

    created() {
      this.value = 1;
    },

    methods: {
      //计算日期
      calcData(val) {
        let start = this.formatDate(),
          end = this.formatDate({ is_start: false }),
          date = moment(),
          type = 'day';
        if (val === '2') {
          date = moment().add(-1, 'days');
        }
        if (val === "3") {
          date = moment().month(moment().month());
          type = 'month';
        }
        if (val === "4") {
          date = moment().month(moment().month() - 1);
          type = 'month';
        }
        start = this.formatDate({ date, type });
        end = this.formatDate({ date, type, is_start: false });
        [this.start_time, this.end_time] = [start, end];
        this.$emit("dateQuery", this.date);
      },

      //格式化时间
      formatDate({ date = moment(), type = "day", is_start = true } = {}) {
        date = is_start ? date.startOf(type) : date.endOf(type);
        return date.format('YYYY-MM-DD HH:mm:ss');
      }
    },

    beforeDestroy() {
    },

    filters: {},

    watch: {
      picker(val) {
        if (val) {
          this.value = '';
          this.start_time = this.formatDate({ date: moment(val[0]) });
          this.end_time = this.formatDate({ date: moment(val[1]), is_start: false });
          this.$emit("dateQuery", this.date)
        }
      },

      value(val) {
        if (!val) return false;
        this.picker = '';
        this.calcData(val);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .filter-box {
    color: #909399;
    font-size: 14px;
    .el-card__body {
      padding: 10px 20px;
      overflow: hidden;
    }
    .el-date-editor .el-range-separator {
      width: auto;
    }
  }
</style>