<template>
  <div class="system-store-page">
    <el-form ref="storeForm" :model="form" :rules="rules" class="store-form" label-width="80px">
      <el-form-item label="门店封面" prop="logo">
        <div class="logo-box">
          <div class="upload-box">
            <img :src="form.logo" alt="" v-if="form.logo">
          </div>
          <el-upload
            class="upload-btn"
            :action="uploadUrl"
            name='imageurl'
            :show-file-list="false"
            :with-credentials="false"
            :on-success='uploadLogoSuccess'
            :on-error='uploadLogoError'>
            <el-button size="mini" type="primary">选择图片</el-button>
            <div slot="tip" class="el-upload__tip">支持上传图片格式jpg、png、gif。尺寸：640px*640px。</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="门店名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="门店电话" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="营业时间" prop="store_hour_start">
        <el-time-picker
          is-range
          v-model="store_hour"
          format='HH:mm'
          value-format="HH:mm"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="门店地址" prop="address">
        <el-input v-model="form.address" class="address-input"></el-input>
      </el-form-item>

      <template v-if="manager">
        <hr/>
        <ul class="manager-box">
          <li><label class="el-form-item__label">店主姓名</label>{{manager.realname}}</li>
          <li><label class="el-form-item__label">手机号</label>{{manager.mobile}}</li>
        </ul>
        <hr/>
      </template>

      <el-form-item>
        <el-button type="primary" @click="saveStore">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  const moment = require("moment");
  import {uploadUrl} from '@/api/index';
  import {getStore, saveStore} from '@/api/system/store';
  import {validateTel} from '@/utils/validate';

  export default {
    name: "system_store",
    data() {
      let checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入门店电话'));
        }
        if (!validateTel(value)) {
          callback(new Error('门店电格式不正确'));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        uploadUrl,
        form: {
          name: '',
          logo: '',
          address: '',
          store_hour_start: '',
          store_hour_end: '',
          phone: '',
          envir_images: [],
          introduce: ''
        },
        store_hour: ["08:12", "08:25"],
        manager: null,
        rules: {
          logo: [
            { required: true, message: '请上传门店封面', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入门店名称', trigger: 'blur' },
          ],
          phone: [
            { validator: checkTel, required: true,trigger: 'blur' },
          ],
          store_hour_start: [
            { required: true, message: '请选择营业时间', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入门店地址', trigger: 'blur' }
          ],
        },
      }
    },

    computed: {},

    mounted() {
      this.getStore();
    },

    methods: {
      // 上传成功
      uploadLogoSuccess(res) {
        this.form.logo = res.success.data;
      },

      // 上传失败
      uploadLogoError(res) {
        this.$message({
          message: res.error.message,
          type: 'error',
          duration: 5 * 1000,
        });
      },

      // 获取门店配置
      getStore() {
        getStore().then(res => {
          let data = res.success.data[0];
          data.envir_images = data.images;
          let { name, logo, address, store_hour_start, store_hour_end, phone, envir_images, introduce } = data;
          this.form = { name, logo, address, store_hour_start, store_hour_end, phone, envir_images, introduce };
          this.store_hour = [store_hour_start, store_hour_end];
          this.manager = data.manager;
        });
      },

      // 保存配置
      saveStore() {
        this.$refs['storeForm'].validate((valid) => {
          if (valid) {
            saveStore(this.form).then(() => {
              this.$message({
                message: '门店设置成功',
                type: 'success',
              });
              this.$store.dispatch('getBasicInfo');
            });
          }
        });

      }
    },

    watch: {
      store_hour(val) {
        if (val) {
          [this.form.store_hour_start, this.form.store_hour_end] = val;
        } else {
          this.form.store_hour_start = this.form.store_hour_end = '';
        }

      }
    }
  }
</script>

<style lang="scss">
  .system-store-page {
    padding: 20px;
    .store-form {
      .el-input {
        width: 200px;
      }
      .el-range-separator {
        width: 24px;
      }
      .address-input {
        width: 350px;
      }
    }
    hr {
      background: #dcdfe6;
      border: none;
      height: 1px;
      margin-bottom: 15px;
    }
    .logo-box {
      display: flex;
      .upload-box {
        width: 180px;
        height: 180px;
        background: url("~@/assets/system/shop-upload-img.png") no-repeat center;
        margin-right: 30px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .manager-box {
      margin-bottom: 20px;
      li {
        line-height: 36px;
        overflow: hidden;
        color: #939393;
        label {
          width: 80px;
          line-height: 36px;
        }
      }
    }
  }
</style>