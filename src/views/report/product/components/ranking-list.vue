<template>
  <div class="report-product-ranking">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="排行榜" type="index" width="100">
        <template slot-scope="scope">
          <img src="@/assets/report/rank-icon1.png" alt="" v-if="scope.$index ===0">
          <img src="@/assets/report/rank-icon2.png" alt="" v-if="scope.$index ===1">
          <img src="@/assets/report/rank-icon3.png" alt="" v-if="scope.$index ===2">
          <span v-if="scope.$index>2">{{scope.$index + 1}}</span>
        </template>
      </el-table-column>

      <template v-if="type === 'bestselling'">
        <el-table-column prop="title" label="产品名称" width="180"></el-table-column>
        <el-table-column prop="item.category.name" label="产品分类"></el-table-column>
        <el-table-column prop="member_count" label="会员"></el-table-column>
        <el-table-column prop="guest_count" label="散客"></el-table-column>
        <el-table-column prop="total_num" label="销售数量"></el-table-column>
        <el-table-column prop="total_amount" label="销售总额">
          <template slot-scope="scope">
            {{scope.row.total_amount | formatMoney}}
          </template>
        </el-table-column>
      </template>

      <template v-if="type === 'unsalable'">
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column prop="category.name" label="产品分类"></el-table-column>
        <el-table-column label="滞销天数">
          <template slot-scope="scope">
            {{scope.row.last_sale_day}}
            <span v-if="scope.row.last_sale_day!=='暂未售出'">天</span>
          </template>
        </el-table-column>
      </template>

    </el-table>
  </div>
</template>

<script>
  import {getProductRankingList, getUnsalableRankList} from '@/api/report';

  const moment = require('moment');

  export default {
    name: "report-product-ranking",
    props: {
      date: Array,
      type: String,
    },
    data() {
      return {
        tableData: [],
      }
    },

    mounted() {
      console.log(this.type);
      if (this.type === "bestselling") {
        this.getProductRankingList();
      } else {
        this.getUnsalableRankList();
      }

    },

    methods: {
      //畅销排行榜
      getProductRankingList() {
        let [start_date, end_date] = this.date;
        getProductRankingList({ start_date, end_date }).then(res => {
          this.tableData = res.success.data;
        })
      },

      //滞销排行榜
      getUnsalableRankList() {
        let [start_date, end_date] = this.date;
        getUnsalableRankList({ start_date, end_date }).then(res => {
          this.tableData = res.success.data;
        })
      },

      //计算滞销天数
      calcUnsalableDays(last_sale_time, created_at) {
        return moment()
          .diff(moment(last_sale_time || created_at), "days");
      }
    },

    watch: {
      date() {
        if (this.type === "bestselling") {
          this.getProductRankingList();
        } else {
          this.getUnsalableRankList();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .report-product-ranking {
    .triangle {
      width: 0;
      height: 0;
      border-style: solid;
      position: relative;
      display: inline-block;
      span {
        position: absolute;
        right: -20px;
        line-height: 8px;
      }
    }
    .triangle-up {
      border-width: 0 6px 8px;
      border-color: transparent transparent $--color-primary;
      span {
        top: 0;
        color: $--color-primary;
      }
    }

    .triangle-down {
      border-width: 8px 6px 0;
      border-color: lightgreen transparent transparent;
      span {
        top: -8px;
        color: lightgreen;
      }
    }
  }
</style>