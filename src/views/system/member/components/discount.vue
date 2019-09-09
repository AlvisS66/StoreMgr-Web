<template>
  <div class="app-container system_member_discount_tab">
    <!-- 折扣设置 -->
    <div class="page_header">
      <!-- <el-button
        plain
        @click='handleMultipleEdit'
      >
        批量折扣设置
      </el-button> -->
      <el-dropdown
        @command="handleCommand"
        trigger="click"
        placement='bottom-start'
      >
        <el-button
          plain
          class="showbtn"
        >
          批量操作<i
            class="el-icon-arrow-down el-icon--right"
            style="color:#c7cbd2"
          ></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="discount">批量折扣设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button
        plain
        class="fr"
        @click="synchrodataDialog.show=true"
      >
        同步总部数据
      </el-button>

      <el-popover
        class="fr sync_tips"
        placement="bottom"
        width="200"
        trigger="hover"
        content="同步总部折扣列表。"
      >
        <i
          slot="reference"
          class="el-icon-question"
        ></i>
      </el-popover>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data='discountList'
      fit
      style="width: 100%"
      stripe
      class="goods_list"
      ref='staffList'
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="left"
        type='index'
        width="40px"
      >
      </el-table-column>
      <el-table-column
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        label="分类"
        prop='name'
      >
      </el-table-column>
      <el-table-column
        :label="item.name"
        v-for="(item,key,index) in rankList"
        :key='index'
      >
        <template slot-scope="scope">
          {{ {rank_id:item.id,discount:scope.row.discount_list} | discountListFormat}}折
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >设置</el-button>
          <el-button
            size="mini"
            @click='handleSpecEdit(scope.row)'
          >特殊折扣</el-button>
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
      @pagination="getDiscountList"
    />

    <!-- dialog 设置 -->
    <el-dialog
      title="设置"
      :visible.sync="editDialog.dialogEditVisible"
      width="746px"
      class="discount_dialog"
    >
      <div>
        <el-scrollbar
          class="scrollbar"
          ref="scrollbar"
        >
          <div class="discount_tips">
            <i class="el-icon-info"></i>10折为不打折
          </div>
          <el-form
            label-position="right"
            label-width="80px"
            ref="editForm"
            :show-message='false'
            :model="editTemp"
          >
            <div>
              <div
                class="fl discount_item"
                v-for='(item,key,index) in editTemp.discountEditList'
                :key='index'
              >
                <el-form-item
                  :label=item.name
                  :prop='`discountEditList[${key}].discount`'
                  :rules='rules.discount'
                >
                  <el-input
                    v-model='item.discount'
                    @blur='discountFormat(item)'
                  >
                    <template slot="append">折</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <el-button @click="editDialog.dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editDialog.dialogStatus?updateMultipleData():updateData()"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- dialog 特殊折扣设置 -->
    <el-dialog
      :visible.sync="editDialog.dialogSpecEditVisible"
      top='0'
      class="edit-dialog spec_discount_dialog"
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
          @click="editDialog.dialogSpecEditVisible = false"
        >
          <svg-icon icon-class="back" />
        </button>
        <span>特殊折扣设置</span>
      </div>
      <el-scrollbar
        class="scrollbar"
        ref='scrollbar_spec'
      >
        <div>
          <el-form
            :model="editSpecTemp"
            class="edit-form"
            ref='editSpecForm'
            :show-message='false'
          >
            <div class='specTable'>
              <!-- 特殊折扣 -->
              <el-table
                :data="editSpecTemp.specItemList"
                fit
                style="width: 100%"
                stripe
                class="discount_form"
                ref='discountForm'
              >
                <el-table-column
                  label="产品名称"
                  prop='itemname'
                >
                </el-table-column>

                <el-table-column label="折扣类型">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.mode"
                      @change='handleChangeMode(scope.row.rankitemInfo,$event)'
                    >
                      <el-option
                        v-for="(item,key,index) in ['比例折扣','金额折扣']"
                        :key='index'
                        :label="item"
                        :value="key"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column
                  :label="item.name"
                  v-for="(item,key,index) in rankList"
                  :key='index'
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'specItemList[' + scope.$index  + ']'+'.rankitemInfo.' + item.id + '.discount'"
                      :rules='scope.row.mode?rules.discountS:rules.discount'
                    >
                      <el-input
                        v-model="scope.row.rankitemInfo[item.id].discount"
                        @blur='discountFormat(scope.row.rankitemInfo[item.id])'
                      >
                        <template slot="append">{{scope.row.mode==0?'折':'元'}}</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleDelSpecItem(scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleAddSpecItem"
            >
              <el-button type="primary">
                选择产品名称<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if='!editSpecTemp.itemInfo.length'>暂无数据</el-dropdown-item>
                <el-dropdown-item
                  :command="item"
                  v-for='(item,key,index) in editSpecTemp.itemInfo'
                  :key='index'
                >{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form>
        </div>
      </el-scrollbar>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="updateSpecData"
        >保存</el-button>
      </div>
    </el-dialog>

    <!-- 同步数据 -->
    <synchrodata-member-dialog :visible.sync='synchrodataDialog.show'></synchrodata-member-dialog>
  </div>

</template>

<script>
import Pagination from "@/components/Pagination";
import synchrodataMemberDialog from "@/views/system/member/components/synchrodata-member-dialog";
import { Message } from "element-ui";
import {
  discountList,
  getEditDiscountInfo,
  editDiscount,
  editDiscounts,
  getEditSpecDiscountInfo,
  editSpecDiscount
} from "@/api/system/member";
import { calc } from "@/utils";

export default {
  name: "member_discount",
  components: {
    Pagination,
    synchrodataMemberDialog
  },
  props: {},
  filters: {
    discountListFormat(val) {
      let status = val.discount.some(item => {
        return item.rank_id == 0;
      });
      if (!status && val.rank_id == 0) {
        return 10;
      }
      let item = val.discount.find(v => {
        return v.rank_id == val.rank_id;
      });
      if (item) {
        return item.discount;
      }
    }
  },
  data() {
    let validNumber = (rule, value, callback) => {
      if (!value && value != 0) {
        callback(new Error());
      } else {
        // console.log(value);
        let reg = /^(\-|\+)?\d+(\.\d)?$/;
        if (!reg.test(value)) {
          Message.error("折扣格式不正确");
          callback(new Error());
        } else if (value > 10) {
          Message.error("折扣不能大于10折");
          callback(new Error());
        } else if (value <= 0) {
          Message.error("折扣必须大于0折");
          callback(new Error());
        }
        callback();
      }
    };
    let validPrice = (rule, value, callback) => {
      if (!value && value != 0) {
        callback(new Error());
      } else {
        let reg = /^(\d+|\d+\.\d{1,2})$/;
        // let reg = /^(\-|\+)?\d+(\.\d)?$/;
        if (!reg.test(value)) {
          Message.error("折扣格式不正确");
          callback(new Error());
        } else if (value < 0) {
          Message.error("折扣不能小于0元");
          callback(new Error());
        }
        callback();
      }
    };
    return {
      listLoading: true,
      // 校验
      rules: {
        discount: [{ validator: validNumber, trigger: "blur" }],
        discountS: [{ validator: validPrice, trigger: "blur" }]
      },
      //
      multipleSelection: [],
      // 折扣列表
      discountList: [],
      // 会员等级列表
      rankList: [],
      // 同步数据 dialog
      synchrodataDialog: {
        show: false
      },
      // dialog
      editDialog: {
        dialogEditVisible: false,
        dialogSpecEditVisible: false,
        dialogStatus: undefined
      },
      editTemp: {
        // 编辑
        category_id: undefined,
        discountEditList: [],
        // 批量编辑
        category_ids: undefined
      },
      editSpecTemp: {
        specItemList: [],
        category_id: undefined,
        discountSpecEditList: [{}],
        itemInfo: [],
        itemInfo_g: []
      },
      //
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      layout: " sizes, jumper, next, pager, prev, total"
    };
  },
  methods: {
    // 批量操作
    handleCommand(command) {
      command == "assign" ? this.handleAssign() : this.handleMultipleEdit();
    },
    // 批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // reset
    // resetEditTemp() {
    //   this.editSpecTemp = {
    //     discountSpecEditList: [{}],
    //     itemInfo: []
    //   }
    // },

    // 折扣编辑
    handleEdit(row) {
      console.log(row);
      this.editDialog.dialogStatus = 0;
      let { id } = row;
      getEditDiscountInfo(id)
        .then(res => {
          let data = res.success.data,
            list,
            status = data.some(item => {
              return item.rank_id == 0;
            }); // 判断是否有散客
          console.log("折扣", data);
          console.log("有无散客", status);
          if (!status) {
            list = data.map(item => {
              return {
                discount: item.discount,
                name: item.rank.name,
                id: item.id
              };
            });
            list.unshift({ rank_id: 0, name: "散客", discount: "10.0" }); // 添加散客折扣
          } else {
            list = data.map(item => {
              return {
                discount: item.discount,
                name: item.rank ? item.rank.name : "散客",
                id: item.id
              };
            });
          }
          this.editTemp = Object.assign(
            {},
            {
              category_id: id,
              discountEditList: list
            }
          );
          console.log("折扣temp", this.editTemp);
          this.editDialog.dialogEditVisible = true;
          this.$nextTick(() => {
            this.$refs["editForm"].clearValidate();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 批量折扣编辑
    handleMultipleEdit() {
      this.editDialog.dialogStatus = 1;
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择产品进行操作");
        return;
      }
      let category_ids = [],
        discountEditList = [];
      category_ids = this.multipleSelection.map(item => {
        return item.id;
      });
      console.log(category_ids);
      category_ids = category_ids.join(",");
      discountEditList = this.rankList.map(item => {
        return {
          id: item.id,
          name: item.name,
          discount: 10
        };
      });
      this.editTemp = Object.assign(
        {},
        {
          category_ids,
          discountEditList
        }
      );
      console.log("批量折扣temp", this.editTemp);
      // console.log("rankList", this.rankList);
      this.editDialog.dialogEditVisible = true;
      this.$nextTick(() => {
        this.$refs["editForm"].clearValidate();
      });
    },

    // 折扣保存
    updateData() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let { category_id, discountEditList } = this.editTemp;
          editDiscount(category_id, discountEditList)
            .then(res => {
              this.$message.success("编辑成功");
              this.editDialog.dialogEditVisible = false;
              this.getDiscountList();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 批量折扣保存
    updateMultipleData() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let { category_ids, discountEditList } = this.editTemp;
          editDiscounts({ category_ids, rankinfo: discountEditList })
            .then(res => {
              this.$message.success("编辑成功");
              this.editDialog.dialogEditVisible = false;
              this.getDiscountList();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 特殊折扣编辑
    handleSpecEdit(row) {
      console.log(row);
      let { id } = row;
      getEditSpecDiscountInfo(id)
        .then(res => {
          let data = res.success.data;
          console.log("特殊折扣", data);
          let { discountInfo, itemInfo } = data,
            itemInfo_g = [...itemInfo],
            item_ids = Object.keys(discountInfo),
            discountItemList;
          discountInfo = Object.values(discountInfo);
          // 去除已添加产品
          item_ids.forEach(item_id => {
            let index = itemInfo.findIndex(item => {
              return item.id == item_id;
            });
            itemInfo.splice(index, 1);
          });

          //
          discountItemList = discountInfo.map(item => {
            let { discount } = item,
              list = {};
            discount.forEach(v => {
              let { id, discount, rank_id } = v,
                info;
              info = Object.assign(
                {},
                {
                  discount: discount,
                  id,
                  rank_id
                }
              );
              list[rank_id] = info;
            });
            return {
              item_id: item.item_id,
              itemname: item.name,
              mode: item.mode,
              price: item.price,
              rankitemInfo: list
            };
          });
          this.editSpecTemp = Object.assign(
            {},
            {
              specItemList: [],
              category_id: id,
              discountSpecEditList: discountItemList,
              itemInfo,
              itemInfo_g
            }
          );
          console.log("特殊折扣temp", this.editSpecTemp);
          this.editDialog.dialogSpecEditVisible = true;
          this.$nextTick(() => {
            this.$refs["editSpecForm"].clearValidate();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 添加特殊折扣
    handleAddSpecItem(command) {
      if (command) {
        console.log(command);

        let discountSpecItem = {},
          rankitem = [],
          rankitemInfo = {};
        rankitem = this.rankList.map(item => {
          return {
            rank_id: item.id,
            // name: item.name,
            discount: "10"
          };
        });
        rankitem.forEach(item => {
          rankitemInfo[item.rank_id] = item;
        }); // 数组转换为 对象
        discountSpecItem = Object.assign(
          {},
          {
            item_id: command.id,
            itemname: command.name,
            price: command.price,
            mode: 0,
            rankitemInfo
          }
        );
        let index = this.editSpecTemp.discountSpecEditList.length;
        //
        let i = this.editSpecTemp.discountSpecEditList.findIndex(item => {
          return item.item_id == command.id && item.hasOwnProperty("is_del");
        });
        if (i >= 0) {
          index = i;
          let info = this.editSpecTemp.discountSpecEditList[index].rankitemInfo,
            rankitem_g = this.rankList.map(item => {
              return {
                id: info[item.id].id,
                rank_id: item.id,
                // name: item.name,
                discount: "10"
              };
            }),
            rankitemInfo = {};
          rankitem_g.forEach(item => {
            rankitemInfo[item.rank_id] = item;
          });
          discountSpecItem = Object.assign({}, discountSpecItem, {
            rankitemInfo
          }); // 合并 id
        } // 添加 is_del == 1 的产品
        this.editSpecTemp.discountSpecEditList.splice(
          index,
          1,
          discountSpecItem
        );

        // 添加后删除产品列表数据
        let index_add = this.editSpecTemp.itemInfo.findIndex(item => {
          return item.id == command.id;
        });
        this.editSpecTemp.itemInfo.splice(index_add, 1);
        console.log("特殊折扣temp", this.editSpecTemp);
      }
    },

    // 删除特殊折扣
    handleDelSpecItem(row) {
      console.log(row);
      let { rankitemInfo, item_id } = row,
        item_g = this.editSpecTemp.itemInfo_g.find(item => {
          return item.id == item_id;
        }),
        length = this.editSpecTemp.itemInfo.length,
        status = rankitemInfo[0].hasOwnProperty("id"),
        index = this.editSpecTemp.discountSpecEditList.indexOf(row);
      console.log(item_g);
      this.editSpecTemp.itemInfo.splice(length, 1, item_g);
      if (status) {
        let item = Object.assign({}, row, {
          is_del: 1
        });
        this.editSpecTemp.discountSpecEditList.splice(index, 1, item);
      } else {
        this.editSpecTemp.discountSpecEditList.splice(index, 1);
      }
      console.log("特殊折扣temp", this.editSpecTemp);
    },

    // 特殊折扣保存
    updateSpecData() {
      this.$refs["editSpecForm"].validate(valid => {
        if (valid) {
          let { discountSpecEditList, category_id } = this.editSpecTemp,
            itemInfo = discountSpecEditList.map(item => {
              let { rankitemInfo } = item,
                list = [];
              rankitemInfo = Object.values(rankitemInfo);
              rankitemInfo.forEach(v => {
                let info = Object.assign({}, v, {
                  mode: item.mode
                });
                list.push(info);
              });
              return {
                item_id: item.item_id,
                itemname: item.itemname,
                price: item.price,
                is_del: item.is_del ? item.is_del : undefined,
                rankitemInfo: list
              };
            });
          editSpecDiscount(category_id, { itemInfo })
            .then(res => {
              this.$message.success("编辑成功");
              this.editDialog.dialogSpecEditVisible = false;
              this.getDiscountList();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 获取会员折扣列表
    getDiscountList() {
      discountList(this.listQuery)
        .then(res => {
          let data = res.success.data;
          data.info.data = Object.values(data.info.data); // 转换数组
          this.total = data.info.total; // 总数
          data.rankInfo.unshift({ id: 0, name: "散客" });
          this.discountList = data.info.data;
          this.rankList = data.rankInfo;
          console.log("折扣列表", data);
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 折扣格式化
    discountFormat(val) {
      // let { discount } = val;
      // discount =
      //   calc(Number(discount)).toFixed(1) == "NaN"
      //     ? discount
      //     : calc(Number(discount)).toFixed(1);
      // val.discount = discount;
      // console.log(val);
    },

    // 折扣类型变化
    handleChangeMode(item, val) {
      if (!val) {
        Object.keys(item).forEach(v => {
          item[v].discount = 10;
        });
      } else {
        Object.keys(item).forEach(v => {
          item[v].discount = 0;
        });
      }
    }
  },
  created() {
    this.getDiscountList();
  },
  computed: {
    syncDialogShow() {
      return this.synchrodataDialog.show;
    },
    specItemList() {
      return this.editSpecTemp.discountSpecEditList.filter(item => {
        return !item.hasOwnProperty("is_del");
      });
    } // 过滤 is_del == 1 的产品
  },
  watch: {
    syncDialogShow(val, oldval) {
      if (!val) this.getDiscountList();
    },
    specItemList(val, oldVal) {
      this.editSpecTemp.specItemList = val;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
$dialogColor: #e4e7ed;
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;
.app-container {
  padding: 0;
}
.page_header {
  padding: 10px 0;
  border-bottom: 1px solid $tbColor;
}
.discount_tips {
  background-color: #fdf6ec;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 13px;
  color: #f7a16c;
  margin-bottom: 20px;
  i {
    color: #f7a16c;
    font-size: 14px;
    padding-right: 10px;
  }
}
.discount_item {
  margin-right: 30px;
}
.specTable {
  margin-bottom: 10px;
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
.system_member_discount_tab {
  //
  .page_header {
    .showbtn {
      width: 100px;
      background-color: #fff;
      color: $fontColor;
      border: 1px solid $borderColor;
      padding: 10px;
      &:focus {
        border: 1px solid #f48d98;
      }
      i {
        padding-left: 5px;
      }
    }
  }

  // dialog
  .el-dialog {
    color: $fontColor;
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
  .discount_dialog {
    .el-input {
      width: 180px;
    }
    .el-input__inner {
      width: 100%;
    }
    .el-input-group__append {
      padding: 0 15px;
    }
  }
  // 特殊折扣
  $dialogW: calc(100% - 210px);
  .edit-dialog {
    margin: 0;
    overflow: hidden;
    // width: $dialogW;
    width: 100%;
    left: 0;
    .el-dialog {
      width: $dialogW;
      height: 100vh;
      margin: 0;
      transition: all 0.3s;
      animation-duration: 0.3s;
      float: right;
      border-radius: 4px;
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
    .el-dialog__body {
      height: calc(100vh - 122px);
    }
    .el-dialog__header {
    }
    .el-dialog__footer {
      text-align: left;
    }
  }
  .spec_discount_dialog {
    .el-dialog__body {
      padding-top: 0 !important;
    }
    .el-form-item {
      display: inline-block;
      margin: 0;
    }
    .el-table {
    }
    .el-table__header-wrapper {
      th {
        padding: 0;
        line-height: 47px;
        font-weight: 400;
      }
    }
    .el-input {
      max-width: 110px;
    }
    .el-input__inner {
      width: 100%;
    }
    .el-input-group__append {
      width: 34px;
      background-color: #f6f7fb;
      padding: 0;
      text-align: center;
    }
  }
  @keyframes dialogShow {
    0% {
      transform: translate3d(100%, 0, 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes dialogHide {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    100% {
      transform: translate3d(100%, 0, 0);
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

  // 同步数据
  .el-icon-question {
    color: #d5d8de;
    font-size: 18px;
    cursor: pointer;
  }

  .sync_tips {
    line-height: 36px;
    margin-right: 5px;
  }
}
</style>
