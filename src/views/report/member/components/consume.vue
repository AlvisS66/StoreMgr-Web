<template>
  <!--消费排行-->
  <div class="report-member-consume" v-loading="loading">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline fl">
        <el-form-item label="累计消费">
          <el-input placeholder="" v-model.number="filter.min_amount" type="number">
            <template slot="append">元</template>
          </el-input>
          <span> 至 </span>
          <el-input placeholder="" v-model.number="filter.max_amount" type="number">
            <template slot="append">元</template>
          </el-input>
          <el-button style="margin-left: 15px" @click="getMemberRankingList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-input
        placeholder='会员姓名、卡号、手机号'
        class="input-with-search fr"
        v-model="filter.search"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getMemberRankingList"
        clearable
        @clear="getMemberRankingList">
      </el-input>
    </div>
    <el-table :data="tableData" style="width: 100%" class="table-list">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="会员姓名" class="name-column">
        <template slot-scope="scope">
          <div class="name-column">
            <img :src="scope.row.avatar_url" alt="" v-if="scope.row.avatar_url">
            <img src="@/assets/index/visitor.png" alt="" v-else>
            {{scope.row.realname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="card_no" label="会员卡号" width="180"></el-table-column>
      <el-table-column prop="mobile" label="会员手机"></el-table-column>
      <el-table-column prop="rank" label="会员等级"></el-table-column>
      <el-table-column prop="account.card_amount" label="会员余额">
        <template slot-scope="scope">
          {{calc(scope.row.account.card_amount).plus(scope.row.account.donation_amount) | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="payment_amount" label="累计消费">
        <template slot-scope="scope">
          {{scope.row.payment_amount | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="active_time" label="距上次消费" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.active_time">
            {{scope.row.active_time | parseTime('{y}-{m}-{d} {h}:{i}')}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="营销顾问">
        <template slot-scope="scope">
          <span v-for="(staff,index) in scope.row.staffs" :key="`staff${staff.id}${Math.random()}`">
            {{staff.realname}}{{index === scope.row.staffs.length-1 ? '': '、'}}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="paginate.total>0"
      :total="paginate.total"
      :page.sync="paginate.page"
      :limit.sync="paginate.limit"
      class='pagination'
      @pagination='getMemberRankingList()'/>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {getMemberRankingList} from "@/api/report";
  import {calc} from '@/utils/index';

  export default {
    name: "report-member-consume",
    components: {
      Pagination
    },
    props: {
      date: Array,
    },
    computed: {},
    data() {
      return {
        calc,
        loading: false,
        filter: {
          min_amount: '',
          max_amount: '',
          search: '',
        },
        tableData: [],
        // 分页
        paginate: {
          page: 1,
          limit: 20,
          total: 0,
        },
      };
    },

    mounted() {
      this.getMemberRankingList();
    },

    methods: {
      // 消费排行
      getMemberRankingList() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          limit: this.paginate.limit,
          start_date: this.date[0],
          end_date: this.date[1],
          ...this.filter,
        };
        getMemberRankingList(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = data.data;
          this.paginate.total = data.total;
        });
      }
    },

    watch: {
      date() {
        this.getMemberRankingList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .report-member-consume {
    .search-box {
      color: #909399;
      .el-input {
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