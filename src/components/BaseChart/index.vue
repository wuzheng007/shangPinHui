<template>
  <div id="chart" ref="chart" :style="style"></div>
</template>

<script>
import * as echarts from 'echarts'
// 优化了元素的跨浏览器调整大小监听器
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: 'BaseChart',
  props: {
    // 图表的宽度
    width: {
      type: String,
      default: '600px'
    },
    // 图表的高度
    height: {
      type: String,
      default: '400px'
    },
    // 图表的配置项和数据
    option: {
      type: Object,
      required: true
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
        width: this.width,
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
    this.handleResize()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    // 销毁图表实例
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 初始化图表
    initChart() {
      // 如果没有图表实例，则创建一个新的实例
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart)
      }
      // 将传入的配置项设置给图表实例
      const option = Object.assign(this.option, {})
      // 使用刚指定的配置项和数据显示图表
      this.chart.setOption(option)
    },
    // 处理图表容器大小变化
    handleResize() {
      const erd = elementResizeDetectorMaker()
      // 监听图表容器的大小变化
      erd.listenTo(this.$refs.chart, () => {
        // 改变图表尺寸
        this.chart.resize()
      })
    }
  }
}
</script>
