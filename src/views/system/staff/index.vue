<template>
  <div class="app-container system_staff">
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
import Staff from "@/views/system/staff/components/staff";
import Position from "@/views/system/staff/components/position";
import Role from "@/views/system/staff/components/role";
export default {
  name: "system_staff",
  components: {
    Staff,
    Position,
    Role
  },
  data() {
    return {
      activeName: "staff",
      tabList: [
        {
          name: "staff",
          label: "员工管理"
        },
        {
          name: "position",
          label: "职位管理"
        },
        {
          name: "role",
          label: "角色管理"
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
$tbColor: #ebeef5;
.system_staff {
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
