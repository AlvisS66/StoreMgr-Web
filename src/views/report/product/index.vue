<template>
  <!--店务报表-->
  <div class="app-container report-product-page">
    <!--筛选条件-->
    <date-query ref="dateQuery" @dateQuery="getDateQuery($event)"></date-query>

    <el-card shadow="always" class="card-box setting-box mb-15">
      <el-tabs v-model="activeTabName" class="common-tabs" @tab-click="tabChange">
        <el-tab-pane
          v-for='(item,index) in tabList'
          :key='index'
          :label="item.label"
          :name="item.name">
          <component
            v-if="activeTabName === item.name"
            :is="item.name"
            :date="[filter.start_time, filter.end_time]">
          </component>
        </el-tab-pane>
        <el-tab-pane label="畅销排行榜" name="bestselling">
          <ranking-list
            :date="[filter.start_time,filter.end_time]"
            type="bestselling"
            v-if="activeTabName === 'bestselling'"/>
        </el-tab-pane>
        <el-tab-pane label="滞销排行榜" name="unsalable">
          <ranking-list
            :date="[filter.start_time,filter.end_time]"
            type="unsalable"
            v-if="activeTabName === 'unsalable'"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div><!---->
</template>

<script>
  const moment = require('moment');
  import Pagination from "@/components/Pagination";
  import DateQuery from "@/components/MyDateQuery";
  import ProductAnalysis from "./components/product-analysis";
  import NumAnalysis from "./components/num-analysis";
  import RankingList from "./components/ranking-list";

  export default {
    name: "report_product",
    components: {
      Pagination,
      DateQuery,
      ProductAnalysis,
      NumAnalysis,
      RankingList,
    },
    data() {
      return {
        loading: false,
        filter: {
          start_time: moment().format('YYYY-MM-DD'),
          end_time: moment().add(1, 'days').format('YYYY-MM-DD'),
        },
        activeTabName: "productAnalysis",
        tabList: [
          {
            name: "productAnalysis",
            label: "产品分析表",
          },
          {
            name: "numAnalysis",
            label: "数量分析表"
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
  .report-product-page {
    .card-box {
      .el-card__body {
        padding-top: 0;
      }
    }
  }
</style>