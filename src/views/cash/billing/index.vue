<template>
  <div class="billing-page" v-loading="loading">
    <el-row :gutter="20">
      <!--产品-->
      <el-col :span="16" class="left-content" style="padding-right: 0">
        <el-tabs v-model="tabs.activeName" class="goods-tabs" v-if="categories.length" @tab-click="tabChange">
          <el-tab-pane :label="category.name" :name="`category-${category.id}`" v-loadmore="loadMore"
                       v-for="category in categories" :key="`category-${category.id}`">
            <el-scrollbar class="goods-content" v-loading="tabs.listLoading">
              <div class="goods-content-inner">
                <el-row :gutter="10" class="goods-row" v-if="category.list.length">
                  <el-col :span="6" class="goods-item" v-for="listItem in category.list"
                          :key="`listItem-${category.id}-${listItem.id}`" v-if="category.id >=0">
                    <el-card shadow="hover" @click.native="selectGoods(listItem)">
                      <div class="img-box">
                        <!--<img v-lazy="listItem.imageurl" :alt="listItem.name"/>-->
                        <img v-productImg="listItem.imageurl" :alt="listItem.name"/>
                        <span class="flag red" v-if="listItem.type === globals.PPCARD">{{ globals.TYPE[globals.PPCARD]}}</span>
                        <span class="flag blue" v-if="listItem.type === globals.TCARD">{{ globals.TYPE[globals.TCARD]}}</span>
                      </div>
                      <div class="bottom">
                        <h3 class="title">
                          <span class="ellipsis name" :title="listItem.name">{{listItem.name}}</span>
                          <!--<el-tag class="tag" type="danger" size="small">体验价</el-tag>-->
                        </h3>
                        <p class="price">单价：<span>{{listItem.price | formatMoney}}</span></p>
                      </div>
                    </el-card>
                  </el-col>
                  <template v-for="(typeItem,index) in category.list" v-if="category.id ===-1">
                    <el-col :span="24" class="card-type-title">
                      {{typeItem.name}}
                      <span>{{typeItem.created_at}}</span>
                    </el-col>
                    <el-col :span="6" class="goods-item"
                            v-for="(listItem,listIndex) in (typeItem.user_tcard_items || typeItem.user_advance_items)"
                            :key="`listItem-${index}${listIndex}`">
                      <el-card shadow="hover" @click.native="selectCards(listItem)">
                        <div class="img-box">
                          <!--<img v-lazy="listItem.image_url" :alt="listItem.item_name"/>-->
                          <img v-productImg="listItem.image_url" :alt="listItem.item_name"/>
                          <span class="flag red" v-if="listItem.type === globals.PPCARD">
                            {{ globals.TYPE[globals.PPCARD]}}
                          </span>
                          <span class="flag blue" v-if="listItem.type === globals.TCARD">
                            {{ globals.TYPE[globals.TCARD]}}
                          </span>
                        </div>
                        <div class="bottom">
                          <h3 class="title">
                            <span class="ellipsis name" :title="listItem.item_name">
                              {{listItem.item_name}}
                            </span>
                            <!--<el-tag class="tag" type="danger" size="small">体验价</el-tag>-->
                          </h3>
                          <p class="price">剩余：<span>{{listItem.time - listItem.used_time}}</span></p>
                        </div>
                      </el-card>
                    </el-col>
                  </template>
                </el-row>
                <div style="padding: 30px 0"
                     v-loading="!tabs.loadSign"
                     v-if="category.list.length < category.list_total && !tabs.loadSign">
                </div>
                <div style="text-align: center;padding: 30px 0"
                     v-if="!category.list.length && !tabs.listLoading">
                  暂无数据
                </div>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!--结算-->
      <el-col :span="8" class="right-content">
        <div class="right-content-inner">
          <div class="search-box">
            <div class="input-with-search">
              <el-input
                placeholder="请输入姓名、产品名称或手机号"
                prefix-icon="el-icon-search"
                v-model.trim="search.keyword"
                @focus="search.show = true"
                @blur.stop="searchResultHide"
                @keyup.native="userSearch"
                clearable>
              </el-input>
              <el-collapse-transition>
                <div class="search-result" v-show="search.show" v-loading="search.loading">
                  <el-scrollbar class="search-result-inner">
                    <dl>
                      <dt>会员</dt>
                      <dd v-for="item in search.user" @click="selectMember(item)">
                        {{item.user.realname}}（{{item.user.mobile}}）
                        <el-tag class="rank-tag" size="mini" v-if="item.rank">{{item.rank}}</el-tag>
                      </dd>
                      <dd v-show="!search.user.length">未找到相应会员</dd>
                      <dt>产品</dt>
                      <dd v-for="item in search.goods" @click.stop.prevent="selectGoods(item,true)" class="product-dd">
                        <span>{{item.name}}</span> <span>{{item.price | formatMoney}}</span>
                      </dd>
                      <dd v-show="!search.goods.length">未找到相应产品</dd>
                    </dl>
                  </el-scrollbar>
                </div>
              </el-collapse-transition>
            </div>
            <el-checkbox v-model="checked" class="checkbox">扫码枪模式</el-checkbox>
            <el-popover placement="top-start" width="200" trigger="hover" content="开启后，扫描结果自动添加至购物车">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>

          <el-scrollbar class="order-scrollbar">
            <!--会员-->
            <div class="flex-y-center member-box">
              <div class="head">
                <img v-avatar='[curMember.avatar_url, curMember.gender]' src="" alt="">
              </div>
              <div class="content">
                <div class="name">
                  <span v-if="curMember">{{curMember.user.realname}}</span>
                  <span v-else>散客</span>
                  <el-tag class="rank-tag" size="mini" v-if="curMember.rank">
                    {{curMember.rank}}
                  </el-tag>
                </div>
                <div class="tel" v-if="curMember">{{curMember.user.mobile}}</div>
              </div>
              <el-button
                size="small" v-if="curMember &&
                (curMember.user.user_tcard.length || curMember.user.user_advances.length)"
                @click.native="useCardList">
                耗卡
              </el-button>
              <el-button size="mini" circle v-if="curMember" @click.native="deleteMember">
                <svg-icon icon-class="delete"/>
              </el-button>
            </div>
            <!--账单明细-->
            <div class="order-detail">
              <!--耗卡-->
              <div class="title" v-show="cardSelected.length">耗卡</div>
              <div class="card-list" v-show="cardSelected.length">
                <el-collapse accordion v-model="cardActive">
                  <el-collapse-item
                    class="order-item"
                    v-for="(item,index) in cardSelected"
                    :key="`selected-${index}`"
                    :name="`card-${index}`">
                    <template slot="title">
                      <div class="flex-y-center info">
                        <div class="info-content">
                          <span class="ellipsis name" :title="item.name">{{item.item_name}}</span>
                          <span>×{{item.num}}</span>
                          <span class="price">
                           {{0 | formatMoney}}
                            <del>{{item.avg_price | formatMoney}}</del>
                          </span>
                        </div>
                        <svg-icon icon-class="delete" class="delete-btn" @click.native.stop="deleteCardDetail(index)"/>
                      </div>
                    </template>
                    <div class="technician">
                      <span>技师：</span>
                      <el-badge
                        v-for="(staff,index) in item.staff_list"
                        :key="`tag-${index}`"
                        :value="staff.is_appoint ? '点客': ''"
                        class="item" type="warning">
                        <el-tag>
                          {{staff.staff_info.realname}}
                        </el-tag>
                      </el-badge>
                      <el-button
                        class="button-new-tag" size="small"
                        @click.native="selectTechnician(item,index,'card')">
                        + 选择技师
                      </el-button>
                    </div>
                    <div class="price-table">
                      <el-table :data="[...item]" style="width: 100%">
                        <el-table-column label="数量" width="80" align="center">
                          <template slot-scope="scope">
                            <el-input
                              class="num-input"
                              v-model.trim="scope.row.num"
                              max-length="4"
                              @blur="checkSalesCount">
                            </el-input>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <!--账单明细-->
              <div class="title" v-show="goodsSelected.length">账单明细</div>
              <div class="detail-list" v-show="goodsSelected.length">
                <el-collapse accordion v-model="goodsActive">
                  <el-collapse-item
                    class="order-item"
                    v-for="(item,index) in goodsSelected"
                    :key="`goods-${index}`"
                    :name="`goods-${index}`">
                    <template slot="title">
                      <div class="flex-y-center info">
                        <div class="info-content">
                          <span class="ellipsis name" :title="item.name">{{item.name}}</span>
                          <span>×{{item.num}}</span>
                          <span class="price">
                            {{item.is_free ? 0 : item.original_total | formatMoney }}
                            <del v-if="item.is_free || item.price != item.discount_price">
                              {{item.total_amount | formatMoney}}
                            </del>
                          </span>
                        </div>
                        <svg-icon icon-class="delete" class="delete-btn" @click.native.stop="deleteOrderDetail(index)"/>
                      </div>
                    </template>
                    <div class="technician">
                      <span>技师：</span>
                      <el-badge
                        v-for="(staff,index) in item.staff_list"
                        :key="`staff-index-${index}`"
                        :value="staff.is_appoint ? '点客': ''"
                        class="item" type="warning">
                        <el-tag>{{staff.staff_info.realname}}</el-tag>
                      </el-badge>
                      <el-button
                        class="button-new-tag" size="small"
                        @click.native="selectTechnician(item,index,'goods')">
                        + 选择技师
                      </el-button>
                    </div>
                    <div class="price-table">
                      <el-table :data="[...item]" style="width: 100%">
                        <el-table-column label="数量" width="80" align="center">
                          <template slot-scope="scope">
                            <el-input
                              class="num-input"
                              v-model.trim="scope.row.num"
                              max-length="4"
                              @blur="salesCountChange">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="discount_price" label="单价" align="center">
                          <template slot-scope="scope">
                            <!--{{scope.row.price | formatMoney}}-->
                            <el-input
                              class="num-input"
                              v-model.trim="scope.row.custom_price"
                              max-length="4"
                              @blur="handleDiscountPrice(scope.row)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="discount" label="折扣(%)" align="center">
                          <template slot-scope="scope">
                            <!--{{scope.row.price | formatMoney}}-->
                            <el-input
                              class="num-input"
                              v-model.trim="scope.row.discount"
                              max-length="4"
                              @blur="handleDiscountPrice(scope.row,true)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column width="100">
                          <template slot-scope="scope">
                            <el-checkbox
                              class="gift"
                              v-model="scope.row.is_free"
                              :checked="scope.row.is_free"
                              @change="getPreStore(handleSelectedGoodsData())">
                              赠送
                            </el-checkbox>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-collapse-item>
                </el-collapse>
                <div class="remark-box">
                  <el-input v-model="curOrder.remark" placeholder="备注"></el-input>
                </div>
              </div>
              <div v-show="!goodsSelected.length && !cardSelected.length" style="padding: 20px 0;text-align: center">暂无订单</div>
            </div>
          </el-scrollbar>

          <div class="cashier-right-bottom">
            <ul>
              <li>
                <span>总金额</span>
                <span class="sum">{{total.sum | formatMoney}}</span>
              </li>
              <li class="icon-arrow-right"
                  :class="Boolean(goodsSelected.length) ? 'can-point' : ''"
                  @click="discountDialogShow = Boolean(goodsSelected.length)"
                  v-show="goodsSelected.length || cardSelected.length">
                <span>折扣</span>
                <span class="discount">-{{Math.abs(total.discount) | formatMoney}}</span>
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
          </div>
          <div class="cashier-right-pay">
            <el-button
              type="primary" @click.native="consumeCard"
              v-if="cardSelected.length && !goodsSelected.length">
              耗卡
            </el-button>
            <el-button type="primary" @click.native="accountsDialogShow" v-else>
              结账 {{total.payable | formatMoney}}
            </el-button>
            <el-button @click.native="recordingDialogShow">暂挂</el-button>
            <el-button @click.native="takeBillDialogShow">取单</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--弹窗-->
    <!--设置折扣-->
    <el-dialog title="设置销售折扣" :visible.sync="discountDialogShow" class="discount-dialog" width="420px">
      <el-form :inline="true" class="form-inline">
        <el-form-item label="请选择折扣">
          <el-select v-model="discountType" placeholder="请选择折扣">
            <el-option :label="curMember ? '会员折扣' : '散客折扣'" :value="1"></el-option>
            <el-option label="无折扣" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="discountDialogShow = false" size="samll">取 消</el-button>
        <el-button type="primary" @click="discountChange" size="samll">确 定</el-button>
      </div>
    </el-dialog>

    <!--结账-->
    <accounts-dialog
      ref="accountsDialog"
      :show.sync="accounts.dialogShow"
      :total="total.payable"
      :member-id="curMember ? curMember.member_user_id : ''"
      v-if="accounts.dialogShow">
    </accounts-dialog>

    <!--暂挂-->
    <recording-dialog
      ref="recordingDialog"
      :show.sync="recording.dialogShow"
      v-if="recording.dialogShow"
      :cur_room_id="curOrder.room_id">
    </recording-dialog>

    <!--取单-->
    <takebill-dialog
      ref="takebillDialog"
      :show.sync="takeBill.dialogShow"
      v-if="takeBill.dialogShow">
    </takebill-dialog>

    <!--选择技师-->
    <technician-dialog
      ref="technicianDialog"
      :show.sync="technician.dialogShow"
      :cur="technician.curItem"
      @staff="handleTechnician($event)"
      v-if="technician.dialogShow">
    </technician-dialog>

    <!--订单支付成功-->
    <success-dialog
      ref="successDialog"
      :show.sync="successDialog.show"
      :order_id="successDialog.order_id"
      v-if="successDialog.show">
    </success-dialog>
  </div>
</template>

<script>
  import {
    orderCategory, orderItem, orderSearch, memberInfo, selectedList,
    saveOrder, tcardPay, preStore, msgconnect
  } from '@/api/cash/billing';
  import {calc, parseTime} from '@/utils/index';
  import {validateInteger} from '@/utils/validate';
  import * as globals from '@/utils/globals';
  import icons from '../../svg-icons/requireIcons';
  import AccountsDialog from './components/accounts-dialog';
  import RecordingDialog from './components/recording-dialog';
  import TakebillDialog from './components/takebill-dialog';
  import TechnicianDialog from './components/technician-dialog';
  import SuccessDialog from './components/success-dialog';

  export default {
    name: 'cash_billing',
    components: {
      AccountsDialog,
      RecordingDialog,
      TakebillDialog,
      TechnicianDialog,
      SuccessDialog
    },
    data() {
      return {
        globals,
        icons,
        loading: true,
        checked: false,
        curTime: new Date(),
        tags: [],
        discountDialogShow: false,
        //结账
        accounts: {
          dialogShow: false,
        },
        //暂挂
        recording: {
          dialogShow: false,
        },
        //取单
        takeBill: {
          dialogShow: false,
        },
        //技师
        technician: {
          dialogShow: false,
          curIndex: '',
          type: 'goods',
          curItem: {},
        },

        //2019/01/09
        categories: [],
        categoryType: ['商品', '服务', '次卡', '储值卡'],
        tabs: {
          activeName: 'category-0',
          listLoading: false,
          loadSign: true,
        },
        goodsSelected: [], //账单详细
        cardSelected: [], //耗卡
        //会员产品搜素
        search: {
          loading: false,
          show: false,
          keyword: '',
          user: [],
          goods: [],
        },
        curMember: '', //当前会员,
        //总价
        total: {
          sum: 0,
          discount: 0,
          payable: 0
        },
        //当前订单
        curOrder: {
          id: '',
          room_id: '',
          remark: ''
        },
        //折扣类型
        discountType: 1,
        // 交易成功
        successDialog: {
          show: false,
          order_id: '',
        },
        connectTimer: '',
        goodsActive: [],
        cardActive: [],
      }
    },
    computed: {},

    mounted() {
      this.getOrderCategory(); //获取产品分类
      if (this.$route.params.user_id) {
        this.getMemberInfo(this.$route.params.user_id);
      }
      this.msgconnect();
    },
    methods: {
      // 开单登录维持
      msgconnect() {
        this.connectTimer = setInterval(() => {
          msgconnect();
        }, (60 * 1000));
      },

      //重置数据
      resetData(data) {
        if (data) {
          Object.assign(this.$data[data], this.$options.data()[data]);
        } else {
          Object.assign(this.$data, this.$options.data());
        }
      },

      //选择技师弹框
      selectTechnician(item, index, type) {
        console.log('selectTechnician', item);
        if (!this.checkSalesCount()) return false;
        item.staff_list = item.staff_list ? item.staff_list : [];
        this.technician = {
          dialogShow: true,
          curIndex: index,
          curItem: item,
          type,
        }
      },

      //处理选择数据
      handleTechnician(staff) {
        console.log('staff', staff);
        let index = this.technician.curIndex;
        if (this.technician.type === 'goods') {
          this.goodsSelected[index].staff_list = staff;
          this.$set(this.goodsSelected, index, this.goodsSelected[index]);
        } else {
          this.cardSelected[index].staff_list = staff;
          this.$set(this.cardSelected, index, this.cardSelected[index]);
        }
      },

      //获取产品类型
      getOrderCategory() {
        orderCategory().then(res => {
          let data = res.success.data;
          let all = {
            id: 0,
            name: "全部",
            parent_id: 0,
            type: "0",
          };
          let last = {
            id: -1,
            name: "耗卡",
            parent_id: 0,
            type: "0",
          };
          this.categories = [all, ...data, last];
          this.categories.map(n => {
            n.list = [];
            n.page = 1;
          });
          if (this.loading) {
            this.loading = false;
            //获取默认分类列表
            this.$nextTick(() => {
              this.getOrderItem();
            });
          }
        }).catch(error => {
          console.log(error);
        })
      },

      //根据分类获取列表
      getOrderItem(id = 0) {
        let index = this.categories.findIndex(n => n.id === id);
        if (index === -1) return;
        let item = this.categories.find(n => n.id === id);
        console.log(item);
        if (item.page === 1) this.tabs.listLoading = true;
        orderItem(id, item.page).then(res => {
          this.loading = false;
          let data = res.success.data;
          data.data.map(n => n.imgLoad = false);
          item.list = [...item.list, ...data.data];
          item.list_total = data.total;
          item.page++;
          this.categories.splice(index, 1, item);
          this.tabs.listLoading = false;
          this.tabs.loadSign = true
        }).catch(error => {
          console.log(error);
        })
      },

      //商品tab切换
      tabChange(tab, event) {
        let id = Number(event.target.getAttribute('id').split('-')[2]);
        let index = this.categories.findIndex(n => n.id === id);
        if (!this.categories[index].list.length) {
          this.getOrderItem(id);
        }
      },

      //商品滚动加载
      loadMore() {
        if (this.tabs.loadSign) {
          this.tabs.loadSign = false;
          if (this.tabs.activeName === 'category--1') return false;
          let id = Number(this.tabs.activeName.split('-')[1]);
          let item = this.categories.find(n => n.id === id);
          if (item.list.length < item.list_total) {
            this.getOrderItem(id);
          } else {
            console.log('到底了', item.page);
          }
        }
      },

      //搜索会员
      userSearch() {
        if (!this.search.keyword) {
          this.search.user = [];
          this.search.goods = [];
          return false;
        }
        this.search.loading = true;
        orderSearch(this.search.keyword).then(res => {
          let data = res.success.data;
          this.search.user = data.user;
          this.search.goods = data.item;
          this.search.loading = false;
        });
      },

      //点击搜索会员
      selectMember(member) {
        if (this.curMember && this.curMember.id !== member.id) {
          this.$confirm('该订单已有会员信息,切换会员后,订单信息将清空确定切换会员吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.getMemberInfo(member.member_user_id);
            this.goodsSelected = [];
            this.cardSelected = [];
          }).catch(() => {
          });
        } else {
          this.getMemberInfo(member.member_user_id);
        }
        this.resetData('search'); // 重置 this.search
      },

      //获取会员耗卡信息
      getMemberInfo(user_id) {
        memberInfo(user_id).then(res => {
          this.curMember = res.success.data[0];
          this.getPreStore(this.handleSelectedGoodsData());
          //耗卡
          let lastItem = this.categories.find(n => n.id === -1);
          lastItem.list = [
            ...this.curMember.user.user_tcard,
            ...this.curMember.user.user_advances
          ];
        });
      },

      //删除会员信息
      deleteMember() {
        this.$confirm('确定删除此会员信息吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.curMember = '';
          this.goodsSelected = [];
          this.cardSelected = [];
          this.resetData('curOrder');
          this.resetData('total');
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.tabs.activeName = 'category-0';
        }).catch(() => {
        });
      },

      //关闭搜索结果
      searchResultHide() {
        setTimeout(() => {
          this.search.show = false;
        }, 50);
      },

      //选择消费商品
      selectGoods(item, isSearch = false) {
        console.log('选择消费商品', item);
        let message = '';
        let msg = '不可与其他类型产品同时购买,请再开一单或结算后再进行操作!';
        //存在次卡
        if (this.goodsSelected.findIndex(n => n.type === 2) !== -1) {
          if (item.type !== 2) {
            message = `计次卡${msg}`;
          }
        }
        // 存在储值卡
        if (this.goodsSelected.findIndex(n => n.type === 3) !== -1) {
          if (item.type !== 3) {
            message = `储值卡${msg}`;
          }
        }
        //商品或服务
        if (this.goodsSelected.findIndex(n => n.type === 0 || n.type === 1) !== -1) {
          if (item.type === 2 || item.type === 3) {
            message = `会员卡${msg}`;
          }
        }
        //散客会员卡互斥
        if (!this.curMember && (item.type === 2 || item.type === 3)) {
          message = `请选择会员后再进行购买`;
        }
        // 重置 this.search
        if (isSearch) this.resetData('search');

        if (message) {
          this.$message({
            type: 'warning',
            message, saveOrder
          });
          return false;
        }
        this.getSelectedList(item);
      },

      // 选择耗卡
      selectCards(card) {
        card = {
          num: 1,
          total_amount: 0,
          staff_list: [],
          ...card,
        };
        console.log('选择耗卡card', card);
        this.cardSelected.push(card);
      },

      // 获取已选择产品列表
      getSelectedList(item) {
        if (!this.checkSalesCount()) return false;
        this.loading = true;
        let items = this.handleSelectedGoodsData();
        items = [...items, {
          item_id: item.id,
          is_free: 0,
          staff_list: [],
        }];
        this.getPreStore(items);
      },

      //删除消费明细
      deleteOrderDetail(index) {
        this.goodsSelected.splice(index, 1);
        this.getPreStore(this.handleSelectedGoodsData()); //更新消费明细
      },

      //删除已选耗卡
      deleteCardDetail(index) {
        this.cardSelected.splice(index, 1);
      },

      //跳转耗卡列表
      useCardList() {
        this.tabs.activeName = 'category--1';
      },

      //已选择商品数据处理
      handleSelectedGoodsData() {
        console.log('goodsSelected', this.goodsSelected);
        let items = [];
        if (this.goodsSelected.length) {
          items = this.goodsSelected.map(n => {
            return {
              item_id: n.id,
              is_free: Number(n.is_free),
              num: n.num,
              staff_list: n.staff_list,
              custom_price: this.handelCustomAmount(n),
            }
          });
        }
        return items;
      },

      //根据商品ID实时计算折扣价格
      getPreStore(items, discount_type = this.discountType, member_user_id = this.curMember.member_user_id) {
        if (!this.checkSalesCount()) return false;
        console.log('getPreStore', items);
        if (!items.length) {
          this.total.sum = 0;
          this.total.discount = 0;
          this.calcSum();
          return false;
        }
        preStore({ items, discount_type, member_user_id }).then(res => {
          this.loading = false;
          let data = res.success.data;
          data.item_list.map(n => {
            n.is_free = Boolean(n.is_free);
            n.custom_price_origin = n.custom_price;
            n.custom_price = calc(n.discount_price).toFixed(2);
            n.discount = calc(n.discount_price).div(n.price).times(100).toFixed(2);
          });
          this.goodsSelected = [...data.item_list];
          this.total = {
            sum: data.all_fee,
            discount: data.deduct_price,
            payable: data.original_total
          };
          this.calcSum();
        });
      },

      // 处理自定义价格
      handelCustomAmount(item) {
        console.log('处理自定义价格', item);
        let custom_price = item.custom_price;
        let comparedToDiscountPrice = calc(item.custom_price).comparedTo(calc(item.discount_price)) === 0;
        if (comparedToDiscountPrice && !item.custom_price_origin) {
          custom_price = 0;
        }
        console.log('custom_price', custom_price);
        return custom_price;
      },


      // 商品数量监听
      salesCountChange() {
        if (!this.checkSalesCount()) return false;
        this.getPreStore(this.handleSelectedGoodsData());
      },

      // 检查商品数量格式
      checkSalesCount() {
        let res = true;
        let message = (name) => {
          this.$message({
            message: `${name}-数量格式不正确`,
            type: 'warning'
          });
        };
        if (this.goodsSelected.length) {
          for (let val of this.goodsSelected) {
            if (!validateInteger(val.num)) {
              message(val.name);
              return res = false;
            }
          }
        }
        if (this.cardSelected.length) {
          for (let val of this.cardSelected) {
            if (!validateInteger(val.num)) {
              message(val.item_name);
              return res = false;
            }
          }
        }
        return res;
      },

      //计算总价
      calcSum() {
        let [card_sum, card_discount] = [0, 0];
        if (this.cardSelected.length) {
          this.cardSelected.forEach(item => {
            card_discount = calc(card_discount).plus(item.avg_price).toNumber();
            card_sum = card_discount;
          });
        }
        this.total.sum = calc(this.total.sum).plus(card_sum).toNumber();
        this.total.discount = calc(this.total.discount).plus(card_discount).toNumber();
        this.total.payable = calc(this.total.sum).minus(this.total.discount).toNumber();
        console.log('计算总价', this.total.sum);
        console.log('计算discount', this.total.discount);
      },

      //结账弹框
      accountsDialogShow() {
        if (!this.checkSalesCount()) return false;
        if (!this.goodsSelected.length) {
          this.$message({
            message: '请至少选择一个产品！',
            type: 'warning'
          });
          return false;
        }
        this.$nextTick(_ => {
          this.accounts.dialogShow = true;
        });
      },

      //暂挂弹框
      recordingDialogShow() {
        if (!this.checkSalesCount()) return false;
        if (!this.goodsSelected.length && !this.cardSelected.length) {
          this.$message({
            message: '请至少选择一个产品！',
            type: 'warning'
          });
          return false;
        }
        this.recording.dialogShow = true;
        if (this.curOrder.room_id) {
          this.recording.room_id = this.curOrder.room_id;
        }
      },

      // 折扣金额联动
      handleDiscountPrice(account, is_discount = false) {
        console.log('折扣金额联动', account);
        if (Number(account.discount) > 100) {
          this.$message({
            message: '折扣不能超过100%',
            type: 'warning'
          });
          return false;
        }
        let price = is_discount ?
          calc(account.price).times(account.discount).div(100) : Number(account.custom_price);
        if (isNaN(price) || price < 0) {
          price = 0;
        }
        if (Number(price) > Number(account.price)) {
          this.$message({
            message: '销售价格不能超过原价',
            type: 'warning'
          });
          return false;
        }
        price = calc(price).toFixed(2);
        account.custom_price = price;
        this.getPreStore(this.handleSelectedGoodsData());
        console.log('格式化金额', account.custom_price);
        return price;
      },

      //保存订单
      saveOrder({ room_id, is_card } = {}) {
        let data = {
          remark: this.curOrder.remark,
        };
        if (room_id) data.room_id = room_id;
        data.discount_type = this.discountType;
        if (this.curOrder.id) {
          data.id = this.curOrder.id;
        }
        if (this.curMember.id) {
          data.member_user_id = this.curMember.member_user_id;
          data.mon_member = 0;
        } else {
          data.mon_member = 2;
        }
        data.order_items = [];
        if (this.goodsSelected.length) {
          this.goodsSelected.forEach(item => {
            let staff_list = [];
            if (item.staff_list.length) {
              staff_list = this.handelStaff(item.staff_list);
            }
            let goods = {
              item_id: item.id,
              is_free: Number(item.is_free),
              staff_list,
              num: item.num,
              custom_price: item.custom_price,
            };
            if (item.pivot && item.pivot.id) goods.id = item.pivot.id;
            data.order_items.push(goods);
          })
        }
        if (this.cardSelected.length) {
          this.cardSelected.forEach(item => {
            item.staff_list = item.staff_list || [];
            let staff_list = [];
            if (item.staff_list.length) {
              staff_list = this.handelStaff(item.staff_list);
            }
            let card = {
              item_id: 0,
              staff_list,
              num: item.num,
            };
            if (item.user_tcard_id) {
              card = {
                user_tcard_id: item.user_tcard_id,
                user_tcard_item_id: item.user_tcard_item_id || item.id,
                ...card,
              }
            } else {
              card = {
                user_advance_id: item.user_advance_id,
                user_advance_item_id: item.user_advance_item_id || item.id,
                ...card,
              }
            }
            data.order_items.push(card);
          });
        }
        saveOrder(data).then(res => {
          this.resetData('curOrder'); //重置当前订单
          if (room_id) {
            this.$message({
              message: '挂单成功！',
              type: 'success'
            });
            this.resetOrder();
          } else if (is_card) {
            this.tcardPay(res.success.data.id);
          } else {
            //直接支付
            this.$refs.accountsDialog.orderPay(res.success.data.id);
          }
          this.recording.dialogShow = false;
          this.tabs.activeName = 'category-0';
        }).catch(() => {
        });
      },

      //保存订单技师数据处理
      handelStaff(data) {
        return data.map(n => {
          let {
            sale_percent,
            sale_amount,
            sale_percentage,
            sale_percentage_amount,
          } = n.sale_ratio;

          let staff = {
            is_appoint: n.is_appoint,
            is_sale: 1,
            is_labour: 0,
            sale_percent,
            sale_amount,
            sale_percentage,
            sale_percentage_amount,
            staff_user_id: n.staff_info.id,
          };

          if (n.labour_ratio) {
            let {
              labour_percent,
              labour_amount,
              labour_percentage,
              labour_percentage_amount,
            } = n.labour_ratio;
            staff = {
              labour_percent,
              labour_amount,
              labour_percentage,
              labour_percentage_amount,
              ...staff,
            }
          }
          if (n.id) staff.id = n.id;
          return staff;
        });
      },

      //订单重置
      resetOrder() {
        this.cardSelected = [];
        this.goodsSelected = [];
        this.curMember = '';
        this.resetData('total');
        this.resetData('curOrder');
      },

      //取单
      takeBillDialogShow() {
        this.takeBill.dialogShow = true;
      },

      //耗卡
      consumeCard() {
        if (!this.checkSalesCount()) return false;
        this.$confirm('是否确定耗卡?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.saveOrder({ is_card: true });
        }).catch(() => {
        });
      },

      // 耗卡支付
      tcardPay(order_id) {
        tcardPay(order_id).then(() => {
          this.successDialog = {
            show: true,
            order_id,
          };
          this.resetOrder();
          this.tabs.activeName = 'category-0';
        }).catch(() => {
        });
      },

      // 散客会员折扣修改
      discountChange() {
        this.discountDialogShow = false;
        this.getPreStore(this.handleSelectedGoodsData());
      }
    },

    beforeDestroy() {
      clearInterval(this.connectTimer);
    },

    filters: {
      //格式化时间
      parseTime(time, option) {
        return parseTime(time, option);
      }
    },

    watch: {
      //监听计算价格
      cardSelected(array) {
        this.cardActive = [`card-${array.length - 1}`]
      },
      goodsSelected(array) {
        this.goodsActive = [`goods-${array.length - 1}`]
      },
      //重置耗卡列表
      curMember(val) {
        if (!this.curMember) {
          let lastItem = this.categories.find(n => n.id === -1);
          lastItem.list = [];
        }
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";

  .billing-page {
    height: calc(100vh - 60px);
    overflow: hidden;
  }

  .left-content {
    overflow: hidden;
    position: relative;
    padding-right: 15px;
  }

  .goods-content {
    height: calc(100vh - 60px - 65px);
    padding-bottom: 15px;
    transition: all .6s;
  }

  .goods-content-inner {
    overflow: hidden;
    padding-right: 15px;
  }

  .tab-nav-more {
    position: absolute;
    top: 0;
    right: 37px;
    z-index: 99;
    height: 50px;
    padding-left: 20px;
    line-height: 50px;
    margin-bottom: -1px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #909399;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #e4e7ed;
      z-index: 1;
    }
  }

  .card-type-title {
    padding: 5px 0 10px 5px;
    width: 100%;
    font-size: 14px;
    > span {
      padding-left: 20px;
      color: #999999;
    }
  }

  .goods-item {
    margin-bottom: 10px;
    overflow: hidden;
    cursor: pointer;
    .img-box {
      padding-top: 75%;
      position: relative;
      overflow: hidden;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all .6s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .flag {
      position: absolute;
      top: 6px;
      right: -2px;
      height: 24px;
      padding: 0 10px 0 8px;
      line-height: 24px;
      font-size: 12px;
      color: #fff;
      border-radius: $borderRadius;
      &.blue {
        background: #6c7cf7;
      }
      &.red {
        background: #f76cc2;
      }
    }

    .bottom {
      padding: 0 15px;
      color: #666666;
    }
    .title {
      font-size: 14px;
      font-weight: normal;
      padding-top: 5px;
      .name {
        display: inline-block;
        max-width: calc(100% - 65px);
        vertical-align: middle;
      }
    }
    .tag {
      margin-left: 6px;
    }
    .price {
      font-size: 12px;
      span {
        color: $--color-primary;
      }
    }
  }

  .right-content {
    background-color: #fff;
  }

  .right-content-inner {
    margin-right: 1px;
    .rank-tag {
      background-color: #b7c0cc;
      margin-left: 10px;
      color: #fff;
      border-color: #b7c0cc;
      border-radius: 50px;
      font-size: 12px;
      padding: 0 10px;
    }
  }

  .search-box {
    padding: 10px;
    border: 1px solid #eaeefb;
    display: flex;
    align-items: center;
    background-color: #f5f7fa;
    .input-with-search {
      max-width: 70%;
      margin-right: 10px;
      flex: 1;
      min-width: 0;
      position: relative;
    }
    .el-icon-question {
      color: #d5d8de;
      font-size: 18px;
      margin-left: 10px;
      cursor: pointer;
    }
    .search-result {
      position: absolute;
      top: 35px;
      left: 0;
      z-index: 99;
      margin: 5px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      border-radius: 4px;
      border: 1px solid #e4e7ed;
      box-sizing: border-box;
      background-color: #fff;
      width: 100%;
    }
    .search-result-inner {
      transition: all .6s;
      dl {
        margin: 0;
      }
      dt {
        background-color: #ededed;
        color: #9d9d9d;
        font-size: 12px;
      }
      dt, dd {
        padding: 0 20px;
        margin: 0;
        line-height: 34px;
        cursor: pointer;
        color: #606266;
        font-size: 14px;
        list-style: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.product-dd {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }

  .member-box {
    height: 70px;
    .head {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      overflow: hidden;
      margin-right: 15px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .content {
      flex: 1;
      min-width: 0;
      .name {
        color: #303133;
        line-height: 22px;
      }
      .tel {
        font-size: 12px;
        color: #606266;
        margin-top: 6px;
      }
    }
  }

  .order-scrollbar {
    height: calc(100vh - 42px - 68px - 160px)
  }

  $borderColor: #eaeefb;
  .card-list {
    .el-collapse {
      margin-bottom: 0;
    }
  }

  .order-detail {
    border: 1px solid $borderColor;
    border-radius: $borderRadius;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #909399;
      padding: 0 15px;
      margin-bottom: 10px;
      border-bottom: 1px solid $borderColor;
      background-color: #f9fafc;
    }
  }

  .order-item {
    padding: 0 15px;
    font-size: 12px;
    color: #606266;
    border-left: 3px solid transparent;
    &.is-active {
      border-left: 3px solid #61afdf;
    }
    .info {
      height: 32px;
      width: 100%;
    }
    .info-content {
      flex: 1;
      min-width: 0;
      display: flex;
      justify-content: space-between;
      del {
        color: #909399;
      }
      .name {
        width: 40%;
      }
      .price {
        width: 80px;
        display: flex;
        margin-left: 5px;
        height: 48px;
        text-align: right;
        flex-direction: column;
        justify-content: center;
        line-height: normal;
        del {
          font-size: 12px
        }
      }
    }
    .delete-btn {
      width: 24px;
      height: 24px;
      margin-left: 20px;
      cursor: pointer;
      fill: #909399;
      &:hover {
        fill: $--color-primary;
      }
    }
    .el-tag {
      height: 32px;
      line-height: 30px;
    }
    .el-badge + .el-badge {
      margin-left: 20px;
    }
    .el-badge {
      margin-bottom: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
      margin-bottom: 10px;
    }
    .technician {
      padding: 10px 0;
    }
    .el-table {
      &:before {
        display: none;
      }
    }
  }

  .cashier-right-bottom {
    padding-top: 10px;
    position: relative;
    height: 92px;
    ul {
      width: 100%;
      padding: 0;
      border-top: 1px solid $borderColor;
      border-bottom: 1px solid $borderColor;
      margin-bottom: 0;
      position: absolute;
      left: 0;
      bottom: 0;
    }
    li {
      list-style: none;
      height: 40px;
      color: #909399;
      font-size: 12px;
      padding: 0 30px 0 10px;
      @include flex-y-center;
      justify-content: space-between;
      position: relative;
      .sum {
        color: #606266;
        font-size: 14px;
      }
      .discount {
        color: #f56c6c;
        font-size: 14px;
      }
      .el-icon-arrow-right {
        position: absolute;
        top: -5px;
        right: 10px;
      }
      &.icon-arrow-right {
        &.can-point {
          cursor: pointer;
        }
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }

  .cashier-right-pay {
    padding: 10px 0;
    @include flex-y-center;
    justify-content: space-between;
    background-color: #f9fafc;
    button {
      padding: 12px 20px;
      &:first-child {
        width: 50%;
      }
      &:nth-child(2) {
        background-color: #f7a16c;
        border-color: #f7a16c;
        color: #fff;
        flex: 1;
        &:hover {
          opacity: .8;
        }
      }
      &:nth-child(3) {
        background-color: #61afdf;
        border-color: #61afdf;
        color: #fff;
        flex: 1;
        &:hover {
          opacity: .8;
        }
      }
    }
  }

  .remark-box {
    padding: 0 15px;
    margin-bottom: 15px;
  }
</style>
<style lang="scss">
  @import "~@/styles/variables.scss";

  .billing-page {
    padding: 0 15px;
    .left-content {
      overflow: hidden;
      position: relative;
      .el-tabs__header.is-top {
        padding-right: 15px;
      }
    }

    .el-tabs__item {
      height: 50px;
      line-height: 50px;
    }
    .el-icon-arrow-left, .el-icon-arrow-right {
      line-height: 48px;
    }

    .goods-item {
      .el-card__body {
        padding: 0;
        border-radius: 5px;
        overflow: hidden;
      }
    }
    .el-select-dropdown {
      .el-scrollbar__wrap {
        overflow-x: scroll;
      }
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .is-horizontal {
      display: none;
    }
    .search-box {
      background-color: #f9fafc;
      .el-checkbox__label {
        color: #606266;
      }
    }

    .order-detail {
      .el-collapse-item__arrow {
        display: none;
      }
      .el-collapse-item__content {
        padding: 0;
      }
      .el-badge__content {
        border-radius: 4px;
        height: 20px;
        line-height: 20px;
        &.is-fixed {
          right: 20px;
        }
      }
      .price-table {
        height: 72px;
        overflow: hidden;
        .gift {
          padding-left: 10px;
        }
        th {
          color: #c0c4cc;
          font-weight: normal;
        }
        th, td {
          border: none;
          padding: 6px 0;
        }
      }
    }

    // 折扣弹窗
    .discount-dialog {
      .el-dialog {
        width: 420px;
      }
      .el-dialog__body {
        padding: 15px 20px;
      }
      .el-form-item {
        margin-bottom: 0;
        width: 100%;
        label {
          font-weight: normal;
        }
        .el-form-item__content {
          width: 220px;
        }
        .el-select {
          width: 100%;
        }
      }
      .el-dialog__header, .el-dialog__footer {
        border: none;
      }
    }

    .num-input {
      input {
        border: none;
        line-height: 23;
        height: 23px;
        padding: 0;
        text-align: center;
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }
    }
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-select-dropdown__wrap {
    overflow-x: scroll;
  }

  .search-result-inner {
    .el-scrollbar__wrap {
      margin-bottom: 0 !important;
    }
    .el-scrollbar__bar {
      &.is-vertical {
        opacity: 1 !important;
      }
    }
  }

  .el-collapse {
    margin-bottom: 10px;
    .el-collapse-item__header.focusing:focus:not(:hover) {
      color: #303133;
    }
  }
</style>
