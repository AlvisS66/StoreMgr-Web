<template>
  <!--选择技师-->
  <el-dialog title="选择技师" class="billing-technician-dialog" width="1024px"
             :visible.sync="visible"
             @close="$emit('update:show', false)"
             :show="show">
    <div class="left-nav">
      <el-scrollbar class="scrollbar">
        <ul>
          <li :class="item.selected ? 'selected' : ''"
              v-for="(item,index) in staffList" :key="`staff-${index}`"
              @click="selectTechnician(item.staff_user_id)">
            <img v-avatar='[item.avatar_url, item.gender]' src="" alt="">
            <span class="ellipsis" :title="item.realname">{{item.realname}}</span>
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <div class="right-content">
      <el-scrollbar class="scrollbar">
        <el-table :data="selectedList" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="staff_info.realname" label="姓名" width="100"></el-table-column>
          <el-table-column prop="date" label="是否点客" width="120">
            <template slot-scope="scope">
              <el-radio v-model="scope.row.is_appoint" :label="1">是</el-radio>
              <el-radio v-model="scope.row.is_appoint" :label="0">否</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="类型" v-if="selectedList.length && selectedList[0]['labour_ratio']">
            <template slot-scope="scope">
              <div class="achievements">
                <el-checkbox v-model="scope.row.is_sale">销售业绩</el-checkbox>
                <el-checkbox v-model="scope.row.is_labour">劳动业绩</el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="业绩占比" width="120">
            <template slot-scope="scope">
              <div class="staff-input">
                <el-input v-model="scope.row.sale_ratio.sale_percent" size="mini">
                  <template slot="append">%</template>
                </el-input>
              </div>
              <div class="staff-input" v-if="scope.row.labour_ratio">
                <el-input v-model="scope.row.labour_ratio.labour_percent" size="mini">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="业绩金额" width="120">
            <template slot-scope="scope">
              <div class="staff-input">
                <el-input v-model="scope.row.sale_ratio.sale_amount" size="mini">
                  <template slot="append">元</template>
                </el-input>
              </div>
              <div class="staff-input" v-if="scope.row.labour_ratio">
                <el-input v-model="scope.row.labour_ratio.labour_amount" size="mini">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="提成比例" width="120">
            <template slot-scope="scope">
              <div class="staff-input">
                <el-input v-model="scope.row.sale_ratio.sale_percentage" size="mini">
                  <template slot="append">%</template>
                </el-input>
              </div>
              <div class="staff-input" v-if="scope.row.labour_ratio">
                <el-input v-model="scope.row.labour_ratio.labour_percentage" size="mini">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="提成金额" width="120">
            <template slot-scope="scope">
              <div class="staff-input">
                <el-input v-model="scope.row.sale_ratio.sale_percentage_amount" size="mini">
                  <template slot="append">元</template>
                </el-input>
              </div>
              <div class="staff-input" v-if="scope.row.labour_ratio">
                <el-input v-model="scope.row.labour_ratio.labour_percentage_amount" size="mini">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handelConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {staffList, calculateRatio} from '@/api/cash/billing';

  export default {
    name: "technician-dialog",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      cur: Object
    },
    data() {
      return {
        visible: this.show,
        loading: false,
        staffList: [],
        selectedList: [],
      }
    },
    computed: {},

    mounted() {
      this.getStaffList();
    },

    methods: {
      //获取技师
      getStaffList() {
        staffList().then(res => {
          let data = res.success.data;
          data.map(n => {
            n.selected = false;
            n.is_appoint = 1;
          });
          this.staffList = [...data];
          if (this.cur.staff_list.length) {
            this.cur.staff_list.map(n => {
              n.is_sale = false;
              n.is_labour = true;
            });
            this.selectedList = [...this.cur.staff_list];
            this.staffList.forEach((item, index) => {
              this.cur.staff_list.forEach(item2 => {
                if (item.staff_user_id === item2.staff_info.id) {
                  this.staffList[index].selected = true;
                  // this.selectTechnician(item.staff_user_id, true);
                }
              })
            });
          }
          this.staffList = [...this.staffList];

        })
      },

      //选择技师
      selectTechnician(id, init) {
        let cur_staff = this.staffList.find(n => n.staff_user_id === id);
        if (!init) {
          cur_staff.selected = !cur_staff.selected;
        }
        cur_staff = { ...cur_staff };
        let staff_list = this.selectedList.map(n => {
          return {
            staff_user_id: n.staff_info.id,
            is_appoint: n.is_appoint,
          }
        });
        if (cur_staff.selected) {
          staff_list.push({
            staff_user_id: cur_staff.staff_user_id,
            is_appoint: cur_staff.is_appoint,
          });
        } else {
          let index = staff_list.findIndex(n => n.staff_user_id === id);
          if (index !== -1) staff_list.splice(index, 1);
          if (!staff_list.length) {
            return this.selectedList = [];
          }
        }
        this.getCalculateRatio(staff_list).then(res => {
          res.map(n => {
            n.is_sale = false;
            n.is_labour = true;
          });
          this.selectedList = [...res];
        });
      },

      //确定
      handelConfirm() {
        this.visible = false;
        console.log('handelConfirm', this.selectedList);
        // let staff_list = this.selectedList.map(n => {
        //   n.staff_user_id = n.id;
        //   n.is_sale = Number(n.achievements.findIndex(n => n === 'is_sale') >= 0);
        //   n.is_labour = Number(n.achievements.findIndex(n => n === 'is_labour') >= 0);
        // });
        // console.log('staff_list', this.selectedList);
        this.$emit('staff', this.selectedList);
      },

      //选择技师更新提成数据
      getCalculateRatio(staff_list) {
        let [total_amount, num, item_id, member_user_id] = [
          this.cur.total_amount,
          this.cur.num,
          this.cur.id,
          this.$parent.curMember.id
        ];
        let user_tcard_item_id = 0;
        let user_advance_item_id = 0;
        if (this.cur.user_tcard_id) {
          user_tcard_item_id = this.cur.user_tcard_item_id || this.cur.id;
          item_id = 0;
        }
        if (this.cur.user_advance_id) {
          user_advance_item_id = this.cur.user_advance_item_id || this.cur.id;
          item_id = 0;
        }
        return new Promise(resolve => {
          calculateRatio({
            total_amount,
            num, member_user_id,
            item_id,
            staff_list,
            user_tcard_item_id,
            user_advance_item_id,
          }).then(res => {
            resolve(res.success.data.staff_list);
          });
        });
      },
    },

    beforeDestroy() {
      this.$parent.technician.curIndex = ''; //重置当前
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
  //技师
  .billing-technician-dialog {
    .el-dialog__body {
      overflow: hidden;
    }
    .left-nav {
      width: 135px;
      float: left;
      border: 1px solid #eceef4;
      border-right: none;
      li {
        line-height: 50px;
        height: 50px;
        cursor: pointer;
        vertical-align: middle;
        border-bottom: 1px solid #eceef4;
        display: flex;
        align-items: center;
        padding: 0 10px 0 15px;
        font-size: 14px;
        color: #606266;
        border-left: 4px solid transparent;
        &.selected {
          border-left: 4px solid #82c0f2;
          background-color: #f0f7fc;
        }
      }
      img {
        width: 34px;
        height: 34px;
        object-fit: cover;
        border-radius: 100%;
        margin-right: 10px;
      }
    }

    .right-content {
      border: 1px solid #eceef4;
      width: calc(100% - 136px);
      float: left;
    }
    .el-scrollbar {
      height: 350px;
    }

    .achievements {
      .el-checkbox {
        display: block;
        & + .el-checkbox {
          margin-left: 0;
          margin-top: 18px;
        }
      }
    }
    .staff-input {
      width: 100px;
      .el-input-group__append {
        padding: 0 10px;
      }
      &:nth-child(2) {
        padding-top: 10px;
      }
      input {
        padding: 0 10px;
      }
    }

    .el-radio + .el-radio {
      margin-left: 20px;
    }
  }

</style>