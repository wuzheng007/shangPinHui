<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <CardItem title="总销售额">
          <template #main>
            <div class="card-main-content">
              <p class="count">￥&nbsp;126560</p>
              <div class="chart">
                <span>周同比 56.67%</span>
                <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                  <use xlink:href="#icon-up" />
                </svg>
                <span>日同比 19.96%</span>
                <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                  <use xlink:href="#icon-down" />
                </svg>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="card-footer">
              <span>日销售额￥&nbsp;12423</span>
            </div>
          </template>
        </CardItem>
      </el-col>
      <el-col :span="6">
        <CardItem title="访问量">
          <template #main>
            <div class="card-main-content">
              <p class="count">88460</p>
              <div class="chart">
                <BaseChart width="100%" height="100%" :option="pvOption" />
              </div>
            </div>
          </template>
          <template #footer>
            <div class="card-footer">日访问量12365</div>
          </template>
        </CardItem>
      </el-col>
      <el-col :span="6">
        <CardItem title="支付笔数">
          <template #main>
            <div class="card-main-content">
              <p class="count">2536</p>
              <div class="chart">
                <BaseChart width="100%" height="100%" :option="paymentNumberOption" />
              </div>
            </div>
          </template>
          <template #footer>
            <div class="card-footer">转换率64%</div>
          </template>
        </CardItem>
      </el-col>
      <el-col :span="6">
        <CardItem title="运营活动效果">
          <template #main>
            <div class="card-main-content">
              <p class="count">{{ genOperationEffectDate[0] }}%</p>
              <div class="chart">
                <BaseChart width="100%" height="100%" :option="operationEffectOption" />
              </div>
            </div>
          </template>
          <template #footer>
            <div class="card-footer">
              <span>周同比 56.67%</span>
              <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                <use xlink:href="#icon-up" />
              </svg>
              <span>日同比 19.96%</span>
              <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                <use xlink:href="#icon-down" />
              </svg>
            </div>
          </template>
        </CardItem>
      </el-col>
    </el-row>
    <el-card class="big-card">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="销售额" name="first" />
        <el-tab-pane label="访问量" name="second" />
      </el-tabs>
      <!-- 日期选择 -->
      <div class="select-date">
        <ul class="ul">
          <li :class="{ active: selectDateType === 'day' }" @click="changeDateType('day')">今日</li>
          <li :class="{ active: selectDateType === 'week' }" @click="changeDateType('week')">本周</li>
          <li :class="{ active: selectDateType === 'month' }" @click="changeDateType('month')">本月</li>
          <li :class="{ active: selectDateType === 'year' }" @click="changeDateType('year')">本年</li>
        </ul>
        <el-date-picker
          v-model="curDate"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :clearable="false"
          @change="changeDate"
        />
      </div>
      <el-row>
        <el-col :span="18">
          <BaseChart width="100%" height="300px" :option="bigBarOption" />
        </el-col>
        <el-col :span="6">
          <p class="sort-title">{{ sortTitle }}</p>
          <ul class="sort-list">
            <li v-for="(item, index) in sortData" :key="index" class="sort-item">
              <span class="level">{{ index + 1 }}</span>
              <span class="name">{{ item.name }}</span>
              <span class="amount">{{ item.amount }}</span>
            </li>
            <li v-if="sortData.length === 0" class="empty">暂无数据</li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="10" class="footer-card-row">
      <el-col :span="12">
        <el-card class="hot-search-card" :body-style="{ height: '350px' }">
          <div slot="header">
            <span>线上热门搜索</span>
            <el-dropdown style="float: right;">
              <i class="el-icon-more" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-row :gutter="20" style="margin-bottom: 10px;">
            <el-col :span="12">
              <div class="sub-title">
                <span style="margin-right: 10px;">搜索用户数</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xinxi1" />
                </svg>
              </div>
              <div class="index-num">
                <span class="count">12321</span>
                <span class="percent-num">17.1</span>
                <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                  <use xlink:href="#icon-up" />
                </svg>
              </div>
              <div>
                <BaseChart width="100%" height="50px" :option="pvOption" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="sub-title">
                <span style="margin-right: 10px;">人均搜索次数</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xinxi1" />
                </svg>
              </div>
              <div class="index-num">
                <span class="count">2.7</span>
                <span class="percent-num">26.1</span>
                <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                  <use xlink:href="#icon-down" />
                </svg>
              </div>
              <div>
                <BaseChart width="100%" height="50px" :option="pvOption" />
              </div>
            </el-col>
          </el-row>
          <el-table :data="hotSearchTableData" stripe height="200">
            <el-table-column label="排名" type="index" align="center" width="80" />
            <el-table-column label="搜索关键字" align="center" prop="keyword" />
            <el-table-column label="用户数" align="center" sortable prop="userNum" />
            <el-table-column label="周涨幅" align="center" sortable prop="weekIncrease" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :body-style="{ height: '350px' }">
          <div slot="header">
            <span>销售额类别占比</span>
            <el-radio-group v-model="selectChannel" size="mini" style="float: right;">
              <el-radio-button label="全部渠道" />
              <el-radio-button label="线上" />
              <el-radio-button label="门店" />
            </el-radio-group>
          </div>
          <BaseChart ref="saleCateRatioChart" width="100%" height="100%" :option="saleCateRatioOption" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // 导入插件
import 'dayjs/locale/zh-cn' // 导入本地化语言
dayjs.extend(isLeapYear) // 使用插件
dayjs.locale('zh-cn') // 使用本地化语言
import BaseChart from '@/components/BaseChart'
import CardItem from './components/CardItem'
import { genPvOption, genPaymentNumberOption, genOperationEffectOption, genBigBarOption, genSaleCateRatioOption } from './chartOptions.js'
export default {
  name: 'Dashboard',
  components: {
    CardItem,
    BaseChart
  },
  data() {
    return {
      pvData: [1020, 1932, 901, 334, 1290, 530, 1320],
      PaymentNumberDate: [50, 16, 42, 103, 35, 9, 65, 20],
      genOperationEffectDate: [78],
      activeTabName: 'first', // 选中的tab
      curDate: [], // 当前选中的日期
      selectDateType: 'month', // 选中的日期类型
      bigBarData: [],
      salesData: [], // 销售额排名数据
      accessData: [], // 访问量排名数据
      hotSearchTableData: [ // 热门搜索表格数据
        {
          keyword: '法拉力',
          userNum: 123,
          weekIncrease: '12.3%'
        },
        {
          keyword: '兰博基尼',
          userNum: 58,
          weekIncrease: '10%'
        },
        {
          keyword: '保时捷',
          userNum: 45,
          weekIncrease: '8.9%'
        },
        {
          keyword: '奔驰',
          userNum: 37,
          weekIncrease: '7.1%'
        }
      ],
      selectChannel: '全部渠道', // 选中的渠道
      saleCateRatioData: [ // 销售额类别占比数据
        {
          name: '视频广告',
          value: 300
        },
        {
          name: '联盟广告',
          value: 484
        },
        {
          name: '邮件营销',
          value: 580
        },
        {
          name: '直接访问',
          value: 625
        },
        {
          name: '搜索引擎',
          value: 1350
        }
      ]
    }
  },
  computed: {
    // 访问量图表配置
    pvOption() {
      return genPvOption(this.pvData)
    },
    // 支付笔数图表配置
    paymentNumberOption() {
      return genPaymentNumberOption(this.PaymentNumberDate)
    },
    // 运营活动效果图表配置
    operationEffectOption() {
      return genOperationEffectOption(this.genOperationEffectDate)
    },
    // 销售额和访问量柱状图配置
    bigBarOption() {
      const colorMap = {
        first: {
          title: '销售额',
          color: '#b6a014'
        },
        second: {
          title: '访问量',
          color: '#a76283'
        }
      }
      return genBigBarOption(this.bigBarData, colorMap[this.activeTabName].color, colorMap[this.activeTabName].title)
    },
    // 销售额类别占比图表配置
    saleCateRatioOption() {
      return genSaleCateRatioOption(this.saleCateRatioData)
    },
    // 排序标题
    sortTitle() {
      const titleMap = {
        first: '销售额排名',
        second: '访问量排名'
      }
      return titleMap[this.activeTabName]
    },
    // 排序数据
    sortData() {
      const dataMap = {
        first: this.salesData,
        second: this.accessData
      }
      return dataMap[this.activeTabName]
    }
  },
  watch: {
    /**
     * @Date 2023-09-25 20:18:18
     * @introduction 监听器-监听日期的变化
     * @description 详细描述
     */
    curDate: {
      deep: true,
      handler(val) {
        this.mockBigBarData()
      }
    },
    /**
     * @Date 2023-09-25 22:01:03
     * @introduction 监听器-监听选中的tab
     * @description 重新生成mock数据
     */
    activeTabName: {
      immediate: true,
      handler(val) {
        if (val === 'first') {
          this.mockSalesData()
        } else {
          this.mockAccessData()
        }
      }
    }
  },
  mounted() {
    this.curDate = [dayjs().startOf(this.selectDateType).format('YYYY-MM-DD'), dayjs().endOf(this.selectDateType).format('YYYY-MM-DD')]
    // 监听销售额类别占比图表的点击事件，点击时在饼图中间显示对应的数据
    this.$refs.saleCateRatioChart.chart.on('click', (e) => {
      console.log(e)
      const { name, value } = e
      if (!name || !value && value !== 0) {
        return
      }
      this.$refs.saleCateRatioChart.chart.setOption({
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: `${name}\n${value}`,
              textAlign: 'center',
              fill: '#333',
              fontSize: 18,
              fontWeight: 'bold'
            }
          }
        ]
      })
    })
  },
  methods: {
    // 改变选中日期类型
    changeDateType(type) {
      this.selectDateType = type
      const start = dayjs().startOf(type).format('YYYY-MM-DD')
      const end = dayjs().endOf(type).format('YYYY-MM-DD')
      this.curDate = [start, end]
    },
    // 用户确认选定的值时触发
    changeDate(e) {
      // 获取今日，本周，本月，本年的开始和结束时间
      const dayStart = dayjs().startOf('day').format('YYYY-MM-DD')
      const dayEnd = dayjs().endOf('day').format('YYYY-MM-DD')
      const weekStart = dayjs().startOf('week').format('YYYY-MM-DD')
      const weekEnd = dayjs().endOf('week').format('YYYY-MM-DD')
      const monthStart = dayjs().startOf('month').format('YYYY-MM-DD')
      const monthEnd = dayjs().endOf('month').format('YYYY-MM-DD')
      const yearStart = dayjs().startOf('year').format('YYYY-MM-DD')
      const yearEnd = dayjs().endOf('year').format('YYYY-MM-DD')
      const [start, end] = e
      if (start === dayStart && end === dayEnd) {
        this.selectDateType = 'day'
      } else if (start === weekStart && end === weekEnd) {
        this.selectDateType = 'week'
      } else if (start === monthStart && end === monthEnd) {
        this.selectDateType = 'month'
      } else if (start === yearStart && end === yearEnd) {
        this.selectDateType = 'year'
      } else {
        this.selectDateType = ''
      }
    },
    // mock大柱状图数据
    mockBigBarData() {
      const [start, end] = this.curDate
      // 计算两个日期间隔的天数
      const days = dayjs(end).diff(dayjs(start), 'days')
      const data = []
      for (let i = 0; i <= days; i++) {
        // 生成日期和随机数
        const time = dayjs(start).add(i, 'days').format('YYYY-MM-DD')
        const value = Math.floor(Math.random() * 1000)
        // 生成日期在当天之后，跳出循环
        if (dayjs(time).isAfter(dayjs().format('YYYY-MM-DD'))) {
          continue
        }
        data.push({
          time,
          value
        })
      }
      this.bigBarData = data
    },
    // mock销售额排名数据
    mockSalesData() {
      const shopNames = ['萧山店', '余杭店', '滨江店', '西湖店', '江干店', '拱墅店', '下城店', '上城店', '富阳店', '临安店']
      this.salesData = shopNames.map(item => {
        return {
          name: item,
          amount: Math.floor(Math.random() * 100000)
        }
      })
    },
    // mock访问量排名数据
    mockAccessData() {
      const shopNames = ['萧山店', '余杭店', '滨江店', '西湖店', '江干店', '拱墅店', '下城店', '上城店', '富阳店', '临安店']
      this.accessData = shopNames.map(item => {
        return {
          name: item,
          amount: Math.floor(Math.random() * 100000)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 整个滚动条 */
::-webkit-scrollbar {
  /* 对应纵向滚动条的宽度 */
  width: 5px;
  /* 对应横向滚动条的宽度 */
  height: 5px;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 32px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: #C0C4CC;
  border-radius: 32px;
}

p {
  margin: 0;
}

.card-main-content {
  overflow: hidden;

  .count {
    margin: 10px 0;
    font-size: 30px;
    font-weight: 700;
  }

  .chart {
    height: 80px;
  }
}

.big-card {
  position: relative;
  margin: 10px 0;

  .select-date {
    position: absolute;
    top: 10px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .ul {
      display: flex;
      list-style: none;
      margin-right: 20px;

      li {
        cursor: pointer;
        margin-right: 25px;

        &:hover,
        &.active {
          color: #409eff;
        }

      }
    }
  }

  .sort-title {
    font-size: 18px;
    font-weight: 700;
  }

  // 销售额和访问量排名列表样式
  .sort-list {
    height: 280px;
    overflow: auto;
    list-style: none;
    padding: 0 10px;
    margin: 0;

    .sort-item {
      display: flex;
      align-items: center;
      height: 40px;

      // 前3个元素背景色不同
      &:nth-child(-n + 3) {
        .level {
          background-color: #000;
          color: #fff;
        }
      }

      .level {
        width: 20px;
        line-height: 20px;
        border-radius: 50%;
        text-align: center;
        margin-right: 10px;
      }

      .name {
        flex: 1;
      }
    }

    .empty {
      text-align: center;
      color: #909399;
      line-height: 2em;
    }
  }
}

.footer-card-row {

  .hot-search-card {
    .sub-title {
      color: #909399;
      margin-bottom: 15px;
    }

    .index-num {
      margin-bottom: 10px;

      .count {
        font-size: 20px;
        margin-right: 30px;
      }

      .percent-num {
        color: #909399;
        font-size: 14px;
      }

    }
  }

  // 线上热门搜索卡片
}
</style>
