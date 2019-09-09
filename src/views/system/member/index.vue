<template>
  <div class="app-container system_member">
    <el-card
      shadow="always"
      class="card-box  mb-15"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for='(item,key,index) in tabList'
          :key='index'
          :label="item.label"
          :name="item.name"
        >
          <!-- <keep-alive> -->
            <component
              v-if="activeName == item.name"
              :is="item.name"
              :activeName='activeName'
            ></component>
          <!-- </keep-alive> -->
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

</template>

<script>
import Rank from "@/views/system/member/components/rank";
import Discount from "@/views/system/member/components/discount";
import Attribute from "@/views/system/member/components/attribute";
import Tag from "@/views/system/member/components/tag";
import Recharge from "@/views/system/member/components/recharge";
export default {
  name: "system_member",
  components: {
    Rank,
    Discount,
    Attribute,
    Tag,
    Recharge
  },
  data() {
    return {
      activeName: "discount",
      tabList: [
        // {
        //   name: "rank",
        //   label: "会员等级"
        // },
        {
          name: "discount",
          label: "折扣设置"
        },
        // {
        //   name: "attribute",
        //   label: "属性设置"
        // },
        // {
        //   name: "tag",
        //   label: "标签设置"
        // },
        // {
        //   name: "recharge",
        //   label: "余额充值设置"
        // }
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
$tbColor: #ebeef5;
.system_member {
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
