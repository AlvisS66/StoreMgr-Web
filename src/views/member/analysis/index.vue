<template>
  <div class="app-container member_analysis">
    <!--筛选条件-->
    <date-query
      @dateQuery="getDateQuery($event)"
      v-show="activeName=='birthdayTable'"
    ></date-query>

    <el-card
      shadow="always"
      class="filter-box mb-15"
    >
      <div class="filter_container">
        <div class="header">
          <el-row>
            <el-tabs
              v-model="activeName"
              class="fl"
            >
              <el-tab-pane
                v-for='(item,key,index) in tabList'
                :key='index'
                :label="item.label"
                :name="item.name"
              ></el-tab-pane>

            </el-tabs>
            <el-button
              plain
              class="fr"
              @click="show = !show"
            >{{toggleCheck}}</el-button>
            <el-input
              placeholder='会员姓名、卡号或手机号'
              class="fr search"
              v-model="listQuery.search"
              prefix-icon="el-icon-search"
              @change="handleSearch"
              clearable
            >
            </el-input>
          </el-row>
        </div>
        <el-collapse-transition>
          <div
            class="body"
            v-show='show'
          >
            <div>
              <el-form
                label-position="right"
                :model="filterList"
                ref="filterForm"
                :rules="rules"
                :show-message='false'
              >
                <el-row>
                  <el-form-item>
                    <span class="filter">会员等级</span>
                    <el-radio-group
                      v-model="filterList.rank_id"
                      @change='handleFilter'
                    >
                      <el-radio-button label="">全部</el-radio-button>
                      <el-radio-button
                        v-for='(item,key,index) in rankList'
                        :key='index'
                        :label="item.id"
                      >{{item.name}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-row>

                <el-row v-show="activeName=='memberTable'">
                  <el-form-item
                    prop='sleep_days'
                    :rules='rules.filter'
                  >
                    <span class='filter'>休眠天数</span>
                    <div class="fl option">
                      <span>超过</span>
                      <el-input
                        placeholder=''
                        class="fl"
                        v-model="filterList.sleep_days"
                        @change='handleFilter'
                        clearable
                      >
                      </el-input>
                      <span>天</span>
                    </div>
                  </el-form-item>
                </el-row>

                <el-row v-show="activeName=='cardTable'">
                  <el-form-item
                    prop='tcard_days'
                    :rules='rules.filter'
                  >
                    <span class="filter">计次卡过期</span>
                    <div class="fl option">
                      <span>卡片</span>
                      <el-input
                        placeholder=''
                        class="fl"
                        v-model="filterList.tcard_days"
                        @change='handleFilter'
                        clearable
                      >
                      </el-input>
                      <span>天内过期提醒</span>
                    </div>
                  </el-form-item>
                </el-row>

                <el-row v-show="activeName=='storeCardTable'">
                  <el-form-item
                    prop='ppcard_days'
                    :rules='rules.filter'
                  >
                    <span class="filter">储值卡过期</span>
                    <div class="fl option">
                      <span>卡片</span>
                      <el-input
                        placeholder=''
                        class="fl"
                        v-model="filterList.ppcard_days"
                        @change='handleFilter'
                        clearable
                      >
                      </el-input>
                      <span>天内过期提醒</span>
                    </div>
                  </el-form-item>
                </el-row>

                <el-row v-show="activeName=='balanceTable'">
                  <el-form-item
                    prop='balance'
                    :rules='rules.filter'
                  >
                    <span class="filter">会员余额</span>
                    <div class="fl option">
                      <span>低于</span>
                      <el-input
                        placeholder=''
                        class="fl"
                        v-model="filterList.balance"
                        @change='handleFilter'
                        clearable
                      >
                      </el-input>
                      <span>元时提醒</span>
                    </div>
                  </el-form-item>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <component
        :is="activeName"
        :activeName='activeName'
        :listLoading='listLoading'
        :value='dataList'
      ></component>
      <pagination
        :layout='layout'
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        class='pagination'
        @pagination="getAnalysisList"
      />
    </el-card>
  </div>
</template>

<script>
const moment = require("moment");
import { Message } from "element-ui";
import Pagination from "@/components/Pagination";
import memberTable from "@/views/member/analysis/components/member";
import cardTable from "@/views/member/analysis/components/card";
import storeCardTable from "@/views/member/analysis/components/storecard";
import birthdayTable from "@/views/member/analysis/components/birthday";
import balanceTable from "@/views/member/analysis/components/balance";
import DateQuery from "@/components/MyDateQuery";
import { rankList, analysisList } from "@/api/member";

export default {
  name: "Analysis",
  components: {
    Pagination,
    memberTable,
    cardTable,
    storeCardTable,
    birthdayTable,
    balanceTable,
    DateQuery
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
    return {
      tabList: [
        {
          name: "memberTable",
          label: "睡眠会员"
        },
        {
          name: "cardTable",
          label: "计次卡即将过期"
        },
        {
          name: "storeCardTable",
          label: "储值卡即将过期"
        },
        {
          name: "balanceTable",
          label: "会员余额不足"
        },
        {
          name: "birthdayTable",
          label: "会员生日"
        }
      ],
      // 校验
      rules: {
        filter: [{ validator: validFilter, trigger: "blur" }]
      },
      show: false,
      activeName: "memberTable",
      // filter
      filterList: {
        rank_id: "",
        sleep_days: 30,
        tcard_days: 30,
        ppcard_days: 30,
        balance: 500,
        start_time: moment().format("YYYY-MM-DD"),
        end_time: moment().format("YYYY-MM-DD")
      },
      // table
      listLoading: true,
      rankList: [],
      memberList: [],
      cardList: [],
      storeCardList: [],
      balanceList: [],
      birthdayList: [],

      // 分页
      listQuery: {
        type: "sleep",
        page: 1,
        limit: 10,
        search: ""
      },
      total: 0,
      layout: " sizes, jumper, next, pager, prev, total"
    };
  },
  methods: {
    //
    getDateQuery(date) {
      console.log("date", date);
      [this.filterList.start_time, this.filterList.end_time] = date;
      this.handleSearch();
    },

    // 搜索
    handleSearch() {
      this.$refs["filterForm"].validate(valid => {
        if (valid) {
          this.listQuery.page = 1;
          this.getAnalysisList();
        }
      });
    },
    handleFilter() {
      this.handleSearch();
    },

    // 获取等级列表
    getRankList() {
      rankList()
        .then(res => {
          let data = res.success.data;
          this.rankList = [...data];
        })
        .catch(err => {
          console.log(err);
        });
    },

    getAnalysisList() {
      let { page, limit, search } = this.listQuery;
      let { rank_id } = this.filterList;
      this.listQuery = Object.assign({}, { page, limit, search, rank_id });
      switch (this.activeName) {
        case "memberTable":
          let { sleep_days } = this.filterList;
          this.listQuery = Object.assign({}, this.listQuery, {
            sleep_days,
            type: "sleep"
          });
          break;
        case "cardTable":
          let { tcard_days } = this.filterList;
          this.listQuery = Object.assign({}, this.listQuery, {
            tcard_days,
            type: "tcard"
          });
          break;
        case "storeCardTable":
          let { ppcard_days } = this.filterList;
          this.listQuery = Object.assign({}, this.listQuery, {
            ppcard_days,
            type: "ppcard"
          });
          break;
        case "balanceTable":
          let { balance } = this.filterList;
          this.listQuery = Object.assign({}, this.listQuery, {
            balance,
            type: "balance"
          });
          break;
        case "birthdayTable":
          let { start_time, end_time } = this.filterList;
          this.listQuery = Object.assign({}, this.listQuery, {
            type: "birthday",
            start_time,
            end_time
          });
          console.log("birthdayTable");
          break;
      }

      analysisList(this.listQuery)
        .then(res => {
          let data = res.success.data;
          console.log(this.activeName, data);
          let name = this.activeName;
          this.total = data.total;
          if (name == "memberTable") {
            this.memberList = [...data.data];
          } else if (name == "cardTable") {
            this.cardList = [...data.data];
          } else if (name == "storeCardTable") {
            this.storeCardList = [...data.data];
          } else if (name == "balanceTable") {
            this.balanceList = [...data.data];
          } else if (name == "birthdayTable") {
            this.birthdayList = [...data.data];
          }
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  computed: {
    toggleCheck() {
      return this.show ? "收起搜索" : "高级搜索";
    },
    dataList() {
      switch (this.activeName) {
        case "memberTable":
          return this.memberList;
          break;
        case "cardTable":
          return this.cardList;
          break;
        case "storeCardTable":
          return this.storeCardList;
          break;
        case "birthdayTable":
          return this.birthdayList;
          break;
        case "balanceTable":
          return this.balanceList;
          break;
      }
    }
  },

  watch: {
    activeName(val, oldVal) {
      // if (val == "memberTable" && this.memberList.length >= 1) {
      //   return;
      // } else if (val == "cardTable" && this.cardList.length >= 1) {
      //   return;
      // } else if (val == "storeCardTable" && this.storeCardList.length >= 1) {
      //   return;
      // } else if (val == "birthdayTable" && this.birthdayList.length >= 1) {
      //   return;
      // } else if (val == "balanceTable" && this.balanceList.length >= 1) {
      //   return;
      // }
      this.listQuery.page = 1;
      this.getAnalysisList();
    }
  },

  created() {
    this.getRankList();
    this.getAnalysisList();
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import "~@/styles/variables.scss";

$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$fontsize14: 14px;
$primaryColor: #f1717e;
.filter_container {
  .header {
    border-bottom: 1px solid #ebeef5;
  }
  .search {
    width: 240px;
    margin-right: 20px;
  }

  .el-tabs__item {
  }
  .body {
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #f5f7fa;
    overflow: hidden;
    > div {
      margin: 15px 60px;
    }
    .el-row {
      margin-bottom: 10px;

      span.filter {
        display: inline-block;
        width: 70px;
        text-align: right;
        margin-right: 20px;
        color: $fontColor_light;
        float: left;
        line-height: 36px;
      }
    }
    .option {
      color: $fontColor;
      span {
        float: left;
        line-height: 36px;
        &:first-child {
          margin-right: 5px;
        }
        &:last-child {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
<style lang='scss'>
@import "~@/styles/variables.scss";
$fontColor: #606266;
$fontColor_light: #909399;
$borderColor: #dcdfe5;
$tbColor: #ebeef5;
$dialogColor: #e4e7ed;
$formActiveColor: #61afdf;

.member_analysis {
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__item {
    height: 47px;
  }
  .el-tabs__nav-wrap {
    &::after {
      height: 0px;
    }
  }
  .el-tabs__active-bar {
    height: 3px;
  }
  .filter_container {
    .body {
      .el-radio-button {
        margin-right: 10px;
      }
      .el-radio-button__inner {
        border: 1px solid $borderColor;
        border-radius: 4px;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        box-shadow: none;
        border: 1px solid $--color-primary;
      }
      .el-input {
        width: 88px;
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
}
</style>

