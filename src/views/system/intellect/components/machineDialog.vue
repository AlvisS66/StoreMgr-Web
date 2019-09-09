<template>
  <el-dialog :title="data ? '编辑打印机' : '新增打印机'" width="770px"
             class="system-machine-dialog"
             :visible.sync="visible"
             @close="$emit('update:show', false)"
             :show="show">
    <el-scrollbar class="scrollbar">
      <el-form ref="machineForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="form.name" placeholder="请输入打印机名称"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="printer_no">
          <el-input type="text" v-model="form.printer_no" placeholder="请输入编号"></el-input>
        </el-form-item>
        <el-form-item label="识别码" prop="printer_code">
          <el-input type="text" v-model="form.printer_code" placeholder="请输入识别码"></el-input>
        </el-form-item>
        <el-form-item label="流量卡号">
          <el-input type="text" v-model="form.card_num" placeholder="请输入流量卡号"></el-input>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addMachine} from '@/api/system/printer';

  export default {
    name: "add_machine",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      staff_list: Array,
      cate_list: Array,
      data: Object,
    },
    data() {
      return {
        loading: false,
        visible: this.show,
        form: {
          time: new Date(),
        },
        rules: {
          name: [
            { required: true, message: '请输入打印机名称', trigger: 'blur' }
          ],
          printer_no: [
            { required: true, message: '请输入编号', trigger: 'blur' }
          ],
          printer_code: [
            { required: true, message: '请输入识别码', trigger: 'blur' }
          ],
        }
      }
    },
    computed: {},

    mounted() {
      if (this.data) {
        this.data.card_num = this.data.card_num || '';
        this.form = this.data;
      }
    },

    methods: {
      // 提交
      onSubmit() {
        this.$refs['machineForm'].validate((valid) => {
          if (valid) {
            addMachine(this.form).then(() => {
              this.$emit('updateList');
              this.visible = false;
              this.$message({
                message: this.data ? '编辑成功' : '新增成功',
                type: "success",
              });
            });
          }
        });
      },
    },

    beforeDestroy() {
      this.form = null;
    },

    filters: {},

    watch: {
      show() {
        this.visible = this.show;
      },
      'form.time'() {
        if (typeof this.form.time === 'string') {
          this.form.time = new Date(this.form.time);
        }
      }
    }
  }
</script>


<style lang="scss">
  .system-machine-dialog {
    .el-form {
      width: 310px;
      margin: 0 auto;
    }
    .el-form-item__label {
      font-weight: normal;
      color: #606266;
    }
  }
</style>