<template>
  <div class="app-container system_member_rank_tab">
    <!-- 会员等级 -->
    <el-popover
      placement="bottom"
      width="190"
      v-model="tag.visible"
      :key="key"
      v-for="(tag,key) in rankTags"
    >
      <p class="tips">确定是否删除该等级名称?</p>
      <div style="text-align: right; margin: 0">
        <el-button
          size="mini"
          type="text"
          @click="tag.visible = false"
        >取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="tag.visible = false"
        >确定</el-button>
      </div>
      <el-tag
        closable
        :disable-transitions="false"
        type="info"
        @close="tag.visible = true"
        slot="reference"
      >
        {{tag.item.name}}
      </el-tag>
    </el-popover>

    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button
      v-else
      class="button-new-tag"
      type="primary"
      size="small"
      @click="showInput"
    >新增等级名称</el-button>

  </div>

</template>

<script>
export default {
  name: "member_rank",
  props: {},
  data() {
    return {
      rankTags: [
        {
          visible: false,
          item: {
            name: "111"
          }
        }
      ],
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    // //處理標籤刪除
    // handleClose(tag) {
    //   this.$confirm("确定是否删除该包间名称?", "温馨提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   })
    //     .then(() => {
    //       this.tags.splice(this.tags.indexOf(tag), 1);
    //     })
    //     .catch(() => {});
    // },

    //顯示新增輸入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //處理新增
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.rankTags.push({ item: { name: inputValue }, visible: false });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    //保存新增標籤
    saveTag() {
      //TODO:
    },

    //刪除標籤
    delTag() {
      //TODO:
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
  padding: 30px 0 0 0;
}
.tips {
  font-weight: normal;
  line-height: 33px;
  letter-spacing: 0px;
  color: $fontColor;
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
.system_member_rank_tab {
  .setting-box {
    padding: 0 20px;
  }
  .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    height: 28px;
    line-height: 26px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
