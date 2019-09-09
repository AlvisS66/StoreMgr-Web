<template>
  <!--产品分析-->
  <div class="report-product-analysis">
    <table v-if="tableData">
      <tr>
        <th>#</th>
        <th>产品分类</th>
        <th>销售数量</th>
        <th>销售总额</th>
        <th>销售占比</th>
      </tr>
      <template v-for="(item,key,index) in tableData">
        <tr v-if="PRODUCTS[key]">
          <td>{{index+1}}</td>
          <td>{{PRODUCTS[key]}}</td>
          <td>{{item.num}}</td>
          <td>{{item.amount | formatMoney}}</td>
          <td>{{item.amount | calcPercent(tableData.total.amount)}}</td>
        </tr>
      </template>
    </table>
    <div class="table-total">销售总额：
      <span class="red" v-if="tableData">{{tableData.total.amount | formatMoney}}</span>
    </div>
  </div>
</template>

<script>
  import {getProductAnalysis} from '@/api/report';
  import {calc} from '@/utils/index';
  import {PRODUCTS} from '@/utils/globals';

  export default {
    name: "report-product-analysis",
    props: {
      date: Array,
    },
    data() {
      return {
        PRODUCTS,
        tableData: '',
      }
    },

    mounted() {
      this.getProductAnalysis();
    },

    methods: {
      getProductAnalysis() {
        let [start_date, end_date] = this.date;
        getProductAnalysis({ start_date, end_date }).then(res => {
          this.tableData = res.success.data;
        });
      },
    },

    watch: {
      date() {
        this.getProductAnalysis();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .report-product-analysis {
    .table-total {
      padding: 10px 0;
      line-height: 23px;
      border-bottom: 1px solid #ebeef5;
      font-size: 14px;
      color: #606266;
    }
    .red {
      color: $--color-primary;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        background-color: #fff;
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
      }
      th {
        color: #909399;
      }
      th, td {
        border: 1px solid #ebeef5;
        padding: 14px 10px;
        text-align: left;
        color: #606266;
        border-left: 0;
        border-right: 0;
      }
      .red {
        color: $--color-primary;
      }
    }
  }
</style>
