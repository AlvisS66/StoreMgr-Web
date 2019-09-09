<template>
  <div class="app-container synchrodata">
    <!-- 同步数据 -->
    <el-dialog
      :visible.sync="show"
      class="edit-dialog"
      top="0"
      center
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <button
          type="button"
          aria-label="Close"
          class="header-close-btn"
          @click="show = false"
        >
          <svg-icon icon-class="back" />
        </button>
        <span>{{editDialog.editTitle[activeName]}}</span>
      </div>
      <el-scrollbar class="scrollbar">
        <div class="pr-10">
          <div class="clearfix Sync_Operate">
            <el-button
              plain
              class="fl"
              @click="handleOperateSyncMultiple"
            >
              批量同步
            </el-button>
            <el-input
              :placeholder="editDialog.placeholder[activeName]"
              class="fr search"
              v-model="listQuery.search"
              prefix-icon="el-icon-search"
              clearable
              @change='handleSearch'
            ></el-input>
          </div>
          <!-- 编辑 -->
          <el-table
            v-loading="editDialog.listLoading"
            :data="goodsList"
            fit
            style="width: 100%"
            stripe
            class="goods_list"
            ref='goodsList'
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              align="left"
              type='index'
              width="40px"
            >
            </el-table-column>

            <el-table-column
              align="left"
              type='selection'
              width="30px"
            >

            </el-table-column>

            <el-table-column
              align="left"
              label="编码"
              prop='code'
              key="code"
              v-if='activeName==0||activeName==1'
            >
              <template slot-scope="scope">
                <span>{{scope.row.code}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              label="名称"
              prop='name'
              width='420px'
            >
              <template slot-scope="scope">
                <div class="product_name">
                  <span class='product_img'>
                    <img
                      :src="scope.row.imageurl"
                      alt=""
                    >
                  </span>
                  {{scope.row.name}}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="分类"
              prop='category'
            >
              <template slot-scope="scope">
                <span>{{scope.row.catename}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              label="单价"
              prop='price'
            >
              <template slot-scope="scope">
                <span>￥{{scope.row.price}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="时效"
              prop='exp'
              sortable='custom'
              v-if='activeName==2||activeName==3'
              key='exp'
            >
              <template slot-scope="scope">
                <span>{{scope.row.exp}}{{scope.row.exp_unit==0?'天':'月'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="状态"
            >
              <template slot-scope="scope">
                <span>{{scope.row.is_sync?'同步':'未同步'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width='170'
              align="left"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleOperateSync(scope.row)"
                  type="primary"
                  :plain='scope.row.is_sync==1'
                >{{scope.row.is_sync?'同步取消':'同步'}}</el-button>
                <!-- <el-button
                  size="mini"
                  @click="handleDel(scope.row)"
                >删除</el-button> -->
              </template>
            </el-table-column>

          </el-table>
          <!-- 分页 -->
          <pagination
            :layout='layout'
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            class='pagination'
            @pagination="getGoodsList"
          />
        </div>

      </el-scrollbar>
    </el-dialog>

  </div>

</template>

<script>
import Pagination from "@/components/Pagination";
import { syncDataList, operateSync } from "@/api/goods";

export default {
  name: "synchrodata-dialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: Number,
      default: 0
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      editDialog: {
        listLoading: true,
        show: false,
        editTitle: ["商品列表", "服务列表", "次卡列表", "储值卡列表"],
        placeholder: [
          "搜索编码、名称",
          "搜索编码、名称",
          "搜索名称",
          "搜索名称"
        ]
      },
      multipleSelection: [],
      goodsList: [],
      listQuery: {
        search: undefined,
        page: 1,
        limit: 10
      },
      total: 0,
      layout: " sizes, jumper, next, pager, prev, total"
    };
  },
  methods: {
    // filter
    handleSearch() {
      this.listQuery.page = 1;
      this.getGoodsList();
    },

    // 批量操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleOperateSyncMultiple() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择产品进行操作");
        return;
      }
      this.$confirm(
        `确定是否批量同步已选择的${this.multipleSelection.length}件产品?`,
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          console.log(this.multipleSelection);
          let arr = [];
          this.multipleSelection.forEach((v, k) => {
            arr.push(v.id);
          });
          let id = arr.join(",");
          this.operateSyncData({ id, is_sync: 1 });
        })
        .catch(action => {});
    },

    // 同步操作
    handleOperateSync(row) {
      let { id, is_sync } = row,
        title = is_sync ? "取消该同步" : "同步该";
      this.$confirm(`确定是否${title}产品?`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          console.log(row);
          is_sync = is_sync == 0 ? 1 : 0;
          this.operateSyncData({ id, is_sync });
        })
        .catch(action => {});
    },

    operateSyncData(data) {
      operateSync(data)
        .then(res => {
          this.getGoodsList();
          this.$message.success("同步成功");
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 产品列表
    getGoodsList() {
      syncDataList(this.activeName, this.listQuery)
        .then(res => {
          let data = res.success.data;
          console.log(data);
          this.goodsList = [...data.item.data];
          this.total = data.item.total;
          this.editDialog.listLoading = false;
          console.log("synchrodata-dialog");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {},
  mounted() {},
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.editDialog.listLoading = true;
        this.getGoodsList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
$tbColor: #ebeef5;
.app-container {
  padding: 0;
}
.Sync_Operate {
  padding-bottom: 10px;
  border-bottom: 1px solid $tbColor;
}
.product_img {
  display: inline-block;
  width: 109px;
  height: 82px;
  margin-right: 10px;
  vertical-align: middle;
  background: url("~@/assets/product/product_bg.png") no-repeat center;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

<style lang="scss">
@import "~@/styles/variables.scss";
$dialogColor: #e4e7ed;
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;

.synchrodata {
  .search {
    width: 240px;
  }
  // dialog 编辑
  $dialogW: calc(100% - 210px);
  // dialog
  .el-dialog {
    border-radius: 4px;
    label {
      font-weight: 400;
    }
    .el-dialog__header {
      padding: 20px;
      border-bottom: 1px solid $dialogColor;
      .el-dialog__title {
        font-size: 16px;
      }
    }
    .el-dialog__footer {
      border-top: 1px solid $dialogColor;
      padding: 15px 20px;
    }
  }
  .edit-dialog {
    margin: 0;
    overflow: hidden;
    // width: $dialogW;
    width: 100%;
    left: auto;
    .el-dialog {
      width: $dialogW;
      height: 100vh;
      margin: 0;
      transition: all 0.3s;
      float: right;
      animation-duration: 0.3s;
      border-radius: 4px;
      label {
        font-weight: 400;
      }
    }
    &.dialog-fade-enter-active {
      .el-dialog {
        animation-name: dialogShow;
      }
    }
    &.dialog-fade-leave-active {
      .el-dialog {
        animation-name: dialogHide;
      }
    }
    .dialog-title {
      font-size: 16px;
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

    .el-dialog__body {
      height: calc(100vh - 55px);
    }
    .el-dialog__header {
    }
    .el-dialog__footer {
      text-align: right;
    }
    .el-table {
      .el-button--primary {
        &:focus {
          color: #fff;
          background-color: $--color-primary;
          border-color: $--color-primary;
        }
        &:hover {
          background: #f48d98;
          border-color: #f48d98;
          color: #fff;
        }
        &.is-plain {
          &:focus {
            color: $--color-primary;
            background: #fef1f2;
            border-color: #f9c6cb;
          }
          &:hover {
            background: $--color-primary;
            border-color: $--color-primary;
            color: #fff;
          }
        }
      }
    }
    .el-button {
      &.is-plain {
        &:focus {
          background: #fff;
          border-color: #dcdfe6;
          color: $fontColor;
        }
        &:hover {
          background: #fff;
          border-color: $--color-primary;
          color: $--color-primary;
        }
      }
    }
  }
  @keyframes dialogShow {
    0% {
      width: 0;
      opacity: 0;
    }
    100% {
      width: $dialogW;
      opacity: 1;
    }
  }
  @keyframes dialogHide {
    0% {
      width: $dialogW;
      opacity: 1;
    }
    100% {
      width: 0;
      opacity: 0;
    }
  }
  // scrollbar
  .scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

// 提示框警告颜色
.el-message-box__status.el-icon-warning {
  color: #f7a26c;
}
</style>
