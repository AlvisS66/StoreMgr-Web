<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title&&item.meta.breadcrumb!==false" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{
        generateTitle(item.meta.title) }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb();

    console.log('levelList',this.levelList);
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => {
        if (item.name) {
          return true
        }
      })
      const first = matched[0]
      if (first && first.name.trim().toLocaleLowerCase() !== 'Index'.toLocaleLowerCase()) {
        matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
      }
      this.levelList = matched
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 60px;
    margin-left: 10px;
    .no-redirect {
      color: rgba(255,255,255,.8);
      cursor: text;
    }
    .el-breadcrumb__inner {
      a {
        color: #fff;
      }
    }
  }
</style>
<style>
  .el-breadcrumb__separator  {
    color: #ffe0d6!important;
  }
</style>
