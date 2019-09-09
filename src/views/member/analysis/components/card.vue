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
    </el-table>
  </div>
</template>
<script>
export default {
  name: "cardList",
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
    },

    formatTimeS(value) {
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
    return {};
  },
  methods: {},
  mounted() {
    console.log(this.activeName);
  }
};
</script>

<style lang="scss" scoped>
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
</style>

<style lang="scss">
</style>

