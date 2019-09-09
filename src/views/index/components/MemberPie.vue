<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'
  import {mapGetters} from 'vuex'

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
        default: '290px'
      },
      data: Array,
    },
    data() {
      return {
        chart: null
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
      this.initChart()
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
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
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['会员', '会员点客', '散客', '散客点客']
          },
          calculable: true,
          color: ['#fb7ca4', '#31cfd3', '#c4b4e5', '#6abff3', '#ffc692'],
          series: [
            {
              name: '客源占比',
              type: 'pie',
              // roseType: 'radius',
              radius: '60%',
              center: ['50%', '50%'],
              data: this.data,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    },

    watch: {
      isCollapse() {
        this.__resizeHandler();
      },

      data(){
        this.initChart();
      }
    }
  }
</script>
