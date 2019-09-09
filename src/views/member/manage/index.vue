<template>
  <div class="app-container member_manage">
    <!-- 会员列表 -->
    <!-- 筛选 -->
    <el-card
      shadow="always"
      class="filter-box mb-15"
    >
      <div class="filter_container">
        <div class="header">
          <el-dropdown
            @command="handleCommand"
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
              <el-dropdown-item command="assign">分配</el-dropdown-item>
              <el-dropdown-item command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            plain
            class="fr"
            @click="show = !show"
          >{{toggleCheck}}
          </el-button>
          <el-button
            type="primary"
            class="fr add_member"
            @click="handleAdd"
          >
            新增会员
          </el-button>
          <el-input
            placeholder='会员姓名、卡号或手机号'
            class="fr search"
            v-model="listQuery.search"
            prefix-icon="el-icon-search"
            @change="handleSearch"
            clearable
          >
          </el-input>
          <!-- <el-input
            placeholder='产品名称'
            class="input-with-search fr"
            v-model="listQuery.search"
            prefix-icon="el-icon-search"
            @keyup.enter.native="handleSearch"
            clearable
            @clear="handleSearch"
          > </el-input> -->
        </div>
        <el-collapse-transition>
          <div
            class="body"
            v-show='show'
          >
            <el-form
              label-position="right"
              :model="filterList"
              ref="filterForm"
              :rules="rules"
              :show-message='false'
            >
              <el-row>
                <span>会员等级</span>
                <el-radio-group v-model="filterList.level">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button
                    v-for='(item,key,index) in rankList'
                    :key='index'
                    :label="item.id"
                  >{{item.name}}
                  </el-radio-button>
                </el-radio-group>
              </el-row>
              <!-- <el-row>
              <span>会员积分</span>
              <el-radio-group v-model="filterList.point">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button label="1000以下"></el-radio-button>
                <el-radio-button label="1000~4999"></el-radio-button>
                <el-radio-button label="5000~9000"></el-radio-button>
                <el-input
                  placeholder='自定义积分'
                  class="fr defined"
                  clearable
                  v-model="definedPoint"
                  @blur="filterList.point=definedPoint"
                >
                </el-input>
              </el-radio-group>

            </el-row> -->
              <el-row>
                <el-form-item
                  prop='registtime'
                  :rules='rules.filter'
                >
                  <span>注册日期</span>
                  <el-radio-group v-model="filterList.registtime">
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="7">1周内</el-radio-button>
                    <el-radio-button label="30">1月内</el-radio-button>
                    <el-radio-button label="365">1年内</el-radio-button>
                    <el-input
                      placeholder='自定义时间(天)'
                      class="fr defined"
                      clearable
                      v-model="definedRegisttime"
                      @change="filterList.registtime=definedRegisttime"
                    >
                    </el-input>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item
                  prop='expensetime'
                  :rules='rules.filter'
                >
                  <span>距上次消费</span>
                  <el-radio-group v-model="filterList.expensetime">
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="7">1周内</el-radio-button>
                    <el-radio-button label="30">1月内</el-radio-button>
                    <el-radio-button label="365">1年内</el-radio-button>
                    <el-input
                      placeholder='自定义时间(天)'
                      class="fr defined"
                      clearable
                      v-model="definedConsumptiontime"
                      @change="filterList.expensetime=definedConsumptiontime"
                    >
                    </el-input>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <span>营销顾问</span>
                <el-radio-group v-model="filterList.name">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button
                    v-for="(item,key,index) in staffsList.option"
                    :key='index'
                    :label="item.id"
                  >{{item.realname}}
                  </el-radio-button>
                </el-radio-group>
              </el-row>
            </el-form>
          </div>
        </el-collapse-transition>
      </div>
      <!-- 列表 -->
      <el-table
        v-loading="listLoading"
        :data="memberData"
        fit
        style="width: 100%"
        stripe
        class="member_list"
        ref='memberList'
        @selection-change="handleSelectionChange"
      >

        <el-table-column
          align="left"
          type='index'
          width="40px"
        >

        </el-table-column>

        <el-table-column
          align="left"
          type='selection'
          width="30px"
        >

        </el-table-column>

        <el-table-column
          align="left"
          label="会员姓名"
          min-width='120px'
        >
          <template slot-scope="scope">
            <div class="member_name">
              <span class='avatar_img'>
                <img v-avatar='[scope.row.avatar_url, scope.row.gender]'>
              </span>
              {{scope.row.realname}}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="会员卡号"
          prop='card_no'
          min-width='115'
        >
          <template slot-scope="scope">
            <span>{{scope.row.card_no}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="会员手机"
          prop='tel'
          min-width='100'
        >
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="会员生日"
          min-width='100'
        >
          <template slot-scope="scope">
            <span>{{scope.row.birthday | formatBirthday}}</span>
          </template>

        </el-table-column>

        <el-table-column
          align="left"
          label="会员等级"
          prop='rank'
        >

          <template slot-scope="scope">
            <span>{{scope.row.rank}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="会员余额"
          prop='account.card_amount'
          min-width='100'
        >
          <template slot-scope="scope">
            {{calc(scope.row.account.card_amount).plus(scope.row.account.donation_amount) | formatMoney}}
          </template>

        </el-table-column>

        <el-table-column
          align="left"
          label="距上次消费"
          prop='active_time'
          min-width='135'
        >
          <template slot-scope="scope">
            <span>{{scope.row.active_time | formatActiveTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="营销顾问"
          prop='Meetingtel'
          min-width='115'
        >
          <template slot-scope="scope">
            <span class="word_break">{{scope.row.staffs | formatStaffs}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="注册日期"
          min-width='80'
        >
          <template slot-scope="scope">
            <span>{{scope.row.created_at | formatCreat}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width='300'
          align="left"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              @click="handleRecharge(scope.row)"
            >充值
            </el-button>
            <el-button
              size="mini"
              @click="handleShowDetails(scope.row)"
            >详情
            </el-button>
            <el-button
              size="mini"
              @click="$router.push({name: 'cash_billing', params:{user_id: scope.row.member_user_id}})"
            >
              开单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="total">
        本页累计余额总计：<span>{{totalAmount | formatMoney}}</span>
      </div>
      <!-- 分页 -->
      <pagination
        :layout='layout'
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        class='pagination'
        @pagination='getMemberList()'
      />

      <!-- dialog 会员编辑-->
      <el-dialog
        :title="dialogTitle[dialogStatus]"
        :visible.sync="dialogEditFormVisible"
        width="770px"
      >
        <!-- 充值 -->
        <div
          v-if="dialogStatus=='topup'"
          style='width: 450px; margin: 0 auto;'
          class="recharge"
        >
          <el-form
            label-position="right"
            label-width="80px"
            :model="rechargeTemp.item"
            ref="topupForm"
            :show-message='true'
            :rules="rules"
          >
            <el-form-item label="会员余额">
              <span style="color:#f1717e">{{rechargeTemp.card_amount | formatMoney}}</span>
            </el-form-item>
            <el-form-item
              label="充值金额"
              prop='amount'
            >
              <el-input
                v-model="rechargeTemp.item.amount"
                style='width:240px'
                @change='handleGetDonation'
              ></el-input>
            </el-form-item>
            <el-form-item label="赠送金额">
              <span>{{rechargeTemp.donation | formatMoney}}</span>
            </el-form-item>
            <el-form-item
              label="付款方式"
              prop='pay_id'
            >
              <el-radio-group v-model="rechargeTemp.item.pay_id">
                <el-radio
                  v-for='(item,key,index) in payWayList'
                  :key='index'
                  :label="item.id"
                >{{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="营销顾问"
              prop='staff_user_id'
              class="select-staff"
            >
              <!--<el-select-->
              <!--v-model="rechargeTemp.item.staff_user_id"-->
              <!--style="width: 240px;">-->
              <!--<el-option-->
              <!--v-for="(item,key,index) in staffsList.option"-->
              <!--:key='index'-->
              <!--:label="item.realname"-->
              <!--:value="item.staff_user_id"-->
              <!--&gt;</el-option>-->

              <!--</el-select>-->
              <el-badge
                class="recharge-staff"
                type="warning"
                v-for="(staff,index) in technician.selected"
                :key="`tag-${index}`"
              >
                <el-tag>{{staff.staff_info.realname}}</el-tag>
              </el-badge>
              <el-button
                class="button-new-tag"
                size="small"
                @click.native="selectTechnician"
              >
                + 选择顾问
              </el-button>
            </el-form-item>
            <el-form-item label="充值备注">
              <el-input
                type="textarea"
                :rows="3"
                v-model="rechargeTemp.item.remark"
                style='width:240px'
              >
              </el-input>
            </el-form-item>
          </el-form>

        </div>
        <!-- 分配 -->
        <div
          v-else-if="dialogStatus=='assign'"
          class="assign"
        >
          <el-form
            :model="staffsList"
            label-width="80px"
          >
            <el-form-item label="已选会员">
              <span>{{multipleSelection.length}}</span>人
            </el-form-item>
            <el-row>
              <el-form-item label="营销顾问">
                <el-col :span='17'>
                  <el-checkbox-group v-model="staffsList.checkList">
                    <el-checkbox
                      :label="item.id"
                      v-for="(item,key,index) in staffsList.option"
                      :key='index'
                    >{{item.realname}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
        </div>

        <!-- 编辑 -->
        <div
          v-else
          class="edit"
        >
          <el-scrollbar
            class="scrollbar"
            ref="scrollbar"
          >
            <el-form
              label-position="right"
              label-width="80px"
              :model="temp.item"
              ref="dataForm"
              :rules="rules"
              :show-message='true'
            >
              <el-row>
                <div class="upload_avatar clearfix">
                  <div class="image-preview fl">
                    <div class="image-preview-wrapper">
                      <img v-avatar='[temp.item.avatar_url, temp.item.gender]'>
                      <div class="image-preview-action">
                        <!-- <i class="el-icon-delete" /> -->
                      </div>
                    </div>
                  </div>
                  <el-upload
                    class="upload_btn fl"
                    :action='uploadUrl'
                    ref="uploadImg"
                    name='imageurl'
                    :show-file-list="false"
                    :with-credentials="false"
                    :before-upload='beforeUpload'
                    :on-success='uploadSuccess'
                    :on-error='uploadError'
                  >
                    <div
                      slot="trigger"
                      class="trigger_btn"
                    >上传头像
                    </div>
                    <div
                      class="el-upload__tip"
                      slot="tip"
                    >
                      <div>
                        支持上传图片格式jpg、png、gif。
                      </div>
                      <div>
                        尺寸：80像素*80像素
                      </div>
                    </div>
                  </el-upload>
                </div>
                <el-form-item
                  label="会员卡号"
                  prop="card_no"
                >
                  <el-input v-model="temp.item.card_no"></el-input>
                </el-form-item>

                <el-form-item
                  label="会员等级"
                  prop="rank_id"
                >
                  <el-select v-model="temp.item.rank_id">
                    <el-option
                      v-for='(item,key,index) in rankList'
                      :key='index'
                      :label="item.name"
                      :value="item.id"
                    ></el-option>

                  </el-select>
                </el-form-item>
                <el-form-item
                  label="会员姓名"
                  prop='realname'
                >
                  <el-input v-model="temp.item.realname"></el-input>
                </el-form-item>
                <el-form-item
                  label="联系方式"
                  prop='mobile'
                >
                  <el-input v-model="temp.item.mobile"></el-input>
                </el-form-item>
                <el-form-item label="会员性别">
                  <el-radio-group v-model="temp.item.gender">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                    <el-radio :label="null">保密</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="会员生日"
                  prop='birthday'
                >
                  <el-date-picker
                    type="date"
                    value-format='yyyy-MM-dd'
                    v-model="temp.item.birthday"
                  >
                  </el-date-picker>
                </el-form-item>

                <el-form-item
                  label="注册日期"
                  prop='created_at'
                >
                  <el-date-picker
                    type="date"
                    value-format='yyyy-MM-dd'
                    v-model="temp.item.created_at"
                  >
                  </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="会员密码">
                  <el-input v-model="temp.item.password"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="归属门店">
                  <el-select
                    v-model="temp.affiliation"
                    placeholder=""
                  >
                    <el-option
                      label="中北大厦店"
                      value="中北大厦店"
                    ></el-option>
                    <el-option
                      label="中北大厦店"
                      value="1"
                    ></el-option>
                    <el-option
                      label="中北大厦店"
                      value="2"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="营销顾问">
                  <el-select
                    v-model="temp.item.staff_ids"
                    multiple
                    placeholder=""
                  >
                    <el-option
                      v-for="(item,key,index) in staffsList.option"
                      :key='index'
                      :label="item.realname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注信息">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="temp.item.remark"
                  >
                  </el-input>
                </el-form-item>

                <div class="ex_info">
                  <el-form-item
                    label="扩展信息"
                    class="ex_info_title"
                  >
                  </el-form-item>
                  <el-form-item label="体重">
                    <el-input v-model="temp.item.weight"></el-input>
                  </el-form-item>
                  <el-form-item label="联系地址">
                    <el-input v-model="temp.item.address"></el-input>
                  </el-form-item>
                </div>

              </el-row>
            </el-form>
          </el-scrollbar>
        </div>

        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogEditFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus=='create'?createData():dialogStatus=='edit'?updateData():dialogStatus=='topup'?topUpSubmit():assignMember()"
          >确 定
          </el-button>
        </div>
      </el-dialog>

      <!-- dialog 会员详情 -->
      <el-dialog
        :visible.sync="dialogDetailVisible"
        class="member_datail"
        width='100%'
        top='0'
        @close='closeBox()'
        :style="{left:showStyle.left,opcity:showStyle.opcity}"
        :show-close='false'
      >
        <template slot='title'>
          <div style="overflow:hidden;">
            <span
              style="float:left; padding-top:7px; cursor:pointer;"
              @click='dialogDetailVisible=false'
            >
              <svg-icon
                icon-class="back"
                style='width:28px;height:28px;'
              />
            </span>
            <el-tabs
              class="detail_tabs"
              v-model="activeName"
            >
              <el-tab-pane
                label="消费明细"
                name="consuming"
              >
              </el-tab-pane>
              <!-- <el-tab-pane
                label="兑换查询"
                name="exchange"
              >
              </el-tab-pane> -->
              <el-tab-pane
                label="计次卡查询"
                name="tCard"
              >
              </el-tab-pane>
              <el-tab-pane
                label="储值卡查询"
                name="ppCard"
              >
              </el-tab-pane>
              <el-tab-pane
                label="余额记录"
                name="account"
              >
              </el-tab-pane>
              <el-tab-pane
                label="预存记录"
                name="advance"
              >
              </el-tab-pane>
              <!-- <el-tab-pane
                label="优惠券查询"
                name="coupon"
              >
              </el-tab-pane> -->
            </el-tabs>
          </div>
        </template>
        <div class="details_table">

          <el-row>
            <el-col :span='5'>
              <div class="left_content">
                <div class="left_title">会员基本信息</div>
                <div
                  class="left_info"
                  v-if='memberInfo.realname'
                >
                  <ul>
                    <li>
                      <div><span class="info_lable">会员卡号:</span><span class="info_body">{{memberInfo.card_no}}</span></div>
                    </li>
                    <li>
                      <div><span class="info_lable">会员等级:</span><span class="info_body">{{memberInfo.rank}}</span></div>
                    </li>
                    <li>
                      <div><span class="info_lable">会员姓名:</span><span class="info_body">{{memberInfo.realname}}</span></div>
                    </li>
                    <li>
                      <div><span class="info_lable">会员性别:</span><span class="info_body">{{memberInfo.gender==1?'男':memberInfo.gender==0?'女':"保密"}}</span></div>
                    </li>
                    <li>
                      <div><span class="info_lable">联系方式:</span><span class="info_body">{{memberInfo.mobile}}</span></div>
                    </li>
                    <li>
                      <div><span class="info_lable">会员余额:</span><span class="info_body">{{calc(memberInfo.account.card_amount).plus(memberInfo.account.donation_amount) | formatMoney}}</span></div>
                    </li>
                    <!-- <li>
                        <div><span class="info_lable">当前积分:</span><span class="info_body">{{memberInfo.point}}</span></div>
                      </li> -->
                    <li>
                      <div><span class="info_lable">注册日期:</span><span class="info_body">{{memberInfo.created_at | formatCreat}}</span></div>
                    </li>
                    <li>
                      <div><span class="info_lable">营销顾问:</span><span class="info_body">{{memberInfo.staffs | formatStaffs}}</span></div>
                    </li>
                    <!-- <li>
                        <div><span class="info_lable">归属门店:</span><span class="info_body">{{memberInfo.company}}</span></div>
                      </li> -->
                    <li>
                      <div><span class="info_lable">备注信息:</span><span class="info_body">{{memberInfo.remark==null||memberInfo.remark==''?'-':memberInfo.remark}}</span></div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
            <el-col :span='19'>
              <el-scrollbar
                class="scrollbar"
                ref='scrollbar'
              >
                <el-table
                  border
                  fit
                  :data='memberDetail'
                  class="details_tablelist"
                >
                  <!-- 消费明细 -->
                  <template v-if="activeName=='consuming'">
                    <el-table-column
                      label="财务日期"
                      width='180px'
                      key='consuming_created_at'
                    >
                      <template slot-scope="scope">
                        <span>{{scope.row.created_at}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="消费项目"
                      key='consuming_order_item'
                    >
                      <template slot-scope="scope">
                        {{scope.row.order_item | formatOrderItem}}
                        <!-- <el-tag
                          type="danger"
                          size="small"
                          v-if="scope.row.order_item[0].is_free"
                        >赠送</el-tag> -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="消费金额"
                      key='consuming_payment_amount'
                    >
                      <template slot-scope="scope">
                        <span :class="['status_color',scope.row.payment_amount-0<0?'discount':'']">
                          {{scope.row.payment_amount | formatMoney}}
                        </span>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column
                      label="积分分值"
                      prop='point'
                    >
                      <template slot-scope="scope">
                        <span :class="['status_color',scope.row.point-0<0?'discount':'']">
                          {{scope.row.point}}
                        </span>
                      </template>
                    </el-table-column> -->
                    <el-table-column
                      label="付款方式"
                      key='consuming_payments'
                    >
                      <template slot-scope="scope">
                        <span>
                          {{scope.row.payments | formatOrderPay}}
                        </span>
                      </template>
                    </el-table-column>
                  </template>

                  <!-- 计次卡 -->
                  <template v-if="activeName=='tCard'">
                    <el-table-column
                      label="财务日期"
                      prop='created_at'
                      key='tCard_created_at'
                      width='180px'
                    >
                    </el-table-column>

                    <el-table-column
                      label="交易内容"
                      key='tCard_item'
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <!-- <span> -->
                        计次卡{{scope.row.type=='BUY'? '购买' : scope.row.type=='CONSUME'? '消费' : '退款'}}：&nbsp;{{scope.row | formatTcardOrder}}
                        <!-- </span> -->
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="操作人员"
                      prop='operator.realname'
                      key="tCard_operator"
                      width='145px'
                    >
                    </el-table-column>
                  </template>

                  <!-- 储值卡 -->
                  <template v-if="activeName=='ppCard'">
                    <el-table-column
                      label="财务日期"
                      prop='created_at'
                      key='ppCard_created_at'
                      width='180px'
                    >
                    </el-table-column>
                    <el-table-column
                      label="交易内容"
                      key='ppCard_item'
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <!-- <span> -->
                        储值卡{{scope.row.type=='BUY'? '购买' : scope.row.type=='CONSUME'? '消费' : '退款'}}：&nbsp;{{scope.row | formatPpCardOrder}}
                        <!-- </span> -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作人员"
                      prop='operator.realname'
                      key="ppCard_operator"
                      width='145px'
                    >
                    </el-table-column>
                  </template>

                  <!-- 余额记录 -->
                  <template v-if="activeName=='account'">
                    <el-table-column
                      label="财务日期"
                      key='account_date'
                      prop='created_at'
                      width='180px'
                    >
                    </el-table-column>
                    <el-table-column
                      label="交易内容"
                      key='account_pay'
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span :class="['status_color',scope.row.reason=='CONSUME'?'discount':'']">
                          余额{{scope.row.reason=='RECHARGE'?'充值':scope.row.reason=='CONSUME'?'消费':"退款"}}：{{calc(scope.row.order_card_amount).plus(scope.row.order_donation_amount) | formatMoney}}；当前余额：{{calc(scope.row.card_amount).plus(scope.row.donation_amount) | formatMoney}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="充值备注"
                      key='remark'
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <!-- <span> -->
                        {{scope.row.order.remark==null||scope.row.order.remark==''?'-':scope.row.order.remark}}
                        <!-- </span> -->
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="操作人员"
                      key='account_role'
                      prop='operator.realname'
                      width='145px'
                    >
                    </el-table-column>
                  </template>

                  <!-- 预存记录 -->
                  <template v-if="activeName=='advance'">
                    <el-table-column
                      label="财务日期"
                      key='advance_created_at'
                      prop='created_at'
                      width='180px'
                    >
                    </el-table-column>
                    <el-table-column
                      label="交易内容"
                      key='advance_pay'
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span :class="['status_color',scope.row.type=='CONSUME'?'discount':'']">
                          预存{{scope.row.type=='BUY'? '充值' : scope.row.type=='CONSUME'? '消耗' : '退款'}}：&nbsp;{{scope.row | formatAdvancedOrder}}
                        </span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="操作人员"
                      key='advance_role'
                      prop='operator.realname'
                      width='145px'
                    >
                    </el-table-column>
                  </template>

                  <el-table-column
                    label="操作"
                    key='handle'
                    width='170px'
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleShowInnerDetails(scope.row)"
                      >
                        查看详情
                      </el-button>
                    </template>
                  </el-table-column>
                  <template
                    slot="append"
                    v-if="activeName =='consuming'"
                  >
                    <div class="count">
                      <span>总计:</span>
                      <span>消费金额: <i>{{orderTotalAmount | formatMoney}}</i></span>
                      <!-- <span
                        style='padding-left:15px'
                        v-if="activeName == 'consuming'"
                      >积分值: <i>317</i></span> -->
                    </div>
                  </template>
                </el-table>
              </el-scrollbar>
            </el-col>
          </el-row>
        </div>

        <!-- order detail -->
        <!-- <el-dialog
          title="内层 Dialog"
          :visible.sync="innerDetailVisible"
          append-to-body
          top='0'
          class="inner_order_detail"
          :show-close='false'
        >
          <template slot='title'>
            <div class="inner_title">
              <span>订单详情</span>
              <button
                type="button"
                aria-label="Close"
                class="el-dialog__headerbtn inner_back"
                @click="innerDetailVisible=false"
              >
                <svg-icon
                  icon-class="back"
                  style='width:28px;height:28px;'
                />
              </button>
            </div>
          </template>
          <div>
            <el-row>
              <el-col
                :span='11'
                class="order"
              >
                <div style="margin-bottom:18px">订单号:<span>{{orderInfo.info.no}}</span></div>
                <div v-if="orderInfo.info.member">顾客:<span>{{orderInfo.info.member.realname}} {{orderInfo.info.member.mobile}}</span></div>
              </el-col>
              <el-col
                :span='11'
                class="order"
              >
                <div style="margin-bottom:18px">交易时间:<span>{{orderInfo.info.created_at}}</span></div>
                <div v-if="orderInfo.info.staff_user">操作人员:<span>{{orderInfo.info.staff_user.realname}}</span></div>
              </el-col>
              <img
                class="status-icon"
                src="@/assets/cash/order-status-success.png"
                alt=""
                v-if="orderInfo.info.status ===2"
              >
              <img
                class="status-icon"
                src="@/assets/cash/order-status-cancel.png"
                alt=""
                v-if="orderInfo.info.status ===3"
              >
            </el-row>
            <el-table
              style="width: 100%"
              fit
              :data="orderInfo.info.order_item"
              class="order_details_tablelist"
            >
              <el-table-column
                label="产品名称"
                prop='title'
                min-width='120px'
              >
                <template slot-scope="scope">
                  {{scope.row.title}}
                  <el-tag
                    type="danger"
                    size="small"
                    v-if="scope.row.is_free"
                  >赠送
                  </el-tag>
                  <el-tag
                    type="warning"
                    size="small"
                    v-if="scope.row.user_advance_id || scope.row.is_advance"
                  >预存
                  </el-tag>
                </template>
              </el-table-column>
              <template v-if="orderInfo.info.account&&orderInfo.info.account.reason!='RECHARGE' || !orderInfo.info.account">
                <el-table-column
                  label="单价"
                  prop='price'
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.price | formatMoney}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量"
                  prop='num'
                >
                  <template slot-scope="scope">
                    ×{{scope.row.num}}
                  </template>
                </el-table-column>
              </template>

              <el-table-column :label="orderInfo.info.account&&orderInfo.info.account.reason!='RECHARGE' || !orderInfo.info.account? '金额':'充值金额'">
                <template slot-scope="scope">
                  {{scope.row.discount_amount | formatMoney}}
                  <br>
                  <del v-show="scope.row.discount_amount !== scope.row.total_amount">
                    {{scope.row.total_amount | formatMoney}}
                  </del>
                </template>
              </el-table-column>
              <el-table-column
                label="赠送金额"
                key='total_amount'
                v-if="orderInfo.info.account&&orderInfo.info.account.reason =='RECHARGE'"
              >
                <template slot-scope="scope">
                  <span v-if='orderInfo.info.account'>
                    {{orderInfo.info.account.order_donation_amount | formatMoney}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="orderInfo.info.account&&orderInfo.info.account.reason!='RECHARGE' || !orderInfo.info.account? '技师':'营销顾问'"
                prop='staff'
              >
                <template slot-scope="scope">
                  <div
                    v-for="(item,index) in scope.row.staff"
                    :key="item.id+index"
                  >{{item.staff.realname}} &nbsp;<span
                      class='spec'
                      v-if="item.is_appoint"
                    >点客</span>
                  </div>
                  <div v-if="!scope.row.staff.length">-</div>
                </template>

              </el-table-column>
            </el-table>
            <el-row class="order_amount">
              <el-col :span='5'>
                <div>总计:</div>
                <div>折扣:</div>
                <div
                  class="status_color pay"
                  v-for='(item,key,index) in orderInfo.info.payments'
                  :key='index'
                >{{payMethod[item.type]}}:
                </div>
              </el-col>
              <el-col :span='6'>
                <div>{{orderInfo.info.total_amount | formatMoney}}</div>
                <div class="status_color discount">-{{orderInfo.info.discount | formatMoney}}</div>
                <div
                  class="status_color pay"
                  v-for='(item,key,index) in orderInfo.info.payments'
                  :key='index'
                >{{item.amount | formatMoney}}
                </div>
              </el-col>
            </el-row>
            <div class="order_remark">
              备注:&nbsp;&nbsp;{{orderInfo.info.remark}}
            </div>
          </div>
        </el-dialog> -->
      </el-dialog>

      <!--选择技师-->
      <technician-dialog
        ref="technicianDialog"
        :show.sync="technician.dialogShow"
        :selected="technician.selected"
        :amount="rechargeTemp.item.amount"
        @staff="handleTechnician($event)"
        v-if="technician.dialogShow"
      >
      </technician-dialog>

      <!--详情-->
      <detail-dialog
        ref="detailDialog"
        :show.sync="innerDetailVisible"
        :order_id="innerDetail_orderId"
        v-if="innerDetailVisible"
        :is_order='false'
      >
      </detail-dialog>
    </el-card>
  </div>
</template>

<script>
const moment = require("moment");
import { Message } from "element-ui";
//
import Pagination from "@/components/Pagination";
import TechnicianDialog from "./components/technician-dialog";
import DetailDialog from "@/views/cash/order/components/detail-dialog";
//
import {
  memberList,
  rankList,
  staffsList,
  payWay,
  deleteMember,
  updateMemberOwners,
  editMember,
  createMember,
  consumingRecords,
  accountRecords,
  tCardRecords,
  ppCardRecords,
  advanceRecords,
  doRecharge,
  getDonation
} from "@/api/member";
import {
  uploadUrl
} from "@/api/index";
import { orderInfo } from "@/api/cash/order";
import { calc } from "@/utils";
import { validateMoney } from "@/utils/validate";

export default {
  name: "Manage",
  components: {
    Pagination,
    TechnicianDialog,
    DetailDialog
  },
  filters: {
    // 格式化列表营销顾问
    formatStaffs: function(value) {
      if (value.length < 1) {
        return "-";
      }
      let name = [];
      value.forEach((v, k) => {
        name.push(v.realname);
      });
      name = name.join("、");
      return name;
    },

    // 格式化注册日期
    formatCreat: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.trim().split(" ")[0];
    },

    // 格式化生日
    formatBirthday: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      return value.date.trim().split(" ")[0];
    },

    // 格式化距上次消费
    formatActiveTime: function(value) {
      if (value == null || value.length < 1) {
        return "-";
      }
      value.trim();
      let index = value.lastIndexOf(":");
      return value.substring(0, index);
    },

    // 格式化订单消费项目
    formatOrderItem: function(value) {
      let order_item = "";
      if (value == null || value.length < 1) {
        return "";
      }
      if (value.length > 1) {
        order_item = "" + value[0].title + "等" + value.length + "件产品";
      } else {
        order_item += value[0].title;
      }
      return order_item;
      // return value.date.trim().split(" ")[0];
    },

    // 格式化次卡订单消费项目
    formatTcardOrder: function(value) {
      let order_item = "",
        list;
      if (value.type == "BUY") {
        list = value.tcard.user_tcard_items;
        if (list == null || list.length < 1) {
          return "";
        }
        list.forEach((item, key) => {
          let str = `${item.item_name}：充${item.time}剩${item.time}`;

          if (key == 0) {
            order_item += str;
          } else {
            order_item += "，" + str;
          }
        });
      } else if (value.type == "CONSUME") {
        list = value.item_records;
        if (list == null || list.length < 1) {
          return "";
        }
        list.forEach((item, key) => {
          let str = `${item.user_tcard_item.item_name}：扣${
            item.used_time
          }剩${item.time - item.used_time}`;
          if (key == 0) {
            order_item += str;
          } else {
            order_item += "，" + str;
          }
        });
      } else {
        order_item = "次数清零退卡";
      }
      return `<${value.tcard.name}>${order_item}`;
    },

    // 格式化储值卡订单消费项目
    formatPpCardOrder: function(value) {
      if (value == null || value.length < 1) {
        return "";
      }
      let order_item = "";
      if (value.type == "BUY") {
        order_item = `充值金额：${calc(value.card_amount).plus(
          value.donation_amount
        )}，卡内余额：${calc(value.card_amount).plus(value.donation_amount)}`;
      } else if (value.type == "CONSUME") {
        order_item = `消费金额：${calc(value.order_card_amount).plus(
          value.order_donation_amount
        )}，卡内余额：${calc(value.card_amount).plus(value.donation_amount)}`;
      } else {
        // order_item = `消费金额：${calc(value.order_card_amount).plus(
        //   value.order_donation_amount
        // )}，卡内余额：${calc(value.card_amount).plus(value.donation_amount)}`;
        order_item = "退卡";
      }
      return `<${value.ppcard.name}>${order_item}`;
    },

    // 格式化预存记录订单消费项目
    formatAdvancedOrder: function(value) {
      let order_item = "",
        list;
      if (value.type == "BUY") {
        list = value.item_records;
        if (list == null || list.length < 1) {
          return "";
        }
        list.forEach((item, key) => {
          let str = `${item.user_advance_item.item_name}：充${item.time}剩${
            item.time
          }`;

          if (key == 0) {
            order_item += str;
          } else {
            order_item += "，" + str;
          }
        });
      } else {
        list = value.item_records;
        if (list == null || list.length < 1) {
          return "";
        }
        list.forEach((item, key) => {
          let str = `${item.user_advance_item.item_name}：扣${
            item.used_time
          }剩${item.time - item.used_time}`;
          if (key == 0) {
            order_item += str;
          } else {
            order_item += "，" + str;
          }
        });
      }
      return `${order_item}`;
    },

    // 格式化订单支付方式
    formatOrderPay: function(value) {
      if (value.length < 1) {
        return "耗卡";
      }
      let payments = [];
      let payMethod = {
        BANKCARD: "银行卡",
        CASH: "现金",
        ALIPAY: "支付宝",
        WECHATPAY: "微信",
        PPCARD: "储值卡",
        OTHERS: "其他",
        DEPOSIT: "余额",
        GROUP_BUYING: "团购"
      };
      value.forEach(v => {
        payments.push(payMethod[v.type]);
      });
      return payments.join("；");
      // return value.date.trim().split(" ")[0];
    }

    // //格式化金额
    // formatMoney(money) {
    //   return calc(money).toFormat(2);
    // }
  },
  data() {
    let validFilter = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^(\-|\+)?\d+(\.\d+)?$/;
        if (!reg.test(value)) {
          Message.error("输入的查询条件格式不正确");
          callback(new Error());
        } else if (value < 0) {
          Message.error("输入的查询条件格式不正确");
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validMobile = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback(new Error());
      } else {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validAmount = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else if (value == 0) {
        callback(new Error());
      } else {
        let reg = /^(\-|\+)?\d+(\.\d+)?$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validCard = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^[\x21-\x7E]{1,}$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validBirthday = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        if (new Date(value).getTime() >= new Date().getTime()) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    return {
      uploadUrl,
      calc,
      show: false,
      // 筛选
      filterList: {
        level: "",
        point: "",
        registtime: "",
        expensetime: "",
        name: ""
      },
      definedPoint: "",
      definedRegisttime: "",
      definedConsumptiontime: "",

      // checkbox
      multipleSelection: [],
      // 等级列表
      rankList: [],
      // 营销顾问列表
      staffsList: [],
      // 支付方式列表
      payWayList: [],
      // dialog
      dialogStatus: "",
      dialogTitle: {
        create: "新增会员",
        edit: "编辑会员",
        topup: "会员充值",
        assign: "分配营销顾问"
      },
      dialogEditFormVisible: false,
      // 编辑
      temp: {
        id: null,
        item: {
          avatar_url: "",
          card_no: "",
          rank_id: 1,
          realname: "",
          mobile: "",
          created_at: "",
          staff_ids: [],
          gender: 1,
          remark: "",
          birthday: undefined,
          // password: "",
          address: ""
        }
      },
      // 充值
      rechargeTemp: {
        card_amount: undefined,
        donation: "00.00",
        item: {
          member_user_id: undefined,
          amount: undefined,
          pay_id: 1,
          remark: undefined,
          staff_list: [],
          staff_user_id: undefined
        }
      },
      // 分配
      staffsList: {
        checkList: [],
        option: []
      },

      // 校验
      rules: {
        filter: [{ validator: validFilter, trigger: "blur" }],
        card_no: [
          { required: true, trigger: "blur", message: "会员卡号不能为空" },
          { validator: validCard, trigger: "blur", message: "会员卡号格式不正确" }
        ],
        rank_id: [{ required: true, trigger: "change", message: "会员等级不能为空" }],
        realname: [{ required: true, trigger: "blur", message: "会员姓名不能为空" }],
        mobile: [
          { required: true, trigger: "blur", message: "手机号码不能为空" },
          {
            validator: validMobile,
            trigger: "blur",
            message: "手机号码格式不正确"
          }
        ],
        amount: [
          { required: true, trigger: "blur", message: "充值金额不能为空" },
          { validator: validAmount, trigger: "blur", message: "充值金额格式不正确" }
        ],
        // pay_id: [{ required: true, trigger: "change" }],
        // staff_user_id: [{ required: true, trigger: "change" }],
        created_at: [
          { validator: validBirthday, trigger: "blur", message: "注册日期不正确" }
        ],
        birthday: [{ validator: validBirthday, trigger: "blur", message: "会员生日不正确" }]
      },
      // detail
      dialogDetailVisible: false,
      innerDetailVisible: false,
      innerDetail_orderId: undefined,
      showStyle: {
        left: "30%",
        opcity: "0.5"
      },
      activeName: "consuming",
      member_user_id: undefined,
      orderTotalAmount: 0.0,
      memberInfo: {},
      consumingDetail: [],
      TCardDetail: [],
      ppCardDetail: [],
      accountDetail: [],
      advanceDetail: [],
      // order datail
      orderInfo: { info: {} },
      payMethod: {
        BANKCARD: "银行卡",
        CASH: "现金",
        ALIPAY: "支付宝",
        WECHATPAY: "微信",
        PPCARD: "储值卡",
        OTHERS: "其他",
        DEPOSIT: "余额",
        GROUP_BUYING: "团购"
      },

      // list
      memberData: [],
      listLoading: true,
      // 分页
      listQuery: {
        page: 1,
        limit: 10,
        search: "",
        register_start_time: "",
        register_end_time: "",
        rank_id: "",
        point_min: "",
        point_max: "",
        active_end_time: "",
        active_start_time: "",
        seller_id: ""
      },
      total: 0,
      layout: " sizes, jumper, next, pager, prev, total",

      //技师
      technician: {
        dialogShow: false,
        selected: []
      }
    };
  },
  methods: {
    // 高级查询
    handleFilter() {
      this.$refs["filterForm"].validate(valid => {
        if (valid) {
          this.listQuery.page = 1;
          this.getMemberList();
          console.log(this.filterList);
          console.log(this.listQuery);
        }
      });
    },
    // 批量操作
    handleCommand(command) {
      command == "assign" ? this.handleAssign() : this.showDelBOX();
    },
    // 搜索
    handleSearch() {
      this.handleFilter();
    },
    // 批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // temp
    resetTemp() {
      this.temp = {
        id: null,
        item: {
          avatar_url: "",
          card_no: "",
          rank_id: this.rank_id_first,
          realname: "",
          mobile: "",
          created_at: moment().format("YYYY-MM-DD"),
          staff_ids: [],
          gender: 1,
          remark: "",
          birthday: undefined,
          // password: "",
          address: ""
        }
      };
    },
    resetRechargeTemp() {
      this.rechargeTemp = {
        card_amount: undefined,
        donation: "00.00",
        item: {
          member_user_id: undefined,
          amount: undefined,
          pay_id: 1,
          staff_list: [],
          remark: undefined
        }
      };
      this.technician.selected = [];
    },
    // 新增
    handleAdd() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogEditFormVisible = true;
      this.$nextTick(() => {
        this.$refs["scrollbar"].wrap.scrollTop = 0;
        this.$refs["dataForm"].clearValidate();
      });
      console.log(this.temp);
    },
    // 编辑
    handleEdit(row) {
      console.log(row);
      let {
          avatar_url,
          id,
          card_no,
          rank_id,
          realname,
          mobile,
          created_at,
          gender,
          remark,
          // password,
          weight,
          address
        } = row,
        Meetingtel = row.staffs;
      let birthday = row.birthday == null ? undefined : row.birthday.date;
      let staff_ids = [];
      Meetingtel.forEach((v, k) => {
        staff_ids.push(v.id);
      });
      created_at =
        created_at == "" || created_at == undefined || created_at == null
          ? ""
          : created_at.split(" ")[0];
      birthday =
        birthday == null || birthday == "" ? undefined : birthday.split(" ")[0];
      this.temp = Object.assign({}, this.temp, {
        id,
        item: {
          avatar_url,
          card_no,
          rank_id,
          realname,
          mobile,
          created_at,
          staff_ids,
          gender,
          remark,
          birthday,
          // password,
          weight,
          address
        }
      });
      console.log(this.temp);
      this.dialogStatus = "edit";
      this.dialogEditFormVisible = true;
      this.$nextTick(() => {
        this.$refs["scrollbar"].wrap.scrollTop = 0;
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 新建数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.temp.item);

          createMember(this.temp.item)
            .then(res => {
              this.getMemberList();
              this.dialogEditFormVisible = false;
              console.log(this.temp);
              this.$message.success("新建成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.temp);
          let { id } = this.temp;
          editMember(id, this.temp.item)
            .then(res => {
              this.getMemberList();
              this.dialogEditFormVisible = false;
              console.log(this.temp);
              this.$message.success("编辑成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 充值
    handleRecharge(row) {
      this.resetRechargeTemp();
      let { member_user_id } = row,
        { card_amount, donation_amount } = row.account,
        count = calc(Number(card_amount)).plus(Number(donation_amount));
      this.rechargeTemp = Object.assign({}, this.rechargeTemp, {
        card_amount: count,
        donation: "00.00",
        item: {
          member_user_id,
          amount: "",
          pay_id: 1,
          remark: "",
          staff_list: []
        }
      });
      console.log("rechargeTemp", this.rechargeTemp);
      this.dialogStatus = "topup";
      this.dialogEditFormVisible = true;
      this.$nextTick(() => {
        this.$refs["topupForm"].clearValidate();
      });
    },

    topUpSubmit() {
      this.$refs["topupForm"].validate(valid => {
        if (valid) {
          console.log("充值temp", this.rechargeTemp.item);
          doRecharge(this.rechargeTemp.item)
            .then(res => {
              this.getMemberList();
              this.dialogEditFormVisible = false;
              this.$message.success("充值成功");
              console.log(res.success);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 获取充值金额
    handleGetDonation() {
      let { amount } = this.rechargeTemp.item;
      if (amount == "" || amount == 0) {
        this.rechargeTemp.donation = "00.00";
        return;
      }
      getDonation({ amount })
        .then(res => {
          let data = res.success.data;
          this.rechargeTemp.donation = data.donation;
          console.log("赠送金额", data.donation);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 详情
    resetDetailList() {
      this.activeName = "consuming";
      this.consumingDetail = [];
      this.TCardDetail = [];
      this.ppCardDetail = [];
      this.accountDetail = [];
      this.advanceDetail = [];
    },

    handleShowDetails(row) {
      this.resetDetailList();
      let { member_user_id } = row;
      this.memberInfo = Object.assign({}, row);
      this.member_user_id = member_user_id;
      console.log(row);
      consumingRecords({ member_user_id }).then(res => {
        let data = res.success.data;
        // console.log(data);
        console.log("消费明细", data);
        console.log("消费明细", data.items.data);
        this.consumingDetail = [...data.items.data];
        this.orderTotalAmount = data.total_amount;
        this.dialogDetailVisible = true;
        setTimeout(() => {
          this.showStyle.left = "0";
          this.showStyle.opcity = "1";
        }, 0);
        this.$nextTick(() => {
          this.$refs["scrollbar"].wrap.scrollTop = 0;
        });
      });
    },

    showBox() {},

    closeBox() {
      this.showStyle.left = "30%";
      this.showStyle.opcity = "0.5";
    },

    // 订单详情
    handleShowInnerDetails(row) {
      // this.orderInfo = { info: {} };
      console.log(row);
      let id;
      if (row.order_id) {
        id = row.order_id;
      } else {
        id = row.id;
      }
      this.innerDetail_orderId = id;
      // orderInfo(id)
      //   .then(res => {
      //     let data = res.success.data;
      //     console.log(data);
      //     this.orderInfo.info = data;
      //     this.orderInfo.info.discount = calc(this.orderInfo.info.total_amount)
      //       .minus(this.orderInfo.info.payment_amount)
      //       .toNumber();
      this.innerDetailVisible = true;
      // })
      // .catch(err => {
      //   console.log(err);
      // });
    },

    // 分配
    handleAssign() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择会员进行操作");
        return;
      }
      this.dialogStatus = "assign";
      this.staffsList.checkList = [];
      this.dialogEditFormVisible = true;
    },

    assignMember() {
      let ids = [];
      this.multipleSelection.forEach((v, k) => {
        ids.push(v.id);
      });
      let staff_ids = this.staffsList.checkList;
      updateMemberOwners({
        ids,
        staff_ids
      })
        .then(res => {
          this.getMemberList();
          this.dialogEditFormVisible = false;
          this.$message.success("分配成功");
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 删除
    showDelBOX() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择会员进行操作");
        return;
      }
      this.$confirm(
        "所选会员的余额、购买的计次卡、储值卡及预存产品将一并删除，确定删除吗？",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.handleDelete();
        })
        .catch(action => {});
    },

    // 批量删除
    handleDelete() {
      console.log(this.multipleSelection);
      let arr = [];
      this.multipleSelection.forEach((v, k) => {
        arr.push(v.id);
      });
      let ids = arr.join(",");
      deleteMember(ids)
        .then(res => {
          this.getMemberList();
          this.$message.success("删除成功");
        })
        .catch(err => {
          console.log(err);
          this.$message.error("删除失败");
        });
    },

    // 获取会员列表
    getMemberList() {
      memberList(this.listQuery)
        .then(res => {
          let data = res.success.data;
          this.memberData = [...data.data];
          this.total = data.total;
          this.$nextTick(() => {
            this.listLoading = false;
          });
          console.log("会员", data);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取等级列表
    getRankList() {
      rankList()
        .then(res => {
          let data = res.success.data;
          console.log("等级", data);
          this.rankList = [...data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取营销顾问列表
    getStaffsList() {
      staffsList()
        .then(res => {
          let data = res.success.data;
          console.log("营销顾问", data);
          this.staffsList.option = [...data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取支付方式
    getPayWay() {
      payWay()
        .then(res => {
          let data = res.success.data;
          console.log("支付方式", data);
          this.payWayList = [...data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    //
    formatDate(days = 0, date = new Date()) {
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
      let milliSecond = date.getTime();
      if (!days) {
        return (
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second
        );
      }
      let _milliSecond = 86400000 * days;
      let times = milliSecond - _milliSecond;
      return this.formatDate(0, new Date(times));
    },

    // 图片上传
    uploadImage() {},

    beforeUpload(file) {
      // console.log(file);
    },

    uploadSuccess(response, file, fileList) {
      console.log(response.success.data);
      console.log(file);
      // this.temp.item.imageurl = file.url;
      this.temp.item.avatar_url = response.success.data;
    },

    uploadError(err, file, fileList) {
      console.log(err);
    },

    // 获取订单明细
    getConsumingRecords(id) {
      if (this.consumingDetail.length) {
        return;
      }
      consumingRecords(id)
        .then(res => {
          let data = res.success.data;
          console.log("消费明细", data);
          console.log(data.items.data);
          this.consumingDetail = [...data.items.data];
          this.orderTotalAmount = data.total_amount;
        })
        .catch(err => {
          console.log(err);
        });
    },

    getTCardRecords(id) {
      if (this.TCardDetail.length) {
        return;
      }
      tCardRecords(id)
        .then(res => {
          let data = res.success.data;
          console.log("计次卡明细", data);
          this.TCardDetail = [...data.data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    getPpCardRecords(id) {
      if (this.ppCardDetail.length) {
        return;
      }
      ppCardRecords(id)
        .then(res => {
          let data = res.success.data;
          console.log("储值卡明细", data);
          this.ppCardDetail = [...data.data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    getAccountRecords(id) {
      if (this.accountDetail.length) {
        return;
      }
      accountRecords(id)
        .then(res => {
          let data = res.success.data;
          console.log("余额明细", data);
          this.accountDetail = [...data.data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    getAdvanceRecords(id) {
      if (this.advanceDetail.length) {
        return;
      }
      advanceRecords(id)
        .then(res => {
          let data = res.success.data;
          console.log("预存记录", data);
          this.advanceDetail = [...data.data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    getOrderDetail() {
      let id = { member_user_id: this.member_user_id };
      switch (this.activeName) {
        case "consuming":
          this.getConsumingRecords(id);
          break;
        case "tCard":
          this.getTCardRecords(id);
          break;
        case "ppCard":
          this.getPpCardRecords(id);
          break;
        case "account":
          this.getAccountRecords(id);
          break;
        case "advance":
          this.getAdvanceRecords(id);
          break;
      }
    },

    //选择技师
    selectTechnician() {
      let amount = this.rechargeTemp.item.amount;
      console.log("选择技师2", amount);
      if (!validateMoney(amount) || amount <= 0) {
        this.$message({
          message: "请先输入正确的充值金额",
          type: "warning"
        });
        return false;
      }
      this.technician.dialogShow = true;
    },

    // 处理技师数据
    handleTechnician(val) {
      console.log("处理技师数据", val);
      this.technician.selected = val;
      if (val.length) {
        this.rechargeTemp.item.staff_list = val.map(n => {
          return {
            is_appoint: n.is_appoint,
            staff_user_id: n.staff_info.id,
            ...n.sale_ratio
          };
        });
        console.log("处理技师数据format", this.technician.selected);
      }
    }
  },
  computed: {
    toggleCheck() {
      return this.show ? "收起搜索" : "高级搜索";
    },
    filterPoint() {
      return this.filterList.point;
    },
    filterRegist() {
      return this.filterList.registtime;
    },
    filterExpense() {
      return this.filterList.expensetime;
    },
    filterLevel() {
      return this.filterList.level;
    },
    filterName() {
      return this.filterList.name;
    },
    memberDetail() {
      if (this.activeName == "consuming") {
        return this.consumingDetail;
      } else if (this.activeName == "tCard") {
        return this.TCardDetail;
      } else if (this.activeName == "ppCard") {
        return this.ppCardDetail;
      } else if (this.activeName == "account") {
        return this.accountDetail;
      } else if (this.activeName == "advance") {
        return this.advanceDetail;
      }
    },
    // 总计
    totalAmount() {
      let num = 0;
      this.memberData.forEach((v, k) => {
        num = calc(num)
          .plus(Number(v.account.card_amount))
          .plus(Number(v.account.donation_amount));
      });
      return num.toFixed(2);
    },
    // // 订单总计
    // orderTotalAmount() {
    //   let num = 0;
    //   this.consumingDetail.forEach((v, k) => {
    //     num = calc(num).plus(Number(v.payment_amount));
    //   });
    //   return num.toFixed(2);
    // },
    rank_id_first() {
      return this.rankList.length > 0 ? this.rankList[0].id : "";
    }
  },
  watch: {
    filterList: {
      handler(val, oldVal) {
        this.handleFilter();
      },
      deep: true
    },
    filterLevel(val, oldVal) {
      this.listQuery.rank_id = val;
    },
    filterName(val, oldVal) {
      this.listQuery.seller_id = val;
    },
    filterPoint(val, oldVal) {
      if (val == "") {
        this.listQuery.point_min = "";
        this.listQuery.point_max = "";
      } else if (val == "1000以下") {
        this.listQuery.point_min = 0;
        this.listQuery.point_max = 1000;
      } else {
        let arr = val.split("~");
        this.listQuery.point_min = arr[0];
        this.listQuery.point_max = arr[1];
      }
    },
    filterRegist(val, oldVal) {
      let now = this.formatDate();
      if (val == "") {
        this.listQuery.register_start_time = "";
        this.listQuery.register_end_time = "";
      } else {
        let time = this.formatDate(val - 0);
        this.listQuery.register_start_time = time;
        this.listQuery.register_end_time = now;
      }
    },
    filterExpense(val, oldVal) {
      let now = this.formatDate();
      if (val == "") {
        this.listQuery.active_start_time = "";
        this.listQuery.active_end_time = "";
      } else {
        let time = this.formatDate(val - 0);
        this.listQuery.active_start_time = time;
        this.listQuery.active_end_time = now;
      }
    },
    activeName(val, oldVal) {
      this.getOrderDetail();
      this.$nextTick(() => {
        this.$refs["scrollbar"].wrap.scrollTop = 0;
      });
    }
  },
  created() {
    this.getMemberList();
    this.getRankList();
    this.getStaffsList();
    this.getPayWay();
    //首页跳转
    if (this.$route.params.type === "add") {
      setTimeout(() => {
        this.handleAdd();
      }, 500);
    }
  }
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
.member_manage {
  // 会员列表
  .filter_container {
    .header {
      padding-bottom: 10px;
      overflow: hidden;
      border-bottom: 1px solid $tbColor;
      i {
        padding-left: 5px;
      }
      .showbtn {
        width: 100px;
        background-color: #fff;
        color: $fontColor;
        border: 1px solid $borderColor;
        padding: 10px;
        &:focus {
          border: 1px solid #f48d98;
        }
      }
      .search {
        min-width: 240px;
        width: auto;
        margin-right: 20px;
      }
      .add_member {
        margin-left: 0;
        margin-right: 20px;
      }
    }
    .body {
      padding: 15px 60px;
      background-color: #f5f7fa;

      .el-row {
        padding-left: 90px;
        .el-radio-button {
          margin-right: 10px;
          margin-bottom: 10px;
        }
        span {
          float: left;
          margin-left: -90px;
          width: 70px;
          text-align: right;
          margin-right: 20px;
          color: $fontColor_light;
          line-height: 36px;
        }
        .defined {
          width: auto;
          max-width: 125px;
          float: right;
        }
      }
    }
  }

  .member_list {
  }
  .total {
    margin-top: 15px;
    color: $fontColor_light;
    span {
      color: $primaryColor;
    }
  }
  // dialog 编辑
  .el-dialog__body {
    color: $fontColor;

    .el-col {
      .el-form-item:last-child {
        margin-bottom: 0;
      }
    }
    .el-input,
    .el-select,
    .el-textarea {
      width: 240px;
    }
    .upload_avatar {
      margin-bottom: 30px;
    }
    .image-preview {
      width: 80px;
      height: 80px;
      background: url("~@/assets/member/avatar-big.png") no-repeat center;
      background-color: #f0f2f5;
      overflow: hidden;
      .image-preview-wrapper {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
        }
      }
    }
    .upload_btn {
      margin-top: 10px;
      margin-left: 10px;
    }
    .trigger_btn {
      width: 78px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: $fontColor_light;
      border: 1px solid $borderColor;
      border-radius: $borderRadius;
      // i {
      //   line-height: 40px;
      //   color: $borderColor;
      //   font-size: 24px;
      // }
    }
    .el-upload__tip {
      font-size: 12px;
      color: #c0c4cc;
      line-height: 17px;
      margin-top: 10px;
    }
  }
}

.status_color {
  &.discount {
    color: #f7a16c;
  }
  &.pay {
    color: $primaryColor;
  }
}

// 充值顾问
.recharge-staff.el-badge {
  height: 32px;
  line-height: 30px;
  margin-right: 10px;
  margin-bottom: 10px;
  .el-tag {
    height: 32px;
    line-height: 30px;
  }
}
</style>

<style lang="scss">
@import "~@/styles/variables.scss";

$fontColor: #606266;
$primaryColor: #f1717e;
$fontColor_light: #909399;

.member_manage {
  // 会员列表
  // 列表
  .member_list {
    .el-table-column--selection .cell {
      padding: 0px;
    }
    .avatar_img {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      vertical-align: middle;
      border-radius: 50%;
      overflow: hidden;
      background: url("~@/assets/member/avatar-mini.png") no-repeat center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .word_break {
      word-break: break-word;
    }
  }

  // 分页
  .pagination {
    padding: 20px 0;
    margin-top: 0;
    .el-pagination__sizes {
      float: left;
    }
    .el-pagination__total,
    .btn-prev,
    .el-pager,
    .btn-next,
    .el-pagination__jump {
      float: right;
    }
  }

  $borderColor: #dcdfe5;
  $fontColor: #606266;
  .filter_container {
    .el-radio-button__inner {
      border: 1px solid $borderColor;
      border-radius: 4px !important;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: none;
      border: 1px solid $--color-primary;
    }
    .defined {
      input {
        padding-right: 15px;
        // &::-webkit-input-placeholder {
        //   color: $fontColor;
        // }
        // &::-moz-placeholder {
        //   color: $fontColor;
        // }
        // &:-ms-input-placeholder {
        //   color: $fontColor;
        // }
      }
    }
    .el-form-item {
      margin-bottom: 0;
      &.is-success {
        .el-input__inner {
          border: 1px solid #dcdfe6;
        }
      }
      &.is-error {
        .el-input__inner {
          border: 1px solid #dcdfe6;
        }
      }
    }
  }

  // dialog 编辑
  $dialogColor: #e4e7ed;
  $formActiveColor: #61afdf;
  .el-dialog {
    border-radius: 4px;
    label {
      font-weight: 400;
    }
    .el-dialog__header {
      padding: 20px;
      border-bottom: 1px solid $dialogColor;
      .el-dialog__title {
        font-size: 16px;
      }
    }
    .el-dialog__body {
      .edit {
        margin-right: -15px;
        height: 450px;
        .el-row {
          width: 335px;
          margin: 0 auto;
        }
      }

      .el-form-item__label {
      }

      .el-input__inner:focus,
          // .el-textarea__inner:focus {
          //   border-color: $formActiveColor;
          // }
          // .el-radio__input.is-checked .el-radio__inner {
          //   border-color: $formActiveColor;
          //   background: $formActiveColor;
          // }
        .el-radio__input.is-checked + .el-radio__label {
        color: $fontColor;
      }
      .assign {
        .el-form-item {
          margin-bottom: 8px;
        }
        .el-checkbox {
          margin-left: 0;
          margin-right: 30px;
        }
      }
      .recharge {
        .el-radio {
          font-weight: 400;
          line-height: 36px;
          margin-left: 0;
          margin-right: 30px;
        }
      }
    }
    .el-dialog__footer {
      border-top: 1px solid $dialogColor;
      padding: 15px 20px;
    }
    .ex_info_title {
      margin-bottom: 10px;
    }
  }

  // dialog 详情
  $_height: calc(100vh - 95px);
  $tbColor: #ebeef5;
  .member_datail {
    left: 100%;
    transition: left 0.3s, opcity 0.3s;
    padding-left: 210px;
    .el-row,
    .el-col {
      height: 100%;
    }
    .el-dialog {
      height: 100vh;
      margin-bottom: 0;
      .el-dialog__header {
        padding-top: 5px !important;
        padding-bottom: 0px !important;
        .detail_tabs {
          float: left;
          padding-left: 38px;
          .el-tabs__header {
            margin-bottom: 0;
            .el-tabs__nav-wrap {
              .el-tabs__active-bar {
                bottom: 1px;
              }
              .el-tabs__item {
                height: 50px;
              }
              &::after {
                background-color: #fff;
              }
            }
          }
        }
        .el-dialog__headerbtn {
          top: 16px !important;
        }
      }
      .el-dialog__body {
        overflow: hidden;
        .details_table {
          height: $_height;
          overflow: hidden;
          border: 1px solid $tbColor;
          .left_title {
            padding: 10px 15px;
            line-height: 23px;
            color: $fontColor_light;
            font-weight: bold;
            background-color: #f9fafc;
            border-bottom: 1px solid $tbColor;
          }
          .left_info {
            padding: 21px 15px;
            li {
              min-height: 16px;
              margin-bottom: 20px;
              div {
                padding-left: 70px;
                .info_lable {
                  color: $fontColor_light;
                  float: left;
                  margin-left: -70px;
                }
                .info_body {
                  line-height: 16px;
                  min-height: 16px;
                }
                span {
                  color: $fontColor;
                  // padding-left: 8px;
                }
              }
            }
          }
          .details_tablelist {
            border-top: none;
            border-bottom: none;
            min-height: $_height;
            .cell {
              padding-left: 15px;
            }
            th {
              &.is-leaf {
                background-color: #f9fafc;
                &:last-of-type {
                  border-right: none;
                }
              }
            }
            .el-table__append-wrapper {
              padding-bottom: 10px;
              .count {
                padding: 10px 15px;
                span {
                  padding-right: 12px;
                  i {
                    color: $primaryColor;
                    font-style: normal;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 充值选择技师
  .select-staff {
    .el-form-item__content {
      font-size: 0;
    }
  }

  // scrollbar
  .scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

// order detail
// $_order_fontColor: #606266;
// .inner_order_detail {
//   animation-duration: 0.3s;
//   .el-dialog {
//     width: 770px;
//     min-height: 100vh;
//     float: right;
//     margin: 0;
//     transition: all 0.3s;

//     .el-dialog__header {
//       padding: 17px 20px !important;
//       .inner_title {
//         text-align: center;
//         position: relative;
//         span {
//           font-size: 18px;
//           color: #303133;
//         }
//         .inner_back {
//           left: 0;
//           top: 50% !important;
//           transform: translateY(-50%);
//         }
//       }
//     }
//     .el-dialog__body {
//       .el-col.order {
//         div {
//           color: $fontColor_light;
//           span {
//             color: $_order_fontColor;
//             padding-left: 8px;
//           }
//         }
//       }
//       .order_details_tablelist {
//         margin-top: 25px;
//         margin-bottom: 25px;
//         border: 1px solid #ebeef5;
//         border-bottom: 0;
//         th {
//           &.is-leaf {
//             background-color: #f9fafc;
//           }
//         }
//         .el-table__body {
//           .cell {
//             span {
//               &.spec {
//                 background-color: #e6a23c;
//                 border-radius: 6px;
//                 color: #fff;
//                 padding: 2px 4px;
//                 font-size: 12px;
//                 margin-left: 1px;
//               }
//             }
//           }
//         }
//       }
//       .order_amount {
//         margin-left: 15px;
//         .el-col {
//           div {
//             margin-bottom: 15px;
//           }
//           &.status_color {
//           }
//         }
//       }
//     }
//   }
//   .status-icon {
//     position: absolute;
//     right: 0;
//     width: 70px;
//   }
//   &.dialog-fade-enter-active {
//     animation-name: dialog_Show;
//   }
//   &.dialog-fade-leave-active {
//     animation-name: dialog_Hide;
//   }
//   @keyframes dialog_Show {
//     0% {
//       transform: translate3d(100%, 0, 0);
//       opacity: 0;
//     }
//     100% {
//       transform: translate3d(0, 0, 0);
//       opacity: 1;
//     }
//   }
//   @keyframes dialog_Hide {
//     0% {
//       transform: translate3d(0, 0, 0);
//       opacity: 1;
//     }
//     100% {
//       transform: translate3d(100%, 0, 0);
//       opacity: 0;
//     }
//   }
//   del {
//     font-size: 12px;
//     color: $fontColor_light;
//   }
//   .order_remark {
//     padding-left: 15px;
//     border-top: 1px solid #ebeef5;
//     color: $fontColor;
//     line-height: 40px;
//     margin: 10px 0;
//   }
// }

// 下拉文字颜色
.el-dropdown-menu--medium .el-dropdown-menu__item {
  color: $fontColor_light;
}

// 提示框警告颜色
.el-message-box__status.el-icon-warning {
  color: #f7a26c;
}

// 按钮 focus
.el-button--primary:focus {
  background: $--color-primary;
  border-color: $--color-primary;
  color: #fff;
}

.cell .el-button:focus {
  color: #606266;
  border-color: #dcdfe6;
  background-color: #fff;
}
</style>

