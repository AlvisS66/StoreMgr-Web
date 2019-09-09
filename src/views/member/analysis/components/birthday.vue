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
              <img v-avatar='[scope.row.avatar_url,scope.row.gender]'>
            </span>
            {{scope.row.realname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="会员卡号"
        prop='card_no'
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="会员手机"
        prop='mobile'
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="会员等级"
        prop='rank'
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="会员余额"
        prop='account.card_amount'
      >
        <template slot-scope="scope">
          <span>
            {{scope.row.account.card_amount | formatMoney}}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        align="left"
        label="累计消费"
      >
      </el-table-column> -->
      <el-table-column
        align="left"
        label="近期消费日期"
      >
        <template slot-scope="scope">
          <span>{{scope.row.updated_at | formatCreat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="营销顾问"
      >
        <template slot-scope="scope">
          <span>{{scope.row.staffs | formatStaffs}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="生日日期"
      >
        <template slot-scope="scope">
          <span>{{scope.row.birthday | formatBirthday}}</span>
        </template>
      </el-table-column>

    </el-table>
    <div class="total">
      本页会员余额总计：<span>￥{{totalAmount}}</span>
    </div>
  </div>
</template>
<script>
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
    formatStaffs: function(value) {
      if (value.length < 1) {
        return "-";
      }
      let name = [];
      value.forEach((v, k) => {
        name.push(v.realname);
      });
      name = name.join(" ");
      return name;
    },

    formatCreat: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.trim().split(" ")[0];
    },

    formatBirthday: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.date.trim().split(" ")[0];
    }
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    console.log(this.activeName);
  },
  computed: {
    totalAmount() {
      let num = 0;
      this.value.forEach((v, k) => {
        num += Number(v.account.card_amount);
      });
      return num;
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

