<template>
  <el-dialog title="订单详情页" class="card-sales-detail-dialog"
             width="770px" top="0" center
             :visible.sync="visible"
             @close="$emit('update:show', false)"
             :show="show">
    <div slot="title" class="dialog-title">
      <button type="button" aria-label="Close" class="header-close-btn" @click="visible = false">
        <svg-icon icon-class="back"/>
      </button>
      <span>订单详情页</span>
    </div>
    <el-scrollbar class="scrollbar" v-loading="loading">
      <div class="search-box">
        <el-input
          placeholder='会员姓名、卡号、手机号'
          class="input-with-search fr"
          v-model="search"
          prefix-icon="el-icon-search"
          @keyup.enter.native=""
          clearable
          @clear="">
        </el-input>
      </div>

      <el-table :data="tableData" style="width: 100%" class="table-list" v-if="tableData.length">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="会员姓名" class="name-column">
          <template slot-scope="scope">
            <div class="name-column">
              <img :src="scope.row.avatar_url" alt="" v-if="scope.row.avatar_url">
              <img src="@/assets/index/visitor.png" alt="" v-else>
              {{scope.row.realname}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="card_no" label="会员卡号"></el-table-column>
        <el-table-column prop="mobile" label="会员手机"></el-table-column>
        <el-table-column prop="rank" label="会员等级"></el-table-column>
        <el-table-column prop="account.card_amount" label="会员余额"></el-table-column>
        <el-table-column prop="payment_amount" label="累计消费"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="paginate.total>0"
        :total="paginate.total"
        :page.sync="paginate.page"
        :limit.sync="paginate.limit"
        class='pagination'
        @pagination=''/>

    </el-scrollbar>
  </el-dialog>
</template>

<script>
  import {calc} from '@/utils/index';
  import Pagination from "@/components/Pagination";

  export default {
    name: "cardSalesDialog",
    components: {
      Pagination
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },

    },
    data() {
      return {
        loading: false,
        visible: this.show,
        search: "",
        tableData : [],
        // 分页
        paginate: {
          page: 1,
          limit: 20,
          total: 0,
        },
      }
    },
    computed: {},

    mounted() {

    },

    methods: {},

    beforeDestroy() {

    },

    filters: {},

    watch: {
      show() {
        this.visible = this.show;
      }
    }
  }
</script>


<style lang="scss">
  @import "~@/styles/variables.scss";

  //详情
  .card-sales-detail-dialog {
    margin: 0;
    overflow: hidden;
    .el-dialog {
      width: 100%;
      height: 100vh;
      margin: 0;
      transition: all .3s;
      float: right;
      animation-duration: .3s;
    }
    &.dialog-fade-enter-active {
      .el-dialog {
        animation-name: detailShow;
      }
    }
    &.dialog-fade-leave-active {
      .el-dialog {
        animation-name: detailHide;
      }
    }
    .dialog-title {
      font-size: 18px;
      color: #303133;
      position: relative;
      line-height: 24px;
    }

    .header-close-btn {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
      > svg {
        width: 24px;
        height: 24px;
        fill: #9b9b9b;
      }
    }
    .el-dialog__headerbtn {
      display: none;
    }
    .top-info {
      overflow: hidden;
      color: #606266;
      margin-bottom: 10px;
      padding-right: 100px;
      position: relative;
      > span {
        float: left;
        display: block;
        line-height: 35px;
        width: 50%;
      }
      .status-icon {
        position: absolute;
        right: 0;
        width: 70px;
      }
    }
    .order-detail-table {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      border-bottom: none;
      .dianke {
        background-color: #e6a23c;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        padding: 2px 5px;
        margin-left: 5px;
      }
    }

    .total {
      padding-top: 20px;
      li {
        line-height: 34px;
        > span {
          padding-left: 125px;
          &.discount {
            color: #e6a23c;
          }
          &.pay {
            color: $--color-primary;;
          }
        }
      }
    }

    .scrollbar {
      height: calc(100vh - 60px);
    }
    .el-scrollbar__view {
      padding: 25px 25px 30px;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-dialog__body {
      padding: 0 !important;
    }
    .dialog-footer {
      padding: 20px 0;
      text-align: center;
      border-top: 1px solid #e4e7ed;
      margin: 20px -20px 0 -20px;
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

    .search-box {
      overflow: hidden;
    }
  }

  @keyframes detailShow {
    0% {
      width: 0;
      opacity: 0;
    }
    100% {
      width: 770px;
      opacity: 1;
    }
  }

  @keyframes detailHide {
    0% {
      width: 770px;
      opacity: 1;
    }
    100% {
      width: 0;
      opacity: 0;
    }
  }
</style>
