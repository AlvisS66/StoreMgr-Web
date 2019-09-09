<template>
  <!--提成明细-->
  <div class="report-shop-summary" v-loading="loading">
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline fl">
        <el-form-item label="员工姓名">
          <el-select v-model="filter.staff_user_id" placeholder="姓名" @change="getPercentageSummary()">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item.realname" :value="item.id" v-for="item in staffs" :key="`staffs${item.id}`"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="提成类型">-->
          <!--<el-select v-model="filter.type" placeholder="服务提成" @change="getPercentageSummary()">-->
            <!--<el-option label="全部" value="all"></el-option>-->
            <!--<el-option label="销售提成" value="sale"></el-option>-->
            <!--<el-option label="服务提成" value="service"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <el-table :data="tableData"
              class="table-list"
              style="width: 100%"
              show-summary
              :summary-method="getSummaries"
              sum-text="本页总计">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="员工姓名" class="name-column">
        <template slot-scope="scope">
          <div class="name-column">
            <img :src="scope.row.avatar_url" alt="" v-if="scope.row.avatar_url">
            <img src="@/assets/index/visitor.png" alt="" v-else>
            {{scope.row.realname}}
            <!--<el-tag type="warning" size="mini" class="icon">点客</el-tag>-->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="product_amount" label="商品提成">
        <template slot-scope="scope">
          {{scope.row.product_amount || 0 | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="services_amount" label="服务提成">
        <template slot-scope="scope">
          {{scope.row.services_amount || 0 | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="ppcard_amount" label="储值卡提成">
        <template slot-scope="scope">
          {{scope.row.ppcard_amount || 0 | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="tcard_amount" label="计次卡提成">
        <template slot-scope="scope">
          {{scope.row.tcard_amount || 0 | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="recharge_amount" label="充值提成">
        <template slot-scope="scope">
          {{scope.row.recharge_amount || 0 | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="total_amount" label="提成合计">
        <template slot-scope="scope">
          {{scope.row.total_amount || 0 | formatMoney}}
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
      @pagination='getPercentageSummary()'/>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {getPercentageSummary, getStaffs} from '@/api/report';
  import {calc} from '@/utils/index';

  export default {
    name: "report-shop-summary",
    components: {
      Pagination
    },
    props: {
      date: Array
    },
    computed: {},
    data() {
      return {
        loading: false,
        filter: {
          type: 'all',
          staff_user_id: '',
        },
        tableData: [],
        staffs: [],
        // 分页
        paginate: {
          page: 1,
          limit: 20,
          total: 100,
        },
      };
    },

    mounted() {
      this.getStaffs();
      this.getPercentageSummary();
    },

    methods: {
      //获取提成汇总
      getPercentageSummary() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          limit: this.paginate.limit,
          start_date: this.date[0],
          end_date: this.date[1],
          ...this.filter,
        };
        getPercentageSummary(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = this.handelTotal(data.data);
          this.paginate.total = data.total;
        });
      },

      //获取员工
      getStaffs() {
        getStaffs().then(res => {
          this.staffs = res.success.data;
        });
      },

      //处理提成合计
      handelTotal(data) {
        data.map(n => {
          n.total_amount = calc(n.product_amount || 0)
            .plus(n.ppcard_amount || 0)
            .plus(n.services_amount || 0)
            .plus(n.recharge_amount || 0)
            .plus(n.tcard_amount || 0)
            .toNumber();
        });
        return data;
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
      }
    },

    watch: {
      date() {
        this.getPercentageSummary();
      }
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .report-shop-summary {
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
      }
    }

    .el-table__footer-wrapper {
      td {
        &:not(:nth-child(1)) {
          color: $--color-primary;
        }
      }
    }
  }

</style>