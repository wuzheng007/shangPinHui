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
                  <use xlink:href="#icon-up"></use>
                </svg>
                <span>日同比 19.96%</span>
                <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                  <use xlink:href="#icon-down"></use>
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
                <PvChart :data="pvData"></PvChart>
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
                <PayNumChart :data="payData"></PayNumChart>
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
              <p class="count">78%</p>
              <div class="chart">
                <OperationEffectChart :data="operationData"></OperationEffectChart>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="card-footer">
              <span>周同比 56.67%</span>
              <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                <use xlink:href="#icon-up"></use>
              </svg>
              <span>日同比 19.96%</span>
              <svg class="icon" aria-hidden="true" style="margin: 0 5px;">
                <use xlink:href="#icon-down"></use>
              </svg>
            </div>
          </template>
        </CardItem>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CardItem from './components/CardItem'
import PvChart from './components/PvChart' // 访问量折线图
import PayNumChart from './components/PayNumChart' // 支付笔数柱状图
import OperationEffectChart from './components/OperationEffectChart' // 运营活动效果图表
export default {
  name: 'Dashboard',
  components: {
    CardItem,
    PvChart,
    PayNumChart,
    OperationEffectChart
  },
  data() {
    return {
      pvData: [1020, 1932, 901, 334, 1290, 530, 1320],
      payData: [50, 16, 42, 103, 35, 9, 65, 20],
      operationData: [78]
    }
  },
  mounted() {
    // 测试数据变化,图表是否会变化
    setTimeout(() => {
      this.changeData()
    }, 3000);
  },
  methods: {
    changeData() {
      this.pvData = [102, 30, 60, 50, 10]
      this.payData = [1020, 1932, 901, 334, 1290, 530, 1320]
      this.operationData = [85]
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.card-main-content {
  overflow: hidden;

  .chart {
    height: 80px;
  }
}

.count {
  margin: 10px 0;
  font-size: 30px;
  font-weight: 700;
}
</style>
