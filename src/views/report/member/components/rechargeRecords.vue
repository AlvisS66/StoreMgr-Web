<template>
  <!--充值明细-->
  <div class="report-member-rechargeRecords">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline fl">
        <el-form-item label="会员等级">
          <el-select v-model="filter.rank_id" placeholder="请选择" @change="getRechargeRecords">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in ranks"
              :key="item.name + item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营销顾问">
          <el-select v-model="filter.seller_id" placeholder="请选择" @change="getRechargeRecords">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in staffs"
              :key="item.realname + item.id"
              :label="item.realname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人">
          <el-select v-model="filter.operator_id" placeholder="请选择" @change="getRechargeRecords">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in staffs"
              :key="item.realname + item.id"
              :label="item.realname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-input
        placeholder='会员姓名、卡号、手机号'
        class="input-with-search fr"
        v-model="filter.search"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getRechargeRecords"
        clearable
        @clear="getRechargeRecords">
      </el-input>
    </div>

    <el-table :data="tableData" style="width: 100%" class="table-list">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="会员姓名" class="name-column">
        <template slot-scope="scope">
          <div class="name-column" v-if="scope.row.member">
            <img :src="scope.row.member.avatar_url" alt="" v-if="scope.row.member.avatar_url">
            <img src="@/assets/index/visitor.png" alt="" v-else>
            {{scope.row.member.realname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="member.card_no" label="会员卡号" width="180"></el-table-column>
      <el-table-column prop="member.mobile" label="会员手机"></el-table-column>
      <el-table-column prop="member.rank" label="会员等级"></el-table-column>
      <el-table-column prop="updated_at" label="充值日期"></el-table-column>
      <el-table-column prop="account.card_amount" label="营销顾问">
        <template slot-scope="scope" v-if="scope.row.member">
          <span v-for="(item,index) in scope.row.member.staffs" :key="item.realname + index">
            {{item.realname}}{{index === scope.row.member.staffs.length -1 ? '' : '、'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="order_card_amount" label="充值金额">
        <template slot-scope="scope">
          {{scope.row.order_card_amount | formatMoney}}
          <small v-if="scope.row.donation_amount">
            （赠送:{{scope.row.order_donation_amount | formatMoney}}）
          </small>
        </template>
      </el-table-column>
      <el-table-column prop="operator.realname" label="操作人"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="paginate.total>0"
      :total="paginate.total"
      :page.sync="paginate.page"
      :limit.sync="paginate.limit"
      class='pagination'
      @pagination='getRechargeRecords()'/>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {getRechargeRecords, getRank, getStaff} from "@/api/report";

  export default {
    name: "report-member-rechargeRecords",
    components: {
      Pagination
    },
    props: {
      date: Array,
    },
    computed: {},
    data() {
      return {
        loading: false,
        filter: {
          rank_id: '',
          seller_id: '',
          operator_id: '',
          search: '',
        },
        tableData: [],
        staffs: [],
        ranks: [],
        // 分页
        paginate: {
          page: 1,
          limit: 10,
          total: 0,
        },
      };
    },

    mounted() {
      this.getRank();
      this.getStaff();
      this.getRechargeRecords();
    },

    methods: {
      // 获取明细
      getRechargeRecords() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          limit: this.paginate.limit,
          start_date: this.date[0],
          end_date: this.date[1],
          ...this.filter,
        };
        getRechargeRecords(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = data.data;
          this.paginate.total = data.total;
        });
      },

      // 获取会员等级
      getRank() {
        getRank().then(res => {
          this.ranks = res.success.data;
        });
      },

      // 获取营销顾问
      getStaff() {
        getStaff().then(res => {
          this.staffs = res.success.data.data;
        });
      }

    },

    watch: {
      date() {
        this.getRechargeRecords();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .report-member-rechargeRecords {
    .search-box {
      color: #909399;
      .el-select {
        width: 120px;
      }
      .input-with-search {
        width: 300px;
      }
      .amount-interval {
        display: inline-block;
        padding-left: 30px;
        .el-form-item__content {
          display: inline-block;
          > span {
            padding: 0 10px;
          }
        }
      }
      .el-form-item__label {
        color: #909399;
        font-weight: normal;
      }
    }

    .name-column {
      img {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        border-radius: 100%;
        margin-right: 10px;
      }
    }
  }
</style>