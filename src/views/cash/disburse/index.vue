<template>
  <div class="app-container cash-disburse-page">
    <!--筛选条件-->
    <date-query @dateQuery="getDateQuery($event)"></date-query>

    <el-card shadow="always" class="disburse-table-box">
      <div class="search-box">
        <el-form :inline="true" :model="filter" class="demo-form-inline fl" v-loading="loading">
          <el-form-item label="类型">
            <el-select
              v-model="filter.category_id" placeholder="支出类型"
              @change="getExpenseList">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in cate_list"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工">
            <el-select
              v-model="filter.user_id" placeholder="员工姓名"
              @change="getExpenseList">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in staff_list"
                :key="item.id"
                :label="item.realname"
                :value="item.staff_user_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" class="amount-interval">
            <el-input v-model="filter.start_price" placeholder="支出金额" type="number"></el-input>
            <span>至</span>
            <el-input v-model="filter.end_price" placeholder="支出金额" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button class="fr" @click="addExpense" type="primary">新增支出</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="time" label="支出日期" width="250"></el-table-column>
        <el-table-column prop="cate" label="支出类型" width="180">
          <template slot-scope="scope" v-if="scope.row.cate">
            {{scope.row.cate.name}}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="支出金额" width="180">
          <template slot-scope="scope">
            {{scope.row.price | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="支出员工" width="180">
          <template slot-scope="scope">
            {{scope.row.staff ? scope.row.staff.realname :'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="支出备注">
          <template slot-scope="scope">
            {{scope.row.remark||'-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="total" v-if="tableData.length">本页累计支出总计：<span>{{totalAmount | formatMoney}}</span></div>

      <!-- 分页 -->
      <pagination
        v-show="paginate.total>0"
        :total="paginate.total"
        :page.sync="paginate.page"
        :limit.sync="paginate.page_size"
        class='pagination'
        @pagination='getExpenseList'/>
    </el-card>

    <!--新增支出-->
    <expense
      ref="disburseDialog"
      :show.sync="addDisburse.dialogShow"
      :cate_list="cate_list"
      :staff_list="staff_list"
      @updateList="getExpenseList"
      :data="addDisburse.editData"
      v-if="addDisburse.dialogShow">
    </expense>

  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import DateQuery from "@/components/MyDateQuery";
  import Expense from "./components/expense";
  import {getExpense, getEditData, delExpense} from '@/api/cash/expense';
  import {calc} from '@/utils/index';
  import {validateMoney} from '@/utils/validate';

  export default {
    name: "cash_disburse",
    components: {
      Pagination,
      DateQuery,
      Expense,
    },
    data() {
      return {
        loading: false,
        filter: {
          start_time: '',
          end_time: '',
          start_price: '',
          end_price: '',
          user_id: '',
          category_id: '',
        },
        // 分页
        paginate: {
          page: 1,
          page_size: 10,
          total: 0,
        },
        staff_list: [],
        cate_list: [],
        tableData: [],
        totalAmount: 0,
        // 支出弹框
        addDisburse: {
          dialogShow: false,
          editData: null,
        },
      }
    },
    computed: {},
    mounted() {
      this.getEditData();
    },
    methods: {
      // 获取筛选时间
      getDateQuery(date) {
        [this.filter.start_time, this.filter.end_time] = date;
        this.getExpenseList();
      },

      // 获取列表
      getExpenseList() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          page_size: this.paginate.page_size,
          ...this.filter,
        };
        getExpense(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = data.data;
          this.paginate.total = data.total;
          this.calcTotal(data.data);
        });
      },

      // 计算本页累计支出总计
      calcTotal(data) {
        let total = 0;
        for (let item of data) {
          total = calc(total).plus(item.price);
        }
        this.totalAmount = total;
      },

      // 获取编辑数据
      getEditData() {
        getEditData().then(res => {
          let data = res.success.data;
          this.staff_list = data.staff_list;
          this.cate_list = data.cate_list;
        })
      },

      // 新增支出
      addExpense() {
        this.addDisburse.editData = null;
        this.addDisburse.dialogShow = true;
      },

      // 编辑
      handleEdit(item) {
        let { id, category_id, staff_user_id, remark, time, price } = item;
        let editData = { id, category_id, staff_user_id, remark, time, price };
        this.addDisburse = {
          dialogShow: true,
          editData,
        };
      },

      // 删除支出提示
      handleDelete(id) {
        this.$confirm('确定删除该支出?', '提示', {
          type: 'warning',
          center: true,
        }).then(() => {
          this.delExpense(id);
        }).catch(() => {
        });
      },

      // 删除支出
      delExpense(id) {
        delExpense(id).then(_ => {
          this.$message({
            message: "删除成功",
            type: 'success',
          });
          this.getExpenseList();
        });
      },

      // 金额查询
      onSearch() {
        if (this.filter.start_price || this.filter.end_price) {
          if (!validateMoney(this.filter.start_price) || !validateMoney(this.filter.end_price)) {
            this.$message({
              message: "查询支出金额格式不正确",
              type: 'warning',
            });
            return false;
          }
        }
        this.getExpenseList();
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .cash-disburse-page {
    .search-box {
      color: #909399;
      .el-input {
        width: 120px;
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
    .total {
      padding-top: 20px;
      color: #909399;
      span {
        color: $--color-primary;
      }
    }

    //支出弹窗
    .addDisburse-dialog {
      .el-form {
        width: 310px;
        margin: 0 auto;
      }
      .el-form-item__label {
        font-weight: normal;
        color: #606266;
      }
      .el-select {
        width: 100%;
      }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
</style>