<template>
  <!--结账-->
  <el-dialog
    class="billing-accounts-dialog" width="770px"
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    :show="show">
    <div slot="title" class="dialog-title">
      <span class="el-dialog__title">结账</span>
      <span class="time">交易时间：{{ curTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
    </div>
    <el-form class="form-inline" ref="form" label-width="80px" v-loading="loading" @submit.native.prevent>
      <el-form-item label="消费金额">
        <span class="main-color">￥{{total | formatMoney}}</span>
      </el-form-item>
      <el-form-item label="付款方式" class="pay-type">
        <el-button :type="item.selected ? 'primary' : ''" v-for="item in payways" :key="item.id" @click.native="selectPayway(item)">
          <svg-icon :icon-class="`payway-${item.code.toLowerCase()}`" v-if="icons.findIndex(n=>n === `payway-${item.code.toLowerCase()}`) !==-1"/>
          <svg-icon icon-class="payway-tcard" v-else/>
          {{item.name}}
        </el-button>
      </el-form-item>
      <el-form-item label="会员卡" class="pay-select" v-if="memberPayways.length">
        <el-button :type="item.selected ? 'primary' : ''" v-for="item in memberPayways" :key="item.id" @click.native="selectMemberPayway(item)">
          <svg-icon icon-class="payway-mcard"/>
          <div class="pay-select-hover">
            <h4>{{item.name}}</h4>
            <div class="ng-binding">卡金：{{item.card_amount | formatMoney}}</div>
            <div class="ng-binding">赠送金：{{item.donation_amount | formatMoney}}</div>
          </div>
        </el-button>
      </el-form-item>

      <el-form-item label="实收金额" class="pay-type-money" v-if="paywayAllSelectd.length">
        <el-input v-model="item.amount" @blur="handleAccountsInput(item)"
                  v-for="item in paywaySelectd" :key="`memeber-payway-${item.id}`">
          <template slot="prefix">￥</template>
          <template slot="append">{{item.name}}</template>
        </el-input>
        <template v-if="Object.keys(memberPaywaySelectd).length">
          <el-input v-model="memberPaywaySelectd.card_input.amount"
                    @blur="handleAccountsInput(memberPaywaySelectd.card_input)">
            <template slot="prefix">￥</template>
            <template slot="append">{{memberPaywaySelectd.card_input.name}}</template>
          </el-input>
          <el-input v-model="memberPaywaySelectd.donation_input.amount"
                    @blur="handleAccountsInput(memberPaywaySelectd.donation_input)">
            <template slot="prefix">￥</template>
            <template slot="append" :title="memberPaywaySelectd.donation_input.name">
              {{memberPaywaySelectd.donation_input.name}}
            </template>
          </el-input>
        </template>
      </el-form-item>
      <!--<el-form-item label="" class="pay-type-money">-->
      <!--<el-checkbox v-model="timer">是否自动打印</el-checkbox>-->
      <!--</el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="prestore">
        <template v-if="advance.show">
          <el-checkbox v-model="advance.is_advance" class="checkbox">订单预存</el-checkbox>
          <el-popover placement="top-start" width="200" trigger="hover" content="预存后，未来到店可从耗卡中进行消耗">
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </template>
      </div>
      <div class="btn-area">
        <el-button @click="visible= false" size="small">取 消</el-button>
        <el-button type="primary" @click="accountsSubmit" size="small">结 账</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {calc, parseTime} from '@/utils/index';
  import {payway, memberPayway, orderPay} from '@/api/cash/billing';
  import icons from '../../../svg-icons/requireIcons';
  import * as globals from '@/utils/globals';

  export default {
    name: "accounts-dialog",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      total: [Number, String],
      memberId: [Number, String]
    },
    data() {
      return {
        globals,
        loading: false,
        curTime: new Date(),
        timer: '',
        icons,
        visible: this.show,
        payways: [],
        memberPayways: [],
        paywaySelectd: [],
        memberPaywaySelectd: {},
        //预存
        advance: {
          show: false,
          is_advance: false,
        },
        payData: null,
      }
    },
    computed: {
      paywayAllSelectd() {
        let selected = [...this.paywaySelectd];
        if (Object.keys(this.memberPaywaySelectd).length) {
          selected.push(this.memberPaywaySelectd);
        }
        return selected;
      },

    },

    mounted() {
      this.getPayway(); //获取支付方式
      this.curTimeUpdate(); //更新当前时间
      if (!this.memberId) return false;
      this.getMemberPayway(this.memberId);
      if (this.$parent.goodsSelected.findIndex(n => n.type === globals.PRODUCT || n.type === globals.SERVICES) !== -1
        && !this.$parent.cardSelected.length) {
        this.advance.show = true;
      }
    },

    methods: {
      //动态当前时间
      curTimeUpdate() {
        this.timer = setInterval(_ => {
          this.curTime = new Date();
        }, 1000 * 30);
      },

      //获取支付方式
      getPayway() {
        this.loading = true;
        payway().then(res => {
          this.loading = false;
          let payways = res.success.data;
          payways.map(item => {
            item.selected = false;
            item.amount = calc(0).toFormat(2);
          });
          this.payways = payways;
        });
      },

      //获取用户的储值卡和余额
      getMemberPayway(member_id) {
        memberPayway(member_id).then(res => {
          console.log(res.success.data);
          let data = res.success.data;
          let memberPayways = [...data.ppcard];
          if (data.account) {
            data.account.name = '会员余额';
            data.account.isMember = '会员余额';
            memberPayways.push(data.account);
          }
          memberPayways.map(n => n.selected = false);
          this.memberPayways = memberPayways;
        });
      },

      //选择支付方式
      selectPayway(payway) {
        let sum = 0;
        if (payway.selected) {
          payway.amount = calc(0).toFixed(2);
        } else {
          if (this.payways.length) {
            this.payways.forEach(item => {
              sum = calc(sum).plus(item.amount);
            });
            payway.amount = calc(this.total).minus(sum).toFixed(2);
          } else {
            payway.amount = calc(this.total).toFixed(2);
          }
        }
        payway.selected = !payway.selected;
        this.paywaySelectd = [];
        this.payways.forEach(item => {
          if (item.selected) {
            this.paywaySelectd.push(item);
          }
        });
        this.calcPay();
      },

      //选择储值卡或余额
      selectMemberPayway(payway) {
        if (!payway.selected) {
          this.memberPayways.map(n => n.selected = false);
          this.$set(payway, 'card_input', {
            amount: calc(0).toFormat(2),
            name: '卡金',
          });
          this.$set(payway, 'donation_input', {
            amount: calc(0).toFormat(2),
            name: '赠送金',
          });
          this.memberPaywaySelectd = payway;
        } else {
          this.memberPaywaySelectd = {};
        }
        payway.selected = !payway.selected;
        this.calcPay();
      },

      // 自动分配金额
      calcPay() {
        if (this.paywaySelectd.length) {
          this.paywaySelectd.map((item, index) => {
            if (index) {
              item.amount = calc(0).toFormat(2);
            } else {
              item.amount = calc(this.total).toFormat(2);
            }
          });
          if (this.memberPaywaySelectd.card_input) {
            let amount = calc(0).toFormat(2);
            this.memberPaywaySelectd.card_input.amount
              = this.memberPaywaySelectd.donation_input.amount
              = amount;
          }
        } else {
          if (this.memberPaywaySelectd.card_input) {
            this.memberPaywaySelectd.card_input.amount = calc(this.total).toFormat(2);
          }
        }
      },

      //格式化金额
      handleAccountsInput(account) {
        let amount = account.amount;
        amount = Number(amount);
        if (isNaN(amount) || amount < 0) {
          amount = 0;
        }
        amount = calc(amount).toFixed(2);
        account.amount = amount;
        console.log('格式化金额', account.amount);
        return amount;
      },

      //结账
      accountsSubmit() {
        this.handelPayways();
      },

      //处理获取选中支付方式
      handelPayways() {
        let data = {
          is_advance: Number(this.advance.is_advance),
        };
        data.pay_data = [];
        this.payways.forEach(item => {
          if (item.selected) {
            let selected = {
              pay_id: item.id,
              amount: item.amount,
            };
            data.pay_data.push(selected);
          }
        });
        if (Object.keys(this.memberPaywaySelectd).length) {
          let memberPayway = {
            card_amount: this.memberPaywaySelectd.card_input.amount,
            donation_amount: this.memberPaywaySelectd.donation_input.amount,
          };
          if (this.memberPaywaySelectd.isMember) {
            memberPayway.account_id = this.memberPaywaySelectd.id;
          } else {
            memberPayway.user_ppcard_id = this.memberPaywaySelectd.id;
          }
          data.pay_data.push(memberPayway);
        }
        if (!data.pay_data.length) {
          this.$message({
            message: '请至少选择一种支付方式！',
            type: 'error'
          });
          return false;
        }
        this.payData = data;
        this.$parent.saveOrder();
      },

      //支付
      orderPay(order_id) {
        let data = this.payData;
        data.order_id = order_id;
        orderPay(data).then(res => {
          this.$parent.successDialog = {
            show: true,
            order_id,
          };
          this.visible = false;
          this.$parent.resetOrder();
          this.$parent.tabs.activeName = 'category-0';
        });
      },
    },

    beforeDestroy() {
      clearInterval(this.timer); //停止更新时间
    },

    filters: {
      //格式化金额
      formatMoney(money) {
        return calc(money).toFormat(2);
      },

      //格式化时间
      parseTime(time, option) {
        return parseTime(time, option);
      },
    },

    watch: {
      show() {
        this.visible = this.show;
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .billing-accounts-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #e4e7ed;
      overflow: hidden;
      .time {
        float: right;
        padding-right: 30px;
        vertical-align: middle;
        color: #606266;
        font-size: 14px;
        line-height: 24px;
      }
    }
    .el-form-item__label {
      font-weight: normal;
    }

    .pay-type {
      .el-button {
        padding: 0 20px;
        line-height: 40px;
        height: 40px;
        > span {
          display: flex;
          align-items: center;
        }
        svg {
          width: 34px;
          height: 34px;
          margin-right: 10px;
        }
      }
      .el-checkbox {
        display: inline-flex;
        align-items: center;
        padding: 0 20px 0 10px;
        margin-bottom: 10px;
      }
    }

    .pay-select {
      .el-button {
        margin-bottom: 10px;
        > span {
          display: inline-flex;
          align-items: center;
        }
        svg {
          width: 34px;
          height: 34px;
        }
      }
      .pay-select-hover {
        text-align: left;
        padding-left: 10px;
        font-size: 12px;
      }
      .ng-binding {
        line-height: 20px;
      }
      h4 {
        font-weight: normal;
        margin: 0 0 10px 0;
        font-size: 14px;
      }
    }

    .pay-type-money {
      .el-form-item__content {
        width: 30%;
      }
      .el-input {
        margin-bottom: 20px;
      }
      .el-input__prefix {
        line-height: 36px;
        left: 10px;
      }
    }

    .el-input-group__append {
      background-color: #f5f7fa;
      min-width: 85px;
      text-align: center;
    }

    .el-dialog__footer {
      border-top: 1px solid #e4e7ed;
    }
    .dialog-footer {
      display: flex;
      justify-content: space-between;
    }

    .prestore {
      display: flex;
      align-items: center;
    }
    .el-icon-question {
      color: #d5d8de;
      font-size: 18px;
      margin-left: 5px;
      cursor: pointer;
      vertical-align: middle;
    }

  }
</style>