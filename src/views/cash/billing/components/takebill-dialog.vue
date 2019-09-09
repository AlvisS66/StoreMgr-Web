<template>
  <!--取单-->
  <el-dialog title="取单" class="billing-takeBill-dialog" width="770px"
             :visible.sync="visible"
             @close="$emit('update:show', false)"
             :show="show">
    <el-form class="form-inline" ref="form" label-width="100px" @submit.native.prevent>
      <el-form-item label="">
        <el-input class="search-input" v-model="search"
                  placeholder="请输入查询包厢名称"
                  @keyup.enter.native="searchTakeBill"
                  clearable
                  @clear="searchTakeBill">
          <el-button slot="append" icon="el-icon-search" @click.native="searchTakeBill"></el-button>
        </el-input>
      </el-form-item>
      <el-scrollbar class="scrollbar" v-loading="loading">
        <el-form-item label="包厢名称" class="loge-radio-box" v-show="list.length">
          <el-row :gutter="24" style="padding: 0 10px;">
            <el-col :span="8" v-for="(item,index) in list" :key="index">
              <el-radio v-model="bill_id" :label="item.id" border>
                <h4>
                  <span>{{item.room_name}}</span>
                  <svg-icon icon-class="delete" class="delete-btn" @click.native.prevent.stop="delOrder(item,index)"/>
                </h4>
                <ul>
                  <li>
                    <span>顾客：</span>
                    <div>{{item.member_user_id ? item.member_user.realname : '散客'}}</div>
                  </li>
                  <li v-if="item.member_user_id">
                    <span>手机：</span>
                    <div>{{item.member_user.mobile}}</div>
                  </li>
                  <li class="ellipsis" :title="item.project">
                    <span>项目：</span>
                    <div>{{item.project}}</div>
                  </li>
                  <li>
                    <span>操作：</span>
                    <div>{{item.staff_user.realname}}</div>
                  </li>
                  <li>
                    <span>备注：</span>
                    <div class="remark-content" :title="item.remark">{{item.remark}}</div>
                  </li>
                </ul>
              </el-radio>
            </el-col>
          </el-row>
        </el-form-item>
        <div style="text-align: center;padding: 30px 0" v-if="!list.length && !loading">暂无数据</div>
      </el-scrollbar>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click.native="doTakeBill">取 单</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {stagingList, delOrder, orderDetail, calculateRatio} from '@/api/cash/billing';

  export default {
    name: "takebill-dialog",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      cur_room_id: [Number, String],
    },
    data() {
      return {
        visible: this.show,
        loading: false,
        list: [],
        bill_id: '',
        search: '',
      }
    },
    computed: {},

    mounted() {
      this.getStagingList(); //获取订单
    },

    methods: {
      //获取订单
      getStagingList(name) {
        this.loading = true;
        stagingList(name).then(res => {
          this.loading = false;
          this.list = [];
          let list = res.success.data;
          if (!list.length) return false;
          list.forEach(item => {
            item.project = item.order_item.map(n => n.title).join('、');
          });
          this.list = list;
        });
      },

      //查询取单
      searchTakeBill() {
        this.getStagingList(this.search);
      },

      //删除订单
      delOrder(order, index) {
        this.$confirm('确定删除该订单吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.loading = true;
          delOrder(order.id).then(res => {
            this.list.splice(index, 1);
            this.loading = false;
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
          });
          if (this.bill_id === order.id) {
            this.bill_id = '';
          }
          if (this.$parent.curOrder.id === order.id) {
            this.$parent.resetOrder();
          }
        }).catch(() => {
        });
      },

      //取单
      doTakeBill() {
        if (!this.bill_id) {
          this.$message({
            message: '请选择挂单！',
            type: 'warning'
          });
          return false;
        }
        orderDetail(this.bill_id).then(res => {
          this.$message({
            message: '取单成功！',
            type: 'success'
          });
          this.visible = false;

          let orderInfo = res.success.data;
          if (orderInfo.member_user_id) {
            this.$parent.getMemberInfo(orderInfo.member_user_id);
          } else {
            this.$parent.curMember = '';
          }
          let goodsSelected = [];
          let cardSelected = [];
          orderInfo.order_item.forEach(item => {
            item.is_free = item.is_free > 0;
            if (item.user_tcard_id || item.user_advance_id) {
              item.avg_price = item.price;
              item.item_name = item.title;
              cardSelected.push(item);
            } else {
              goodsSelected.push(item);7
            }
          });
          this.$parent.curOrder = {
            id: orderInfo.id,
            room_id: orderInfo.room_id,
          };
          this.$parent.cardSelected = cardSelected;
          this.$parent.curOrder.remark = orderInfo.remark;
          //取单耗卡数据处理
          this.handelCalculateRatio(cardSelected, orderInfo.id);
          //取单商品数据处理
          this.handelTakeBillData(goodsSelected, orderInfo.id);
        });
      },

      // 取单数据处理
      handelTakeBillData(data, member_user_id) {
        if (!data.length) return false;
        this.handelCalculateRatio(data, member_user_id).then(res => {
          this.$parent.getPreStore(res);
        });
      },

      //取单选择技师更新提成数据
      handelCalculateRatio(data, member_user_id) {
        let items = [];
        return new Promise(resolve => {
          data.map(n => {
            if (n.user_tcard_item_id || n.user_advance_id) {
              n.item_id = 0;
            }
            let item = {
              item_id: n.item_id,
              is_free: n.is_free,
              staff_list: [],
              num: n.num,
              custom_price: n.discount_price,
            };
            if (n.staff.length) {
              let staff_format = n.staff.map(i => {
                return {
                  staff_user_id: i.staff_user_id,
                  is_appoint: i.is_appoint,
                  id: i.id,
                }
              });
              let { total_amount, num, item_id, user_tcard_item_id, user_advance_item_id } = n;
              let formData = { total_amount, num, item_id, user_tcard_item_id, user_advance_item_id };
              formData.member_user_id = member_user_id;
              formData.staff_list = staff_format;
              this.getCalculateRatio(formData).then(res => {
                console.log('staff', res);
                item.staff_list = n.staff_list = res;
                items.push(item);
                if (items.length === data.length) {
                  resolve(items);
                }
              });
            } else {
              items.push(item);
              if (items.length === data.length) {
                resolve(items);
              }
            }
          });
        });
      },

      //选择技师更新提成数据
      getCalculateRatio(formData) {
        return new Promise(resolve => {
          calculateRatio(formData).then(res => {
            resolve(res.success.data.staff_list);
          });
        });
      }
    },

    beforeDestroy() {
    },

    filters: {},

    watch: {
      show() {
        this.visible = this.show;
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .billing-takeBill-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #e4e7ed;
      .el-input {
        width: 300px;
        position: absolute;
        right: 40px;
        top: 10px;
      }
    }
    .el-form-item__label {
      font-weight: normal;
      width: 90px !important;
    }

    .search-input {
      width: 300px;
      float: right;
    }

    .el-dialog__footer {
      border-top: 1px solid #e4e7ed;
    }

    .loge-radio-box {
      label {
        margin-bottom: 10px;
        padding: 15px;
        width: 100%;
        height: 170px;
      }
      .el-radio__input {
        display: none;
      }

      .el-radio__label {
        display: block;
        color: #606266;
        padding-left: 0;
        h4 {
          margin: 0;
          font-weight: normal;
          font-size: 14px;
          margin-bottom: 10px;
          position: relative;
          svg {
            position: absolute;
            right: 0;
            top: -5px;
            width: 20px;
            height: 20px;
          }
        }
        li {
          font-size: 12px;
          line-height: 20px;
          display: flex;
          overflow: hidden;
          > span {
            display: block;
            min-width: 38px;
          }
          > div {
            white-space: normal;
            &.remark-content {
              height: 40px;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }

      .is-checked {
        background-color: $--color-primary;
        .el-radio__label {
          color: #fff;
        }
      }
    }
    .el-scrollbar {
      height: 350px;
    }
  }
</style>