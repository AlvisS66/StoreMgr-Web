<template>
  <div class="app-container product_card">
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
        width="960px"
        class="goods_dialog"
      >
        <!-- 编辑 -->
        <el-form
          label-position="right"
          label-width="80px"
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
              class="right_content"
            >
              <el-scrollbar
                class="scrollbar"
                ref='scrollbar'
              >
                <div>
                  <el-form-item
                    label="次卡类型"
                    prop='is_limit'
                  >
                    <el-radio-group
                      v-model="temp.item.is_limit"
                      @change='handleChangeTcardLimit'
                    >
                      <el-radio-button label="1">有限次卡</el-radio-button>
                      <el-radio-button label="0">无限次卡</el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item
                    label="卡片名称"
                    prop='name'
                  >
                    <el-input v-model="temp.item.name"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="次卡分类"
                    prop='category_id'
                  >
                    <el-select v-model="temp.item.category_id">
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
                    label="指定服务"
                    class="form_tablelist"
                    required
                  >
                    <template>
                      <el-table
                        style="width: 100%"
                        :data='tcard_items'
                      >
                        <el-table-column
                          label="产品名称"
                          width='125'
                        >
                          <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="单价"
                          width='75'
                        >
                          <template slot-scope="scope">
                            <span>{{scope.row.price | formatMoney}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="卡内次数">
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.time"
                              :disabled='temp.item.is_limit==0'
                            >
                              <template slot="append">次</template>
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="平均单次价格">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.avg_price"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          width='75'
                          label="操作"
                        >
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              @click="deletTcardItems(scope.row)"
                            >
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-button
                        type="primary"
                        class="add_button"
                        @click="showInnerDialog"
                      >+&nbsp;&nbsp;添加匹配产品</el-button>
                    </template>
                  </el-form-item>
                  <el-form-item label="过期可用">
                    <el-radio-group
                      v-model="temp.item.is_expired_vaild"
                      :disabled='temp.item.is_limit==0'
                    >
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
                    label="单价"
                    prop='price'
                  >
                    <div>
                      <el-input
                        v-model="temp.item.price"
                        class="fl"
                      ></el-input>
                      <el-button
                        type="primary"
                        class="fl auto_count"
                        v-if="temp.item.price !='' && temp.item.price>0 && temp.item.is_limit==1"
                        @click='handleCalcPrice'
                      >核算单次均价</el-button>
                    </div>

                  </el-form-item>
                  <el-form-item
                    label="备注"
                    style="margin-bottom:0px; margin-bottom: 10px;"
                  >
                    <el-input
                      type="textarea"
                      :rows="3"
                      v-model="temp.item.remark"
                    >
                    </el-input>
                  </el-form-item>

                </div>
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-form>
        <!-- 内层 dialog -->
        <el-dialog
          width="746px"
          title="添加搭配商品"
          :visible.sync="innerAddItemVisible"
          append-to-body
          class="addProduct_dialog"
        >
          <div class="inner_content clearfix">
            <el-tabs
              tab-position="left"
              v-model="activeName"
            >
              <el-tab-pane
                label="商品"
                name='0'
              ></el-tab-pane>
              <el-tab-pane
                label="服务"
                name='1'
              ></el-tab-pane>
            </el-tabs>
            <div
              class="fl tab_right_content"
              v-loading='addListLoading'
            >
              <el-scrollbar
                class="scrollbar"
                ref='scrollbar_addItem'
                v-if='!addListLoading'
              >
                <div class="content_header clearfix">
                  <el-select
                    placeholder="产品分类"
                    v-model='addFilter.category_id'
                    @change='handleFilterAddItem'
                    class="fl"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="(item,key,index) in addFilterList"
                      :key='index'
                      class="goods_select_option"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    placeholder='产品名称、编号'
                    class="fr search"
                    v-model="addFilter.search"
                    suffix-icon="el-icon-search"
                    clearable
                    @change="handleFilterAddItem"
                  >
                  </el-input>
                </div>
                <div class="content_body">
                  <el-table
                    style="width: 100%"
                    :data='addItemList'
                    @selection-change="handleSelectAddItem"
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
                    >
                      <template slot-scope="scope">
                        <span v-if='activeName=="0"'>{{scope.row.product.code}}</span>
                        <span v-else>{{scope.row.service.code}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="left"
                      label="名称"
                      prop='name'
                      min-width='240px'
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
                      label="价格"
                      width='100'
                    >
                      <template slot-scope="scope">
                        <span>{{scope.row.price | formatMoney}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
            style="vertical-align: middle;"
          >
            <el-button @click="innerAddItemVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="handleAddItem"
            >确 定</el-button>
          </div>
        </el-dialog>
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
  tcardList,
  getEditTcardInfo,
  addItems,
  creatTcard,
  eaditTcard,
  deleteTcard,
  deleteInBatchesTcard,
  productStopList,
  stopProduct,
  saleProduct
} from "@/api/goods";
import { calc } from "@/utils";

export default {
  name: "product_card",
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
      //
      // checkbox
      multipleSelection: [],
      // 商品列表
      listLoading: true,
      goodsList: [],
      // 编辑 temp
      temp: {
        id: null,
        tcard_items: [],
        item: {
          is_limit: 1,
          name: "",
          category_id: null,
          price: "",
          remark: "",
          imageurl: "",
          items_id: "",
          times: "",
          avg_price: "",
          exp: 12,
          exp_unit: 1,
          is_expired_vaild: 1
        }
      },
      // dialog
      dialogEditFormVisible: false,
      synchrodataDialog: {
        show: false,
        activeName: 2
      },
      dialogStatus: "",
      dialogTitle: {
        create: "新增次卡",
        edit: "编辑次卡"
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
        is_limit: [{ required: true, trigger: "blur", message: "次卡类型不能为空"}],
        category_id: [{ required: true, trigger: "blur", message: "分类不能为空"}],
        exp: [
          { required: true, trigger: "blur", message: "时效不能为空"},
          { validator: validNumber, trigger: "blur", message: "时效格式不正确"}
        ],
        name: [{ required: true, trigger: "blur", message: "卡片名称不能为空"}]
      },
      // dialog table
      showProductList: [
        {
          name: "22",
          price: "11",
          number: 1,
          oneprice: "11"
        }
      ],
      // dialog addItem
      innerAddItemVisible: false,
      activeName: "0",
      addFilterList: [],
      addItemList: [],
      addListLoading: true,
      addFilter: {
        category_id: undefined,
        search: undefined
      },
      addMultipleSelection: [],
      // 分页
      listQuery: {
        page: 1,
        limit: 10,
        category_id: "",
        search: ""
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
        type: 2
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
      // deleteInBatchesTcard({ ids })
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
        tcard_items: [],
        item: {
          is_limit: 1,
          name: "",
          category_id: this.commandFilterList[0].id,
          price: "",
          remark: "",
          imageurl: "",
          // items_id: "",
          // times: "",
          // avg_price: "",
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
        this.$refs["scrollbar"].wrap.scrollTop = 0;
        this.$refs["dataForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.resetTimes();
          this.resetEditData();
          creatTcard(this.temp.item)
            .then(res => {
              console.log("编辑temp", this.temp);
              this.getGoodsList();
              this.$message.success("新增成功");
              if (this.editStatus.autoAdd) {
                this.handleAdd();
                return;
              }
              this.dialogEditFormVisible = false;
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
      console.log("产品id", this.temp.id);
      getEditTcardInfo(this.temp.id).then(res => {
        let data = res.success.data;
        console.log("产品信息", data);
        let { is_limit, exp, exp_unit = 0, is_expired_vaild } = data.info,
          { category_id, imageurl, name, price, remark } = data.info.item,
          { tcard_items } = data;
        tcard_items.forEach((v, k) => {
          tcard_items[k] = Object.assign({}, v, {
            is_del: 0
          });
        });
        if (is_limit == 0) {
          tcard_items.map(item => {
            return (item.time = "无限");
          });
        }

        this.temp = Object.assign({}, this.temp, {
          tcard_items,
          item: {
            is_limit,
            category_id,
            imageurl,
            name,
            price,
            remark,
            exp,
            exp_unit,
            is_expired_vaild
            // items_id: "",
            // times: "",
            // avg_price: ""
          }
        });
        console.log("编辑temp", this.temp);
        this.dialogStatus = "edit";
        this.dialogEditFormVisible = true;
        this.$nextTick(() => {
          this.$refs["scrollbar"].wrap.scrollTop = 0;
          this.$refs["dataForm"].clearValidate();
        });
      });
    },

    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.resetTimes();
          this.resetEditData();
          eaditTcard(this.temp.id, this.temp.item)
            .then(res => {
              this.dialogEditFormVisible = false;
              console.log("编辑temp", this.temp);
              this.getGoodsList();
              this.$message.success("编辑成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // resetData() {
    //   let items_id = [],
    //     times = [],
    //     avg_price = [],
    //   this.temp.tcard_items.forEach((v, k) => {
    //     let id = v.item_id,
    //       count = v.time,
    //       price = v.avg_price;
    //     items_id.push(id);
    //     times.push(count);
    //     avg_price.push(price);
    //   });
    //   items_id = items_id.join(",");
    //   times = times.join(",");
    //   avg_price = avg_price.join(",");
    //   // console.log(items_id, time, avg_price);
    //   this.temp.item = Object.assign({}, this.temp.item, {
    //     items_id,
    //     times,
    //     avg_price
    //   });
    // },

    resetEditData() {
      let tcard_info = [...this.temp.tcard_items];
      this.temp.item = Object.assign({}, this.temp.item, {
        tcard_info
      });
    },

    resetTimes() {
      if (this.temp.item.is_limit == 0) {
        this.temp.tcard_items.map(item => {
          return (item.time = -1);
        });
      }
    },

    // 计算平均价
    handleCalcPrice() {
      let { price } = this.temp.item,
        tcard_items = this.temp.tcard_items.filter(item => {
          return (
            !item.hasOwnProperty("id") ||
            (item.hasOwnProperty("id") && item.is_del == 0)
          );
        }), // 过滤 is_del == 1 的产品
        totalcount = tcard_items.reduce((total, item) => {
          return calc(total).plus(
            calc(Number(item.price)).multipliedBy(Number(item.time))
          );
        }, 0);
      this.temp.tcard_items.map(item => {
        if (
          item.is_del == 0 &&
          item.time != undefined &&
          item.time != 0 &&
          item.time != "" &&
          item.time != null
        ) {
          item.avg_price = calc(Number(item.price))
            .multipliedBy(Number(price) / totalcount)
            .toFixed(2);
        } else {
          item.avg_price = 0;
        }
        return;
      });
    },

    // change 次卡类型
    handleChangeTcardLimit(val) {
      console.log("is_limit:", val);
      if (val == 0) {
        this.temp.tcard_items.map(item => {
          item.time = "无限";
          item.avg_price = 0;
          return;
        });
        this.temp.item.is_expired_vaild = 0;
      } else {
        this.temp.tcard_items.map(item => {
          return (item.time = "1");
        });
        this.temp.item.is_expired_vaild = 1;
      }
    },
    // 获取产品信息
    getGoodsList() {
      tcardList(this.listQuery).then(res => {
        console.log(res);
        let data = res.success.data;
        if (this.commandFilterList.length == 0) {
          this.commandFilterList = [...data.cateinfo];
        }
        this.goodsList = [...data.item.data];
        this.total = data.item.total;
        this.listLoading = false;
        // console.log(this.goodsList);
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
      deleteTcard(ids)
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

    // 图片上传
    uploadImage() {},

    beforeUpload(file) {
      // console.log(file);
    },

    uploadSuccess(response, file, fileList) {
      console.log(response.success.data);
      console.log(file);
      // this.temp.item.imageurl = file.url;
      this.temp.item.imageurl = response.success.data;
    },

    uploadError(err, file, fileList) {
      console.log(err);
    },

    // 搭配商品
    showInnerDialog() {
      this.innerAddItemVisible = true;
      this.addListLoading = true;
      this.getAddItems(this.activeName);
    },

    // 获取搭配商品信息
    getAddItems(id, data) {
      addItems(id, data).then(res => {
        let data = res.success.data;
        this.addFilterList = [...data.cateInfo];
        this.addItemList = [...data.itemInfo.data];
        this.addListLoading = false;
        // this.$nextTick(() => {
        //   this.$refs["scrollbar_addItem"].wrap.scrollTop = 0;
        // });
        console.log(data);
        console.log(this.addItemList);
        console.log(this.activeName);
      });
    },

    handleFilterAddItem() {
      this.getAddItems(this.activeName, this.addFilter);
      console.log(this.addFilter);
    },

    // 选中 添加 搭配商品
    handleSelectAddItem(val) {
      this.addMultipleSelection = val;
      // console.log(val);
    },

    handleAddItem() {
      this.addMultipleSelection.forEach((v, k) => {
        let time = this.temp.item.is_limit == 0 ? "无限" : "1",
          { id, name, price } = this.addMultipleSelection[k],
          filterItem = this.temp.tcard_items.filter(item => {
            return item.item_id == id;
          });
        if (filterItem.length == 0) {
          this.addMultipleSelection[k] = Object.assign(
            {},
            {
              item_id: id,
              name,
              price,
              time,
              avg_price: 0,
              is_del: 0
            }
          );
          this.temp.tcard_items.push(this.addMultipleSelection[k]);
        } else {
          let arr = filterItem.filter(item => {
            return item.is_del == 1;
          });
          arr.forEach((v, k) => {
            let index = this.temp.tcard_items.indexOf(v);
            let item = Object.assign({}, this.temp.tcard_items[index], {
              is_del: 0,
              time,
              avg_price: 0
            });
            this.temp.tcard_items.splice(index, 1, item);
          });
        }
      });
      // this.temp.tcard_items = this.temp.tcard_items.concat(
      //   this.addMultipleSelection
      // );
      console.log(this.temp.tcard_items);
      this.innerAddItemVisible = false;
    },

    // 删除搭配商品
    deletTcardItems(row) {
      let index = this.temp.tcard_items.indexOf(row);
      if (this.dialogStatus == "edit" && row.hasOwnProperty("id")) {
        row = Object.assign({}, row, {
          is_del: 1
        });
        this.temp.tcard_items.splice(index, 1, row);
      } else {
        this.temp.tcard_items.splice(index, 1);
      }
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
    tcard_items() {
      return this.temp.tcard_items.filter(item => {
        return item.is_del == 0;
      });
    },
    syncDialogShow() {
      return this.synchrodataDialog.show;
    }
  },

  watch: {
    activeName(val, oldVal) {
      this.addFilterList = [];
      this.addFilter = [];
      this.addItemList = [];
      this.getAddItems(val);
    },
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
.product_card {
}
</style>
<style lang="scss">
@import "~@/styles/variables.scss";
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$dialogColor: #e4e7ed;
.product_card {
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
  .goods_dialog {
    .left_content {
      width: 341px;
    }
    .right_content {
      width: 599px;
      height: 600px;
      .scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
        .el-scrollbar__view {
          > div {
            padding-right: 10px;
          }
          .el-input {
            width: 240px;
            .el-input__inner {
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

          .el-textarea__inner {
            width: 240px;
          }
          .el-radio-group {
            .el-radio-button {
              margin-right: 20px;
              .el-radio-button__inner {
                width: 110px;
                border-radius: $borderRadius;
              }
            }
          }
          .form_tablelist {
            .el-table {
              border: solid 1px #eaeefb;
              border-bottom: none;
              .el-table__header-wrapper {
                th {
                  padding: 0;
                  line-height: 37px;
                  background-color: #f0f2f5;
                }
              }
              .el-table__body-wrapper {
                td:first-child {
                  padding-left: 5px;
                }

                .cell {
                  font-size: 12px;
                  padding: 0 5px;
                  .el-input {
                    width: 100%;
                    .el-input__inner {
                      width: 100%;
                      height: 32px;
                      font-size: 12px;
                    }
                    .el-input-group__append {
                      width: 40px;
                      height: 32px;
                      background-color: #f6f7fb;
                      padding: 0;
                      text-align: center;
                      font-size: 12px;
                    }
                  }
                  .el-button {
                    height: 32px;
                    font-size: 12px;
                  }
                }
              }
            }
            .add_button {
              font-size: 12px;
              margin-top: 10px;
              padding: 9px 9px;
            }
          }
        }
      }
      .auto_count {
        margin-left: 10px;
        transition: all 0.2s;
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
// dialog addItem
.addProduct_dialog {
  .el-dialog__body {
    padding: 0 !important;
    .inner_content {
      width: 100%;
      padding-left: 130px;
      .el-tabs {
        float: left;
        height: 442px;
        margin-left: -130px;
        .el-tabs__header {
          margin-right: 0px;
          .el-tabs__nav-wrap {
            &.is-left::after {
              z-index: 2;
              width: 0px;
            }
            .el-tabs__item {
              width: 130px;
              text-align: left;
              border-left: 4px solid #fff;
              transition: all 0.3s;
              &.is-active {
                background-color: #eef7fd;
                color: #606266;
                border-left: 4px solid #6cc2f7;
              }
              &:hover {
                color: #606266;
              }
            }
            .el-tabs__active-bar {
              display: none;
            }
          }
        }
      }
      .tab_right_content {
        height: 442px;
        border-left: 1px solid #e4e7ed;
        padding: 20px;
        width: 100%;
        margin-left: -1px;
        margin-right: 1px;
        padding-right: 10px;
        .content_header {
          .el-select {
            .el-input__inner {
              width: 130px;
            }
          }
          .search {
            width: 240px;
            .el-input__inner {
              // width: 168px;
            }
          }
        }
        .content_body {
          .el-table-column--selection {
            .cell {
              padding: 0px;
            }
          }
          .product_img {
            display: inline-block;
            width: 109px;
            height: 82px;
            margin-right: 10px;
            vertical-align: middle;
            background: url("../../assets/product/product_bg.png") no-repeat
              center;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  .scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      padding-right: 10px;
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
