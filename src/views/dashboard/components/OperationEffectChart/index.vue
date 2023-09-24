<template>
  <div id="chart" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'OperationEffectChart',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      // chart: null;
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
    this.init();
  },
  methods: {
    init() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart)
      }
      this.chart.setOption({
        xAxis: {
          show: false,
          min: 0,
          max: 100
        },
        yAxis: {
          type: 'category',
          show: false,
        },
        series: [
          {
            type: 'bar',
            data: this.data,
            barWidth: 15,
            showBackground: true, // 是否显示柱条的背景色,通过 backgroundStyle 配置背景样式。
            backgroundStyle: {
              color: '#eee'
            },
            label: { // 图形上的文本标签
              show: true,
              position: 'right', // 标签的位置
              formatter: '{c}%' // 标签内容格式器
            },
            itemStyle: {
              color: '#9ACD32' // 柱条颜色
            }
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
