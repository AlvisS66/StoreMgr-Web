<template>
  <!--店务报表-->
  <div class="app-container report-shop-page">
    <!--筛选条件-->
    <date-query ref="dateQuery" @dateQuery="getDateQuery($event)"></date-query>

    <el-card shadow="always" class="card-box setting-box mb-15">
      <el-tabs v-model="activeTabName" class="common-tabs" @tab-click="tabChange">
        <el-tab-pane
          v-for='(item,index) in tabList'
          :key='index'
          :label="item.label"
          :name="item.name">
          <keep-alive>
            <component
              v-if="activeTabName === item.name"
              :is="item.name"
              :date="[filter.start_time, filter.end_time]">
            </component>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  const moment = require('moment');
  import Pagination from "@/components/Pagination";
  import DateQuery from "@/components/MyDateQuery";
  import PayTab from "./components/pay";
  import DetailTab from "./components/detail";
  import SummaryTab from "./components/summary";
  import BirthdayTab from "./components/birthday";

  export default {
    name: "report_shop",
    components: {
      Pagination,
      DateQuery,
      PayTab,
      DetailTab,
      SummaryTab,
      BirthdayTab,
    },
    data() {
      return {
        loading: false,
        filter: {
          start_time: '',
          end_time: '',
        },
        activeTabName: "payTab",
        tabList: [
          {
            name: "payTab",
            label: "前台缴费"
          },
          {
            name: "detailTab",
            label: "提成明细"
          },
          {
            name: "summaryTab",
            label: "提成汇总"
          },
          {
            name: "birthdayTab",
            label: "员工生日"
          },
        ]
      }
    },
    methods: {
      // 获取筛选时间
      getDateQuery(date) {
        [this.filter.start_time, this.filter.end_time] = date;
        console.log('获取筛选时间', this.filter.start_time, this.filter.end_time);
      },

      //tab切换
      tabChange() {
        this.$refs.dateQuery.value = 1;
      }
    }

  }
</script>

<style lang="scss">
  .report-shop-page {
    .card-box {
      position: relative;
      .el-card__body {
        padding-top: 0;
      }
      .download-btn {
        position: absolute;
        right: 10px;
      }
    }
  }
</style>
