<template>
  <!--会员报表-->
  <div class="app-container report-member-page">
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
  import ConsumeRanking from "./components/consume";
  import PassengerAnalysis from "./components/passenger";
  import CardSales from "./components/cardSales";
  import RechargeRecords from "./components/rechargeRecords";
  import MemberBirthday from "./components/birthday";

  export default {
    name: "report_shop",
    components: {
      Pagination,
      DateQuery,
      ConsumeRanking,
      PassengerAnalysis,
      CardSales,
      RechargeRecords,
      MemberBirthday,
    },
    data() {
      return {
        loading: false,
        filter: {
          start_time: '',
          end_time: '',
        },
        activeTabName: "consumeRanking",
        tabList: [
          {
            name: "consumeRanking",
            label: "消费排行"
          },
          {
            name: "passengerAnalysis",
            label: "客源分析"
          },
          {
            name: "cardSales",
            label: "售卡统计"
          },
          // {
          //   name: "passengerAnalysis",
          //   label: "耗卡统计"
          // },
          {
            name: "rechargeRecords",
            label: "充值明细"
          },
          // {
          //   name: "memberBirthday",
          //   label: "会员生日"
          // },
        ]
      }
    },
    methods: {
      // 获取筛选时间
      getDateQuery(date) {
        [this.filter.start_time, this.filter.end_time] = date;
      },

      // tab切换
      tabChange() {
        this.$refs.dateQuery.value = 1;
      }
    }

  }
</script>

<style lang="scss">
  .report-member-page {
    .card-box {
      .el-card__body {
        padding-top: 0;
      }
    }
  }

</style>