<template>
  <div class="app-container index-page" id="index-page">
    <el-row :gutter="24" class="card-box mb-15">
      <el-col :span="8">
        <div class="card-panel" @click="$router.push({ name: 'cash_billing'})">
          <span>快速开单</span>
          <span class="icon"></span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card-panel" @click="$router.push({ name: 'member_manage',params: { type: 'add' }})">
          <span>新增会员</span>
          <span class="icon"></span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card-panel">
          <span>新增预约</span>
          <span class="icon"></span>
        </div>
      </el-col>
    </el-row>

    <!--营业分析-->
    <el-row :gutter="24" class="ranking-list payment-cart">
      <el-col :span="24">
        <el-card shadow="always" class="ranking-box">
          <div slot="header" class="header">营业分析</div>
          <div class="chart-box">
            <income-bar></income-bar>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--筛选条件-->
    <date-query @dateQuery="getDateQuery($event)"></date-query>

    <!--营业收入-->
    <el-row class="ranking-list payment-list" v-if="indexData">
      <el-col :span="24">
        <el-card shadow="always" class="ranking-box analysis-box">
          <div slot="header" class="header">营业收入<span>营收合计: {{indexData.payment_data.total | formatMoney}}</span></div>
          <ul class="income-analysis">
            <li class="title">
              <span>收款方式</span>
              <span>实收金额</span>
              <span>收款占比</span>
            </li>
            <template v-for="(val,key) in indexData.payment_data">
              <li v-if="payments[key]">
                <span>{{payments[key]}}</span>
                <span>{{val | formatMoney}}</span>
                <span>{{val | calcPercent(indexData.payment_data.total)}}</span>
              </li>
            </template>
          </ul>
        </el-card>
      </el-col>
    </el-row>

    <!--产品分类-->
    <el-row :gutter="15" class="ranking-list" v-if="indexData">
      <el-col :span="12">
        <el-card shadow="always" class="ranking-box charts analysis-box">
          <div slot="header" class="header">产品分类 <span>销售总额:{{indexData.product_data.total.amount | formatMoney}}</span></div>
          <table class="index-data-table">
            <tr>
              <th>#</th>
              <th>产品分类</th>
              <th>销售数量</th>
              <th>销售总额</th>
            </tr>
            <template v-for="(item,key,index) in indexData.product_data">
              <tr v-if="PRODUCTS[key]">
                <td>{{index+1}}</td>
                <td>{{PRODUCTS[key]}}</td>
                <td>{{item.num}}</td>
                <td>{{item.amount | formatMoney}}</td>
              </tr>
            </template>
          </table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="always" class="ranking-box">
          <div slot="header" class="header">产品占比</div>
          <div class="chart-box">
            <product-pie :data="product_format" v-if="product_format.length"></product-pie>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--客源分析-->
    <el-row :gutter="15" class="ranking-list" v-if="indexData">
      <el-col :span="12">
        <el-card shadow="always" class="ranking-box analysis-box charts ">
          <div slot="header" class="header">客源分析
            <span>消费总额: {{indexData.member_data.amount_total | formatMoney}}</span>
          </div>
          <table class="index-data-table">
            <tr>
              <th>#</th>
              <th>客源状态</th>
              <th>订单数</th>
              <th>消费总额</th>
            </tr>
            <tr>
              <td>1</td>
              <td>会员</td>
              <td>{{indexData.member_data.member_noappoint_count}}</td>
              <td>{{indexData.member_data.member_noappoint_amount | formatMoney}}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>会员点客</td>
              <td>{{indexData.member_data.member_appoint_count}}</td>
              <td>{{indexData.member_data.member_appoint_amount | formatMoney}}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>散客</td>
              <td>{{indexData.member_data.guest_noappoint_count}}</td>
              <td>{{indexData.member_data.guest_noappoint_amount | formatMoney}}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>散客点客</td>
              <td>{{indexData.member_data.guest_appoint_count}}</td>
              <td>{{indexData.member_data.guest_appoint_amount | formatMoney}}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" class="ranking-box analysis-box">
          <div slot="header" class="header">客源占比</div>
          <div class="chart-box">
            <member-pie :data="member_format" v-if="member_format.length"></member-pie>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const moment = require('moment');
  import ProductPie from './components/ProductPie'
  import MemberPie from './components/MemberPie'
  import IncomeBar from './components/IncomeBar'
  import DateQuery from "@/components/MyDateQuery"
  import {indexData} from '@/api/index'
  import {calc} from '@/utils/index';
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
    name: 'Index',
    components: {
      DateQuery,
      ProductPie,
      MemberPie,
      IncomeBar,
    },
    data() {
      return {
        PRODUCTS,
        payments,
        filter: {
          start_date: moment().format('YYYY-MM-DD'),
          end_date: moment().add(1, 'days').format('YYYY-MM-DD'),
        },
        indexData: '',

        businessList: [],
        product_format: [],
        member_format: [],
      }
    },

    mounted() {
      this.getIndexData();
    },
    methods: {
      // 获取筛选时间
      getDateQuery(date) {
        [this.filter.start_date, this.filter.end_date] = date;
        console.log('获取筛选时间', this.filter.start_date, this.filter.start_date);
        this.getIndexData();
      },

      // 获取统计数据
      getIndexData() {
        let data = {
          ...this.filter
        };
        indexData(data).then(res => {
          let data = res.success.data;
          this.indexData = data;
          this.handelProductData(data.product_data);
          this.handelMemberData(data.member_data);
        });
      },

      // 产品占比数据处理
      handelProductData(data) {
        let product_format = [];
        for (let product in data) {
          if (product !== 'total') {
            let obj = {
              value: Number(data[product].amount),
              name: PRODUCTS[product],
            };
            product_format.push(obj);
          }
        }
        this.product_format = product_format;
      },

      // 客源占比数据处理
      handelMemberData(data) {
        this.member_format = [
          {
            value: data.member_noappoint_amount,
            name: '会员'
          },
          {
            value: data.member_appoint_amount,
            name: '会员点客'
          },
          {
            value: data.guest_noappoint_amount,
            name: '散客'
          },
          {
            value: data.guest_appoint_amount,
            name: '散客点客'
          },
        ];
      },


    }

  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .card-box {
    padding: 0;
    .el-col {
      cursor: pointer;
      &:nth-child(1) {
        .card-panel {
          background: linear-gradient(90deg, #07ca88, #79e071);
        }
        .icon {
          position: absolute;
          right: 30px;
          bottom: 0;
          display: inline-block;
          width: 71px;
          height: 80px;
          background: url('../../assets/index/card-icon1.png');
          background-size: cover;
        }
      }
      &:nth-child(2) {
        .card-panel {
          background: linear-gradient(90deg, #5e9ffb, #9fd0ff);
        }
        .icon {
          position: absolute;
          right: 30px;
          bottom: 0;
          display: inline-block;
          width: 90px;
          height: 73px;
          background: url('../../assets/index/card-icon2.png');
          background-size: cover;
        }
      }
      &:nth-child(3) {
        .card-panel {
          background: linear-gradient(90deg, #f2889f, #fbc07d);
        }
        .icon {
          position: absolute;
          right: 30px;
          bottom: 0;
          display: inline-block;
          width: 72px;
          height: 75px;
          background: url('../../assets/index/card-icon3.png');
          background-size: cover;
        }
      }
    }
    .card-panel {
      height: 100px;
      line-height: 100px;
      color: #fff;
      border-radius: 5px;
      font-size: 18px;
      padding-left: 10%;
      position: relative;
    }
    .icon {
      color: transparent;
    }
  }

  .ranking-list {
    margin-bottom: 15px;
    .ranking-box {
      padding: 0 18px;
      .header {
        font-weight: bold;
        color: #606266;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span {
          font-size: 14px;
          font-weight: normal;
          color: #999999;
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  .income-analysis {
    $borderColor: #ebeef5;
    $bgColor: #f5f7fa;
    display: flex;
    width: 100%;
    border: 1px solid $borderColor;

    li {
      color: #606266;
      font-size: 14px;
      flex: 1;
      border-right: 1px solid $borderColor;
      > span {
        display: block;
        padding: 12px 10px;
        width: 100%;
        border-bottom: 1px solid $borderColor;
        &:last-child {
          border-bottom: none;
        }
        &:first-child {
          background-color: $bgColor;
          font-weight: bold;
          color: #909399;
        }
      }
      &.title {
        width: 140px;
        flex: none;
      }
      &:last-child {
        border-right: none;
      }
      &:first-child {
        > span {
          background-color: $bgColor;
          font-weight: bold;
          color: #909399;
        }
      }
    }
  }

  .index-data-table {
    width: 100%;
    border-collapse: collapse;
    tr {
      background-color: #fff;
      white-space: nowrap;
      overflow: hidden;
      user-select: none;
    }
    th, td {
      border: 1px solid #ebeef5;
      padding: 14px 10px;
      text-align: left;
      color: #606266;
      border-left: 0;
      border-right: 0;
    }
    th {
      color: #909399;
    }
    .red {
      color: $--color-primary;
    }
  }
</style>
<style lang="scss">
  .index-page {
    .el-date-editor .el-range-separator {
      width: auto;
    }
    .el-card__header {
      padding: 16px 0;
    }
    .analysis-box .el-card__body {
      height: 290px;
      th {
        border-top: none;
      }
    }
    .ranking-list {
      .el-card__body {
        padding: 0;
      }
    }
    .payment-cart {
      .el-card__body {
        padding: 10px 0;
      }
    }
    .payment-list {
      .el-card__body {
        height: auto;
        padding: 20px 0;
      }
    }
  }


</style>
