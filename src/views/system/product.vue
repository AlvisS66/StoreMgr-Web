<template>
  <div class="app-container system-product-page">
    <el-card shadow="always" class="card-box setting-box mb-15">
      <div slot="header">
        <span class="header">产品分类</span>
      </div>
      <div class="type-setting">
        <div class="type-setting-item" v-for="item in types">
          <h4 class="title">{{item.title}}</h4>
          <div class="tag-list">
            <el-popover placement="bottom" class="product-tag" popper-class="product-tag-popover"
                        v-model="tagItem.popoverShow" v-for="tagItem in item.tags" key="tags" @show="popoverShow(tagItem)">
              <div class="tag-del" v-if="tagItem.type === 'del'">
                <p>确定是否删除该分类名称？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="tagItem.popoverShow = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handelTagDel(item,tagItem)">确定</el-button>
                </div>
              </div>
              <div class="tag-edit" v-else-if="tagItem.type === 'edit'">
                <el-input class="input-edit-tag" v-model="tagItem.inputEditValue"></el-input>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="tagItem.popoverShow = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handelTagEdit(tagItem)">确定</el-button>
                </div>
              </div>
              <ul class="tag-option" v-else>
                <li @click="tagEdit(item,tagItem)">编辑</li>
                <li @click="tagDel(item,tagItem)">删除</li>
              </ul>
              <el-button slot="reference" class="tag">{{tagItem.name}}<i class="el-icon-edit-outline"></i></el-button>
            </el-popover>
            <el-input
              class="input-new-tag"
              v-if="item.inputVisible"
              v-model="item.inputValue"
              :ref="`saveTagInput-${item.id}`"
              @keyup.enter.native="handleInputConfirm(item)"
              @blur="handleInputConfirm(item)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" type="primary" @click="showInput(item)">新增{{item.title}}</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "system_product",
    data() {
      return {
        tags: [],
        types: [
          {
            id: 1,
            title: '商品分类',
            inputVisible: false,
            inputValue: '',
            tags: [
              {
                name: '保湿霜',
                popoverShow: false,
                type: 'del',
                inputEditValue: ''
              },
              {
                name: '护肤',
                type: '',
                popoverShow: false,
                inputEditValue: ''
              }
            ]
          },
          {
            id: 2,
            title: '服务分类',
            inputVisible: false,
            inputValue: '',
            tags: []
          }
        ]
      };
    },
    methods: {

      //顯示新增輸入框
      showInput(item) {
        item.inputVisible = true;
        this.$nextTick(_ => {
          let ref = `saveTagInput-${item.id}`;
          this.$refs[ref][0].$refs.input.focus();
        });
      },

      //處理新增
      handleInputConfirm(item) {
        let inputValue = item.inputValue;
        if (inputValue) {
          let tag = {
            name: inputValue,
            popoverShow: false,
            inputEditValue: '',
            type: ''
          };
          item.tags.push(tag);
        }
        item.inputVisible = false;
        item.inputValue = '';
      },

      //编辑标签
      tagEdit(item, tagItem) {
        this.$nextTick(_ => {
          tagItem.type = 'edit';
        });
        console.log(11111);
      },

      //处理标签编辑
      handelTagEdit(tagItem){
        tagItem.name = tagItem.inputEditValue;
        tagItem.popoverShow = false;
        tagItem.inputEditValue = '';
        this.$message({
          message: '操作成功！',
          type: 'success'
        });
      },

      //删除标签
      tagDel(item, tagItem) {
        this.$nextTick(_ => {
          tagItem.type = 'del';
        });
      },

      //处理标签删除
      handelTagDel(item,tagItem){
        item.tags.splice(item.tags.indexOf(tagItem), 1);
        tagItem.popoverShow = false;
        this.$message({
          message: '操作成功！',
          type: 'success'
        });
      },

      //popover开启回调重置状态
      popoverShow(tagItem) {
        tagItem.type = '';
        tagItem.inputEditValue = '';
      }

    }
  }
</script>

<style lang="scss">
  .system-product-page {
    .type-setting-item {
      padding: 10px 0;
      border-bottom: 1px solid #ebeef5;
      &:last-child {
        border-bottom: none;
      }
      h4 {
        &.title {
          font-size: 14px;
          color: #606266;
        }
      }
    }

    .tag-list {
      .product-tag {
        display: inline-block;
        margin-bottom: 10px;
        margin-right: 10px;
      }

    }
    .el-icon-edit-outline {
      margin-left: 10px;
      color: #c0c4cc;
    }

    .input-new-tag {
      width: 130px;
      margin-left: 10px;
      margin-bottom: 10px;
    }

    .card-box {
      .el-card__body {
        padding-top: 0;
      }
    }
  }

  .product-tag-popover {
    min-width: 90px;
  }
</style>

<style lang="scss" scoped>
  .tag-option {
    margin-left: -12px;
    margin-right: -12px;
    li {
      line-height: 30px;
      padding: 0 12px 0 22px;
      cursor: pointer;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  .tag-edit {
    padding-top: 10px;
    .input-edit-tag {
      margin-bottom: 10px;
    }
  }
</style>