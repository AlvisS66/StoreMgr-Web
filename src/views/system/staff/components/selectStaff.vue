<template>
  <div class="system_selectStaff">
    <div>
      <el-button
        plain
        class="fl"
        :size="page=='position'? 'medium' : 'small'"
        @click="handleSelectionStaff"
      >
        员工选择
      </el-button>
      <el-button
        plain
        class="fl"
        :size="page=='position'? 'medium' : 'small'"
        @click="handleDelStaffs"
      >
        批量移除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data='positionStaffList'
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
        align="left"
        type='selection'
        width="30px"
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="员工姓名"
        prop='realname'
        min-width='120px'
      >
        <template slot-scope="scope">
          <div class="member_name">
            <span class='avatar_img'>
              <img v-avatar='[scope.row.avatar_url,scope.row.gender]'>
            </span>
            {{scope.row.realname}}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="联系手机"
      >
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="职位"
      >
        <template slot-scope="scope">
          <span>{{scope.row.position?scope.row.position.name:''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="入职时间"
      >
        <template slot-scope="scope">
          <span>{{scope.row.entry_time | formatCreat}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog 员工编辑 -->
    <el-dialog
      title="选择员工"
      :visible.sync="show"
      width="746px"
      class="goods_dialog"
    >
      <div
        class="selection_staff clearfix"
        v-loading='editDialog.listLoading'
      >
        <div class="left_box fl">
          <div class="left_header clearfix">
            <el-input
              placeholder='姓名、手机'
              class="fl search"
              v-model="listQuery.search"
              clearable
              @change="handleSearch"
            >
            </el-input>
            <el-button
              type="primary"
              class="fl search_btn"
              @click="handleSearch"
            >
              搜索
            </el-button>
          </div>
          <div class="left_body">
            <div class="staff_check_title">
              <span>全部联系人（{{staffList.length}}人）</span>
            </div>
            <div class="staff_checkbox">
              <el-scrollbar
                class="scrollbar"
                ref="scrollbar"
              >
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    :label="item.staff_user_id"
                    v-for='(item,key,index) in staffList'
                    :key='index'
                  >
                    <div class="member_name">
                      <span class='avatar_img'>
                        <img v-avatar='[item.avatar_url,item.gender]'>
                      </span>
                      {{item.realname}}
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="right_box fr">
          <div class="border_box"></div>
          <div class="right_header">
            <span>已选择（{{checkedList.length}}人）</span>
          </div>
          <div class="right_body">
            <el-scrollbar class="scrollbar">
              <ul>
                <li
                  v-for='(item,key,index) in checkedList'
                  :key='index'
                  class="clearfix checked_staff_list"
                >
                  <div class="member_name fl">
                    <span class='avatar_img'>
                      <img v-avatar='[item.avatar_url,item.gender]'>
                    </span>
                    {{item.realname}}
                  </div>
                  <span
                    class="fr remove_btn"
                    @click="handleRemoveChecked(item.id)"
                  >移除</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <el-button @click="show = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateCheckList"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {
  staffList,
  positionStaffList,
  roleStaffList,
  createPositionStaffs,
  delPositionStaffs,
  createRoleStaffs,
  delRoleStaffs
} from "@/api/system/staff";
export default {
  name: "select-staff",
  inject: ["getStaff"],
  props: {
    positionStaffList: {
      type: Array,
      default() {
        return [];
      }
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    activeTab: {
      type: String,
      default: " "
    },
    positionId: [String, Number, Boolean], // 职位 ID || 角色 ID
    visible: {
      type: Boolean,
      default: false
    },
    page: {
      type: String
    }
  },
  filters: {
    // 格式化入职日期
    formatCreat: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.trim().split(" ")[0];
    }
  },
  data() {
    return {
      //
      multipleSelection: [],
      // 
      checkList: [],
      // 员工列表
      staffList: [],
      // 全部联系人
      staffList_g:[],
      // dialog
      editDialog: {
        listLoading: true
      },
      //
      listQuery: {
        search: undefined,
        limit: 10000
      },
      title: {
        position: "职位",
        role: "角色"
      }
    };
  },
  methods: {
    // 批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleSearch() {
      staffList(this.listQuery)
        .then(res => {
          let data = res.success.data;
          console.log("员工列表", data);
          this.staffList = data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 选择员工
    handleSelectionStaff() {
      console.log(this.activeTab);
      if (this.activeTab == " ") {
        this.$message.warning(`请选择${this.title[this.page]}进行操作`);
        return;
      }
      this.$emit("update:positionId", false);
      this.show = true;
      this.getStaffList(this.activeTab);
    },

    // 移除已选员工
    handleRemoveChecked(val) {
      let index = this.checkList.indexOf(val);
      this.checkList.splice(index, 1);
    },

    //
    updateCheckList() {
      let id = this.positionId ? this.positionId : this.activeTab;
      if (this.page == "position") {
        console.log(id);
        createPositionStaffs(id, { staff_ids: this.checkList })
          .then(res => {
            this.show = false;
            this.$message.success("操作成功");
            if (!this.positionId || this.positionId == this.activeTab) {
              this.getStaff(id);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log(id);
        createRoleStaffs(id, { staff_ids: this.checkList })
          .then(res => {
            this.show = false;
            this.$message.success("操作成功");
            if (!this.positionId || this.positionId == this.activeTab) {
              this.getStaff(id);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    // 删除员工
    handleDelStaffs() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择员工进行操作");
        return;
      }
      this.$confirm("确定永久性移除此员工吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          console.log(this.multipleSelection);
          let staff_ids = [];
          this.multipleSelection.forEach((v, k) => {
            staff_ids.push(v.staff_user_id);
          });
          if (this.page == "position") {
            delPositionStaffs(this.activeTab, { staff_ids })
              .then(res => {
                this.getStaff(this.activeTab);
                this.$message.success("移除成功");
              })
              .catch(err => {
                console.log(err);
                this.$message.error("移除失败");
              });
          } else {
            delRoleStaffs(this.activeTab, { staff_ids })
              .then(res => {
                this.getStaff(this.activeTab);
                this.$message.success("移除成功");
              })
              .catch(err => {
                console.log(err);
                this.$message.error("移除失败");
              });
          }
        })
        .catch(action => {});
    },

    // reset
    resetListQuery() {
      this.listQuery = {
        search: undefined,
        limit: 10000
      };
    },

    resetCheckstatus(val) {
      let ids = [];
      val.forEach(item => {
        ids.push(item.staff_user_id);
      });
      this.checkList = ids;
    },

    // 获取员工信息列表
    getStaffList(val) {
      this.resetListQuery();
      this.checkList = [];
      this.editDialog.listLoading = true;
      staffList(this.listQuery)
        .then(res => {
          let data = res.success.data;
          console.log("员工列表", data);
          this.staffList = data.data;
          if(!this.listQuery.search) {
            this.staffList_g = data.data
          }
          console.log("全部联系人",  this.staffList_g);
          if (this.page == "position") {
            this.getPositionStaffList(val);
          } else {
            this.getRoleStaffList(val);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取当前职位员工
    getPositionStaffList(id) {
      positionStaffList(id)
        .then(res => {
          let data = res.success.data;
          console.log("职位员工", data);
          this.resetCheckstatus(data);
          this.$refs["scrollbar"].wrap.scrollTop = 0;
          this.editDialog.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取当前角色员工
    getRoleStaffList(id) {
      roleStaffList(id)
        .then(res => {
          let data = res.success.data;
          console.log("角色员工", data);
          this.resetCheckstatus(data);
          this.$refs["scrollbar"].wrap.scrollTop = 0;
          this.editDialog.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    },
    checkedList() {
      let list = [];
      this.checkList.forEach(item => {
        let arr = this.staffList_g.filter(val => {
          return val.staff_user_id == item;
        });
        list = [...list, ...arr];
      });
      return list;
    }
  },
  watch: {
    show(val, oldVal) {
      if (val && this.positionId !== false) {
        console.log(this.positionId);
        this.getStaffList(this.positionId);
      }
    },
    checkList(val, oldVal) {
      console.log("已选员工列表", this.checkedList);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;
$dialogColor: #e4e7ed;
.system_selectStaff {
  padding: 0;
}
// 选择员工
.selection_staff {
  color: $fontColor;
  .left_box {
    width: 336px;
    min-height: 300px;
    padding-right: 10px;
  }
  .right_box {
    width: 390px;
    // border-left: 1px solid $dialogColor;
    min-height: 300px;
    margin-right: -20px;
    position: relative;
  }
  .right_body {
    padding: 10px 10px 10px 20px;
  }
  .border_box {
    width: 1px;
    position: absolute;
    top: -20px;
    bottom: -20px;
    left: 0;
    width: 1px;
    background-color: $dialogColor;
  }
  .search {
    width: 240px;
  }
  .search_btn {
    padding: 10px 15px;
    margin-left: 15px;
  }
  .right_header {
    color: $fontColor_light;
    padding-left: 20px;
    height: 36px;
    border-bottom: 1px solid $dialogColor;
  }
  .staff_check_title {
    color: $fontColor;
    margin-top: 20px;
    margin-bottom: 10px;
  }
}

.avatar_img {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 50%;
  overflow: hidden;
  background: url("~@/assets/member/avatar-mini.png") no-repeat center;
  img {
    width: 100%;
    height: 100%;
  }
}

.checked_staff_list {
  border-radius: 4px;
  transition: background-color 0.2s;
  padding: 10px 20px 10px 10px;
  &:hover {
    background-color: #f5f7fa;
  }
}

.remove_btn {
  line-height: 40px;
  cursor: pointer;
  font-size: 14px;
  color: $fontColor_light;
}
</style>

<style lang="scss">
@import "~@/styles/variables.scss";
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$borderColor_collapse: #f5f6f7;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;
$dialogColor: #e4e7ed;
.system_selectStaff {
  // 员工列表
  .goods_list {
    .el-table-column--selection .cell {
      padding: 0px;
    }
  }
  // dialog
  .el-dialog {
    color: $fontColor;
    border-radius: 4px;
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
  // dialog 员工选择
  .selection_staff {
    .right_body {
      .scrollbar {
        height: 326px !important;
      }
    }
  }
  .staff_checkbox {
    .scrollbar {
      height: 300px !important;
    }
    .el-checkbox {
      display: block;
      margin-left: 0;
      border-radius: 4px;
      padding: 10px;
      transition: background-color 0.2s;
      &:hover {
        background-color: #f5f7fa;
      }
    }
    .el-checkbox__input {
      float: right;
      line-height: 34px;
      &.is-checked {
        & + .el-checkbox__label {
          color: $fontColor;
        }
        .el-checkbox__inner {
          background-color: transparent;
          border: none;
        }
      }
    }
    .el-checkbox__label {
      padding: 0;
    }
    .el-checkbox__inner {
      background-color: transparent;
      border: none;
      &::after {
        left: 0;
        border: 2px solid $--color-primary;
        border-left: 0px;
        border-top: 0;
      }
    }
  }
  // scrollbar
  .scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .tree_node {
    background-color: pink;
  }
}
</style>
