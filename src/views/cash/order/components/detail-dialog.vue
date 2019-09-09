<template>
  <!--账单详情-->
  <el-dialog
    class="order-detail-dialog" width="770px" top="0" center
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    :show="show">
    <div slot="title" class="dialog-title">
      <button type="button" aria-label="Close" class="header-close-btn" @click="visible = false">
        <svg-icon icon-class="back"/>
      </button>
      <span>订单详情页</span>
    </div>
    <el-scrollbar
      class="scrollbar"
      v-loading="loading"
      v-if="!loading">
      <div class="top-info">
        <span>订单号：{{orderInfo.no}}</span>
        <span>交易时间：{{orderInfo.created_at}}</span>
        <span v-if="orderInfo.member">顾客：{{orderInfo.member.realname}} {{orderInfo.member.mobile}}</span>
        <span v-else>顾客：散客</span>
        <span v-if="orderInfo.staff_user">操作人员：{{orderInfo.staff_user.realname}}</span>
        <img class="status-icon" src="@/assets/cash/order-status-success.png" alt="" v-if="orderInfo.status ===2">
        <img class="status-icon" src="@/assets/cash/order-status-cancel.png" alt="" v-if="orderInfo.status ===3">
      </div>
      <el-table :data="orderInfo.order_item" style="width: 100%" center class="order-detail-table">
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            {{scope.row.title}}
            <el-tag type="danger" size="small" v-if="scope.row.is_free">赠送</el-tag>
            <el-tag type="warning" size="small" v-if="scope.row.is_advance">预存</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="120">
          <template slot-scope="scope">
            {{scope.row.discount_price | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" width="88">
          <template slot-scope="scope">
            ×{{scope.row.num}}
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="金额" width="120">
          <template slot-scope="scope">
            {{scope.row.discount_amount | formatMoney}}
            <br>
            <del v-show="scope.row.discount_amount !==scope.row.total_amount">
              {{scope.row.total_amount | formatMoney}}
            </del>
          </template>
        </el-table-column>
        <el-table-column prop="staff" :label="staff_name">
          <template slot-scope="scope">
            {{handelStaffName(scope.row.item_type)}}
            <div v-for="(item,index) in scope.row.staff" :key="item.id+index">
              {{item.staff.realname}} <span class="dianke" v-if="item.is_appoint">点客</span>
            </div>
            <div v-if="!scope.row.staff.length">-</div>
          </template>
        </el-table-column>
      </el-table>
      <ul class="total">
        <li>
          <span class="pay-name">总计：</span>
          <span>{{orderInfo.total_amount | formatMoney}}</span>
        </li>
        <li>
          <span class="pay-name">折扣：</span>
          <span class="discount">-{{orderInfo.discount | formatMoney}}</span>
        </li>
        <li v-for="payment in orderInfo.payments"
            :key="payment.type"
            v-if="orderInfo.payments && orderInfo.payments.length">
          <span class="pay-name">{{globals.PAYMENTS[payment.type]}}：</span>
          <span class="pay">{{payment.amount | formatMoney}}</span>
        </li>
      </ul>
      <div class="dialog-footer">
        <p class="remark">备注：{{orderInfo.remark}}</p>
        <template v-if="is_order">
          <el-button
            @click="refundConfirm(order_id)" size="small"
            v-if="orderInfo.status === 2">
            整单退款
          </el-button>
          <!--打印小票-->
          <my-print-button
            :order_id="orderInfo.id">
          </my-print-button>
        </template>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
  import {calc} from '@/utils/index';
  import MyPrintButton from "@/components/MyPrintButton";
  import {orderInfo, refund} from '@/api/cash/order';
  import * as globals from '@/utils/globals';

  export default {
    name: "order-detail-dialog",
    components: {
      MyPrintButton,
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      order_id: [Number, String],
      is_order: {
        default: true,
        type: Boolean,
      }
    },
    data() {
      return {
        globals,
        loading: false,
        visible: this.show,
        orderInfo: null,
        staff_name: '技师',
      }
    },
    computed: {},

    created() {
      this.getOrderInfo();
    },

    methods: {
      // 订单详情
      getOrderInfo() {
        this.loading = true;
        orderInfo(this.order_id).then(res => {
          this.loading = false;
          let data = res.success.data;
          data.discount = calc(data.total_amount)
            .minus(data.payment_amount).toNumber();
          data.order_item.map(n => {
            n.discount_price = calc(n.discount_amount)
              .div(n.num).toNumber();
          });
          this.orderInfo = data;
        });
      },


      // 整单退款
      refundConfirm(id) {
        this.$confirm('确定全部退款吗？退款后将无法恢复！', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.refund(id);
        }).catch(() => {
        });
      },

      // 退款提交
      refund(id) {
        refund(id).then(res => {
          this.orderInfo.dialogShow = false;
          this.$message({
            type: 'success',
            message: '退款成功!'
          });
          // 刷新数据
          this.$emit('refund-success');
          this.getOrderInfo();
        });
      },

      // 处理充值技师名称
      handelStaffName(item_type) {
        this.staff_name = item_type === globals.RECHARGE ? '营销顾问' : '技师';
      },
    },

    beforeDestroy() {
    },

    filters: {},

    watch: {
      show() {
        this.visible = this.show;
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  //详情
  .order-detail-dialog {
    margin: 0;
    overflow: hidden;
    .el-dialog {
      width: 100%;
      height: 100vh;
      margin: 0;
      transition: all .3s;
      float: right;
      animation-duration: .3s;
    }
    &.dialog-fade-enter-active {
      .el-dialog {
        animation-name: detailShow;
      }
    }
    &.dialog-fade-leave-active {
      .el-dialog {
        animation-name: detailHide;
      }
    }

    .dialog-title {
      font-size: 18px;
      color: #303133;
      position: relative;
      line-height: 24px;
    }

    .header-close-btn {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
      > svg {
        width: 24px;
        height: 24px;
        fill: #9b9b9b;
      }
    }
    .el-dialog__headerbtn {
      display: none;
    }
    .top-info {
      overflow: hidden;
      color: #606266;
      margin-bottom: 10px;
      padding-right: 100px;
      position: relative;
      > span {
        float: left;
        display: block;
        line-height: 35px;
        width: 50%;
      }
      .status-icon {
        position: absolute;
        right: 0;
        width: 70px;
      }
    }
    .order-detail-table {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      border-bottom: none;
      .dianke {
        background-color: #e6a23c;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        padding: 2px 5px;
        margin-left: 5px;
      }
      del {
        font-size: 12px;
        color: #909399;
      }
    }

    .total {
      padding-top: 20px;
      li {
        line-height: 34px;
        > span {
          padding-left: 100px;
          &.discount {
            color: #e6a23c;
          }
          &.pay {
            color: $--color-primary;;
          }
          &.pay-name {
            display: inline-block;
            width: 100px;
            padding-left: 0;
          }
        }
      }
    }

    .scrollbar {
      height: calc(100vh - 60px);
    }
    .el-scrollbar__view {
      padding: 25px 25px 30px;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-dialog__body {
      padding: 0 !important;
    }
    .dialog-footer {
      padding: 20px 0;
      text-align: center;
      border-top: 1px solid #e4e7ed;
      margin: 20px -20px 0 -20px;
      .remark {
        text-align: left;
        padding-left: 25px;
        margin-top: -5px;
      }
      .el-button {
        margin-right: 10px;
      }
    }
  }

  @keyframes detailShow {
    0% {
      width: 0;
      opacity: 0;
    }
    100% {
      width: 770px;
      opacity: 1;
    }
  }

  @keyframes detailHide {
    0% {
      width: 770px;
      opacity: 1;
    }
    100% {
      width: 0;
      opacity: 0;
    }
  }
</style>