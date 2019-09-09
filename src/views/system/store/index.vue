<template>
  <div class="app-container system-shop-page">
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
  import Store from './components/store';
  import Room from './components/room';

  export default {
    name: "system_store_index",
    components: {
      Store,
      Room,
    },
    data() {
      return {
        activeName: "store",
        tabList: [
          {
            name: "store",
            label: "门店设置"
          },
          {
            name: "room",
            label: "包间设置"
          },
        ]
      };
    },

    methods: {}
  };
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  $tbColor: #ebeef5;
  .system-shop-page {
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
