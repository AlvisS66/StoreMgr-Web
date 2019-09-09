<template>
  <!--暂挂-->
  <el-dialog title="暂挂" class="billing-recording-dialog" width="770px"
             :visible.sync="visible"
             @close="$emit('update:show', false)"
             :show="show">
    <el-form class="form-inline" ref="form" label-width="80px" @submit.native.prevent>
      <el-form-item>
        <el-input
          class="search-input" v-model="search"
          @keyup.enter.native="searchOrderRoom"
          placeholder="请输入查询包厢名称"
          clearable
          @clear="searchOrderRoom">
          <el-button
            slot="append" icon="el-icon-search"
            @click.native="searchOrderRoom">
          </el-button>
        </el-input>
      </el-form-item>
      <el-scrollbar class="scrollbar" v-loading="loading">
        <el-form-item label="包厢名称" class="loge-radio-box" v-show="orderRoom.length">
          <el-radio v-model="room_id" :label="room.id" border
                    v-for="room in orderRoom" :key="`room-${room.id}`"
                    :disabled="!room.is_used && cur_room_id !== room.id">
            {{room.name}}
          </el-radio>
        </el-form-item>
        <div style="text-align: center;padding: 30px 0" v-if="!orderRoom.length && !loading">暂无数据</div>
      </el-scrollbar>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible= false">取 消</el-button>
      <el-button type="primary" @click="doRecording">暂 挂</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {orderRoom} from '@/api/cash/billing';

  export default {
    name: "recording-dialog",
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
        orderRoom: [],
        room_id: '',
        search: '',
      }
    },
    computed: {},

    mounted() {
      this.getOrderRoom(); //获取包厢
    },

    methods: {
      //获取包厢
      getOrderRoom(name) {
        this.loading = true;
        orderRoom(name).then(res => {
          let orderRoom = res.success.data;
          if (this.cur_room_id) {
            let index = orderRoom.findIndex(n => n.id === this.cur_room_id);
            let item = orderRoom[index];
            orderRoom.splice(index, 1);
            orderRoom.unshift(item);
          }
          this.orderRoom = orderRoom;
          this.loading = false;
        });
      },

      //查询包厢
      searchOrderRoom() {
        this.getOrderRoom(this.search);
      },

      //挂单
      doRecording() {
        if (!this.room_id) {
          this.$message({
            message: '请选择挂单包厢！',
            type: 'warning'
          });
          return false;
        }
        this.$parent.saveOrder({ room_id: this.room_id });
      },
    },

    beforeDestroy() {},

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
  //暂挂
  .billing-recording-dialog {
    .el-dialog__header {
      padding: 15px 20px;
      border-bottom: 1px solid #e4e7ed;
    }
    .el-dialog__body {
      padding: 20px;
    }
    .el-form-item__label {
      font-weight: normal;
    }

    .el-dialog__footer {
      border-top: 1px solid #e4e7ed;
    }

    .search-input {
      width: 300px;
      float: right;
    }

    .loge-radio-box {
      label {
        margin-bottom: 10px;
        &.is-checked {
          background-color: $--color-primary;
          .el-radio__label {
            color: #fff;
          }
        }
      }
      .el-radio__input {
        display: none;
      }
    }
    .el-scrollbar {
      height: 250px;
    }
  }
</style>