<template>
  <div class="app-container system-intellect-setting-page" v-loading="loading">
    <div :gutter="10" class="intellect-box" v-if="setting">
      <div class="print-list">
        <!--<div class="print-top"></div>-->
        <div class="print-content">
          <div class="print-inner">
            <h3 class="store_name" v-show="setting.is_store_name">中医理疗店</h3>
            <div class="top-setting common-setting"
                 v-show="setting.is_card_no ||setting.is_member || setting.is_trade_time || setting.is_operator">
              <span v-show="setting.is_card_no">订单编号: NO13456738443</span>
              <span v-show="setting.is_member">会员: 小灰灰 138****438</span>
              <span v-show="setting.is_trade_time">交易时间: 2018/12/10 13:20</span>
              <span v-show="setting.is_operator">收银人员: 胖龙猫</span>
            </div>
            <ul class="detail-setting common-setting" v-show="setting.is_statement">
              <li>
                <span>推拿服务 <br>×1</span>
                <span>¥2,300.00</span>
              </li>
              <li>
                <span>推拿服务 <br>×1</span>
                <span>¥1,200.00</span>
              </li>
              <li>
                <span>推拿服务 <br>×1</span>
                <span>¥800.00</span>
              </li>
            </ul>
            <ul class="summary-setting common-setting" v-show="setting.is_statement">
              <li><span>总价</span><span>¥4300.00</span></li>
              <li><span>折扣</span><span>-¥40.00</span></li>
              <li><span>应收</span><span>¥4300.00</span></li>
              <li><span>实收</span><span>¥4260.00</span></li>
            </ul>
            <ul class="summary-setting common-setting">
              <li v-show="setting.is_staff"><span>服务人员</span><span>小灰灰、胖龙猫</span></li>
              <template v-show="setting.is_payway">
                <li><span>支付方式</span><span></span></li>
                <li><span>储值卡</span><span>¥4260.00</span></li>
              </template>
            </ul>
            <ul class="summary-setting common-setting" v-show="setting.is_card_balance">
              <li v-show="setting.is_point"><span>卡内余额</span><span></span></li>
              <li><span>名称</span><span>计次卡/储值卡/会员余额</span></li>
              <li><span>剩余次数/剩余余额</span><span>10/¥4260.00</span></li>
            </ul>
            <ul class="bottom-setting">
              <li v-show="setting.is_point"><span>本次积分：1000</span><span></span></li>
              <li v-show="setting.is_all_point"><span>总积分：1000</span><span></span></li>
              <li v-show="setting.is_store_tel"><span>门店电话：043-667876459</span><span></span></li>
              <li v-show="setting.is_address"><span>地址：台湾省台北中山区八德路二段232-234号</span><span></span></li>
              <li v-show="setting.is_member_remark"><span>会员备注：</span></li>
              <li v-show="setting.is_order_remark"><span>单据备注：</span></li>
              <li v-show="setting.is_member_sign"><span>顾客签字：</span></li>
            </ul>
            <div class="footer-setting">{{setting.footer_content}}</div>
          </div>
        </div>
      </div>
      <div class="setting-config">
        <el-form ref="form" label-width="80px">
          <el-form-item label="头部打印">
            <el-checkbox v-model="setting.is_store_name" label="店铺名称"></el-checkbox>
            <el-checkbox v-model="setting.is_card_no" label="订单编号"></el-checkbox>
            <el-checkbox v-model="setting.is_trade_time" label="交易时间"></el-checkbox>
            <el-checkbox v-model="setting.is_member" label="会员"></el-checkbox>
            <el-checkbox v-model="setting.is_operator" label="收银人员"></el-checkbox>
          </el-form-item>
          <el-form-item label="账单明细">
            <el-radio-group v-model="setting.is_statement">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打印明细">
            <el-checkbox v-model="setting.is_staff" label="服务人员"></el-checkbox>
            <el-checkbox v-model="setting.is_card_balance" label="卡内余额"></el-checkbox>
            <el-checkbox v-model="setting.is_point" label="本次积分"></el-checkbox>
            <el-checkbox v-model="setting.is_all_point" label="总积分"></el-checkbox>
            <el-checkbox v-model="setting.is_payway" label="支付方式"></el-checkbox>
          </el-form-item>
          <el-form-item label="底部打印">
            <el-checkbox v-model="setting.is_store_tel" label="电话"></el-checkbox>
            <el-checkbox v-model="setting.is_address" label="地址"></el-checkbox>
            <el-checkbox v-model="setting.is_member_remark" label="会员备注"></el-checkbox>
            <el-checkbox v-model="setting.is_order_remark" label="单据备注"></el-checkbox>
            <el-checkbox v-model="setting.is_member_sign" label="顾客签字"></el-checkbox>
          </el-form-item>
          <el-form-item label="页脚内容">
            <el-input v-model="setting.footer_content" class="footer-content"></el-input>
          </el-form-item>
          <el-form-item label="打印方式">
            <el-radio-group v-model="setting.printer_type">
              <el-radio :label="1">结账前打印</el-radio>
              <el-radio :label="2">结账后打印</el-radio>
              <el-radio :label="0">不打印</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打印份数">
            <el-input v-model="setting.printer_num" class="printer-num"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savePrinter">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPrinter, savePrinter} from '@/api/system/printer';

  export default {
    name: "system_intellect_setting",
    data() {
      return {
        loading: false,
        setting: null,
      };
    },
    computed: {},

    mounted() {
      this.getPrinter();
    },

    methods: {
      // 获取打印配置
      getPrinter() {
        this.loading = true;
        getPrinter().then(res => {
          this.loading = false;
          this.setting = res.success.data;
        });
      },

      // 更新打印配置
      savePrinter() {
        savePrinter(this.setting).then(res => {
          console.log(res);
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .system-intellect-setting-page {
    padding-top: 30px;
    min-height: 500px;
    .intellect-box {
      overflow: hidden;
    }
    .print-list {
      width: 450px;
      float: left;
      margin-right: 35px;
    }
    .print-top {
      width: 100%;
      height: 15px;
      background-color: #cbcbcb;
      border: 1px solid #818181;
      border-radius: 50px;
      box-shadow: 0px -1px 0px 1px #9b9b9b;
    }
    .print-content {
      margin: 0 auto;
      width: 420px;
      background-color: #fff;
    }
    .print-inner {
      border: 1px solid #e1dede;
      border-top: none;
      border-bottom: none;
      width: 100%;
      height: 100%;
      position: relative;
      padding: 25px;
      color: #303133;
      font-size: 14px;
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: -16px;
        top: 0;
        width: 449px;
        height: 32px;
        background: url("~@/assets/system/print-top.png");
        background-size: cover;
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: -1px;
        bottom: 0;
        width: 420px;
        height: 21px;
        background: url("~@/assets/system/print-bottom.png");
        background-size: cover;
      }
    }
    .store_name {
      text-align: center;
      font-size: 22px;
      font-weight: 600;
    }

    .common-setting {
      border-bottom: 1px dashed #878787;
      padding: 15px 0;
    }
    .top-setting {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      span {
        line-height: 25px;
      }
    }
    .detail-setting {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 5px 0;
        span {
          line-height: 25px;
        }
      }
    }
    .summary-setting, .bottom-setting {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 5px 0;
        line-height: 25px;
      }
    }
    .bottom-setting {
      padding: 15px 0;
    }
    .footer-setting {
      border-top: 2px solid #878787;
      text-align: center;
      font-size: 16px;
      padding: 25px 0;
    }
    .setting-config {
      float: left;
    }
    .footer-content {
      width: 250px;
    }
    .printer-num {
      width: 100px;
    }
  }
</style>