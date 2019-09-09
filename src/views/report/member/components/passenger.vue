<template>
  <!--客源分析-->
  <div class="report-member-passenger" v-loading="loading">
    <table v-if="tableData">
      <tr>
        <th>#</th>
        <th>客源状态</th>
        <th>销售数量</th>
        <th>消费总额</th>
        <th>销售占比</th>
      </tr>
      <tr>
        <td>1</td>
        <td>会员</td>
        <td>{{tableData.member_noappoint_count}}</td>
        <td>{{tableData.member_noappoint_amount | formatMoney}}</td>
        <td>{{tableData.member_noappoint_amount | calcPercent(tableData.amount_total)}}</td>
      </tr>
      <tr>
        <td>2</td>
        <td>会员点客</td>
        <td>{{tableData.member_appoint_count}}</td>
        <td>{{tableData.member_appoint_amount | formatMoney}}</td>
        <td>{{tableData.member_appoint_amount | calcPercent(tableData.amount_total)}}</td>
      </tr>
      <tr>
        <td>3</td>
        <td>散客</td>
        <td>{{tableData.guest_noappoint_count}}</td>
        <td>{{tableData.guest_noappoint_amount | formatMoney}}</td>
        <td>{{tableData.guest_noappoint_amount | calcPercent(tableData.amount_total)}}</td>
      </tr>
      <tr>
        <td>4</td>
        <td>散客点客</td>
        <td>{{tableData.guest_appoint_count}}</td>
        <td>{{tableData.guest_appoint_amount | formatMoney}}</td>
        <td>{{tableData.guest_appoint_amount | calcPercent(tableData.amount_total)}}</td>
      </tr>
    </table>
    <div class="table-total">总计：<span class="red">{{tableData.amount_total | formatMoney}}</span></div>
  </div>
</template>

<script>
  import {getSourceAnalysis} from "@/api/report";
  import {calc} from '@/utils/index';

  export default {
    name: "report-member-passenger",
    components: {},
    props: {
      date: Array,
    },
    computed: {},
    data() {
      return {
        loading : false,
        tableData: [],
      };
    },

    mounted() {
      this.getSourceAnalysis();
    },

    methods: {
      getSourceAnalysis() {
        this.loading = true;
        let [start_date, end_date] = this.date;
        getSourceAnalysis({ start_date, end_date }).then(res => {
          this.loading = false;
          this.tableData = res.success.data;
        });
      }
    },

    watch: {
      date() {
        this.getSourceAnalysis();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .report-member-passenger {
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