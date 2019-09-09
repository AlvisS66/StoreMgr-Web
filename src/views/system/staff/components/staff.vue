<template>
  <div class="app-container system_staff_tab">
    <!-- 员工管理 -->
    <div class="filter_container">
      <el-dropdown
        @command="handleCommand"
        class="fl"
        trigger="click"
        placement='bottom-start'
      >
        <el-button
          type="primary"
          class="showbtn"
        >
          批量操作<i
            class="el-icon-arrow-down el-icon--right"
            style="color:#c7cbd2"
          ></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="del">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="primary"
        class="fr"
        @click="handleAdd"
      >
        新增员工
      </el-button>
      <!-- <el-form
        :inline="true"
        class="goods_category fr"
        :model='listQuery'
      >
        <el-form-item label="">
          <el-select
            placeholder="职位名称"
            v-model='listQuery.position_id'
            @change='handleSearch'
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item,key,index) in positionList"
              :key='index'
              class="goods_select_option"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <el-input
        placeholder='姓名、工号或手机'
        class="fr search"
        v-model="listQuery.search"
        prefix-icon="el-icon-search"
        @change="handleSearch"
        clearable
      >
      </el-input>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data='staffList'
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
        label="登录工号"
      >
        <template slot-scope="scope">
          <span>{{scope.row.workcard}}</span>
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
        label="性别"
      >
        <template slot-scope="scope">
          <span>{{scope.row.gender == 1?'男':scope.row.gender == 0?'女':'保密'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="员工生日"
      >
        <template slot-scope="scope">
          <span>{{scope.row.birthday | formatBirthday}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="所属职位"
      >
        <template slot-scope="scope">
          <span>{{scope.row.position?scope.row.position.name:''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="入职日期"
      >
        <template slot-scope="scope">
          <span>{{scope.row.entry_time | formatCreat}}</span>
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
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      class='pagination'
      @pagination="getStaffList"
    />

    <!-- dialog 员工编辑 -->
    <el-dialog
      :title="dialogTitle[dialogStatus]"
      :visible.sync="dialogEditFormVisible"
      width="746px"
      class="goods_dialog"
    >
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
            :span='12'
            class="left_content"
          >
            <div class="upload_avatar clearfix">
              <div class="image-preview fl">
                <div class="image-preview-wrapper">
                  <img v-avatar='[temp.item.avatar_url,temp.item.gender]'>
                  <div class="image-preview-action">
                    <!-- <i class="el-icon-delete" /> -->
                  </div>
                </div>
              </div>
              <el-upload
                class="upload_btn fl"
                :action='uploadUrl'
                ref="uploadImg"
                name='imageurl'
                :show-file-list="false"
                :with-credentials="false"
                :before-upload='beforeUpload'
                :on-success='uploadSuccess'
                :on-error='uploadError'
              >
                <div
                  slot="trigger"
                  class="trigger_btn"
                >上传头像</div>
                <div
                  class="el-upload__tip"
                  slot="tip"
                >
                  <div>
                    支持上传图片格式jpg、png、gif。
                  </div>
                  <div>
                    尺寸：80像素*80像素
                  </div>
                </div>
              </el-upload>
            </div>
            <el-form-item
              label="登录工号"
              prop="workcard"
            >
              <el-input v-model="temp.item.workcard"></el-input>
            </el-form-item>
            <el-form-item
              label="员工姓名"
              prop='realname'
            >
              <el-input v-model="temp.item.realname"></el-input>
            </el-form-item>
            <el-form-item
              label="登录密码"
              prop='password'
            >
              <el-input
                v-model="temp.item.password"
                type='password'
              ></el-input>
            </el-form-item>
            <el-form-item label="员工性别">
              <el-radio-group v-model="temp.item.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
                <el-radio :label="null">保密</el-radio>
              </el-radio-group>
            </el-form-item>

          </el-col>
          <el-col
            :span='12'
            class="right_content"
          >
            <el-form-item
              label="员工生日"
              prop='birthday'
            >
              <el-date-picker
                type="date"
                value-format='yyyy-MM-dd'
                v-model="temp.item.birthday"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="联系手机"
              prop='mobile'
            >
              <el-input v-model="temp.item.mobile"></el-input>
            </el-form-item>
            <el-form-item
              label="入职日期"
              prop='entry_time'
            >
              <el-date-picker
                type="date"
                value-format='yyyy-MM-dd'
                v-model="temp.item.entry_time"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="所属职位"
              prop="position_id"
            >
              <el-select v-model="temp.item.position_id">
                <el-option
                  v-for='(item,key,index) in positionList'
                  :key='index'
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="所属角色"
              prop='role_ids'
            >
              <el-select
                v-model="temp.item.role_ids"
                multiple
                placeholder=""
                popper-class='select_role'
              >
                <el-option-group
                  v-for="(group,key,index) in groupList"
                  :key='index'
                  :label="group.name"
                >
                  <el-option
                    v-for="item in group.roles"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息">
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
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus=='create'?createData():updateData()"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import Pagination from "@/components/Pagination";
import { Message } from "element-ui";
import {
  staffList,
  createStaff,
  delStaff,
  editStaff,
  positionList,
  createPosition,
  editPosition,
  groupList
} from "@/api/system/staff";
import { uploadUrl } from "@/api/index";
export default {
  name: "staff",
  props: {},
  components: {
    Pagination
  },
  filters: {
    // 格式化入职日期
    formatCreat: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.trim().split(" ")[0];
    },
    // 格式化生日
    formatBirthday: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.date.trim().split(" ")[0];
    }
  },
  data() {
    let validPassword = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^[\x21-\x7E]{6,}$/;
        if (!reg.test(value)) {
          Message.error("密码长度必须不少于6位");
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validCard = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^[\x21-\x7E]{1,}$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validMobile = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validBirthday = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        if (new Date(value).getTime() >= new Date().getTime()) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    return {
      uploadUrl,
      // checkbox
      multipleSelection: [],
      // 员工列表
      listLoading: true,
      staffList: [],
      positionList: [],
      groupList: [],
      // 编辑 temp
      temp: {
        item: {
          avatar_url: undefined,
          workcard: undefined,
          realname: undefined,
          password: undefined,
          gender: null,
          birthday: undefined,
          mobile: undefined,
          entry_time: undefined,
          position_id: undefined,
          role_ids: [],
          remark: undefined
        }
      },
      // dialog
      dialogEditFormVisible: false,
      dialogStatus: "",
      dialogTitle: {
        create: "新增员工",
        edit: "编辑员工"
      },
      // 校验
      rules: {
        workcard: [
          { required: true, trigger: "blur", message: "登录工号不能为空" },
          {
            validator: validCard,
            trigger: "blur",
            message: "登录工号格式不正确"
          }
        ],
        realname: [
          { required: true, trigger: "blur", message: "员工姓名不能为空" }
        ],
        password: [
          {
            validator: validPassword,
            trigger: "blur",
            message: "登录密码格式不正确"
          }
        ],
        mobile: [
          { required: true, trigger: "blur", message: "联系手机不能为空" },
          {
            validator: validMobile,
            trigger: "blur",
            message: "联系手机格式不正确"
          }
        ],
        position_id: [
          { required: true, trigger: "blur", message: "所属职位不能为空" }
        ],
        role_ids: [
          { required: true, trigger: "blur", message: "所属角色不能为空" }
        ],
        entry_time: [
          {
            validator: validBirthday,
            trigger: "blur",
            message: "入职日期不正确"
          }
        ],
        birthday: [
          {
            validator: validBirthday,
            trigger: "blur",
            message: "员工生日不正确"
          }
        ]
      },
      // 分页
      listQuery: {
        page: 1,
        limit: 10,
        search: ""
        // position_id: undefined
      },
      total: 0,
      layout: " sizes, jumper, next, pager, prev, total"
    };
  },
  methods: {
    // 批量操作
    handleCommand(command) {
      command == "assign" ? this.handleAssign() : this.openDelBox();
    },
    // 搜索
    handleSearch() {
      this.listQuery.page = 1;
      this.getStaffList();
    },
    // 批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // temp
    resetTemp() {
      this.temp = {
        item: {
          avatar_url: undefined,
          workcard: undefined,
          realname: undefined,
          password: undefined,
          gender: null,
          birthday: undefined,
          mobile: undefined,
          entry_time: undefined,
          position_id: undefined,
          role_ids: [],
          remark: undefined
        }
      };
    },
    // 新增员工
    handleAdd() {
      this.getPositionList();
      this.getGroupList();
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
          console.log("新增temp", this.temp);
          createStaff(this.temp.item)
            .then(res => {
              this.getStaffList();
              this.dialogEditFormVisible = false;
              this.$message.success("新增成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    // 编辑员工
    handleEdit(row) {
      console.log("row", row);
      this.getPositionList();
      this.getGroupList();
      this.resetTemp();
      let {
        id,
        avatar_url,
        workcard,
        realname,
        gender,
        birthday,
        mobile,
        entry_time,
        position,
        roles,
        remark
      } = row;
      let position_id = position == null ? undefined : position.id,
        role_ids = [];
      birthday = birthday == null ? undefined : birthday.date.split(" ")[0];
      entry_time =
        entry_time == null || entry_time == ""
          ? undefined
          : entry_time.split(" ")[0];
      roles.forEach(item => {
        role_ids.push(item.id);
      });
      this.temp = Object.assign({}, this.temp, {
        id,
        item: {
          avatar_url,
          workcard,
          realname,
          password: undefined,
          gender,
          birthday,
          mobile,
          entry_time,
          position_id,
          role_ids,
          remark
        }
      });
      console.log("编辑temp:", this.temp);

      this.dialogStatus = "edit";
      this.dialogEditFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log("提交temp", this.temp);
          let { id } = this.temp;
          editStaff(id, this.temp.item)
            .then(res => {
              this.getStaffList();
              this.dialogEditFormVisible = false;
              this.$message.success("编辑成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    // 批量删除
    openDelBox() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择员工进行操作");
        return;
      }
      this.$confirm("确定永久性删除此员工吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          console.log(this.multipleSelection);
          let arr = [];
          this.multipleSelection.forEach((v, k) => {
            arr.push(v.id);
          });
          let ids = arr.join(",");
          this.handledelStaff(ids);
        })
        .catch(action => {});
    },
    handledelStaff(ids) {
      delStaff(ids)
        .then(res => {
          this.getStaffList();
          this.$message.success("删除成功");
        })
        .catch(err => {
          console.log(err);
          this.$message.error("删除失败");
        });
    },
    // 删除员工
    handleDelete(row) {
      this.$confirm("确定永久性删除此员工吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let ids = row.id;
          this.handledelStaff(ids);
        })
        .catch(action => {});
    },

    // 获取员工信息列表
    getStaffList() {
      staffList(this.listQuery)
        .then(res => {
          let data = res.success.data;
          console.log("员工列表", data);
          this.staffList = data.data;
          this.total = data.total;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取职位信息列表
    getPositionList() {
      positionList()
        .then(res => {
          let data = res.success.data;
          console.log("职位列表", data);
          this.positionList = data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取角色列表
    getGroupList() {
      groupList()
        .then(res => {
          let data = res.success.data;
          this.groupList = data;
          console.log("角色组列表", data);
        })
        .catch(err => {});
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
      this.temp.item.avatar_url = response.success.data;
    },

    uploadError(err, file, fileList) {
      console.log(err);
    }
  },
  created() {
    this.getStaffList();
    // this.getPositionList();
    // this.getGroupList();
    console.log("staff");
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
.app-container {
  padding: 0;
}
.filter_container {
  overflow: hidden;
  padding: 15px 0;
  border-bottom: 1px solid $tbColor;
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
  .search {
    // min-width: 240px;
    width: 240px;
    margin-right: 20px;
  }
  .goods_category {
    margin-right: 20px;
    .el-form-item__label {
      color: $fontColor_light;
    }
  }
}
// dialog 编辑
.el-dialog__body {
  color: $fontColor;

  .el-col {
    .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
  .el-input,
  .el-select,
  .el-textarea {
    width: 240px;
  }
  .upload_avatar {
    margin-bottom: 30px;
  }
  .image-preview {
    width: 80px;
    height: 80px;
    background: url("~@/assets/member/avatar-big.png") no-repeat center;
    background-color: #f0f2f5;
    overflow: hidden;
    .image-preview-wrapper {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
      }
    }
  }
  .upload_btn {
    margin-top: 10px;
    margin-left: 10px;
  }
  .trigger_btn {
    width: 78px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    color: $fontColor_light;
    border: 1px solid $borderColor;
    border-radius: $borderRadius;
    // i {
    //   line-height: 40px;
    //   color: $borderColor;
    //   font-size: 24px;
    // }
  }
  .el-upload__tip {
    font-size: 12px;
    color: #c0c4cc;
    line-height: 17px;
    margin-top: 10px;
  }
}
</style>

<style lang="scss">
@import "~@/styles/variables.scss";
$fontColor: #606266;
$primaryColor: #f1717e;
$fontColor_light: #909399;
$dialogColor: #e4e7ed;
.system_staff_tab {
  .filter_container {
  }
  .goods_category {
    .el-form-item {
      margin: 0;
    }
    .el-form-item__label {
      color: $fontColor_light;
    }
    .el-input__inner {
      width: 130px;
    }
  }
  // 员工列表
  .goods_list {
    .el-table-column--selection .cell {
      padding: 0px;
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
      background-size: cover;
      img {
        width: 100%;
        height: 100%;
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

// 角色选择框样式
.select_role {
  // .el-select-group__title {
  //   font-size: 14px;
  //   color: $fontColor;
  // }
  // .el-select-dropdown__item {
  //   font-size: 12px;
  //   color: $fontColor_light;
  //   font-weight: 400;
  // }
  .el-select-group__wrap {
    padding-bottom: 24px;
    &:not(:last-of-type) {
      &::after {
        height: 0;
      }
    }
    .el-select-group__title {
      // border-bottom: 1px solid #e4e7ed;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        display: block;
        left: 20px;
        right: 20px;
        // top: 30px;
        bottom: 0;
        height: 1px;
        background: #e4e7ed;
      }
    }
  }
}
</style>
