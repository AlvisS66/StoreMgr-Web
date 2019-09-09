<template>
  <div class="app-container product_goods">
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
              label="编码"
              prop='code'
              sortable='custom'
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
              label="规格"
              prop='sku'
            >
              <template slot-scope="scope">
                <span>{{scope.row.sku==null||scope.row.sku==''?'-':scope.row.sku}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="备注"
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
            @pagination="getStopGoodsList"
          />
        </template>
        <template slot='1'>
          <!-- 停售列表 -->
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
              label="编码"
              prop='code'
              sortable='custom'
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
              label="规格"
              prop='sku'
            >
              <template slot-scope="scope">
                <span>{{scope.row.sku==null||scope.row.sku==''?'-':scope.row.sku}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="备注"
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
        @closed='editStatus.autoAdd = false'
      >
        <!-- 编辑 -->
        <el-form
          label-position="right"
          label-width="80px"
          :model="temp"
          ref="dataForm"
          :rules="rules"
          :show-message='true'
        >
          <el-row :gutter="20">
            <el-col
              :span='13'
              class="left_content"
            >
              <upload-image :imageurl.sync='temp.item.imageurl'></upload-image>
            </el-col>
            <el-col :span='11'>

              <el-form-item
                label="编码"
                prop='item.code'
              >
                <el-input v-model="temp.item.code"></el-input>
                <!--  :disabled="editStatus.autoCoding" -->
              </el-form-item>

              <el-form-item
                label="名称"
                prop='item.name'
              >
                <el-input v-model="temp.item.name"></el-input>
              </el-form-item>
              <el-form-item
                label="商品分类"
                prop='item.category_id'
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
                label="单价"
                prop='item.price'
              >
                <el-input v-model="temp.item.price"></el-input>
              </el-form-item>
              <el-form-item label="商品规格">
                <el-input v-model="temp.item.sku"></el-input>
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
  productList,
  getCreatProductInfo,
  getEditProductInfo,
  eaditProduct,
  creatProduct,
  deleteProduct,
  deleteInBatchesProduct,
  productStopList,
  stopProduct,
  saleProduct
} from "@/api/goods";

export default {
  name: "product_goods",
  components: {
    Pagination,
    synchrodataDialog,
    actionBar,
    uploadImage
  },
  data() {
    let validNumber = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback(new Error());
      } else {
        let reg = /^(\-|\+)?\d+(\.\d+)?$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validCode = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback(new Error());
      } else {
        let reg = /^[0-9]*$/;
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
      //
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
          code: "",
          sku: "",
          imageurl: ""
        }
      },
      // 校验
      rules: {
        "item.code": [
          { required: true, trigger: "blur", message: "编码不能为空"},
          { validator: validCode, trigger: "blur", message: "编码格式不正确"}
        ],
        "item.name": [{ required: true, trigger: "blur", message: "名称不能为空"}],
        "item.category_id": [{ required: true, trigger: "change", message: "分类不能为空"}],
        "item.price": [
          { required: true, trigger: "blur", message: "单价不能为空"},
          { validator: validNumber, trigger: "blur", message: "单价格式不正确"}
        ]
      },
      // dialog
      dialogEditFormVisible: false,
      synchrodataDialog: {
        show: false,
        activeName: 0
      },
      dialogStatus: "",
      dialogTitle: {
        create: "新增商品",
        edit: "编辑商品"
      },
      editStatus: {
        autoAdd: false,
        autoCoding: false
      },

      // 分页
      listQuery: {
        page: 1,
        limit: 10,
        category_id: "",
        search: "",
        price: "",
        code: ""
      },
      total: 0,
      layout: " sizes, jumper, next, pager, prev, total",

      // 停售列表
      activeTab: "0",
      stopGoodsList: [],
      stopListLoading: true,
      stopListQuery: {
        page: 1,
        limit: 10,
        type: 0
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
      // deleteInBatchesProduct({ ids })
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
        case "code":
          sort.code = order;
          break;
        case "category":
          sort.category = order;
          break;
        case "price":
          sort.price = order;
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
          code: "",
          sku: "",
          imageurl: ""
        }
      };
    },
    // 新增商品
    handleAdd() {
      this.resetTemp();
      getCreatProductInfo().then(res => {
        let data = res.success.data;
        this.temp.item.code = data.code;
        console.log(this.temp.code);
        this.editStatus.autoCoding = this.temp.item.code == "" ? false : true;
        this.dialogStatus = "create";
        this.dialogEditFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          creatProduct(this.temp.item)
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
      this.editStatus.autoCoding = true;
      this.temp.id = row.id;
      console.log(this.temp.id);
      getEditProductInfo(this.temp.id).then(res => {
        let data = res.success.data;
        console.log(data);
        let { code, sku } = data,
          { category_id, imageurl, name, price, remark } = data.item;
        this.temp = Object.assign({}, this.temp, {
          item: {
            category_id,
            name,
            price,
            remark,
            code,
            sku,
            imageurl
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
          eaditProduct(this.temp.id, this.temp.item)
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

    // 获取商品列表
    getGoodsList() {
      this.listLoading = true;
      productList(this.listQuery).then(res => {
        let data = res.success.data;
        if (this.commandFilterList.length == 0) {
          this.commandFilterList = [...data.cateinfo];
        }
        this.goodsList = [...data.item.data];
        this.total = data.item.total;
        this.listLoading = false;
        console.log("产品列表", this.goodsList);
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
      deleteProduct(ids)
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
  },

  mounted() {},

  created() {
    this.getGoodsList();
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
.product_goods {
}
</style>
<style lang="scss">
@import "~@/styles/variables.scss";
$fontColor_light: #909399;
$borderColor: #dcdfe5;
.product_goods {
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
  // dialog
  .goods_dialog {
    .left_content {
      width: 341px;
    }
    label {
      font-weight: 400;
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
