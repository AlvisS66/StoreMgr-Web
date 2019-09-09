<template>
  <div class="app-container cash-order-page">
    <!--筛选条件-->
    <date-query @dateQuery="getDateQuery($event)"></date-query>

    <!--订单列表-->
    <el-card shadow="always" class="order-box mb-15">
      <div slot="header">
        <span class="header">订单列表</span>
        <div class="fr search-box">
          <el-input
            placeholder='姓名、手机号、订单编号、产品名称'
            class="search fl"
            v-model="filter.search"
            prefix-icon="el-icon-search"
            @keyup.enter.native="getOrderList"
            clearable
            @clear="getOrderList">
          </el-input>
          <el-button class="fl" @click="highFilter.show = !highFilter.show">{{filterBtnName}}</el-button>
        </div>
      </div>

      <!--高级查询-->
      <el-collapse-transition>
        <div class="high-filter" v-show='highFilter.show'>
          <el-row v-if="highFilter.pay_list">
            <span class="filter-name">支付方式</span>
            <el-radio-group v-model="filter.payway" @change="getOrderList">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button
                :label="item[0]"
                v-for="item in highFilter.pay_list"
                :key="`payway-${item[0]}`">
                {{item[1]}}
              </el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row>
            <span class="filter-name">订单状态</span>
            <el-radio-group v-model="filter.status" @change="getOrderList">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button
                :label="index"
                v-for="(item,index) in highFilter.statu_list"
                :key="`status-${index}`">
                {{item}}
              </el-radio-button>
            </el-radio-group>
          </el-row>

          <el-row>
            <span class="filter-name">操作人员</span>
            <el-radio-group v-model="filter.operator" @change="getOrderList">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button
                :label="item.id"
                v-for="item in highFilter.operate_list"
                :key="`operator-${item.id}`">
                {{item.realname}}
              </el-radio-button>
            </el-radio-group>
          </el-row>

          <el-row style="display: none">
            <span class="filter-name">是否赠送</span>
            <el-radio-group>
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="1">有赠送</el-radio-button>
              <el-radio-button label="0">无赠送</el-radio-button>
            </el-radio-group>
          </el-row>
        </div>
      </el-collapse-transition>

      <!--列表-->
      <div class="order-list-box">
        <table class="order-table" border="1" v-loading="loading">
          <thead>
          <tr class="uppercase">
            <th colspan="2">产品名称</th>
            <th>单价</th>
            <th class="sales-count">数量</th>
            <th class="text-left">总额</th>
            <th class="text-left">支付方式</th>
            <th class="text-left">顾客</th>
            <th class="text-left">操作人</th>
            <th class="text-left">状态</th>
            <th class="text-left">操作</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="order in orderList.data" v-if="orderList.data.length">
            <tr class="table-separation">
              <td colspan="10"></td>
            </tr>
            <tr class="table-order-title">
              <td colspan="10">
                <div class="order-info">
                  <span>订单编号:{{order.no}}</span>
                  <span>交易时间:{{order.updated_at}}</span>
                </div>
              </td>
            </tr>

            <tr v-for="(goodsItem,index) in order.order_item">
              <td class="goods-img">
                <img src="@/assets/cash/recharge-img.png" alt="" v-if="goodsItem.item_type === globals.RECHARGE"/>
                <img v-productImg="goodsItem.image_url" alt="" v-else/>
              </td>
              <td class="goods-name">
                {{goodsItem.title}}
                <el-tag type="danger" size="small" v-if="goodsItem.is_free">赠送</el-tag>
                <el-tag type="warning" size="small" v-if="goodsItem.is_advance">预存</el-tag>
              </td>
              <td>{{goodsItem.total_amount | formatMoney}}</td>
              <td>{{goodsItem.num}}</td>
              <template v-if="index === 0">
                <td :rowspan="order.order_item.length">
                  {{order.payment_amount | formatMoney}}
                  <br>
                  <del v-show="order.payment_amount !==order.total_amount">
                    {{order.total_amount | formatMoney}}
                  </del>
                </td>
                <td :rowspan="order.order_item.length">
                  <p v-for="payment in order.payway_name.split('|')"
                     :key="payment.type">
                    {{payment}}
                  </p>
                </td>
                <td :rowspan="order.order_item.length">
                  <template v-if="order.member">
                    <p>{{order.member.realname}}</p>
                    <p>{{order.member.mobile}}</p>
                  </template>
                  <span v-else>散客</span>
                </td>
                <td :rowspan="order.order_item.length">{{order.staff_user.realname}}</td>
                <td :rowspan="order.order_item.length"
                    class="trading-status"
                    :class="order.status === 2 ? 'success' : ''">
                  {{order.status_name}}
                </td>
                <td :rowspan="order.order_item.length" class="setting">
                  <el-button size="small" @click.native="orderInfoShow(order.id)">详情</el-button>
                  <!--打印小票-->
                  <my-print-button
                    :order_id="order.id">
                  </my-print-button>

                  <!--<el-button type="primary" size="small" @click.native="getOrderInfo.dialogShow = true">结账</el-button>-->
                </td>
              </template>
            </tr>
          </template>
          </tbody>
        </table>

        <!--暂无数据-->
        <div class="empty-box" style="text-align: center; padding: 30px 0;"
             v-show="!loading && !paginate.total">暂无数据
        </div>
        <!-- 分页 -->
        <pagination
          v-show="paginate.total>0"
          :total="paginate.total"
          :page.sync="paginate.page"
          :limit.sync="paginate.page_size"
          class='pagination'
          @pagination='getOrderList'/>
      </div>
    </el-card>

    <!--详情-->
    <detail-dialog
      ref="detailDialog"
      :show.sync="detailDialog.show"
      :order_id="detailDialog.order_id"
      @refund-success="getOrderList"
      v-if="detailDialog.show">
    </detail-dialog>
  </div>
</template>

<script>
  const moment = require('moment');
  import {calc} from '@/utils/index';
  import Pagination from "@/components/Pagination";
  import MyPrintButton from "@/components/MyPrintButton";
  import DateQuery from "@/components/MyDateQuery";
  import {searchData, orderList, orderInfo, refund} from '@/api/cash/order';
  import * as globals from '@/utils/globals';
  import DetailDialog from "./components/detail-dialog";

  export default {
    name: "cash_order",
    components: {
      Pagination,
      DateQuery,
      MyPrintButton,
      DetailDialog,
    },
    data() {
      return {
        globals,
        loading: false,
        filter: {
          start_time: '',
          end_time: '',
          operator: '',
          payway: '',
          status: '',
          search: '',
        },
        highFilter: {
          show: false,
          pay_list: [],
          operate_list: [],
          statu_list: [],
        },
        orderList: [],
        // 分页
        paginate: {
          page: 1,
          page_size: 10,
          total: 0,
        },
        // 详情
        detailDialog: {
          show: false,
          order_id: '',
        },
      }
    },
    computed: {
      filterBtnName() {
        return this.highFilter.show ? "关闭查询" : "高级查询";
      }
    },
    created() {
      this.getSearchData();
    },
    methods: {
      // 获取筛选时间
      getDateQuery(date) {
        [this.filter.start_time, this.filter.end_time] = date;
        this.getOrderList();
      },

      // 获取筛选条件
      getSearchData() {
        searchData().then(res => {
          let data = res.success.data;
          this.highFilter.operate_list = data.operate_list;
          this.highFilter.pay_list = data.pay_list;
          let strMap = new Map();
          for (let k of Object.keys(data.pay_list)) {
            strMap.set(k, data.pay_list[k]);
          }
          this.highFilter.pay_list = [...strMap];
          this.highFilter.statu_list = data.statu_list;
        });
      },

      // 获取订单列表
      getOrderList() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          page_size: this.paginate.page_size,
          ...this.filter,
        };
        orderList(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.orderList = data;
          this.paginate.total = data.total;
        });
      },

      // 订单详情
      orderInfoShow(order_id) {
        this.detailDialog = {
          show: true,
          order_id,
        }
      },
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .cash-order-page {
    .order-box {
      padding: 0 20px;
      .el-card__header {
        padding: 10px 0;
        > div {
          overflow: hidden;
        }
        .header {
          line-height: 36px;
          font-size: 16px;
          color: #606266;
          font-weight: bold;
        }
        .search-box {
          overflow: hidden;
          .search {
            width: 300px;
            margin-right: 10px;
          }
        }
      }
      .el-card__body {
        padding: 20px 0;
      }
    }
    .high-filter {
      font-size: 14px;
      padding-left: 40px;
      background-color: #f5f7fa;
      margin-top: -20px;
      padding-top: 20px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      .el-row {
        margin-bottom: 10px;
      }
      .el-radio-button {
        margin-right: 10px;
        margin-bottom: 10px;
        .el-radio-button__inner {
          border-radius: 4px;
          border: 1px solid #dcdfe6;
        }
        &.is-active {
          .el-radio-button__inner {
            border: 1px solid $--color-primary;
          }
        }
      }
      .filter-name {
        margin-right: 15px;
        color: #909399;
      }
    }

    .order-table {
      width: 100%;
      border: 1px solid #e5ede7;
      border-collapse: collapse;
      th {
        background-color: #f2f2f2;
      }
      th, td {
        color: #909399;
        font-size: 14px;
        padding: 12px 10px;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        text-align: left;
        border: 1px solid #e5ede7;
      }
      td {
        color: #606266;
        p {
          margin: 8px 0;
        }
      }
      .table-order-title {
        background-color: #f2f2f2;
      }
      .table-separation {
        td {
          padding: 7px 10px;
        }
      }
      .goods-img {
        width: 110px;
        border-right: none;
        img {
          width: 90px;
          height: 68px;
          object-fit: cover;
          transition: all 0.3s;
          vertical-align: middle;
        }
      }
      .trading-status {
        color: #909399;
        &.pending {
          color: #f56c6c;
        }
        &.success {
          color: #56c480;
        }
        &.refunded {
          color: #909399;
        }
        &.cancelled {
          color: #f7a16c;
        }
      }
      .goods-name {
        cursor: pointer;
        border-left: none;
        min-width: 100px;
      }
      .order-info {
        span {
          display: inline-block;
          width: 33%;
        }
      }

      .setting {
        button + button, .el-dropdown {
          display: inline-block;
          margin-left: 10px;
        }
      }
      del {
        font-size: 12px;
        color: #909399;
      }
    }

    .order-box .el-radio-group {
      vertical-align: top;
      width: calc(100% - 80px);
    }

    .order-list-box {
      min-height: 118px;
    }
  }
</style>