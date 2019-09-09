<template>
  <div class="app-container product_storecard">
    <el-card
      shadow="always"
      class="filter-box mb-15"
    >
      <!--  -->
      <action-bar
        :activeName='synchrodataDialog.activeName'
        :category_id.sync='listQuery.category_id'
        :commandFilterList='commandFilterList'
        :search.sync='listQuery.search'
        :activeTab.sync='activeTab'
        @handleCommand='handleCommand'
        @handleGoodsFilter='handleGoodsFilter'
        @handleSearch='handleSearch'
        @showSynchroDialog='synchrodataDialog.show = true'
        @handleAdd='handleAdd'
      >
        <template slot="0">
          <!-- 列表 -->
          <el-table
            v-loading="listLoading"
            :data='goodsList'
            fit
            style="width: 100%"
            stripe
            class="goods_list"
            ref='goodsList'
            @selection-change="handleSelectionChange"
            @sort-change='handleSort'
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
              label="名称"
              prop='name'
              width='420px'
            >
              <template slot-scope="scope">
                <div class="product_name">
                  <span class='product_img'>
                    <img v-productImg='scope.row.item.imageurl'>
                  </span>
                  {{scope.row.item.name}}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="来源"
            >
              <template slot-scope="scope">
                <span>{{scope.row.item.source_item_id>0?'总部分配':'单店添加'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="分类"
              prop='category'
              sortable='custom'
            >
              <template slot-scope="scope">
                <span>{{scope.row.item.category?scope.row.item.category.name:'-'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="单价"
              prop='price'
              sortable='custom'
            >
              <template slot-scope="scope">
                <span>{{scope.row.item.price | formatMoney}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="时效"
              prop='exp'
              sortable='custom'
            >
              <template slot-scope="scope">
                <span>{{scope.row.exp}}{{scope.row.exp_unit}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              label="备注"
              prop='remark'
            >
              <template slot-scope="scope">
                <span>{{scope.row.item.remark==null||scope.row.item.remark==''?'-':scope.row.item.remark}}</span>
              </template>
            </el-table-column>

            <el-table-column
              width='160'
              align="left"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                >编辑</el-button>
                <!-- <el-button
                  size="mini"
                  @click="handleDelete(scope.row)"
                >删除</el-button> -->
                <el-button
                  size="mini"
                  @click="handleStop(scope.row)"
                >停售</el-button>

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
        </template>

        <template slot="1">
          <!-- 列表 -->
          <el-table
            v-loading="stopListLoading"
            :data='stopGoodsList'
            fit
            style="width: 100%"
            stripe
            class="goods_list"
            ref='goodsList'
            @selection-change="handleSelectionChange"
            @sort-change='handleSort'
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
              label="名称"
              prop='name'
              width='420px'
            >
              <template slot-scope="scope">
                <div class="product_name">
                  <span class='product_img'>
                    <img v-productImg='scope.row.imageurl'>
                  </span>
                  {{scope.row.name}}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="来源"
            >
              <template slot-scope="scope">
                <span>{{scope.row.source_item_id>0?'总部分配':'单店添加'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="分类"
              prop='category'
              sortable='custom'
            >
              <template slot-scope="scope">
                <span>{{scope.row.category?scope.row.category.name:'-'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="单价"
              prop='price'
              sortable='custom'
            >
              <template slot-scope="scope">
                <span>{{scope.row.price | formatMoney}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="时效"
              prop='exp'
              sortable='custom'
            >
              <template slot-scope="scope">
                <span>{{scope.row.exp}}{{scope.row.exp_unit}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              label="备注"
              prop='remark'
            >
              <template slot-scope="scope">
                <span>{{scope.row.remark==null||scope.row.remark==''?'-':scope.row.remark}}</span>
              </template>
            </el-table-column>

            <el-table-column
              width='160'
              align="left"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleSale(scope.row)"
                >开售</el-button>
                <el-button
                  size="mini"
                  @click="handleDelete(scope.row)"
                >删除</el-button>

              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            :layout='layout'
            v-show="stopTotal>0"
            :total="stopTotal"
            :page.sync="stopListQuery.page"
            :limit.sync="stopListQuery.limit"
            class='pagination'
            @pagination="getStopGoodsList"
          />
        </template>
      </action-bar>

      <!-- dialog 商品编辑 -->
      <el-dialog
        :title="dialogTitle[dialogStatus]"
        :visible.sync="dialogEditFormVisible"
        width="770px"
        class="goods_dialog"
      >
        <!-- 编辑 -->
        <el-form
          label-position="right"
          label-width="95px"
          :model="temp.item"
          :rules="rules"
          ref="dataForm"
          :show-message='true'
        >
          <el-row :gutter="20">
            <el-col
              :span='13'
              class="left_content"
            >
              <upload-image :imageurl.sync='temp.item.imageurl'></upload-image>
            </el-col>
            <el-col
              :span='11'
              class='right_content'
            >

              <el-form-item
                label="储值卡名称"
                prop='name'
              >
                <el-input v-model="temp.item.name"></el-input>
              </el-form-item>
              <el-form-item
                label="储值卡分类"
                prop='category_id'
              >
                <el-select
                  v-model="temp.item.category_id"
                  style="width: 100%"
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item,key,index) in commandFilterList"
                    :key='index'
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="储值金额"
                prop='amount'
              >
                <el-input v-model="temp.item.amount"></el-input>
              </el-form-item>
              <el-form-item
                label="赠送金额"
                prop='donation_amount'
              >
                <el-input v-model="temp.item.donation_amount">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="单价"
                prop='price'
              >
                <el-input v-model="temp.item.price"></el-input>
              </el-form-item>
              <el-form-item label="过期可用">
                <el-radio-group v-model="temp.item.is_expired_vaild">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="时效"
                prop='exp'
              >
                <el-input
                  v-model="temp.item.exp"
                  class="exp fl"
                ></el-input>
                <el-select
                  v-model="temp.item.exp_unit"
                  class="exp_unit fl"
                >
                  <el-option
                    v-for="(item,key,index) in ['天','月']"
                    :key="index"
                    :label="item"
                    :value="key"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="备注"
                style="margin-bottom:0px"
              >
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="temp.item.remark"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!--  -->
        <div
          slot="footer"
          class="dialog-footer"
          style="vertical-align: middle;"
        >
          <div
            v-if='dialogStatus=="create"'
            class="fl"
            style="vertical-align: middle;margin-top:10px;"
          >
            <el-checkbox v-model="editStatus.autoAdd">连续增加</el-checkbox>
            <!-- <el-checkbox
              v-model="editStatus.autoCoding"
              style="margin-left:20px;"
            >自动编码</el-checkbox> -->
          </div>
          <el-button @click="dialogEditFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus=='create'?createData():updateData()"
          >确 定</el-button>
        </div>
      </el-dialog>
      <synchrodata-dialog
        :visible.sync='synchrodataDialog.show'
        :activeName='synchrodataDialog.activeName'
      ></synchrodata-dialog>

    </el-card>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import synchrodataDialog from "@/views/product/components/synchrodata-dialog";
import actionBar from "@/views/product/components/action-bar";
import uploadImage from "@/views/product/components/upload-image";
import {
  PpcardList,
  creatPpcard,
  getEditPpcardInfo,
  eaditPpcard,
  deletePpcard,
  deleteInBatchesPpcard,
  productStopList,
  stopProduct,
  saleProduct
} from "@/api/goods";

export default {
  name: "product_storecard",
  components: {
    Pagination,
    synchrodataDialog,
    actionBar,
    uploadImage
  },
  filters: {},
  data() {
    let validNumber = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^(\-|\+)?\d+(\.\d+)?$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    return {
      // 商品分类
      commandFilterList: [],
      // 搜索

      // checkbox
      multipleSelection: [],
      // 商品列表
      listLoading: true,
      goodsList: [],
      // 编辑 temp
      temp: {
        id: null,
        item: {
          name: "",
          category_id: null,
          price: "",
          remark: "",
          amount: "",
          donation_amount: "",
          imageurl: "",
          exp: 12,
          exp_unit: 1,
          is_expired_vaild: 1
        }
      },
      // dialog
      dialogEditFormVisible: false,
      synchrodataDialog: {
        show: false,
        activeName: 3
      },
      dialogStatus: "",
      dialogTitle: {
        create: "新增储值卡",
        edit: "新增储值卡"
      },
      editStatus: {
        autoAdd: false,
        autoCoding: false
      },
      // 校验
      rules: {
        price: [
          { required: true, trigger: "blur", message: "单价不能为空"},
          { validator: validNumber, trigger: "blur", message: "单价格式不正确"}
        ],
        category_id: [{ required: true, trigger: "blur", message: "分类不能为空"}],
        exp: [
          { required: true, trigger: "blur", message: "时效不能为空"},
          { validator: validNumber, trigger: "blur", message: "时效格式不正确"}
        ],
        name: [{ required: true, trigger: "blur", message: "卡片名称不能为空"}],
        amount: [
          { required: true, trigger: "blur", message: "储值金额不能为空"},
          { validator: validNumber, trigger: "blur", message: "储值金额格式不正确"}
        ],
        donation_amount: [
          { required: true, trigger: "blur", message: "赠送金额不能为空"},
          { validator: validNumber, trigger: "blur", message: "赠送金额格式不正确"}
        ]
      },
      // 分页
      listQuery: {
        page: 1,
        limit: 20,
        category_id: "",
        search: "",
        price: "",
        code: ""
      },
      total: 100,
      layout: " sizes, jumper, next, pager, prev, total",

      // 停售列表
      activeTab: "0",
      stopGoodsList: [],
      stopListLoading: true,
      stopListQuery: {
        page: 1,
        limit: 10,
        type: 3
      },
      stopTotal: 0,
      // checkbox
      multipleSelectionStop: []
    };
  },
  methods: {
    // 批量操作
    handleCommand(command) {
      command == "del"
        ? this.showDelBox()
        : command == "stop"
        ? this.showStopBox()
        : this.showSaleBox();
    },
    //商品分类
    // handleCommandFilter(command) {},
    handleGoodsFilter() {
      this.listQuery.page = 1;
      this.getGoodsList();
    },
    // 搜索
    handleSearch() {
      this.handleGoodsFilter();
    },
    // 批量选择
    handleSelectionChange(val) {
      if (this.activeTab == 0) {
        this.multipleSelection = val;
      } else {
        this.multipleSelectionStop = val;
      }
    },
    // 批量删除
    showDelBox() {
      if (this.multipleSelectionStop.length == 0) {
        this.$message.warning("请选择商品进行操作");
        return;
      }
      this.$confirm("确定永久性删除此商品吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.handledelGoods();
        })
        .catch(action => {});
    },
    handledelGoods() {
      let arr = [];
      this.multipleSelectionStop.forEach((v, k) => {
        arr.push(v.product_id);
      });
      let ids = arr.join(",");
      this.deleteProducts(ids);
      // deleteInBatchesPpcard({ ids })
      //   .then(res => {
      //     // this.getGoodsList();
      //     this.getStopGoodsList();
      //     this.$message.success("删除成功");
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.$message.error("删除失败");
      //   });
    },

    // 排序
    handleSort(param) {
      let sort = {},
        prop = param.prop,
        order =
          param.order == "ascending"
            ? "asc"
            : param.order == "descending"
            ? "desc"
            : "";
      console.log(param);
      switch (prop) {
        case "category":
          sort.category = order;
          break;
        case "price":
          sort.price = order;
          break;
        case "exp":
          sort.exp = order;
          break;
        case null:
          sort = {};
          break;
      }
      let { limit, category_id, search } = this.listQuery;
      this.listQuery = Object.assign(
        {},
        { page: 1, limit, category_id, search },
        sort
      );
      this.getGoodsList();
      console.log(this.listQuery);
    },
    // temp
    resetTemp() {
      this.temp = {
        id: null,
        item: {
          name: "",
          category_id: this.commandFilterList[0].id,
          price: "",
          remark: "",
          amount: 0,
          donation_amount: 0,
          imageurl: "",
          exp: 12,
          exp_unit: 1,
          is_expired_vaild: 1
        }
      };
    },
    // 新增商品
    handleAdd() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogEditFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          creatPpcard(this.temp.item)
            .then(res => {
              console.log(this.temp);
              this.getGoodsList();
              this.$message.success("新增成功");
              if (this.editStatus.autoAdd) {
                this.handleAdd();
                return;
              }
              this.dialogEditFormVisible = false;
              console.log(this.temp.item);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    // 编辑商品
    handleEdit(row) {
      this.resetTemp();
      this.temp.id = row.id;
      console.log(this.temp.id);
      getEditPpcardInfo(this.temp.id).then(res => {
        let data = res.success.data;
        console.log(data);
        let {
            amount,
            donation_amount,
            exp,
            exp_unit = 0,
            is_expired_vaild
          } = data,
          { category_id, imageurl, name, price, remark } = data.item;
        this.temp = Object.assign({}, this.temp, {
          item: {
            amount,
            donation_amount,
            exp,
            exp_unit,
            is_expired_vaild,
            category_id,
            imageurl,
            name,
            price,
            remark
          }
        });
        this.dialogStatus = "edit";
        this.dialogEditFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          eaditPpcard(this.temp.id, this.temp.item)
            .then(res => {
              this.dialogEditFormVisible = false;
              console.log(this.temp);
              // this.$refs.uploadImg.submit();
              this.getGoodsList();
              this.$message.success("编辑成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
      //
    },
    getGoodsList() {
      PpcardList(this.listQuery).then(res => {
        console.log(res);
        let data = res.success.data;
        if (this.commandFilterList.length == 0) {
          this.commandFilterList = [...data.cateinfo];
        }
        this.goodsList = [...data.item.data];
        this.total = data.item.total;
        this.listLoading = false;
        console.log(this.goodsList);
      });
    },
    // 删除商品
    handleDelete(row) {
      let id = row.product_id;
      this.$confirm("确定永久性删除此商品吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.deleteProducts(id);
        })
        .catch(action => {});
    },

    deleteProducts(ids) {
      deletePpcard(ids)
        .then(res => {
          // this.getGoodsList();
          this.getStopGoodsList();
          this.$message.success("删除成功");
        })
        .catch(err => {
          console.log(err);
          this.$message.error("删除失败");
        });
    },

    // 获取停售商品
    getStopGoodsList() {
      this.stopListLoading = true;
      productStopList(this.stopListQuery)
        .then(res => {
          let data = res.success.data;
          this.stopGoodsList = [...data.data];
          this.stopTotal = data.total;
          this.stopListLoading = false;
          console.log("停售产品列表", this.stopGoodsList);
        })
        .catch(err => {});
    },

    // 停售商品
    handleStop(row) {
      let id = row.item_id;
      this.$confirm("确定停售此商品吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.stopProducts(id);
        })
        .catch(action => {});
    },

    // 停售商品
    stopProducts(ids) {
      stopProduct(ids)
        .then(res => {
          this.getGoodsList();
          this.getStopGoodsList();

          this.$message.success("停售成功");
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 开售商品
    handleSale(row) {
      let id = row.id;
      this.$confirm("确定开售此商品吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.saleProducts(id);
        })
        .catch(action => {});
    },

    // 开售商品
    saleProducts(ids) {
      saleProduct(ids)
        .then(res => {
          this.getGoodsList();
          this.getStopGoodsList();
          console.log("开售成功");
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 批量停售
    showStopBox() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择商品进行操作");
        return;
      }
      this.$confirm("确定停售此商品吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let ids = this.multipleSelection.map((v, k) => {
            return v.item_id;
          });
          ids.join(",");
          this.stopProducts(ids);
        })
        .catch(action => {});
    },

    // 批量开售
    showSaleBox() {
      if (this.multipleSelectionStop.length == 0) {
        this.$message.warning("请选择商品进行操作");
        return;
      }
      this.$confirm("确定开售此商品吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let ids = this.multipleSelectionStop.map((v, k) => {
            return v.id;
          });
          ids.join(",");
          this.saleProducts(ids);
        })
        .catch(action => {});
    }
  },
  mounted() {},
  created() {
    this.getGoodsList();
  },
  computed: {
    syncDialogShow() {
      return this.synchrodataDialog.show;
    }
  },
  watch: {
    syncDialogShow(val, oldval) {
      if (!val) this.getGoodsList();
    },
    activeTab(val, oldval) {
      if (val == 0 && !this.goodsList.length) {
        this.getGoodsList();
      } else if (val == 1 && !this.stopGoodsList.length) {
        this.getStopGoodsList();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~@/styles/variables.scss";
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;
.product_storecard {
}
</style>
<style lang="scss">
@import "~@/styles/variables.scss";
$fontColor_light: #909399;
$borderColor: #dcdfe5;
.product_storecard {
  .filter-box {
    .el-card__body {
      padding-top: 0;
    }
  }
  // 商品列表
  .goods_list {
    .el-table-column--selection .cell {
      padding: 0px;
    }
    .product_name {
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
    }
  }
  // dialog
  .goods_dialog {
    .left_content {
      width: 341px;
    }
    .right_content {
      .el-input {
        width: 240px;
        .el-input-group__append {
          width: 40px;
          background-color: #f6f8fc;
          padding: 0;
          text-align: center;
        }
        &.exp {
          width: 100px;
        }
      }
      .el-select {
        width: 240px;
        &.exp_unit {
          width: 100px;
          margin-left: 10px;
          .el-input {
            width: 100%;
          }
        }
      }
      .el-textarea {
        width: 240px;
      }
    }
    label {
      font-weight: 400;
    }
    .el-radio-button__inner {
      border: 1px solid $borderColor;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: none;
      border: 1px solid $--color-primary;
    }
  }
}
// 下拉文字颜色
.el-dropdown-menu--medium .el-dropdown-menu__item {
  color: $fontColor_light;
}
.goods_select_option {
  color: $fontColor_light !important;
}
// 提示框警告颜色
.el-message-box__status.el-icon-warning {
  color: #f7a26c;
}

// 按钮 focus
.el-button--primary:focus {
  background: $--color-primary;
  border-color: $--color-primary;
  color: #fff;
}

.cell .el-button:focus {
  color: #606266;
  border-color: #dcdfe6;
  background-color: #fff;
}
</style>
