<template>
  <div class="app-container system_case_table">
    <!-- 提成方案列表 -->
    <div class="table-top-area">
      <div class="dropdown-box fl">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          @command="handleCommand"
        >
          <el-button plain>
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="del">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="fr">
        <el-input
          placeholder='提成方案'
          class="fl search"
          v-model="listQuery.search"
          prefix-icon="el-icon-search"
          clearable
          @change='handleSearch'
        ></el-input>
        <el-button
          type="primary"
          class="fl add_member"
          @click="handleAdd"
        >新增方案</el-button>

        <el-button
          plain
          class="fr"
          @click="synchrodataDialog.show=true"
        >
          同步总部数据
        </el-button>

        <el-popover
          class="fr sync_tips"
          placement="bottom"
          width="200"
          trigger="hover"
          content="同步总部提成列表。"
        >
          <i
            slot="reference"
            class="el-icon-question"
          ></i>
        </el-popover>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="caseList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="index"
        width="50"
      ></el-table-column>
      <el-table-column
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="提成方案"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="操作"
        width="300"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑-->
    <el-dialog
      :visible.sync="editDialog.show"
      class="edit-dialog"
      top="0"
      center
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <button
          type="button"
          aria-label="Close"
          class="header-close-btn"
          @click="editDialog.show = false"
        >
          <svg-icon icon-class="back" />
        </button>
        <span>编辑提成方案</span>
      </div>
      <el-scrollbar
        class="scrollbar"
        ref='scrollbar'
      >
        <el-form
          :model="editTemp"
          class="edit-form"
          label-width="80px"
          ref='editForm'
          :rules="rules"
          :show-message='true'
        >
          <el-form-item
            label="提成方案"
            prop='item.name'
            :rules='rules.name'
          >
            <el-input
              v-model="editTemp.item.name"
              class="case_name"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="适配员工"
            class="staff-form-item"
          >
            <div
              class="member_name fl"
              v-for="(item,key,index) in editTemp.staffInfo"
              :key='index'
            >
              <span class='avatar_img'>
                <img v-avatar='[item.avatar_url,item.gender]'>
              </span>
              {{item.realname}}
            </div>
            <el-button
              plain
              class="fl select_btn"
              @click="handleSelectEdit"
            >选择适配员工</el-button>
          </el-form-item>

          <!-- 商品 服务提成 -->
          <el-form-item
            label="销售提成"
            class="form_label"
            v-if='activeName==0 || activeName==1'
          >
            <!-- 销售提成 -->

            <el-table
              :data="editTemp.saleCommission"
              fit
              style="width: 100%"
              stripe
              class="commission_form"
              ref='commissionForm'
            >
              <el-table-column
                :label="editName[activeName] + '分类'"
                prop='name'
              >
              </el-table-column>
              <el-table-column label="提成类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.mode">
                    <el-option
                      v-for="(item,key,index) in ['比例提成','固定提成']"
                      :key='index'
                      :label="item"
                      :value="key"
                    ></el-option>

                  </el-select>
                </template>

              </el-table-column>
              <el-table-column
                label="会员非点客提成"
                v-if="activeName==1"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'saleCommissionData[' + scope.$index  + ']' + '.fd_member_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.fd_member_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="'会员'+ [activeName==1?'点客':''] +'提成'">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'saleCommissionData[' + scope.$index  + ']' + '.member_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.member_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="非会员非点客提成"
                v-if="activeName==1"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'saleCommissionData[' + scope.$index  + ']' + '.fd_guest_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.fd_guest_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="'非会员'+ [activeName==1?'点客':''] +'提成'">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'saleCommissionData[' + scope.$index  + ']' + '.guest_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.guest_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleSpecEdit(scope.row)">特殊提成</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-form-item>
          <!--  -->
          <el-form-item
            label="销售提成"
            class="form_label"
            v-if='activeName==2 || activeName==3'
          >
            <!-- 储值卡 计次卡 -->
            <el-table
              :data="editTemp.saleCommission"
              fit
              style="width: 100%"
              stripe
              class="commission_form"
              ref='commissionForm'
            >
              <el-table-column
                :label="editName[activeName] + '分类'"
                prop='name'
              >
              </el-table-column>
              <el-table-column label="提成类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.mode">
                    <el-option
                      v-for="(item,key,index) in ['比例提成','固定提成']"
                      :key='index'
                      :label="item"
                      :value="key"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="初次办卡提成">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'saleCommissionData[' + scope.$index  + ']' + '.guest_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.guest_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="再次办卡提成点">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'saleCommissionData[' + scope.$index  + ']' + '.member_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.member_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleSpecEdit(scope.row)">特殊提成</el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-form-item>
          <!--  -->
          <el-form-item
            label="手工提成"
            class="form_label"
            v-if='activeName==0 || activeName==1'
          >
            <!-- 手工提成 -->
            <el-table
              :data="editTemp.laborCommission"
              fit
              style="width: 100%"
              stripe
              class="commission_form"
              ref='commissionForm'
            >
              <el-table-column
                :label="editName[activeName] + '分类'"
                prop='name'
              >
              </el-table-column>
              <el-table-column label="提成类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.mode">
                    <el-option
                      v-for="(item,key,index) in ['比例提成','固定提成']"
                      :key='index'
                      :label="item"
                      :value="key"
                    ></el-option>
                  </el-select>
                </template>

              </el-table-column>
              <el-table-column
                label="会员非点客提成"
                v-if="activeName==1"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'laborCommission[' + scope.$index  + ']' + '.fd_member_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.fd_member_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="'会员'+ [activeName==1?'点客':''] +'提成'">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'laborCommission[' + scope.$index  + ']' + '.member_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.member_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="非会员非点客提成"
                v-if="activeName==1"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'laborCommission[' + scope.$index  + ']' + '.fd_guest_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.fd_guest_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="'非会员'+ [activeName==1?'点客':''] +'提成'">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'laborCommission[' + scope.$index  + ']' + '.guest_amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.guest_amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleSpecEdit(scope.row)">特殊提成</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!--  -->
          <el-form-item
            label="销售提成"
            class="form_label"
            v-if='activeName==4'
          >
            <!-- 余额 -->
            <!-- <el-form :rules="rules" :model="editTemp"  ref="innerform" :show-message='false' class="inner_form"> -->
            <el-table
              :data="this.editTemp.saleCommissionData"
              fit
              style="width: 100%"
              stripe
              class="commission_form"
              ref='commissionForm'
            >
              <el-table-column label="金额区间">
                <template slot-scope="scope">
                  <div class="commission_amount">
                    <el-input
                      v-model.number="scope.row.min_amount"
                      :disabled="true"
                    >
                    </el-input>
                    <span>
                    </span>
                    <el-form-item
                      :prop="scope.$index == editTemp.saleCommissionData.length-1?'valid':'saleCommissionData[' + scope.$index  + ']' + '.max_amount'"
                      :rules='rules.max_amount'
                    >
                      <el-input
                        v-model.number="scope.row.max_amount"
                        :disabled='scope.$index == editTemp.saleCommissionData.length-1'
                        @change='handleChangeRange(scope.row)'
                      >
                      </el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提成类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.mode">
                    <el-option
                      v-for="(item,key,index) in ['比例提成','金额提成']"
                      :key='index'
                      :label="item"
                      :value="key"
                    ></el-option>

                  </el-select>
                </template>

              </el-table-column>
              <el-table-column label="提成系数">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'saleCommissionData[' + scope.$index  + ']' + '.amount'"
                    :rules='rules.amount'
                  >
                    <el-input v-model="scope.row.amount">
                      <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                    </el-input>
                  </el-form-item>

                </template>
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click='handleDelAmountRange(scope.row)'
                    v-if="scope.$index != editTemp.saleCommissionData.length-1"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- </el-form> -->
            <el-button
              type='primary'
              class="add_btn"
              @click="handleAddAmountRange"
            >
              新增区间
            </el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleUpdateData"
        >保存</el-button>
      </div>
    </el-dialog>

    <!-- inner detail 特殊提成方案-->
    <el-dialog
      :visible.sync="editDialog.innerEditVisible"
      top='0'
      class="edit-dialog inne_order_detail"
      center
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <button
          type="button"
          aria-label="Close"
          class="header-close-btn"
          @click="editDialog.innerEditVisible = false"
        >
          <svg-icon icon-class="back" />
        </button>
        <span>特殊提成方案</span>
      </div>
      <el-scrollbar
        class="scrollbar"
        ref='scrollbar_spec'
      >
        <div>
          <el-form
            :model="specTemp"
            class="edit-form"
            ref='editSpecForm'
            :rules="rules"
            :show-message='false'
          >
            <div class="clearfix">
              <el-input
                :placeholder="editName[activeName]+'名称'"
                class="fr search"
                v-model="specTemp.filter.search"
                prefix-icon="el-icon-search"
                clearable
                @change='getSpecCommissionCaseList'
              ></el-input>
            </div>
            <div class='specTable'>
              <!-- 特殊提成 -->
              <el-table
                :data="specTemp.specCommissionList"
                fit
                style="width: 100%"
                stripe
                class="commission_form"
                ref='commissionForm'
              >
                <el-table-column
                  :label="editName[activeName] + '名称'"
                  prop='name'
                >
                </el-table-column>
                <el-table-column
                  label="产品分类"
                  prop='catename'
                >
                </el-table-column>
                <el-table-column
                  label="单价"
                  prop='price'
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.price | formatMoney}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="提成类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.mode">
                      <el-option
                        v-for="(item,key,index) in ['比例提成','固定提成']"
                        :key='index'
                        :label="item"
                        :value="key"
                      ></el-option>
                    </el-select>
                  </template>

                </el-table-column>
                <el-table-column
                  label="会员非点客提成"
                  v-if="activeName==1"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'specCommissionList[' + scope.$index  + ']' + '.fd_member_amount'"
                      :rules='rules.amount'
                    >
                      <el-input v-model="scope.row.fd_member_amount">
                        <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column :label="'会员'+ [activeName==1?'点客':''] +'提成'">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'specCommissionList[' + scope.$index  + ']' + '.member_amount'"
                      :rules='rules.amount'
                    >
                      <el-input v-model="scope.row.member_amount">
                        <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="非会员非点客提成"
                  v-if="activeName==1"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'specCommissionList[' + scope.$index  + ']' + '.fd_guest_amount'"
                      :rules='rules.amount'
                    >
                      <el-input v-model="scope.row.fd_guest_amount">
                        <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column :label="'非会员'+ [activeName==1?'点客':''] +'提成'">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'specCommissionList[' + scope.$index  + ']' + '.guest_amount'"
                      :rules='rules.amount'
                    >
                      <el-input v-model="scope.row.guest_amount">
                        <template slot="append">{{scope.row.mode==0?'%':'元'}}</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleDelSpecItem(scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleAddSpecItem"
            >
              <el-button type="primary">
                选择产品名称<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if='!specTemp.itemInfo.length'>暂无数据</el-dropdown-item>
                <el-dropdown-item
                  :command="item"
                  v-for='(item,key,index) in specTemp.itemInfo'
                  :key='index'
                >{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form>
        </div>
      </el-scrollbar>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click='handleUpdateSpecData'
        >保存</el-button>
      </div>
    </el-dialog>
    <!-- 选择员工 -->
    <el-dialog
      width="768px"
      title="选择员工"
      :visible.sync="editDialog.innerSelectEditVisible"
      class="addStaff_dialog"
    >
      <el-scrollbar
        class="scrollbar"
        ref='scrollbar_select'
      >
        <div>
          <div
            class="check_box_staff"
            v-for='(item,key,index) in staffList'
            :key='index'
          >
            <div class="check_all">
              <el-checkbox
                v-model.lazy="editTemp.checkGroupALL[key]"
                @change="handleCheckGroupALLChange(item.staff,key,$event)"
                :disabled='!item.staff.length'
              >{{item.posName}}</el-checkbox>
            </div>
            <template v-if="item.staff.length">
              <div class="check_Staff_list">
                <el-checkbox-group
                  v-model.lazy="editTemp.checkStaffs"
                  @change.native="handleCheckStaffChange(item.staff,key)"
                >
                  <el-checkbox
                    :label="staff.staff_user_id"
                    v-for='(staff,key,index) in item.staff'
                    :key='index'
                  >{{staff.realname}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>

      <!--  -->
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <div
          class="fl"
          style="vertical-align: middle;margin-top:10px;"
        >
          <el-checkbox
            v-model='editTemp.checkAll'
            @change="handleCheckAll"
          >全选</el-checkbox>
        </div>
        <el-button @click="editDialog.innerSelectEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleUpdateStaffs"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- dialog 新增方案 -->
    <el-dialog
      width="420px"
      title="新增方案"
      :visible.sync="editDialog.createEditVisible"
      class="create_dialog"
    >
      <div>
        <!-- 新增 -->
        <el-form
          label-position="right"
          label-width="80px"
          :show-message='true'
          :rules="rules"
          :model="createTemp"
          ref="createForm"
        >
          <el-form-item
            label="提成方案"
            prop='name'
          >
            <el-input v-model="createTemp.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--  -->
      <div
        slot="footer"
        class="dialog-footer"
        style="vertical-align: middle;"
      >
        <el-button
          @click="editDialog.createEditVisible = false"
          size='mini'
        >取 消</el-button>
        <el-button
          type="primary"
          size='mini'
          @click="createData"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <pagination
      :layout='layout'
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      class='pagination'
      @pagination="getCommissionCaseList"
    />
    <!-- 同步数据 dialog -->
    <synchrodata-commission-dialog
      :visible.sync='synchrodataDialog.show'
      :activeName='activeName'
    ></synchrodata-commission-dialog>
  </div>

</template>

<script>
import Pagination from "@/components/Pagination";
import synchrodataCommissionDialog from "@/views/system/commission/components/synchrodata-commission-dialog";
import {
  commisionList,
  createCommision,
  deleteCommision,
  getEditCommisionInfo,
  editCommision,
  editRechargeCommision,
  specCommisionList,
  editSpecCommisionList,
  selectUser
} from "@/api/system/commission";
import { calc } from "@/utils";
import { Message } from "element-ui";

export default {
  name: "case_table",
  components: {
    Pagination,
    synchrodataCommissionDialog
  },
  props: ["activeName"],
  data() {
    let validNumber = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        console.log(value);
        let reg = /^(\-|\+)?\d+(\.\d+)?$/;
        if (!reg.test(value)) {
          Message.error('提成格式不正确')
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    let validCode = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^[0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    return {
      listLoading: true,
      caseList: [],
      //
      multipleSelection: [],
      // 校验
      rules: {
        name: [{ required: true, trigger: "blur", message:"提成方案不能为空"}],
        max_amount: [
          { required: true, trigger: "blur" },
          { validator: validCode, trigger: "blur" }
        ],
        amount: [
          { required: true, trigger: "blur" },
          { validator: validNumber, trigger: "blur" }
        ]
      },
      // 同步数据 dialog
      synchrodataDialog: {
        show: false
      },
      // dialog
      editDialog: {
        show: false,
        innerEditVisible: false,
        innerSelectEditVisible: false,
        createEditVisible: false
      },
      // 新增
      createTemp: {
        name: undefined,
        type: this.activeName
      },
      // 编辑
      // 员工列表
      staffList: [],
      editTemp: {
        valid: 0,
        id: undefined, // 方案 id
        staffInfo: [], // 员工信息
        cateData: [], // 分类
        checkAll: undefined, // 全选
        checkGroupALL: {}, // 全选分组
        checkStaffs: [], // 选择员工
        staffList: [], // 员工列表
        saleCommission: [], // 销售提成
        laborCommission: [], // 劳动提成
        saleCommissionData: [], // 余额提成
        commissionForm: [],
        item: {
          name: ""
        }
      },
      specTemp: {
        type: undefined,
        filter: {
          scheme_id: undefined,
          category_id: undefined,
          search: undefined,
          page: 1,
          limit: 10
        },
        specList: [],
        itemInfo: [],
        itemInfo_g: [],
        specCommissionList: []
      },
      //
      editName: ["商品", "服务", "计次卡", "储值卡", "金额区间"],
      //
      listQuery: {
        type: this.activeName,
        search: undefined,
        page: 1,
        limit: 10
      },
      total: 0,
      layout: "sizes, jumper, next, pager, prev, total"
    };
  },
  methods: {
    // filter
    handleSearch() {
      this.listQuery.page = 1;
      this.getCommissionCaseList();
    },

    // 批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 重置新增数据
    resetCreateTemp() {
      this.createTemp = {
        name: undefined,
        type: this.activeName
      };
    },

    // 重置编辑数据
    resetEditTemp() {
      this.editTemp = {
        valid: 0, //
        id: undefined,
        staffInfo: [],
        cateData: [],
        checkAll: undefined,
        checkGroupALL: {},
        checkStaffs: [],
        staffList: [],
        saleCommission: [],
        laborCommission: [],
        saleCommissionData: [],
        commissionForm: [],
        item: {
          name: ""
        }
      };
    },

    // 重置特殊提成编辑数据
    resetEditSpecTemp() {
      this.specTemp = {
        type: undefined,
        filter: {
          scheme_id: undefined,
          category_id: undefined,
          search: undefined,
          page: 1,
          limit: 10
        },
        specList: [],
        itemInfo: [],
        itemInfo_g: [],
        specCommissionList: []
      };
    },

    // 编辑提成数据处理
    resetComissionData(item) {
      if (this.activeName == 4) {
        let { amount, id, min_amount, max_amount, mode } = item;
        if (mode == 0) {
          // amount = calc(amount)
          //   .multipliedBy(100)
          //   .toNumber();
        }
        return {
          amount,
          id,
          min_amount,
          max_amount,
          mode
        };
      }
      let {
        fd_guest_amount,
        fd_member_amount,
        guest_amount,
        member_amount,
        mode,
        category_id,
        id,
        item_id,
        scheme_id,
        type
      } = item;
      if (mode == 0) {
        // if (this.activeName == 1) {
        //   fd_guest_amount = calc(fd_guest_amount)
        //     .multipliedBy(100)
        //     .toNumber();
        //   fd_member_amount = calc(fd_member_amount)
        //     .multipliedBy(100)
        //     .toNumber();
        // }
        // guest_amount = calc(guest_amount)
        //   .multipliedBy(100)
        //   .toNumber();
        // member_amount = calc(member_amount)
        //   .multipliedBy(100)
        //   .toNumber();
      }
      // if (this.activeName == 1) {
      return {
        fd_guest_amount,
        fd_member_amount,
        guest_amount,
        member_amount,
        mode,
        category_id,
        id,
        item_id,
        scheme_id,
        type
      };
      // } else {
      //   return {
      //     guest_amount,
      //     member_amount,
      //     mode,
      //     category_id,
      //     id,
      //     item_id,
      //     scheme_id,
      //     type
      //   };
      // }
    },

    resetCreateComissionData() {
      let data;
      // if (this.activeName == 1) {
      data = {
        fd_guest_amount: 0,
        fd_member_amount: 0,
        guest_amount: 0,
        member_amount: 0
      };
      // } else {
      //   data = {
      //     guest_amount: 0,
      //     member_amount: 0
      //   };
      // }
      return data;
    },

    formatComissionData(item) {
      if (this.activeName == 4) {
        let { amount, mode } = item;
        // if (mode == 0) {
        //   amount = calc(amount)
        //     .dividedBy(100)
        //     .toFixed(2);
        // }
        return {
          amount
        };
      }
      let {
        fd_guest_amount,
        fd_member_amount,
        guest_amount,
        member_amount,
        mode
      } = item;
      if (mode == 0) {
        // if (this.activeName == 1) {
        //   fd_guest_amount = calc(fd_guest_amount)
        //     .dividedBy(100)
        //     .toFixed(2);
        //   fd_member_amount = calc(fd_member_amount)
        //     .dividedBy(100)
        //     .toFixed(2);
        // }
        // guest_amount = calc(guest_amount)
        //   .dividedBy(100)
        //   .toFixed(2);
        // member_amount = calc(member_amount)
        //   .dividedBy(100)
        //   .toFixed(2);
      }
      // if (this.activeName == 1) {
      return {
        fd_guest_amount,
        fd_member_amount,
        guest_amount,
        member_amount
      };
      // } else {
      //   return {
      //     guest_amount,
      //     member_amount,
      //   };
      // }
    },

    // 批量删除
    handleCommand(command) {
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择提成方案");
        return;
      }
      this.$confirm("确认删除此方案？?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.handledelCase();
        })
        .catch(action => {});
    },

    handledelCase() {
      console.log(this.multipleSelection);
      let arr = [];
      this.multipleSelection.forEach((v, k) => {
        arr.push(v.id);
      });
      let ids = arr.join(",");
      deleteCommision(ids)
        .then(res => {
          this.getCommissionCaseList();
          this.$message.success("删除成功");
        })
        .catch(err => {
          console.log(err);
          // this.$message.error("删除失败");
        });
    },

    // 删除方案
    handleDelete(row) {
      this.$confirm("确认删除此方案？?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let { id } = row;
          deleteCommision(id)
            .then(res => {
              this.getCommissionCaseList();
              this.$message.success("删除成功");
            })
            .catch(err => {
              console.log(err);
              // this.$message.error("删除失败");
            });
        })
        .catch(action => {});
    },

    // dialog 新增方案
    handleAdd() {
      this.resetCreateTemp();
      this.editDialog.createEditVisible = true;
      this.$nextTick(() => {
        this.$refs["createForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          createCommision(this.createTemp)
            .then(res => {
              this.getCommissionCaseList();
              this.editDialog.createEditVisible = false;
              this.$message.success("新建成功");
            })
            .catch(err => {
              console.log(err);
              // this.$message.error("新建失败");
            });
        }
      });
    },

    // dialog 提成编辑
    handleEdit(row) {
      console.log("提成方案", row);
      this.resetEditTemp();
      let { id } = row,
        scheme_id = id;
      getEditCommisionInfo(id)
        .then(res => {
          let data = res.success.data;
          console.log("提成编辑", data);
          let staffInfo = [],
            saleCommission = [],
            laborCommission = [],
            { cateData } = data,
            { name, user_per, per_cate, per_recharge } = data.perData;
          if (user_per.length) {
            user_per.forEach(item => {
              let { id, realname, avatar_url } = item.user;
              staffInfo.push({
                staff_user_id: id,
                realname,
                avatar_url
              });
            });
          }
          if (this.activeName == 4) {
            // 余额提成
            if (per_recharge.length) {
              per_recharge.forEach(item => {
                let obj = this.resetComissionData(item);
                saleCommission.push(obj);
              });
              let index = saleCommission.length - 1;
              saleCommission[index].max_amount = "无限";
            }
          } else {
            if (per_cate.length) {
              let saleData = per_cate[0],
                laborData = per_cate[1];
              cateData.forEach((item, key) => {
                let { name, id } = item;
                // id = 12;
                if (saleData[id]) {
                  let obj = this.resetComissionData(saleData[id]),
                    obj2 = this.resetComissionData(laborData[id]);
                  let sale = Object.assign({}, obj, {
                      name
                    }),
                    labor = Object.assign({}, obj2, {
                      name
                    });
                  saleCommission.push(sale);
                  laborCommission.push(labor);
                }
              });
            } else {
              if (cateData) {
                cateData.forEach((item, key) => {
                  let { name, id } = item,
                    obj = this.resetCreateComissionData();
                  let sale = Object.assign(
                    {},
                    {
                      category_id: id,
                      scheme_id,
                      name,
                      mode: 0,
                      type: 0
                    },
                    obj
                  );
                  let labor = Object.assign({}, sale, {
                    type: 1
                  });
                  saleCommission.push(sale);
                  laborCommission.push(labor);
                });
              }
            }
          }

          this.editTemp = Object.assign({}, this.editTemp, {
            id,
            staffInfo,
            saleCommission,
            laborCommission,
            item: {
              name
            }
          });
          console.log("提成Temp", this.editTemp);
          this.editDialog.show = true;
          this.$nextTick(() => {
            this.$refs["scrollbar"].wrap.scrollTop = 0;
            this.$refs["editForm"].clearValidate();
          });
        })
        .catch(res => {
          console.log(err);
        });
    },

    // 提成保存
    handleUpdateData() {
      console.log("提成editTemp", this.editTemp);

      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let user_ids = [],
            per_cate = [],
            { id, staffInfo, saleCommission, laborCommission } = this.editTemp,
            commissionList = [...saleCommission, ...laborCommission];
          staffInfo.forEach(item => {
            user_ids.push(item.staff_user_id);
          });
          user_ids = user_ids.join(",");
          commissionList.forEach(item => {
            let formtData = this.formatComissionData(item);
            let data = Object.assign({}, item, formtData);
            per_cate.push(data);
          });
          if (this.activeName == 4) {
            // 余额提成
            let index = per_cate.length - 1;
            per_cate[index].max_amount = 0;
            this.editTemp.item = Object.assign({}, this.editTemp.item, {
              user_ids,
              rechargeData: per_cate
            });
            console.log(this.editTemp.item);
            editRechargeCommision(id, this.editTemp.item)
              .then(res => {
                this.editDialog.show = false;
                this.getCommissionCaseList();
                this.$message.success("保存成功");
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.editTemp.item = Object.assign({}, this.editTemp.item, {
              user_ids,
              per_cate
            });
            console.log(this.editTemp.item);
            editCommision(id, this.editTemp.item)
              .then(res => {
                this.editDialog.show = false;
                this.getCommissionCaseList();
                this.$message.success("保存成功");
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
    },

    // inner dialog 特殊提成
    handleSpecEdit(row) {
      this.resetEditSpecTemp();
      let { scheme_id, category_id, type } = row;
      this.specTemp.type = type;
      this.specTemp.filter = Object.assign({}, this.specTemp.filter, {
        scheme_id,
        category_id,
        type
      });
      console.log("特殊提成specTemp", this.specTemp);
      this.getSpecCommissionCaseList().then(res => {
        // console.log(res);
        this.editDialog.innerEditVisible = true;
        this.$nextTick(() => {
          this.$refs["scrollbar_spec"].wrap.scrollTop = 0;
          this.$refs["editSpecForm"].clearValidate();
        });
      });
    },

    // 添加特殊提成
    handleAddSpecItem(command) {
      if (command) {
        console.log(command);
        let { catename, id, name, price } = command,
          { type } = this.specTemp,
          { scheme_id, category_id } = this.specTemp.filter,
          obj = this.resetCreateComissionData();
        let data = Object.assign(
          {},
          {
            name,
            catename,
            price,
            item_id: id,
            scheme_id,
            category_id,
            mode: 0,
            type
          },
          obj
        );
        let index = this.specTemp.specList.length;
        //
        let i = this.specTemp.specList.findIndex(item => {
          return item.item_id == command.id && item.hasOwnProperty("is_del");
        });
        if (i > 0) {
          index = i;
          data = Object.assign(
            {},
            { id: this.specTemp.specList[index].id },
            data
          ); // 合并 id
        } // 添加 is_del == 1 的产品
        this.specTemp.specList.splice(index, 1, data);
        // 添加后删除产品列表数据
        let index_add = this.specTemp.itemInfo.findIndex(item => {
          return item.id == command.id;
        });
        this.specTemp.itemInfo.splice(index_add, 1);
        console.log("特殊提成temp", this.specTemp);
      }
    },

    // 删除特殊折扣
    handleDelSpecItem(row) {
      console.log(row);
      let { item_id } = row,
        item_g = this.specTemp.itemInfo_g.find(item => {
          return item.id == item_id;
        }),
        length = this.specTemp.itemInfo.length,
        status = row.hasOwnProperty("id"),
        index = this.specTemp.specList.indexOf(row);
      console.log(item_g);
      this.specTemp.itemInfo.splice(length, 1, item_g);
      if (status) {
        let item = Object.assign({}, row, {
          is_del: 1
        });
        this.specTemp.specList.splice(index, 1, item);
      } else {
        this.specTemp.specList.splice(index, 1);
      }
      console.log("特殊折扣temp", this.specTemp);
    },

    // 特殊提成保存
    handleUpdateSpecData() {
      this.$refs["editSpecForm"].validate(valid => {
        if (valid) {
          let specdata = [],
            { scheme_id, category_id } = this.specTemp.filter;
          this.specTemp.specList.forEach(item => {
            let formtData = this.formatComissionData(item);
            let data = Object.assign({}, item, formtData);
            specdata.push(data);
          });
          editSpecCommisionList({ scheme_id, category_id, specdata })
            .then(res => {
              this.editDialog.innerEditVisible = false;
              this.$message.success("保存成功");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // inner dialog 选择员工
    handleSelectEdit() {
      selectUser()
        .then(res => {
          let data = res.success.data;
          console.log("选择员工", data);
          this.staffList = data;
          let checkGroupALL = {};
          this.editTemp.checkStaffs = [];
          this.editTemp.staffInfo.forEach(item => {
            this.editTemp.checkStaffs.push(item.staff_user_id);
          });
          this.staffList.forEach((val, k) => {
            if (val.staff.length) {
              let status = val.staff.every(v => {
                return this.editTemp.checkStaffs.includes(v.staff_user_id);
              });
              checkGroupALL[k] = status;
            }
          });
          this.editTemp.checkGroupALL = checkGroupALL;
          this.changeCheckAllStatus(checkGroupALL);
          this.editDialog.innerSelectEditVisible = true;
          this.$nextTick(() => {
            this.$refs["scrollbar_select"].wrap.scrollTop = 0;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 全选分组
    handleCheckGroupALLChange(item, index, val) {
      let id = [];
      item.forEach(v => {
        id.push(v.staff_user_id);
      });
      if (val) {
        id.forEach(v => {
          let i = this.editTemp.checkStaffs.indexOf(v);
          if (i < 0) {
            let length = this.editTemp.checkStaffs.length;
            this.editTemp.checkStaffs.splice(length, 1, v);
          }
        });
      } else {
        id.forEach(v => {
          let i = this.editTemp.checkStaffs.indexOf(v);
          if (i >= 0) {
            this.editTemp.checkStaffs.splice(i, 1);
          }
        });
      }
      console.log(val);
      console.log(this.editTemp.checkStaffs);
    },

    // 全选
    handleCheckAll(val) {
      console.log(this.editTemp.checkAll);
      if (val) {
        let checkStaffs = [];
        this.staffList.forEach((item, key) => {
          item.staff.forEach((v, k) => {
            let { staff_user_id } = v;
            checkStaffs.push(staff_user_id);
          });
        });
        this.editTemp.checkStaffs = checkStaffs;
        this.changeCheckStatus();
      } else {
        this.editTemp.checkStaffs.splice(0);
        this.changeCheckStatus();
      }
    },

    handleCheckStaffChange(item, index) {
      let status = item.every(v => {
        return this.editTemp.checkStaffs.includes(v.staff_user_id);
      });
      this.editTemp.checkGroupALL[index] = status;
      console.log(this.editTemp.checkStaffs);
    },

    // checkBox 状态
    changeCheckStatus() {
      this.staffList.forEach((item, key) => {
        if (item.staff.length) this.handleCheckStaffChange(item.staff, key);
      });
    },

    // checkAll 状态
    changeCheckAllStatus(val) {
      let status = Object.keys(val).every(v => {
        return val[v] == true;
      });
      this.editTemp.checkAll = status;
    },

    // 选择员工保存
    handleUpdateStaffs() {
      let staff = [];
      this.editTemp.checkStaffs.forEach(item => {
        this.staffList.forEach((v, key) => {
          let val = v.staff.filter(val => {
            return val.staff_user_id == item;
          });
          if (val.length) {
            staff = [...staff, ...val];
          }
        });
      });
      this.editTemp.staffInfo = [...staff];
      console.log(this.editTemp.staffInfo);
      this.$nextTick(() => {
        this.editDialog.innerSelectEditVisible = false;
      });
    },

    // 余额销售提成 删除
    handleDelAmountRange(row) {
      console.log(row);
      let index = this.editTemp.saleCommission.indexOf(row);
      let { id, min_amount } = row;
      if (!id) {
        this.editTemp.saleCommission.splice(index, 1);
        try {
          this.editTemp.saleCommission.forEach((item, key) => {
            if (key >= index && !item.hasOwnProperty("is_del")) {
              this.editTemp.saleCommission[key].min_amount = min_amount;
              throw new Error("ending");
            }
          });
        } catch (error) {
          console.log(this.editTemp.saleCommission);
        }
      } else {
        let item = Object.assign({}, row, {
          is_del: 1
        });
        this.editTemp.saleCommission.splice(index, 1, item);
        try {
          this.editTemp.saleCommission.forEach((item, key) => {
            if (key > index && !item.hasOwnProperty("is_del")) {
              this.editTemp.saleCommission[key].min_amount = min_amount;
              throw new Error("ending");
            }
          });
        } catch (error) {
          console.log(this.editTemp.saleCommission);
        }
      }
    },

    // 金额区间修改
    handleChangeRange(row) {
      let index = this.editTemp.saleCommission.indexOf(row),
        { max_amount, min_amount } = row;
      if (max_amount <= min_amount) {
        this.$message.warning("提成点格式错误");
        return;
      }
      let amount = Number(max_amount),
        length = this.editTemp.saleCommission.length - 1;
      this.editTemp.saleCommission.map((item, key) => {
        if (key > index && !item.hasOwnProperty("is_del")) {
          item.min_amount = amount + 1;
          if (!(key == length)) {
            item.max_amount = amount + 1000;
            amount = item.max_amount;
            return;
          } else {
            item.max_amount = "无限";
            return;
          }
        }
      });
    },

    // 新增区间
    handleAddAmountRange() {
      let index = this.editTemp.saleCommission.length;
      if (!index) {
        // this.editTemp.saleCommission.splice(index, 1, {
        //   amount: 0,
        //   mode: 0,
        //   min_amount: 0,
        //   max_amount: "无限"
        // });
        this.$set(this.editTemp.saleCommission, index, {
          amount: 0,
          mode: 0,
          min_amount: 0,
          max_amount: "无限"
        });
        return;
      }
      let { amount, min_amount } = this.editTemp.saleCommission[index - 1];
      let max_amount = 1000 * (parseInt(Number(min_amount) / 1000) + 1);
      this.editTemp.saleCommission[index - 1].max_amount = max_amount;
      // this.editTemp.saleCommission.splice(index, 1, {
      //   amount: 0,
      //   mode: 0,
      //   min_amount: max_amount + 1,
      //   max_amount: "无限"
      // });
      this.$set(this.editTemp.saleCommission, index, {
        amount: 0,
        mode: 0,
        min_amount: max_amount + 1,
        max_amount: "无限"
      });
      console.log(this.editTemp.saleCommission);
    },

    // 提成方案列表
    getCommissionCaseList() {
      commisionList(this.listQuery)
        .then(res => {
          let data = res.success.data;
          console.log("提成方案", data);
          let { info } = data;
          this.caseList = [...info.data];
          this.total = info.total;
          this.$nextTick(() => {
            this.listLoading = false;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 特殊提成列表
    getSpecCommissionCaseList() {
      return specCommisionList(this.specTemp.filter)
        .then(res => {
          let data = res.success.data;
          console.log("特殊提成", data);
          let { info, itemInfo } = data,
            itemInfo_g = [...itemInfo],
            list = info.data,
            specList = [],
            // 去除已添加产品
            item_ids = list.map(item => {
              return item.item_id;
            });
          console.log("item_ids", item_ids);
          item_ids.forEach(item_id => {
            let index = itemInfo.findIndex(item => {
              return item.id == item_id;
            });
            itemInfo.splice(index, 1);
          });
          //
          list.forEach((item, key) => {
            let { price, name, catename } = item,
              listInfo = Object.assign(
                {},
                { price, name, catename },
                this.resetComissionData(item)
              );
            specList.push(listInfo);
          });
          this.specTemp = Object.assign({}, this.specTemp, {
            specList,
            itemInfo,
            itemInfo_g
          });
          console.log(this.specTemp);
          return data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    saleCommissionData() {
      return this.editTemp.saleCommission.filter(item => {
        return (
          (item.hasOwnProperty("id") && item.is_del != 1) ||
          !item.hasOwnProperty("id")
        );
      });
    }, // 过滤余额提成列表

    checkGroupALLStatus() {
      return this.editTemp.checkGroupALL;
    },

    specCommissionList() {
      return this.specTemp.specList.filter(item => {
        return !item.hasOwnProperty("is_del");
      });
    }, // 过滤 is_del == 1 的提成
    syncDialogShow() {
      return this.synchrodataDialog.show;
    }
  },
  watch: {
    saleCommissionData(val, oldVal) {
      this.editTemp.saleCommissionData = val;
      console.log(val);
    },

    checkGroupALLStatus: {
      handler(val, oldVal) {
        this.changeCheckAllStatus(val);
      },
      deep: true
    },
    specCommissionList(val, oldVal) {
      this.specTemp.specCommissionList = val;
    },
    syncDialogShow(val, oldval) {
      if (!val) this.getCommissionCaseList();
    }
  },
  created() {
    this.getCommissionCaseList();
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-container {
  padding: 0;
}
// 员工头像
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
</style>

<style lang="scss">
@import "~@/styles/variables.scss";
$dialogColor: #e4e7ed;
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;
.system_case_table {
  .table-top-area {
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
    .search {
      width: 240px;
      margin-right: 20px;
    }
    .el-dropdown {
      .el-button {
        padding: 10px 10px;
      }
    }
  }
  // dialog
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
    .el-dialog__footer {
      border-top: 1px solid $dialogColor;
      padding: 15px 20px;
    }
  }
  // dialog 新增
  .create_dialog {
    .el-dialog__header {
      border-bottom: none;
    }
    .el-dialog__footer {
      border-top: none;
    }
    .el-form-item {
      margin: 0;
    }
    .el-input {
      width: 220px;
    }
  }
  // dialog 编辑
  $dialogW: calc(100% - 210px);
  .edit-dialog {
    margin: 0;
    overflow: hidden;
    // width: $dialogW;
    width: 100%;
    left: 0;
    .el-dialog {
      width: $dialogW;
      height: 100vh;
      margin: 0;
      transition: all 0.3s;
      animation-duration: 0.3s;
      float: right;
      border-radius: 4px;
      label {
        font-weight: 400;
      }
    }
    &.dialog-fade-enter-active {
      .el-dialog {
        animation-name: dialogShow;
      }
    }
    &.dialog-fade-leave-active {
      .el-dialog {
        animation-name: dialogHide;
      }
    }

    .dialog-title {
      font-size: 18px;
      color: #303133;
      position: relative;
      line-height: 24px;
    }

    .header-close-btn {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
      > svg {
        width: 24px;
        height: 24px;
        fill: #9b9b9b;
      }
    }
    .el-dialog__headerbtn {
      display: none;
    }

    .el-dialog__body {
      height: calc(100vh - 122px);
    }
    .el-dialog__header {
    }
    .el-dialog__footer {
      text-align: left;
    }

    //
    .edit-form {
      color: #606266;
    }

    .staff-form-item {
      li {
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
    .case_name {
      width: 220px;
    }
    .member_name {
      margin-right: 20px;
    }
    .commission_form {
      .el-table {
      }
      .el-table__header-wrapper {
        border-top: solid 1px #eaeefb;
        th {
          padding: 0;
          line-height: 47px;
          font-weight: 400;
        }
      }
      .el-input {
        width: 110px;
      }
      .el-input__inner {
        width: 100%;
      }
      .el-input-group__append {
        width: 34px;
        background-color: #f6f7fb;
        padding: 0;
        text-align: center;
      }
    }
    .commission_amount {
      // line-height: 36px;
      span {
        margin: 0 10px;
        display: inline-block;
        width: 6px;
        height: 1px;
        background-color: $fontColor;
        vertical-align: middle;
      }
    }
    .add_btn {
      margin-top: 20px;
    }
    .form_label {
      label {
        line-height: 47px;
      }
    }
  }
  // dialog 特殊提成
  .inne_order_detail {
    .search {
      width: 240px;
    }
  }
  .specTable {
    margin: 10px 0;
  }
  // 选择员工
  .addStaff_dialog {
    .check_box_staff {
      border-radius: 4px;
      border: solid 1px $tbColor;
      margin-bottom: 15px;
    }
    .check_all {
      padding: 13px 15px;
      background-color: #f5f7fa;
      border-bottom: solid 1px $tbColor;
      .el-checkbox__label {
        font-size: 16px;
        color: #303133;
      }
    }
    .check_Staff_list {
      padding: 13px 15px;
    }
    .scrollbar {
      height: 360px;
    }
    .el-checkbox {
      margin-right: 30px;
      & + .el-checkbox {
        margin-left: 0;
      }
    }
  }
  @keyframes dialogShow {
    0% {
      transform: translate3d(100%, 0, 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes dialogHide {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    100% {
      transform: translate3d(100%, 0, 0);
      opacity: 0;
    }
  }

  // inner_form
  .commission_form {
    .el-form-item {
      display: inline-block;
      margin-bottom: 0;
    }
  }
  // scrollbar
  .scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
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

  .add_member {
    margin-right: 20px;
  }
}
// 提示框警告颜色
.el-message-box__status.el-icon-warning {
  color: #f7a26c;
}
</style>

