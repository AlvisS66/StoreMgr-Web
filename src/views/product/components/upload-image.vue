<template>
  <div class="app-container upload_image">
    <!-- 上传图片 -->
    <div class="upload_img">
      <div class="image-preview">
        <div class="image-preview-wrapper">
          <img v-productImg='imageurl'>
          <div class="image-preview-action">
            <!-- <i class="el-icon-delete" /> -->
          </div>
        </div>
      </div>
      <div class='upload_box'>
        <el-upload
          class="upload_btn"
          :action='uploadUrl'
          ref="uploadImg"
          name='imageurl'
          :show-file-list="false"
          :before-upload='beforeUpload'
          :with-credentials="false"
          :on-success='uploadSuccess'
          :on-error='uploadError'
        >
          <div
            slot="trigger"
            class="trigger_btn"
          ><i class="el-icon-plus"></i></div>

          <div
            class="el-upload__tip"
            slot="tip"
          >上传产品图片尺寸为480px*360px</div>
        </el-upload>
      </div>
    </div>
  </div>

</template>

<script>
import {
  uploadUrl
} from "@/api/index";
export default {
  name: "upload-image",
  props: ["imageurl"],
  data() {
    return {
      uploadUrl
    };
  },
  methods: {
    // 图片上传
    uploadImage() {},
    beforeUpload(file) {
      // console.log(file);
    },
    uploadSuccess(response, file, fileList) {
      console.log(response.success.data);
      console.log(file);
      // this.temp.item.imageurl = file.url;
      this.$emit("update:imageurl", response.success.data);
    },
    uploadError(err, file, fileList) {
      console.log(err);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-container {
  padding: 0;
}
</style>

<style lang="scss">
@import "~@/styles/variables.scss";
$fontColor_light: #909399;
$borderColor: #dcdfe5;
.upload_image {
  .image-preview {
    width: 311px;
    height: 233px;
    background: url("~@/assets/product/upload_bg.png") no-repeat center;
    background-color: #f0f2f5;
    margin-bottom: 20px;
    overflow: hidden;
    .image-preview-wrapper {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
      }
    }
  }
  .el-upload {
    &.el-upload--text {
      .trigger_btn {
        width: 60px;
        height: 40px;
        border: 1px solid $borderColor;
        border-radius: $borderRadius;
        i {
          line-height: 40px;
          color: $borderColor;
          font-size: 24px;
        }
      }
    }
  }
  .el-upload__tip {
    color: #c0c4cc;
    font-size: 14px;
    // &::before {
    //   content: "*";
    //   color: #f56c6c;
    //   margin-right: 4px;
    // }
  }
}
</style>
