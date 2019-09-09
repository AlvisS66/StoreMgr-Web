<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'
  import {mapGetters} from 'vuex'
  import {indexGraphData} from '@/api/index'

  const pays = {
    bankcard: '银行卡',
    cash: '现金',
    wechatpay: '微信',
    alipay: '支付宝',
    others: '其他',
    groupbuy: "团购"
  };

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      }
    },
    data() {
      return {
        chart: null,
        chartData: [],
        months: [],
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },

    mounted() {
      console.log('isCollapse', this.isCollapse);

      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100);
      window.addEventListener('resize', this.__resizeHandler);

      this.getIndexGraphData();
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter(params) {
              let res = `${params[0].axisValueLabel}<br/>`;
              params.forEach(item => {
                res += `${item.marker} ${item.seriesName}：￥${item.value} <br/>`
              });
              return res;
            }
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['现金', '银行卡', '支付宝', '微信', '团购', '其他']
          },
          grid: {
            left: '0',
            right: '0',
            top: '3%',
            bottom: '10%',
            containLabel: true
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.months,
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '￥{value}'
              },
            }
          ],
          color: ['#fb7ca4', '#31cfd3', '#c4b4e5', '#6abff3', '#ffc692'],
          series: this.chartData,
        })
      },

      // 获取图表数据
      getIndexGraphData() {
        let data = {
          ...this.filter
        };
        indexGraphData(data).then(res => {
          let data = res.success.data.reverse();
          this.handelGraphData(data);
        });
      },

      // 处理图表数据
      handelGraphData(data) {
        let months = [];
        let vals = [];
        data.forEach(item => {
          months = [...months, ...Object.keys(item)];
          vals = [...vals, ...Object.values(item)];
        });
        this.months = months;
        let values = [];
        let keys = [];
        vals.forEach((item, index) => {
          keys.push(Object.keys(item));
          values.push(Object.values(item));
        });
        let values_f = [];
        values.forEach((item) => {
          item.forEach((n, i) => {
            if (!Array.isArray(values_f[i])) {
              values_f[i] = [];
            }
            values_f[i] = [...values_f[i], Number(n)];
          });
        });
        let data_format = [];
        for (let i = 0; i < values_f.length; i++) {
          data_format[i] = {
            name: pays[keys[1][i]],
            type: 'bar',
            data: values_f[i],
          }
        }
        this.chartData = data_format;
        this.initChart();
      },

    },

    watch: {
      isCollapse() {
        this.__resizeHandler();
      }
    }
  }
</script>
