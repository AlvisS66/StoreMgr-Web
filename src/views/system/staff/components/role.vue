<template>
  <div class="app-container system_role_tab">

    <!-- 角色管理 -->
    <div class="role_box">
      <div class='left_content'>
        <div class="clearfix">
          <el-button
            type="primary"
            class="addButton fl"
            @click="handleAddGroup"
          >
            新增角色组
          </el-button>
          <el-button
            type="primary"
            class="addButton fr"
            @click="handleAddRole()"
          >
            新增角色
          </el-button>
        </div>
        <div class="position_list">
          <el-scrollbar class="scrollbar">
            <el-collapse v-model="activeGroup">
              <el-collapse-item
                :name='item.id'
                v-for='item in groupList'
                :key='item.id'
                :class="[item.roles.length? '' : 'icon_visible']"
              >
                <template slot="title">
                  <span>
                    {{item.name}}
                  </span>
                  <el-dropdown
                    @command="handleCommandGroup(item,$event)"
                    trigger="click"
                    @click.native.stop
                    class="fr"
                  >
                    <span class="el-dropdown-link">
                      <i class="el-icon-more el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="create">新增角色</el-dropdown-item>
                      <el-dropdown-item command="edit">编辑角色组</el-dropdown-item>
                      <el-dropdown-item command="del">删除角色组</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <div
                  class="position_info"
                  v-if="item.roles.length"
                >
                  <el-tabs
                    tab-position="left"
                    v-model="activeTab"
                  >
                    <el-tab-pane
                      v-for='value in item.roles'
                      :key='value.id'
                      :name="value.id + ''"
                    >
                      <div
                        slot="label"
                        class="clearfix"
                      >
                        <div class="position_name fl">
                          {{value.name}}
                        </div>
                        <el-dropdown
                          @command="handleCommandRole(value,$event)"
                          trigger="click"
                          @click.native.stop=""
                          class="fr"
                        >
                          <span class="el-dropdown-link">
                            <i class="el-icon-more el-icon--right"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="select">选择员工</el-dropdown-item>
                            <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
                            <el-dropdown-item command="del">删除角色</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </div>
      </div>
      <div class="right_content">
        <el-tabs
          v-model="activeName"
          class="right_tab"
        >
          <el-tab-pane
            label="角色成员"
            name="role"
          >
            <div>
              <select-staff
                :positionStaffList='roleStaffList'
                :listLoading.sync='listLoading'
                :activeTab='activeTab'
                :positionId.sync='roleId'
                :visible.sync='editDialog.dialogEditFormVisible'
                :page='page'
              >
              </select-staff>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="功能权限"
            name="permission"
          >
            <!-- 功能权限 -->
            <div
              class="permission_box"
              v-loading='permission.loading'
            >
              <div
                class="check_box"
                v-for="(item,key,index) in permission.list"
                :key='index'
              >
                <el-checkbox-group
                  v-model.lazy="permission.checkList"
                  @change='handleCheckAllStatus'
                >
                  <div class="check_all">
                    <el-checkbox
                      :label="item.id"
                      @change='handleCheckAll(item.id,item.children,$event)'
                    >{{item.title}}</el-checkbox>
                  </div>
                  <div class="check_permission">
                    <el-checkbox
                      :label="val.id"
                      v-for='(val,k,index) in item.children'
                      :key='index'
                      @change='handleCheck(item.id,item.children)'
                    >{{val.title}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- dialog 编辑角色组 -->
    <el-dialog
      :title="editDialog.title[dialogStatus]"
      :visible.sync="editDialog.editGroupVisible"
      width="420px"
      class="editGroup_dialog"
    >
      <div>
        <!-- 编辑 -->
        <el-form
          label-position="right"
          label-width="50px"
          :show-message='false'
          :rules="rules"
          :model="editGroupTemp"
          ref="editGroupForm"
        >
          <el-form-item
            label="名称"
            prop='name'
          >
            <el-input v-model="editGroupTemp.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--  -->
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <el-button
          @click="editDialog.editGroupVisible = false"
          size='mini'
        >取 消</el-button>
        <el-button
          type="primary"
          size='mini'
          @click="dialogStatus == 'createGroup'? createGroupData() : updateGroupData()"
        >确 定</el-button>
      </div>
      <!--  -->
    </el-dialog>

    <!-- dialog 编辑角色 -->
    <el-dialog
      :title="editDialog.title[dialogStatus]"
      :visible.sync="editDialog.editRoleVisible"
      width="746px"
      class="editRole_dialog"
    >
      <div class="editRole_content clearfix">
        <!-- 编辑 -->
        <el-form
          label-position="right"
          label-width="80px"
          :show-message='false'
          :rules="rules"
          :model="editRolesTemp.item"
          ref="editRoleForm"
        >
          <el-form-item
            label="名称"
            prop='name'
          >
            <el-input v-model.trim="editRolesTemp.item.name"></el-input>
          </el-form-item>

          <el-form-item
            label="角色组"
            prop='group_id'
            v-show='editRolesTemp.selectShow'
          >
            <el-select v-model="editRolesTemp.item.group_id">
              <el-option
                v-for='(item,key,index) in groupList'
                :key='index'
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item
            label="描述"
            prop='remark'
          >
            <el-input
              type="textarea"
              :rows="3"
              v-model="editRolesTemp.item.remark"
            >
            </el-input>
          </el-form-item> -->

        </el-form>
      </div>
      <!--  -->
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <el-button
          @click="editDialog.editRoleVisible = false"
          size='mini'
        >取 消</el-button>
        <el-button
          type="primary"
          size='mini'
          @click="dialogStatus == 'createRole'? createRoleData() : updateRoleData()"
        >确 定</el-button>
      </div>
      <!--  -->
    </el-dialog>

  </div>

</template>

<script>
import selectStaff from "@/views/system/staff/components/selectStaff.vue";

import {
  groupList,
  createGroup,
  editGroup,
  delGroup,
  createRole,
  editRole,
  delRole,
  roleStaffList,
  createRoleStaffs,
  delRoleStaffs,
  permissionMenus,
  rolePermissions,
  syncRoleMenuPermissions
} from "@/api/system/staff";

export default {
  name: "role",
  provide() {
    return {
      getStaff: this.getRoleStaffList
    };
  },
  props: {},
  components: {
    selectStaff
  },
  data() {
    return {
      page: "role",
      activeName: "role",
      activeTab: " ",
      //
      activeGroup: "",
      // 角色组
      groupList: [],
      // 员工列表
      roleStaffList: [],
      listLoading: false,
      roleId: "",
      // rules
      rules: {
        name: [{ required: true, trigger: "blur" }],
        group_id: [{ required: true, trigger: "blur" }]
      },
      // temp
      editGroupTemp: {
        id: undefined,
        name: undefined
      },
      editRolesTemp: {
        id: undefined,
        selectShow: true,
        item: {
          name: undefined,
          group_id: undefined,
          remark: undefined
        }
      },
      // dialog
      dialogStatus: "",
      editDialog: {
        editGroupVisible: false, // 角色组
        editRoleVisible: false, // 角色
        dialogEditFormVisible: false, // 选择员工
        title: {
          createGroup: "新增角色组",
          editGroup: "编辑角色组",
          createRole: "新增角色",
          editRole: "编辑角色"
        }
      },
      permission: {
        loading: false,
        list: [],
        cash: {
          status: false,
          checkList: []
        },
        checkAll: [],
        checkList: []
      },
      timer: null // 权限修改定时器
    };
  },
  methods: {
    //
    handleCommandGroup(item, command) {
      if (command == "create") {
        console.log(command);
        this.handleAddRole(item);
      } else if (command == "edit") {
        console.log(command);
        this.handleEditGroup(item);
      } else {
        console.log(command);
        this.handleDelGroup(item);
      }
    },

    handleCommandRole(item, command) {
      if (command == "select") {
        console.log(command);
        let { id } = item;
        this.roleId = id;
        this.editDialog.dialogEditFormVisible = true;
      } else if (command == "edit") {
        console.log(command);
        this.handleEditRole(item);
      } else {
        console.log(command);
        this.handleDelRole(item);
      }
    },

    // reset
    resetEditGroupTemp() {
      this.editGroupTemp = {
        id: undefined,
        name: undefined
      };
    },

    resetEditRolesTemp() {
      this.editRolesTemp = {
        id: undefined,
        selectShow: true,
        item: {
          name: undefined,
          group_id: undefined,
          remark: undefined
        }
      };
    },

    // group 角色组编辑
    handleAddGroup() {
      this.resetEditGroupTemp();
      this.dialogStatus = "createGroup";
      this.editDialog.editGroupVisible = true;
      this.$nextTick(() => {
        this.$refs["editGroupForm"].clearValidate();
      });
    },

    createGroupData() {
      this.$refs["editGroupForm"].validate(valid => {
        if (valid) {
          let { name } = this.editGroupTemp;
          createGroup({ name })
            .then(res => {
              this.getGroupList();
              this.editDialog.editGroupVisible = false;
              this.$message.success("新增成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    handleEditGroup(val) {
      this.resetEditGroupTemp();
      let { id, name } = val;
      this.editGroupTemp = Object.assign({}, this.editGroupTemp, {
        id,
        name
      });
      console.log("编辑editGroupTemp:", this.editGroupTemp);
      this.dialogStatus = "editGroup";
      this.editDialog.editGroupVisible = true;
      this.$nextTick(() => {
        this.$refs["editGroupForm"].clearValidate();
      });
    },

    updateGroupData() {
      this.$refs["editGroupForm"].validate(valid => {
        if (valid) {
          let { id, name } = this.editGroupTemp;
          editGroup(id, { name })
            .then(res => {
              this.getGroupList();
              this.editDialog.editGroupVisible = false;
              this.$message.success("编辑成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    handleDelGroup(val) {
      this.$confirm("确定永久性删除此角色组吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          console.log("删除");
          let { id } = val;
          delGroup(id).then(res => {
            this.getGroupList();
            this.$message.success("删除成功");
          });
        })
        .catch(action => {
          err => {
            console.log(err);
            this.$message.error("删除失败");
          };
        });
    },

    // role 角色编辑
    handleAddRole(val) {
      this.resetEditRolesTemp();
      if (val) {
        this.editRolesTemp.item.group_id = val.id;
        this.editRolesTemp.selectShow = false;
      }
      this.dialogStatus = "createRole";
      this.editDialog.editRoleVisible = true;
      this.$nextTick(() => {
        this.$refs["editRoleForm"].clearValidate();
      });
    },

    createRoleData() {
      this.$refs["editRoleForm"].validate(valid => {
        if (valid) {
          createRole(this.editRolesTemp.item)
            .then(res => {
              this.getGroupList();
              this.editDialog.editRoleVisible = false;
              this.$message.success("新增成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    handleEditRole(val) {
      this.resetEditGroupTemp();
      this.dialogStatus = "editRole";
      let { id, name, group_id, remark } = val;
      this.editRolesTemp = Object.assign({}, this.editRolesTemp, {
        id,
        item: {
          name,
          group_id,
          remark
        }
      });
      console.log("编辑editRoleTemp:", this.editRolesTemp);
      this.dialogStatus = "editRole";
      this.editDialog.editRoleVisible = true;
      this.$nextTick(() => {
        this.$refs["editRoleForm"].clearValidate();
      });
    },

    updateRoleData() {
      this.$refs["editRoleForm"].validate(valid => {
        if (valid) {
          let { id, item } = this.editRolesTemp;
          editRole(id, item)
            .then(res => {
              this.getGroupList();
              this.editDialog.editRoleVisible = false;
              this.$message.success("编辑成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    handleDelRole(val) {
      this.$confirm("确定永久性删除此角色吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          console.log("删除");
          let { id } = val;
          delRole(id).then(res => {
            this.getGroupList();
            if (this.activeTab == id) {
              this.roleStaffList = [];
              this.permission.list = [];
              this.activeTab = " ";
            }
            this.$message.success("删除成功");
          });
        })
        .catch(action => {
          err => {
            console.log(err);
            this.$message.error("删除失败");
          };
        });
    },

    // 获取角色列表
    getGroupList() {
      return groupList()
        .then(res => {
          let data = res.success.data;
          this.groupList = data;
          console.log("角色组列表", data);
        })
        .catch(err => {});
    },

    // 获取当前角色员工
    getRoleStaffList(id) {
      this.listLoading = true;
      roleStaffList(id)
        .then(res => {
          let data = res.success.data;
          console.log("角色员工", data);
          this.roleStaffList = data;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 权限菜单
    getPermissionMenus() {
      permissionMenus()
        .then(res => {
          let data = res.success.data;
          console.log("权限菜单", data);
          this.permission.list = data;
          // this.permission.loading = false;
        })
        .catch(err => {
          console.log("权限菜单", err);
        });
    },

    // 获取用户权限
    getRolePermissions() {
      if (this.activeTab === " ") {
        return;
      }
      this.permission.loading = true;
      rolePermissions(this.activeTab)
        .then(res => {
          let data = res.success.data;
          console.log("用户权限", data);
          let list = [];
          data.forEach(item => {
            if ((item.type = "menu")) {
              list.push(item.target_id);
            }
          });
          this.permission.checkList = list;
          this.permission.loading = false;
        })
        .catch(err => {
          console.log("用户权限", err);
        });
    },

    handleCheckAllStatus(v) {
      // console.log("更新后的值status", v);
    },

    // 权限 check
    handleCheckAll(menu_id, children, status) {
      if (children) {
        // console.log("All-id", menu_id);
        // console.log("All-children", children);
        // console.log("All-status", status);
        let id = [];
        children.forEach(v => {
          id.push(v.id);
        });
        if (status) {
          id.forEach(v => {
            let i = this.permission.checkList.indexOf(v);
            if (i < 0) {
              let length = this.permission.checkList.length;
              this.permission.checkList.splice(length, 1, v);
            }
          });
        } else {
          id.forEach(v => {
            let i = this.permission.checkList.indexOf(v);
            if (i >= 0) {
              this.permission.checkList.splice(i, 1);
            }
          });
        }
      }
      this.debounce();
    },

    handleCheck(menu_id, children) {
      // console.log("All-id", menu_id);
      // console.log("All-children", children);
      let id = [];
      children.forEach(v => {
        id.push(v.id);
      });
      let status = id.some(v => {
        return this.permission.checkList.includes(v);
      });
      let i = this.permission.checkList.indexOf(menu_id);
      if (status && i < 0) {
        let length = this.permission.checkList.length;
        this.permission.checkList.splice(length, 1, menu_id);
      } else if (!status && i > 0) {
        this.permission.checkList.splice(i, 1);
      }
      this.debounce();
    },

    // 更新权限 ( 防抖 )
    debounce() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleSyncRoleMenuPermissions();
      }, 1500);
    },

    // 同步权限
    handleSyncRoleMenuPermissions() {
      syncRoleMenuPermissions({
        role_id: this.activeTab,
        menu_ids: this.permission.checkList
      })
        .then(res => {
          this.getRolePermissions();
          this.$message.success("修改权限成功");
        })
        .catch(err => {
          console.log(err);
          this.getRolePermissions();
        });
    }
  },

  created() {
    console.log("role");
    this.getGroupList().then(res => {
      if (!this.groupList.length) return;
      try {
        this.groupList.forEach((item, key) => {
          let length = item.roles.length;
          if (length) {
            this.activeGroup = this.groupList[key].id;
            this.activeTab = item.roles[0].id + "";
            throw new Error(""); // 终止循环
          }
        });
      } catch (error) {}
    });
  },
  computed: {},
  watch: {
    activeTab(val, oldVal) {
      if (val && val !== " ") {
        console.log("activeTab:", val);
        this.getPermissionMenus();
        this.getRolePermissions();
        this.getRoleStaffList(val);
      }
    },
    activeName(val, oldVal) {
      if (!this.groupList.length && val === "permission")
        this.$message.warning("请先设置角色组及所属角色");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-container {
  padding: 0 0 0 200px;
}
.role_box {
  margin-top: 20px;
  .left_content {
    width: 200px;
    float: left;
    margin-left: -200px;
    .scrollbar {
      height: 650px;
    }
  }
  .right_content {
    width: 100%;
    padding-left: 20px;
  }
}

.permission_box {
  // padding-top: 20px;
}
.check_box {
  margin-bottom: 35px;
}
.check_permission {
  padding-left: 25px;
  margin-top: 10px;
}

.position_list {
  margin-top: 20px;
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
.system_role_tab {
  .addButton {
    width: 90px;
    padding: 10px 0;
  }
  // left_content
  // tap
  .position_list {
    // .position_info:nth-child(1) {
    //   border-top: 1px solid $borderColor_collapse;
    // }
    .el-collapse:nth-child(1) {
      // border-top: 1px solid $borderColor_collapse;
    }

    // collapse
    .el-collapse {
      border-top: none;
      // border-bottom: 1px solid $borderColor_collapse;
      border: none;
    }
    .el-collapse-item__wrap {
      // border-bottom: 1px solid $borderColor_collapse;
      border: none;
    }
    .el-collapse-item {
      position: relative;
      color: $fontColor;
    }
    .el-collapse-item__header {
      padding-left: 20px;
      color: $fontColor;
      // border-bottom: 1px solid $borderColor_collapse;
      border: none;
      margin: 1px 0;
      &:hover {
        box-shadow: 0px 0px 8px 0 rgba(0, 0, 0, 0.1);
        background-color: #f5f7fa;
      }
    }
    .el-collapse-item__content {
      padding: 0;
      .el-tabs__item {
        border: none;
      }
    }
    .el-collapse-item__arrow {
      position: absolute;
      left: 0;
    }
    .icon_visible {
      .el-collapse-item__arrow {
        display: none;
      }
    }
    .el-icon-arrow-right::before {
      content: "\E60E";
      color: #ebeef5;
    }
    .el-dropdown {
      line-height: 40px;
      position: absolute;
      right: 20px;
    }
    .el-icon-more {
      font-size: 16px;
      color: #c0c4cc;
    }
  }
  .position_info {
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__content {
      display: none;
    }
    .el-tabs--left {
      .el-tabs__nav-wrap.is-left::after {
        display: none;
      }
    }
    .el-tabs__header {
      width: 100%;
    }
    .el-tabs {
      .el-tabs__item {
        &.is-left {
          padding-left: 40px;
        }
      }
    }
    .el-tabs__item {
      font-size: 14px;
      color: $fontColor;
      line-height: 40px;
      // // border-bottom: 1px solid $borderColor_collapse;
      // box-shadow: none !important;
      &.is-active {
        border-left: 3px solid #61afdf;
        // background-color: #f5f7fa;
      }
      margin: 1px 0;
      &:hover {
        box-shadow: 0px 0px 3px 0 rgba(0, 0, 0, 0.1);
        background-color: #f5f7fa;
      }
    }
    .position_name {
      vertical-align: middle;
    }
  }

  //
  .right_tab {
    .el-tabs__nav-wrap {
      &::after {
        display: none;
      }
    }
    .el-tabs__header {
      border-top: 1px solid $tbColor;
      border-bottom: 1px solid $tbColor;
      background-color: #fafafa;
      line-height: 46px;
      height: 46px;
      padding-left: 15px;
    }
    .el-tabs__item {
      line-height: 46px;
      font-size: 14px;
      color: $fontColor_light;
      &.is-active {
        color: $--color-primary;
      }
    }
  }
  .el-tabs__content {
    padding-top: 20px;
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

    .el-input,
    .el-select,
    .el-textarea {
      width: 240px;
    }
  }

  // dialog group
  .editGroup_dialog {
    .el-dialog__header {
      border-bottom: none;
    }
    .el-dialog__footer {
      border-top: none;
    }
    .el-form-item {
      margin: 0;
    }
    .el-input {
      width: 220px;
    }
  }

  .editRole_content {
    text-align: center;
    .el-form {
      display: inline-block;
    }
  }

  // dialog role

  // scrollbar
  .scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
