<template>
  <div class="app-container system-intellect-machine-page" v-loading="loading">
    <div class="search-box">
      <el-button class="fr" @click="addMachine" type="primary">新增打印机</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="machineList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="printer_no" label="编号"></el-table-column>
      <el-table-column prop="printer_code" label="识别码"></el-table-column>
      <el-table-column prop="card_num" label="流量卡号">
        <template slot-scope="scope">
          {{scope.row.card_num || '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="editMachine(scope.row)">编辑</el-button>
          <el-button size="mini" @click="delMachine(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="paginate.total>0"
      :total="paginate.total"
      :page.sync="paginate.page"
      :limit.sync="paginate.page_size"
      class='pagination'
      @pagination='getMachine'/>

    <!--新增支出-->
    <machine-dialog
      ref="machineDialog"
      :show.sync="machineDialog.show"
      @updateList="getMachine"
      :data="machineDialog.editData"
      v-if="machineDialog.show">
    </machine-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {getMachine, delMachine} from '@/api/system/printer'
  import MachineDialog from "./machineDialog"

  export default {
    name: "system_intellect_machine",
    components: {
      Pagination,
      MachineDialog,
    },
    data() {
      return {
        loading: false,
        machineList: [],
        // 分页
        paginate: {
          page: 1,
          page_size: 10,
          total: 0,
        },
        machineDialog: {
          show: false,
          editData: null,
        }
      }
    },
    computed: {},

    created() {
      this.getMachine();
    },

    mounted() {
    },

    methods: {
      // 获取打印列表
      getMachine() {
        getMachine(this.paginate.page, this.paginate.page_size).then(res => {
          this.machineList = res.success.data.data;
        });
      },

      // 新增
      addMachine() {
        this.machineDialog = {
          show: true,
          editData: null,
        };
      },

      // 编辑
      editMachine(item) {
        let { id, name, printer_no, printer_code, card_num } = item;
        let editData = { id, name, printer_no, printer_code, card_num };
        this.machineDialog = {
          show: true,
          editData,
        };
      },

      // 删除
      delMachine(id) {
        this.$confirm('是否确定删除该打印机?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          delMachine(id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'warning',
            });
            this.getMachine();
          });
        }).catch(() => {
        });
      }
    },

  }
</script>

<style lang="scss">
  .system-intellect-machine-page {
    padding: 20px 0;
  }
</style>