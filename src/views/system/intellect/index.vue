<template>
  <div class="app-container system-intellect-page">
    <el-card shadow="always" class="card-box mb-15">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for='(item,key,index) in tabList'
          :key='index'
          :label="item.label"
          :name="item.name">
          <component
            v-if="activeName === item.name"
            :is="item.name"
            :activeName='activeName'>
          </component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import Setting from './components/setting';
  import Machine from './components/machine';

  export default {
    name: "system_intellect_index",
    components: {
      Setting,
      Machine,
    },
    data() {
      return {
        activeName: "setting",
        tabList: [
          {
            name: "setting",
            label: "打印机设置"
          },
          {
            name: "machine",
            label: "打印机管理"
          },
        ]
      };
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  $tbColor: #ebeef5;
  .system-intellect-page {
    .el-tabs__item {
      height: 40px;
      line-height: 24px;
      font-size: 16px;
      font-weight: 400;
    }
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
        background-color: $tbColor;
      }
    }
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__active-bar {
      height: 3px;
    }
  }
</style>