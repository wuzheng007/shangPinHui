<template>
  <div id="chart" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'PayNumChart',
  props: {
    data: { // 数据
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      // chart: null
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.chart) {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.$refs.chart)
      }
      // 绘制图表
      this.chart.setOption({
        xAxis: {
          type: 'category',
          show: false
        },
        yAxis: {
          show: false
        },
        tooltip: {},
        series: [
          {
            type: 'bar',
            data: this.data
          }
        ],
        grid: {
          left: 10
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
#chart {
  width: 100%;
  height: 100%;
}
</style>
