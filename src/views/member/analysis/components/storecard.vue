<template>
  <div class="memeber_table">
    <el-table
      v-loading="listLoading"
      :data="value"
      fit
      style="width: 100%"
      stripe
      class="member_list"
      ref='memberList'
    >
      <el-table-column
        align="left"
        type='index'
        width="80px"
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="会员姓名"
      >
        <template slot-scope="scope">
          <div class="member_name">
            <span class='avatar_img'>
              <img v-avatar='[scope.row.member.avatar_url,scope.row.member.gender]'>
            </span>
            {{scope.row.member.realname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="卡片名称"
        prop='name'
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="会员手机"
        prop='member.mobile'
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="会员等级"
        prop='member.rank'
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="距上次消费"
        min-width='135'
      >
        <template slot-scope="scope">
          <span>
            {{scope.row.member.active_time | formatActiveTime}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="剩余天数"
      >
        <template slot-scope="scope">
          <span>
            {{scope.row.exp_date | formatTimeS}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="卡内余额"
        prop="card_amount"
      >
        <template slot-scope="scope">
          <span>
            {{calc(scope.row.card_amount).plus(scope.row.donation_amount)| formatMoney}}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="total">
      本页卡内余额总计：<span>￥{{totalAmount}}</span>
    </div>
  </div>
</template>
<script>
import { calc } from "@/utils";

export default {
  name: "storeCardList",
  props: {
    activeName: {
      type: String,
      default: ""
    },
    listLoading: {
      type: Boolean,
      default: true
    },
    value: {
      type: Array,
      default: []
    }
  },
  filters: {
    formatCreat: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.trim().split(" ")[0];
    },

    formatTimeS(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      let feture = new Date(value).getTime();
      let now = new Date().getTime();
      let times = feture - now;
      let days = times / 1000 / 60 / 60 / 24;
      return parseInt(days) + "天";
    },

    // 格式化距上次消费
    formatActiveTime: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      value.trim();
      let index = value.lastIndexOf(":");
      return value.substring(0, index);
    }
  },
  data() {
    return {
      calc
    };
  },
  methods: {},
  mounted() {
    console.log(this.activeName);
  },
  computed: {
    totalAmount() {
      let num = 0;
      this.value.forEach((v, k) => {
        num = calc(num)
          .plus(Number(v.card_amount))
          .plus(Number(v.donation_amount));
      });
      return num.toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
$primaryColor: #f1717e;
.avatar_img {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 50%;
  overflow: hidden;
  background: url("~@/assets/member/avatar-mini.png") no-repeat center;
  img {
    width: 100%;
    height: 100%;
  }
}
.total {
  margin-top: 25px;
  span {
    color: $primaryColor;
  }
}
</style>

<style lang="scss">
</style>

