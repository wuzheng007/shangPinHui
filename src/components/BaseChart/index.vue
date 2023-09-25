<template>
  <div id="chart" ref="chart" :style="style"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BaseChart',
  props: {
    // 图表的宽度
    width: {
      type: String,
      required: true,
    },
    // 图表的高度
    height: {
      type: String,
      required: true,
    },
    // 图表的配置项和数据
    option: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    style() {
      return {
        width: this.watch,
        height: this.height
      }
    }
  },
  watch: {
    /**
     * @Date 2023-09-25 15:05:51
     * @introduction 监听器-监听option的变化
     * @description 用于更新图表
     */
    option: {
      deep: true,
      handler() {
        this.initChart()
      }
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      // 如果没有图表实例，则创建一个新的实例
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart)
      }
      // 将传入的配置项设置给图表实例
      const option = Object.assign(this.option, {})
      // 使用刚指定的配置项和数据显示图表
      this.chart.setOption(option)
    }
  },
}
</script>

<style lang="scss" scoped></style>
