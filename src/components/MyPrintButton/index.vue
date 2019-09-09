<template>
  <!--打印小票-->
  <el-dropdown @command="printOrder">
    <el-button class="el-dropdown-link" size="small" @mouseover.native.stop="getMachine">
      打印小票
      <i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :command="item.id"
        v-for="(item,index) in machineList"
        :key="index">
        {{item.name}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import {getMachine, printOrder} from '@/api/system/printer'

  export default {
    name: "MyPrintButton",
    props: {
      order_id: [String, Number],
    },
    data() {
      return {
        machineList: [],
      }
    },
    computed: {},

    mounted() {
    },

    methods: {
      // 获取打印列表
      getMachine() {
        if (this.machineList.length) return;
        getMachine().then(res => {
          this.machineList = res.success.data.data;
        });
      },

      // 打印小票
      printOrder(machine_id) {
        printOrder(this.order_id, machine_id).then(res => {
          this.$message({
            message: '打印成功',
            type: "success",
          });
        });
      }
    },

    beforeDestroy() {
    },

    filters: {},

    watch: {}
  }
</script>

<style lang="scss" scoped>
  .filter-box {
    color: #909399;
    font-size: 14px;
    .el-card__body {
      padding: 10px 20px;
      overflow: hidden;
    }
    .el-date-editor .el-range-separator {
      width: auto;
    }
  }
</style>