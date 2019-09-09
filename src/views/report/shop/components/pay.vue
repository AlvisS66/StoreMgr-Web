<template>
  <!--前台缴费-->
  <div class="report-shop-pay" v-loading="loading">
    <!--<el-button class="download-btn" type="primary" icon="el-icon-download">导出</el-button>-->
    <el-row :gutter="24" class="ranking-list">
      <el-col :span="12">
        <table width="100%" v-if="tableData">
          <tr>
            <th width="40%">收入项目</th>
            <th width="60%">收入金额</th>
          </tr>
          <template v-for="(item,key) in tableData.product_data">
            <tr v-if="PRODUCTS[key]">
              <td>{{PRODUCTS[key]}}</td>
              <td>{{item.amount | formatMoney}}</td>
            </tr>
            <tr v-else>
              <td>营收合计</td>
              <td class="red">{{item.amount | formatMoney}}</td>
            </tr>
          </template>
        </table>
      </el-col>

      <el-col :span="12">
        <table width="100%" v-if="tableData">
          <tr>
            <th width="40%">结算方式</th>
            <th width="60%">结算金额</th>
          </tr>
          <template v-for="(val,key) in tableData.payment_data">
            <tr v-if="payments[key]">
              <td>{{payments[key]}}</td>
              <td>{{val | formatMoney}}</td>
            </tr>
            <tr v-else>
              <td>结算合计</td>
              <td class="red">{{val | formatMoney}}</td>
            </tr>
          </template>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {calc, parseTime} from '@/utils/index';
  import {getGeneralView} from '@/api/report';
  import {PRODUCTS} from '@/utils/globals';

  const payments = {
    bankcard: '银行卡',
    cash: '现金',
    wechatpay: '微信',
    alipay: '支付宝',
    others: '其他',
    groupbuy: "团购"
  };

  export default {
    name: "report-shop-pay",
    props: {
      date: Array,
    },
    computed: {},
    data() {
      return {
        loading: false,
        tableData: '',
        PRODUCTS,
        payments,
      };
    },

    mounted() {
    },

    methods: {
      // 获取数据
      getGeneral(date) {
        let [start_date, end_date] = date;
        this.loading = true;
        getGeneralView(start_date, end_date).then(res => {
          this.loading = false;
          this.tableData = res.success.data;
        });
      }
    },

    beforeDestroy() {
    },

    watch: {
      date(value) {
        this.getGeneral(value);
      }
    }
  };
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .report-shop-pay {
    table {
      border-collapse: collapse;
      border: 1px solid #ebeef5;
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
      }
      .red {
        color: $--color-primary;
      }
    }
  }

</style>


