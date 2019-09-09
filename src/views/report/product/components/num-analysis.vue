<template>
  <!--数量分析表-->
  <div class="report-product-num" v-loading="loading">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline fl">
        <el-form-item label="产品类别">
          <el-select v-model="filter.type" placeholder="选择类别" @change="getProductSaleNumAnalysis">
            <el-option label="全部" value=""></el-option>
            <el-option
              :label="type" :value="index"
              v-for="(type,index) in types"
              :key="`type-${index}`">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-input
        placeholder='产品名称'
        class="input-with-search fr"
        v-model="filter.search"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getProductSaleNumAnalysis"
        clearable
        @clear="getProductSaleNumAnalysis">
      </el-input>
    </div>
    <el-table :data="tableData" style="width: 100%" class="table-list">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="category" label="产品分类"></el-table-column>
      <el-table-column prop="member_num" label="会员">
        <template slot-scope="scope">
          {{scope.row.member_num || 0}}
        </template>
      </el-table-column>
      <el-table-column prop="guest_num" label="散客" width="180">
        <template slot-scope="scope">
          {{scope.row.guest_num || 0}}
        </template>
      </el-table-column>
      <el-table-column prop="sale_count" label="销售数量" width="180">
        <template slot-scope="scope">
          {{scope.row.total_num || 0}}
        </template>
      </el-table-column>
      <el-table-column prop="total_amount" label="销售总额" width="180">
        <template slot-scope="scope">
          {{scope.row.total_amount || 0 | formatMoney}}
        </template>
      </el-table-column>
    </el-table>
    <!--<div class="table-total" v-if="paginate.total>0">本页合计：<span class="red">￥1314.00</span></div>-->

    <!-- 分页 -->
    <pagination
      v-show="paginate.total>0"
      :total="paginate.total"
      :page.sync="paginate.page"
      :limit.sync="paginate.limit"
      class='pagination'
      @pagination ='getProductSaleNumAnalysis()'/>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {getProductSaleNumAnalysis} from '@/api/report';

  export default {
    name: "report-product-num",
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
          search: '',
          type: '',
        },
        tableData: [],
        types: ['商品', '服务', '计次卡', '储值卡', '余额充值'],
        // 分页
        paginate: {
          page: 1,
          limit: 20,
          total: 0,
        },
      };
    },

    mounted() {
      this.getProductSaleNumAnalysis();
    },

    methods: {
      getProductSaleNumAnalysis() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          limit: this.paginate.limit,
          start_date: this.date[0],
          end_date: this.date[1],
          ...this.filter,
        };
        getProductSaleNumAnalysis(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = data.data;
          this.paginate.total = data.total;
        });
      }
    },

    watch: {
      date() {
        this.getProductSaleNumAnalysis();
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  .report-product-num {
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