<template>
  <!--提成明细-->
  <div class="report-shop-detail" v-loading="loading">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline fl">
        <el-form-item label="员工姓名">
          <el-select v-model="staff_user_id" placeholder="姓名" @change="getPercentageDetails">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item.realname" :value="item.id" v-for="item in staffs" :key="`staffs${item.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--<el-input placeholder="产品名称" v-model="search" class="input-with-search fr">-->
        <!--<el-button slot="append" icon="el-icon-search"></el-button>-->
      <!--</el-input>-->
    </div>
    <el-table :data="tableData" style="width: 100%"
              show-summary
              sum-text="本页总计"
              :summary-method="getSummaries"
              class="table-list">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="员工姓名" class="name-column">
        <template slot-scope="scope">
          <div class="name-column">
            <img :src="scope.row.avatar_url" alt="" v-if="scope.row.avatar_url">
            <img src="@/assets/index/visitor.png" alt="" v-else>
            {{scope.row.staff.realname}}
            <el-tag type="warning" size="mini" class="icon" v-if="scope.row.is_appoint">点客</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="消费日期" width="180"></el-table-column>
      <el-table-column prop="order_item.title" label="产品名称"></el-table-column>
      <el-table-column prop="sale_amount" label="销售业绩" width="180">
        <template slot-scope="scope">
          {{scope.row.sale_amount | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="sale_percentage_amount" label="销售提成" width="180">
        <template slot-scope="scope">
          {{scope.row.sale_percentage_amount | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="labour_amount" label="手工业绩" width="180">
        <template slot-scope="scope">
          {{scope.row.labour_amount | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="labour_percentage_amount" label="手工提成" width="180">
        <template slot-scope="scope">
          {{scope.row.labour_percentage_amount | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click.native="orderInfoShow(scope.row.order_id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination
      v-show="paginate.total>0"
      :total="paginate.total"
      :page.sync="paginate.page"
      :limit.sync="paginate.limit"
      class='pagination'
      @pagination='getPercentageDetails'/>

    <!--详情-->
    <detail-dialog
      ref="detailDialog"
      :show.sync="detailDialog.show"
      :order_id="detailDialog.order_id"
      :is_order="false"
      v-if="detailDialog.show">
    </detail-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {getPercentageDetails, getStaffs} from '@/api/report';
  import {calc} from '@/utils/index';
  import DetailDialog from "../../../cash/order/components/detail-dialog";


  export default {
    name: "report-shop-detail",
    components: {
      Pagination,
      DetailDialog,
    },
    props: {
      date: Array,
    },
    computed: {},
    data() {
      return {
        loading: false,
        staff_user_id: '',
        search: '',
        tableData: [],
        staffs: [],
        // 分页
        paginate: {
          page: 3,
          limit: 20,
          total: 0,
        },
        // 详情
        detailDialog: {
          show: false,
          order_id: '',
        },
      };
    },

    created() {
      this.getStaffs();
      this.getPercentageDetails();
    },

    methods: {
      //获取明细
      getPercentageDetails() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          limit: this.paginate.limit,
          staff_user_id : this.staff_user_id,
          start_date: this.date[0],
          end_date : this.date[1],
        };
        getPercentageDetails(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = data.page.data;
          this.paginate.total = data.page.total;
        });
      },

      //获取员工
      getStaffs() {
        getStaffs().then(res => {
          this.staffs = res.success.data;
        });
      },

      //合计
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '本页合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return calc(prev).plus(curr).toNumber();
              } else {
                return prev;
              }
            }, 0);
            sums[index] = `￥${calc(sums[index]).toFormat(2)}`;
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },

      // 订单详情
      orderInfoShow(order_id) {
        this.detailDialog = {
          show: true,
          order_id,
        }
      },
    },

    watch: {
      date() {
        this.getPercentageDetails();
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .report-shop-detail {
    overflow: hidden;
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
      .icon {
        background-color: #e6a23c;
        color: #fff;
        margin-left: 5px;
      }
    }

    .el-table__footer-wrapper {
      td {
        &:nth-child(5), &:nth-child(6), &:nth-child(7), &:nth-child(8) {
          color: $--color-primary;
        }
      }
    }
  }

</style>