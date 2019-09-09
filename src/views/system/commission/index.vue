<template>
  <div class="app-container system-commission-page">
    <el-card
      shadow="always"
      class="card-box setting-box mb-15"
    >
      <el-tabs
        v-model="activeTabName"
        class="common-tabs"
      >
        <el-tab-pane
          v-for='(item,key,index) in tabList'
          :key='index'
          :label="item.label"
          :name="item.name"
        >
          <keep-alive>
            <casetable
              v-if="activeTabName == item.name"
              :activeName='activeTabName'
            >
            </casetable>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import casetable from "@/views/system/commission/components/casetable";

export default {
  name: "system_commission",
  components: {
    casetable
  },
  // provide() {
  //   return {
  //     openEditDialog: this.openEditDialog,
  //     handleCommand: this.handleCommand
  //   };
  // },

  data() {
    return {
      activeTabName: "0",
      tabList: [
        {
          name: "0",
          label: "商品提成"
        },
        {
          name: "1",
          label: "服务提成"
        },
        {
          name: "2",
          label: "计次卡提成"
        },
        {
          name: "3",
          label: "储值卡提成"
        },

        {
          name: "4",
          label: "余额充值提成"
        }
      ]
    };
  },

  methods: {}
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
</style>

<style lang="scss">
@import "~@/styles/variables.scss";
.system-commission-page {
  .card-box {
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>
