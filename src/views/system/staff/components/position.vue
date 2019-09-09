<template>
  <div class="app-container system_position_tab">
    <!-- 职位管理 -->
    <div class="position_box">
      <div class='left_content'>
        <div>
          <el-button
            type="primary"
            class="addButton"
            @click="handleAdd"
          >
            新增职位
          </el-button>
        </div>
        <div class="position_list">
          <el-scrollbar class="scrollbar">
            <div class="position_info">
              <el-tabs
                tab-position="left"
                v-model="activeTab"
              >
                <el-tab-pane
                  v-for='(item,key,index) in positionList'
                  :key='index'
                  :name="item.id + ''"
                >
                  <div
                    slot="label"
                    class="clearfix"
                  >
                    <div class="position_name fl">
                      {{item.name}}
                    </div>
                    <el-dropdown
                      @command="handleCommand(item,$event)"
                      trigger="click"
                      @click.native.stop=""
                      class="fr"
                    >
                      <span class="el-dropdown-link">
                        <i class="el-icon-more el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="select">选择员工</el-dropdown-item>
                        <el-dropdown-item command="edit">编辑职位</el-dropdown-item>
                        <el-dropdown-item command="del">删除职位</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="right_content">
        <select-staff
          :positionStaffList='positionStaffList'
          :listLoading.sync='listLoading'
          :activeTab='activeTab'
          :positionId.sync='positionId'
          :visible.sync='editDialog.dialogEditFormVisible'
          :page='page'
        >
        </select-staff>
      </div>
    </div>
    <!-- dialog 新增职位 -->
    <el-dialog
      :title="editDialog.title[dialogStatus]"
      :visible.sync="editDialog.createEditVisible"
      width="420px"
      class="create_dialog"
    >
      <div>
        <!-- 新增 -->
        <el-form
          label-position="right"
          label-width="50px"
          :show-message='false'
          :rules="rules"
          :model="createTemp"
          ref="createForm"
        >
          <el-form-item
            label="名称"
            prop='name'
          >
            <el-input v-model="createTemp.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <el-button
          @click="editDialog.createEditVisible = false"
          size='mini'
        >取 消</el-button>
        <el-button
          type="primary"
          size='mini'
          @click="dialogStatus=='create'?createData():updateData()"
        >确 定</el-button>
      </div>
      <!--  -->
    </el-dialog>
  </div>

</template>

<script>
import selectStaff from "@/views/system/staff/components/selectStaff.vue";
import {
  staffList,
  positionList,
  createPosition,
  editPosition,
  delPosition,
  positionStaffList
} from "@/api/system/staff";
export default {
  name: "position",
  provide() {
    return {
      getStaff: this.getPositionStaffList
    };
  },
  props: {},
  components: {
    selectStaff
  },
  filters: {},
  data() {
    return {
      page: "position",
      activeName: "",
      activeTab: " ",
      positionList: [],
      // 员工列表
      positionStaffList: [],
      listLoading: false,
      positionId: "",
      // rules
      rules: {
        name: [{ required: true, trigger: "blur" }]
      },
      // dialog
      dialogStatus: "",
      editDialog: {
        title: {
          create: "新增职位",
          edit: "编辑职位"
        },
        createEditVisible: false,
        dialogEditFormVisible: false
      },
      createTemp: {
        id: undefined,
        name: undefined
      }
    };
  },
  methods: {
    //
    handleCommand(item, command) {
      if (command == "select") {
        console.log(command);
        let { id } = item;
        this.positionId = id;
        this.editDialog.dialogEditFormVisible = true;
      } else if (command == "edit") {
        console.log(command);
        this.handleEdit(item);
      } else {
        console.log(command);
        this.handleDelPosition(item);
      }
    },

    // reset
    resetCreateTemp() {
      this.createTemp = {
        id: undefined,
        name: undefined
      };
    },

    // 新增职位
    handleAdd() {
      this.resetCreateTemp();
      this.dialogStatus = "create";
      this.editDialog.createEditVisible = true;
      this.$nextTick(() => {
        this.$refs["createForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          let { name } = this.createTemp;
          createPosition({ name })
            .then(res => {
              this.getPositionList();
              this.editDialog.createEditVisible = false;
              this.$message.success("新增成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 编辑职位
    handleEdit(val) {
      this.resetCreateTemp();
      let { id, name } = val;
      this.createTemp = Object.assign({}, this.createTemp, {
        id,
        name
      });
      console.log("编辑createTemp:", this.createTemp);
      this.dialogStatus = "edit";
      this.editDialog.createEditVisible = true;
      this.$nextTick(() => {
        this.$refs["createForm"].clearValidate();
      });
    },

    updateData() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          let { id, name } = this.createTemp;
          editPosition(id, { name })
            .then(res => {
              if (this.activeTab == id) {
              this.getPositionStaffList(id);
            }
              this.getPositionList();
              this.editDialog.createEditVisible = false;
              this.$message.success("编辑成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 删除职位
    handleDelPosition(val) {
      this.$confirm("确定永久性删除此职位吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          console.log("删除");
          let { id } = val;
          delPosition(id).then(res => {
            this.getPositionList();
            if (this.activeTab == id) {
              this.positionStaffList = [];
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

    // 获取职位信息列表
    getPositionList() {
      return positionList()
        .then(res => {
          let data = res.success.data;
          this.positionList = data;
          console.log("职位列表", this.positionList);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取当前职位员工
    getPositionStaffList(id) {
      this.listLoading = true;
      positionStaffList(id)
        .then(res => {
          let data = res.success.data;
          console.log("职位员工", data);
          this.positionStaffList = data;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    // activeName(val, oldVal) {
    //   this.activeTab = "";
    //   if (val) {
    //     console.log(val);
    //   }
    // },
    // 职位员工
    activeTab(val, oldVal) {
      if (val && val !== " ") {
        console.log("activeTab:", val);
        this.getPositionStaffList(val);
      }
    }
  },
  created() {
    console.log("position");
    this.getPositionList().then(res => {
      if (this.positionList.length)
        this.activeTab = this.positionList[0].id + "";
      // console.log(this.positionList);
    });
  },
  mounted() {}
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
.app-container {
  padding: 0 0 0 200px;
}
.position_box {
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
.addButton {
  width: 100%;
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
.system_position_tab {
  // left_content
  // tap
  .position_list {
    .position_info:nth-child(1) {
      // border-top: 1px solid $borderColor_collapse;
    }
    .el-collapse:nth-child(1) {
      // border-top: 1px solid $borderColor_collapse;
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
      line-height: 38px;
      // border-bottom: 1px solid $borderColor_collapse;
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

    // collapse
    .el-collapse {
      border-top: none;
      // border-bottom: 1px solid $borderColor_collapse;
    }
    .el-collapse-item__wrap {
      // border-bottom: 1px solid $borderColor_collapse;
    }
    .el-collapse-item {
      position: relative;
      color: $fontColor;
    }
    .el-collapse-item__header {
      padding-left: 20px;
      color: $fontColor;
      // border-bottom: 1px solid $borderColor_collapse;
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
    .el-icon-arrow-right::before {
      content: "\E60E";
      color: #ebeef5;
    }

    // el-drop
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

  // dialog 新增
  .create_dialog {
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

  // scrollbar
  .scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
// 下拉文字颜色
.el-dropdown-menu--medium .el-dropdown-menu__item {
  color: $fontColor_light;
}
</style>
