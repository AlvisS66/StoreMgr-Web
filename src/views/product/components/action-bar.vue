<template>
  <div class="app-container product_action_bar">
    <!-- tab -->
    <el-tabs
      v-model="activeList"
      class="common-tabs"
    >
      <el-tab-pane
        :label='`${title[activeName]}列表`'
        name="0"
      >
        <!-- 产品 操作 -->
        <div class="filter_container">
          <div class="header">
            <el-dropdown
              @command="$emit('handleCommand',$event)"
              class="fl"
              trigger="click"
              placement='bottom-start'
            >
              <el-button
                type="primary"
                class="showbtn"
              >
                批量操作<i
                  class="el-icon-arrow-down el-icon--right"
                  style="color:#c7cbd2"
                ></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="stop">停售</el-dropdown-item>
                <!-- <el-dropdown-item command="del">删除</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <el-form
              :inline="true"
              class="goods_category fl"
            >
              <el-form-item label="产品分类">
                <el-select
                  placeholder="分类"
                  v-model='listQueryCategory_id'
                  @change="$emit('handleGoodsFilter')"
                >
                  <el-option
                    label="全部"
                    value=""
                    class="goods_select_option"
                  >
                  </el-option>
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item,key,index) in commandFilterList"
                    :key='index'
                    class="goods_select_option"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <el-button
              plain
              class="fr"
              @click="$emit('showSynchroDialog')"
            >
              同步总部数据
            </el-button>

            <el-popover
              class="fr sync_tips"
              placement="bottom"
              width="200"
              trigger="hover"
              content="同步总部产品列表，且库存默认为零。"
            >
              <i
                slot="reference"
                class="el-icon-question"
              ></i>
            </el-popover>

            <el-button
              type="primary"
              class="fr add_member"
              @click="$emit('handleAdd')"
            >
              新增{{title[activeName]}}
            </el-button>
            <el-input
              :placeholder='placeholder[activeName]'
              class="fr search"
              v-model="listQuerySearch"
              prefix-icon="el-icon-search"
              @change="$emit('handleSearch')"
              clearable
            >
            </el-input>
          </div>
        </div>
        <slot name='0'>
        </slot>
      </el-tab-pane>
      <el-tab-pane
        :label='`已停售${title[activeName]}`'
        name="1"
      >
        <!-- 产品 操作 -->
        <div class="filter_container">
          <div class="header">
            <el-dropdown
              @command="$emit('handleCommand',$event)"
              class="fl"
              trigger="click"
              placement='bottom-start'
            >
              <el-button
                type="primary"
                class="showbtn"
              >
                批量操作<i
                  class="el-icon-arrow-down el-icon--right"
                  style="color:#c7cbd2"
                ></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sale">开售</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- <el-form
              :inline="true"
              class="goods_category fl"
            >
              <el-form-item label="产品分类">
                <el-select
                  placeholder="分类"
                  v-model='listQueryCategory_id'
                  @change="$emit('handleGoodsFilter')"
                >
                  <el-option
                    label="全部"
                    value=""
                    class="goods_select_option"
                  >
                  </el-option>
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item,key,index) in commandFilterList"
                    :key='index'
                    class="goods_select_option"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form> -->

            <!-- <el-input
              :placeholder='placeholder[activeName]'
              class="fr search"
              v-model="listQuerySearch"
              suffix-icon="el-icon-search"
              @change="$emit('handleSearch')"
              clearable
            >
            </el-input> -->
          </div>
        </div>
        <slot name='1'>

        </slot>
      </el-tab-pane>
    </el-tabs>

  </div>

</template>

<script>
export default {
  name: "product_action_bar",
  props: [
    "activeName",
    "category_id",
    "commandFilterList",
    "search",
    "activeTab"
  ],
  data() {
    return {
      title: ["商品", "服务", "次卡", "储值卡"],
      placeholder: ["搜索编码、名称", "搜索编码、名称", "搜索名称", "搜索名称"]
    };
  },
  methods: {},
  computed: {
    listQuerySearch: {
      get() {
        return this.search;
      },
      set(val) {
        this.$emit("update:search", val);
      }
    },
    listQueryCategory_id: {
      get() {
        return this.category_id;
      },
      set(val) {
        this.$emit("update:category_id", val);
      }
    },
    activeList: {
      get() {
        return this.activeTab;
      },
      set(val) {
        this.$emit("update:activeTab", val);
      }
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;
.app-container {
  padding: 0;
}
.filter_container {
  .header {
    padding-bottom: 10px;
    overflow: hidden;
    border-bottom: 1px solid $tbColor;
    .el-dropdown {
      .showbtn {
        width: 100px;
        background-color: #fff;
        color: $fontColor;
        border: 1px solid $borderColor;
        padding: 10px;
        &:focus {
          border: 1px solid #f48d98;
        }
        i {
          padding-left: 5px;
        }
      }
      &.ml-20 {
        margin-left: 20px;
      }
    }
    .goods_category {
      margin-left: 20px;
      .el-form-item__label {
        color: $fontColor_light;
      }
    }
    .search {
      // min-width: 240px;
      width: 240px;
      margin-right: 20px;
    }
    .add_member {
      margin-left: 0;
      margin-right: 20px;
    }
  }
}
</style>

<style lang="scss">
@import "~@/styles/variables.scss";
$fontColor_light: #909399;
$borderColor: #dcdfe5;
.product_action_bar {
  .filter_container {
    .goods_category {
      .el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__label {
        color: $fontColor_light;
      }
      .el-input__inner {
        width: 130px;
      }
    }
  }

  // 同步数据
  .el-icon-question {
    color: #d5d8de;
    font-size: 18px;
    cursor: pointer;
  }

  .sync_tips {
    line-height: 36px;
    margin-right: 5px;
  }
}
</style>
