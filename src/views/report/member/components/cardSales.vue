<template>
  <!--售卡统计-->
  <div class="report-member-cardSales" v-loading="loading">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline fl">
        <el-form-item label="卡片类型">
          <el-select
            v-model="filter.card_type" placeholder="类型"
            @change="getCardSalesData">
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="item in cardTypes"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售出数量">
          <el-input placeholder="" v-model="filter.min_count" type="number">
            <template slot="append">张</template>
          </el-input>
          <span> 至 </span>
          <el-input placeholder="" v-model="filter.max_count" type="number">
            <template slot="append">张</template>
          </el-input>
          <el-button @click="getCardSalesData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" class="table-list">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="卡片类型"></el-table-column>
      <el-table-column prop="count" label="售出数量">
        <template slot-scope="scope">
          {{ scope.row.count || 0}}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="售出金额">
        <template slot-scope="scope">
          {{ scope.row.amount | formatMoney}}
        </template>
      </el-table-column>
      <!--<el-table-column label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button size="small" @click="detailInfo">详情</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <div class="table-total" v-if="tableData.length">
      总计：<span class="red">{{totalAmount | formatMoney}}</span>
    </div>

    <!-- 分页 -->
    <pagination
      v-show="paginate.total>0"
      :total="paginate.total"
      :page.sync="paginate.page"
      :limit.sync="paginate.limit"
      class='pagination'
      @pagination=''/>

    <card-sales-dialog
      ref="detailDialog.show"
      :id="detailDialog.id"
      :show.sync="detailDialog.show"/>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import CardSalesDialog from "./cardSalesDialog";
  import {getCardSalesData} from "@/api/report";
  import {calc} from "@/utils/index";

  const cardTypes = [
    {
      id: 2,
      name: '计次卡',
    },
    {
      id: 3,
      name: '储值卡',
    },
    {
      id: 4,
      name: '余额充值',
    }
  ];
  export default {
    name: "report-member-cardSales",
    components: {
      Pagination,
      CardSalesDialog,
    },
    props: {
      date: Array,
    },
    computed: {},
    data() {
      return {
        loading: false,
        cardTypes,
        formInline: {},
        filter: {
          card_type: '',
          min_count: '',
          max_count: '',
        },
        tableData: [],

        // 分页
        paginate: {
          page: 1,
          limit: 20,
          total: 0,
        },
        detailDialog: {
          show: false,
          id: '',
        },
        totalAmount: 0,
      };
    },

    created() {
      this.getCardSalesData();
    },

    methods: {
      // 获取列表
      getCardSalesData() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          limit: this.paginate.limit,
          start_date: this.date[0],
          end_date: this.date[1],
          ...this.filter,
        };
        getCardSalesData(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = data.data;
          this.paginate.total = data.total;
          this.handelTotalAmount();
        });
      },

      // 详情
      detailInfo(id) {
        this.detailDialog = {
          show: true,
          id,
        }
      },

      // 本页统计
      handelTotalAmount() {
        if (!this.tableData.length) return false;
        this.totalAmount = 0;
        this.tableData.map(n => {
          this.totalAmount = calc(this.totalAmount || 0).plus(n.amount || 0);
        });
      }
    },

    watch: {
      date() {
        this.getCardSalesData();
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .report-member-cardSales {
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
      .el-input-group__append {
        padding: 0 10px;
      }
      .el-button {
        margin-left: 10px;
      }
    }
    .table-total {
      padding: 10px 0;
      line-height: 23px;
      border-bottom: 1px solid #ebeef5;
      font-size: 14px;
      color: #606266;
    }
    .red {
      color: $--color-primary;
    }
  }
</style>