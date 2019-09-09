<template>
  <!--提成明细-->
  <div class="report-shop-birthday" v-loading="loading">
    <div class="search-box">
      <el-input
        placeholder='员工姓名、手机'
        class="input-with-search fr"
        v-model="search"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getBirthdayStaffs"
        clearable
        @clear="getBirthdayStaffs">
      </el-input>
    </div>
    <el-table :data="tableData" style="width: 100%" class="table-list">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="name" label="员工姓名" class="name-column">
        <template slot-scope="scope">
          <div class="name-column">
            <img :src="scope.row.avatar_url" alt="" v-if="scope.row.avatar_url">
            <img src="@/assets/index/visitor.png" alt="" v-else>
            {{scope.row.realname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="联系手机"></el-table-column>
      <el-table-column prop="position.name" label="所属职位"></el-table-column>
      <el-table-column prop="entry_time" label="入职日期">
        <template slot-scope="scope">
          {{scope.row.entry_time | parseTime('{y}-{m}-{d}')}}
        </template>
      </el-table-column>
      <el-table-column label="生日日期">
        <template slot-scope="scope">
          <div class="name-column">
            <span v-if="scope.row.birthday">
              {{scope.row.birthday.date | parseTime('{y}-{m}-{d}')}}
            </span>
            <span v-else>-</span>
          </div>
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
      @pagination='getBirthdayStaffs()'/>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {getBirthdayStaffs} from '@/api/report';
  import {parseTime} from '@/utils/index';

  export default {
    name: "report-shop-birthday",
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
        search: '',
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
      this.getBirthdayStaffs();
    },

    methods: {
      getBirthdayStaffs() {
        this.loading = true;
        let data = {
          page: this.paginate.page,
          limit: this.paginate.limit,
          start_date: this.date[0],
          end_date: this.date[1],
          search: this.search
        };
        getBirthdayStaffs(data).then(res => {
          this.loading = false;
          let data = res.success.data;
          this.tableData = data.data;
          this.paginate.total = data.total;
        });
      }
    },

    watch: {
      date() {
        this.getBirthdayStaffs();
      }
    },

    filters: {
      //格式化时间
      parseTime(time, option) {
        return parseTime(time, option);
      },
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .report-shop-birthday {
    .search-box {
      color: #909399;
      margin-bottom: 10px;
      overflow: hidden;
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
        &:nth-child(5), &:nth-child(6), &:nth-child(7), &:nth-child(8) {
          color: $--color-primary;
        }
      }
    }
  }

</style>