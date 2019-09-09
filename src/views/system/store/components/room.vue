<template>
  <div class="system-room-page" v-loading="loading">
    <div shadow="always" class="setting-box mb-15">
      <el-tag
        v-for="tag in tags"
        :key="tag.id"
        closable
        :disable-transitions="false"
        type="info"
        @close="handleClose(tag.id)">
        {{tag.name}}
      </el-tag>

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
      <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput">新增包间</el-button>
    </div>
  </div>
</template>

<script>
  import {getPrivateroom, addPrivateroom, delPrivateroom} from '@/api/system/room';

  export default {
    name: "system_room",
    data() {
      return {
        loading: false,
        tags: [],
        inputVisible: false,
        inputValue: ''
      };
    },

    mounted() {
      this.getTag();
    },

    methods: {
      //顯示新增輸入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      //获取包厢
      getTag() {
        this.loading = true;
        getPrivateroom().then(res => {
          this.loading = false;
          this.tags = res.success.data;
        });
      },

      //處理新增
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.saveTag(inputValue);
          // this.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      //保存新增標籤
      saveTag(name) {
        addPrivateroom(name).then(_ => {
          this.$message({
            message: '添加成功',
            type: 'success',
          });
          this.getTag();
        });
      },

      //處理標籤刪除
      handleClose(id) {
        this.$confirm('确定是否删除该包间名称?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.delTag(id);
        }).catch(() => {
        });
      },

      //刪除標籤
      delTag(id) {
        delPrivateroom(id).then(_ => {
          this.$message({
            message: '删除成功',
            type: 'success',
          });
          this.getTag();
        });
      }
    }
  }
</script>

<style lang="scss">
  .system-room-page {
    padding: 20px 0;
    .setting-box {
      padding: 0 20px;
      .el-card__header {
        padding: 10px 0;
        .header {
          line-height: 36px;
          font-size: 16px;
          color: #606266;
          font-weight: bold;
        }
      }
      .el-card__body {
        padding: 20px 0;
        min-height: 400px;
      }
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
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


