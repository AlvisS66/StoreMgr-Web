<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo-box">
      <img :src="basicInfoStore.logo" alt="" v-if="basicInfoStore.logo">
      <el-tooltip :content="basicInfoStore.name" effect="dark" placement="bottom">
        <span>{{basicInfoStore.name}}</span>
      </el-tooltip>
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#f1717e"
      text-color="#fff"
      active-text-color="#fff"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'basicInfoStore',
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created(){
    // 获取门店基本信息
    this.$store.dispatch('getBasicInfo');
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .logo-box {
    height: 60px;
    line-height: 60px;
    background-color: $menuBg;
    color: #fff;
    font-size: 14px;
    padding: 0 15px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
</style>
