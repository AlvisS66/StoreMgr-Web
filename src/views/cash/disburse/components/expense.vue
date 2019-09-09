<template>
  <el-dialog title="新增支出" width="770px"
             class="addDisburse-dialog"
             :visible.sync="visible"
             @close="$emit('update:show', false)"
             :show="show">
    <el-scrollbar class="scrollbar">
      <el-form ref="expenseForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="支出日期" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支出类型" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择支出类型">
            <el-option
              v-for="item in cate_list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支出金额" prop="price">
          <el-input type="text" v-model.trim="form.price"></el-input>
        </el-form-item>
        <el-form-item label="支出员工">
          <el-select v-model="form.staff_user_id" placeholder="请选择支出员工">
            <el-option label="不选择" :value="0"></el-option>
            <el-option
              v-for="item in staff_list"
              :key="item.id"
              :label="item.realname"
              :value="item.staff_user_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支出备注" prop="remark">
          <el-input
            type="textarea" v-model.trim="form.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            resize="none"
            placeholder="请输入100字以内的支出备注">
          </el-input>
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
  const moment = require('moment');
  import {calc, parseTime} from '@/utils/index';
  import {editExpense} from '@/api/cash/expense';
  import {validateMoney} from '@/utils/validate';

  let moneyValidate = (rule, value, callback) => {
    if (!validateMoney(value)) {
      callback(new Error('请填写正确支出金额'));
      return false;
    }
    callback();
  };

  export default {
    name: "expense",
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
          time : new Date(),
        },
        rules: {
          time: [
            { type: 'date', required: true, message: '请选择支出日期', trigger: 'change' }
          ],
          price: [
            { validator: moneyValidate, required: true, trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择支出类型', trigger: 'change' }
          ],
          remark : [
            { max: 100, message: '支出备注在100个字符之内', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {},

    mounted() {
      if (this.data) {
        this.form = this.data;
      }
    },

    methods: {
      // 提交
      onSubmit() {
        this.$refs['expenseForm'].validate((valid) => {
          if (valid) {
            this.form.time = moment(this.form.time).format("YYYY-MM-DD HH:mm:ss");
            editExpense(this.form).then(() => {
              this.$emit('updateList');
              this.visible = false;
              this.$message({
                message: this.data ? '编辑成功' : '新增成功',
                type: "success"
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


<style scoped>

</style>