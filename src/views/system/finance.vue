<template>
  <div class="app-container system-finance-page">
    <el-card shadow="always" class="card-box setting-box mb-15">
      <el-tabs v-model="activeName" class="common-tabs">
        <!--支出分类设置-->
        <el-tab-pane label="支出分类设置" name="category">
          <div class="category-tab">
            <el-popover class="category-popover" placement="bottom" v-model="addCategoryVisible">
              <div class="tag-edit">
                <el-input class="input-edit-tag" v-model="addCategoryInput"></el-input>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="addCategoryVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handelCategoryAdd">确定</el-button>
                </div>
              </div>
              <el-button slot="reference" class="button-new-tag" type="primary">+ 新增一级分类</el-button>
            </el-popover>

            <div class="tag-list">
              <div class="tag-item" v-for="item in categoryTags" :key="'categoryTags'">
                <el-popover class="tag-popover" placement="bottom" popper-class="finance-tag-popover"
                            v-model="item.popoverVisible" @show="popoverShow(item)">
                  <div class="tag-del" v-if="item.popoverType === 'del'">
                    <p>确定是否删除该分类名称？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="item.popoverVisible = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="handelCategoryDel(item)">确定</el-button>
                    </div>
                  </div>
                  <div class="tag-edit" v-else-if="item.popoverType === 'edit'">
                    <el-input class="input-edit-tag" v-model="item.inputEditValue"></el-input>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="item.popoverVisible = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="handelCategoryEdit(item)">确定</el-button>
                    </div>
                  </div>
                  <ul class="tag-option" v-else>
                    <li @click="tagCategoryEdit(item)">编辑</li>
                    <li @click="tagCategoryDel(item)">删除</li>
                  </ul>
                  <span class="tag-item-name" slot="reference">{{item.name}}<i class="el-icon-edit"></i></span>
                </el-popover>
                <div class="tags-list">
                  <el-tag :key="tag.id" v-for="tag in item.tags" closable
                          :disable-transitions="false"
                          @close="handleClose(item,tag)">
                    {{tag.name}}
                  </el-tag>
                  <el-input class="input-new-tag"
                            v-if="item.inputVisible"
                            v-model="item.inputValue"
                            :ref="`saveTagInput-${item.id}`"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(item)"
                            @blur="handleInputConfirm(item)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showAddInput(item)">+ 新增</el-button>
                </div>

              </div>

            </div>
          </div>
        </el-tab-pane>

        <!--支付方式-->
        <el-tab-pane label="支付方式" name="type">
          <div class="type-tab">
            <div class="type-setting-item">
              <div class="tag-list">
                <el-popover placement="bottom" class="product-tag" popper-class="product-tag-popover"
                            v-model="tagItem.popoverShow" v-for="tagItem in types.tags" :key="'types'" @show="popoverShow(tagItem)">
                  <div class="tag-del" v-if="tagItem.type === 'del'">
                    <p>确定是否删除该分类名称？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="tagItem.popoverShow = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="handelTagDel(tagItem)">确定</el-button>
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
                    <li @click="tagEdit(tagItem)">编辑</li>
                    <li @click="tagDel(tagItem)">删除</li>
                  </ul>
                  <el-button slot="reference" class="tag">{{tagItem.name}}<i class="el-icon-edit-outline"></i></el-button>
                </el-popover>
                <el-input
                  class="input-new-tag"
                  v-if="types.inputVisible"
                  v-model="types.inputValue"
                  ref="saveTypeTagInput"
                  @keyup.enter.native="handleTypeInputConfirm"
                  @blur="handleTypeInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" type="primary" @click="showTypeInput">新增支付方式</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "system_finance",
    data() {
      return {
        activeName: 'category',
        addCategoryVisible: false,
        addCategoryInput: '',
        categoryTags: [
          {
            id: '1',
            name: '水电费',
            inputVisible: false,
            inputValue: '',
            inputEditValue: '',
            popoverVisible: false,
            popoverType: false,
            tags: [
              {
                id: 1,
                name: '宽带费'
              }
            ],
          }
        ],

        types: {
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

        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
        visible2: false
      };
    },
    methods: {
      //显示增加输入框
      showAddInput(item) {
        item.inputVisible = true;
        this.$nextTick(_ => {
          console.log(this.$refs);
          this.$refs[`saveTagInput-${item.id}`][0].$refs.input.focus();
        });
      },

      //处理增加
      handleInputConfirm(item) {
        let name = item.inputValue;
        let add = {
          name,
        };
        if (name) {
          item.tags.push(add);
        }
        item.inputVisible = false;
        item.inputValue = '';
      },

      //处理增加分类
      handelCategoryAdd() {
        let add = {
          id: 2,
          name: this.addCategoryInput,
          inputVisible: false,
          inputValue: '',
          popoverVisible: false,
          popoverType: false,
          tags: [],
        };
        this.categoryTags.push(add);
        this.addCategoryVisible = false;
        this.addCategoryInput = '';
      },

      //标签分类编辑
      tagCategoryEdit(item) {
        item.popoverType = 'edit';
      },

      //标签分类删除
      tagCategoryDel(item) {
        item.popoverType = 'del'
      },

      //popover开启回调重置状态
      popoverShow(item) {
        item.popoverType = '';
        item.inputEditValue = '';
      },

      //處理標籤刪除
      handleClose(item, tag) {
        this.$confirm('确定是否删除该支出标签?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          item.tags.splice(item.tags.indexOf(tag), 1);
        }).catch(() => {
        });
      },

      handelCategoryEdit(item) {
        item.name = item.inputEditValue;
        item.popoverVisible = false;
        item.inputEditValue = '';
      },

      //处理分类删除
      handelCategoryDel(item) {
        this.categoryTags.splice(this.categoryTags.indexOf(item), 1);
      },

      /* 支付方式 */

      //显示增加框
      showTypeInput(){
        this.types.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs['saveTypeTagInput'].$refs.input.focus();
        });
      },

      //處理新增
      handleTypeInputConfirm() {
        let inputValue = this.types.inputValue;
        if (inputValue) {
          let tag = {
            name: inputValue,
            popoverShow: false,
            inputEditValue: '',
            type: ''
          };
          this.types.tags.push(tag);
        }
        this.types.inputVisible = false;
        this.types.inputValue = '';
      },
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .system-finance-page {
    .card-box {
      .el-card__body {
        padding-top: 0;
      }
    }

    .category-tab {
      padding: 15px 0;
      .tag-list {
        padding: 10px 0;
      }
      .tag-item {
        position: relative;
        margin-bottom: 10px;
      }
      .category-popover {
        display: inline-block;
        margin-left: 40px;
      }
      .tag-popover {
        display: inline-block;
        float: left;
        text-align: right;
        width: 190px;
      }
      .tag-item-name {
        cursor: pointer;
        display: inline-block;
        height: 32px;
        line-height: 30px;
        padding: 0 10px;
        &:hover {
          color: $--color-primary;
        }
        .el-icon-edit {
          margin-left: 8px;
        }
      }
      .el-tag {
        height: 32px;
        line-height: 30px;
        margin-bottom: 10px;
        margin-right: 10px;
      }
      .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
      }
      .tags-list {
        padding-left: 200px;
      }
    }

    .type-tab {
      padding: 15px 0;
      .product-tag {
        display: inline-block;
        margin-bottom: 10px;
        margin-right: 10px;
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
    }
  }

  .finance-tag-popover {
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