// 生成访问量图表的配置项
export function genPvOption(data) {
  return {
    xAxis: {
      type: "category",
      boundaryGap: false,
      show: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: "value",
      show: false
    },
    series: [{
      type: "line",
      data: data,
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
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  }
}

// 生成支付笔数图表的配置项
export function genPaymentNumberOption(data) {
  return {
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
        data: data
      }
    ],
    grid: {
      left: 10
    }
  }
}

// 生成运营活动效果图表的配置项
export function genOperationEffectOption(data) {
  return {
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
        data: data,
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
  }
}

// 生成销售额和访问量图表的配置项
export function genBigBarOption(data, color, title) {
  return {
    title: {
      text: title,
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.time)
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true // 是否显示坐标轴轴线。
      },
    },
    tooltip: { // // 提示框组件
      trigger: 'axis', // 触发类型。item 会在每个数据项图形上触发提示框，axis 会在坐标轴触发。
      axisPointer: { // 坐标轴指示器配置项
        type: 'shadow' // 阴影指示器
      }
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.value),
        itemStyle: {
          color // 柱条颜色
        }
      }
    ],
    grid: {
      top: 50,
      right: 20,
      bottom: 20,
      left: 50
    }
  }
}

// 生成销售额类别占比图表配置
export function genSaleCateRatioOption(data) {
  return {
    tooltip:{},
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'], // 饼图的半径，数组的第一项是内半径，第二项是外半径
        data: data,
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: '',
          textAlign: 'center',
          fill: '#333',
          fontSize: 18,
          fontWeight: 'bold'
        }
      }
    ]
  }
}
