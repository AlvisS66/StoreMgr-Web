<template>
  <!--交易成功-->
  <el-dialog
    class="cash-billing-success-dialog" width="420px"
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    :show="show">
    <div class="title">
      <div class="el-icon-success"></div>
      <span>交易成功</span>
    </div>
    <p class="message">结账成功，请在交易流水中查看消费明细</p>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible= false" size="small">确 定</el-button>
      <!--打印小票-->
      <my-print-button
        :order_id="order_id">
      </my-print-button>
    </div>
  </el-dialog>
</template>

<script>
  import MyPrintButton from "@/components/MyPrintButton";

  export default {
    name: "cash-billing-success-dialog",
    components: {
      MyPrintButton,
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      order_id: [Number, String],
    },
    data() {
      return {
        visible: this.show,
        loading: false,
      }
    },
    computed: {},

    mounted() {

    },

    methods: {},

    beforeDestroy() {
      console.log('beforeDestroy');
      clearInterval(this.timer); //停止更新时间
    },

    filters: {},

    watch: {
      show() {
        this.visible = this.show;
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .cash-billing-success-dialog {
    .el-dialog {
      border-radius: 5px;
    }
    .el-dialog__header {
      border-bottom: 0;
    }
    .el-icon-success {
      position: relative;
      top: auto;
      padding-right: 5px;
      text-align: center;
      transform: translateY(-1px);
      color: #67c23a;
      font-size: 24px;
    }
    .el-dialog__body {
      border-bottom: 0;
      padding: 10px 20px 0 20px !important;
      text-align: center;
      .title {
        padding-left: 0;
        margin-bottom: 0;
        font-size: 18px;
        line-height: 1;
        color: #303133;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .message {
        padding: 10px 0;
      }
    }
    .el-dialog__footer {
      border: none;
      text-align: center;
      padding: 0 0 30px !important;
    }
    .dialog-footer {
      >.el-button {
        margin-right: 10px;
      }
    }
  }
</style>