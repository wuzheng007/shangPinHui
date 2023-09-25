<template>
  <BaseChart width="100%" height="100%" :option="option"></BaseChart>
</template>

<script>
import BaseChart from '@/components/BaseChart'
export default {
  name: 'PvChart',
  components: {
    BaseChart
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // chart: null
    }
  },
  computed: {
    option() {
      return {
        xAxis: {
          type: "category",
          show: false
        },
        yAxis: {
          show: false
        },
        series: [{
          type: "line",
          data: this.data,
          smooth: true, // 是否平滑曲线显示
          itemStyle: { // 折线拐点标志的样式
            opacity: 0 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形, 不显示拐点
          },
          lineStyle: { // 线条样式
            color: '#870E87'
          },
          areaStyle: { // 区域填充样式
            color: { // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(135, 14, 135, 1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(135, 14, 135, 0)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
        }],
        grid: {
          left: 10
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
