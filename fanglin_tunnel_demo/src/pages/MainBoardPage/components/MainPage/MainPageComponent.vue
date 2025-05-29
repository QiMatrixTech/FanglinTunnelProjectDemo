<template>
  <div class="main-grid">
    <!-- 左上：预警统计 -->
    <div class="box small">
      <div class="box-header">预警统计</div>
      <div ref="alertStatsChart" style="width: 100%; height: 100%"></div>
    </div>

    <!-- 左中：隧道基本信息 -->
    <div class="box small">
      <div class="box-header">隧道基本信息</div>
      <div class="box-body">
        <p>名称：XX隧道</p>
        <p>长度：1500m</p>
        <p>起点：A区</p>
        <p>终点：B区</p>
        <p>建造年份：2022</p>
      </div>
    </div>

    <!-- 中部大区：模型视图切换 -->
    <div class="box big">
      <div class="box-header">模型视图</div>
      <el-radio-group v-model="viewMode" size="small" style="margin-bottom: 10px">
        <el-radio-button label="wireframe">线框图</el-radio-button>
        <el-radio-button label="solid">实体模型</el-radio-button>
        <el-radio-button label="2d">2D俯视图</el-radio-button>
        <el-radio-button label="tunnel">隧道穿越</el-radio-button>
      </el-radio-group>
      <component :is="currentComponent" :mode="viewMode" @sensor-click="handleSensorClick" />
    </div>

    <!-- 右上：视频监控 -->
    <div class="box small">
      <div class="box-header">视频监控</div>
      <div class="box-body" style="height: 180px; background: #222; display: flex; align-items: center; justify-content: center; color: #888;">
        视频占位符
      </div>
    </div>

    <!-- 右中：传感器类型统计 -->
    <div class="box small">
      <div class="box-header">传感器类型统计</div>
      <div ref="sensorTypeChart" style="width: 100%; height: 100%"></div>
    </div>

    <!-- 左下：实时监测数据表格 -->
    <div class="box small">
      <div class="box-header">实时监测数据</div>
      <el-table ref="realtimeSensorTableEl" :data="realtimeSensorTable" height="180" border>
        <el-table-column prop="timestamp" label="时间" width="160" />
        <el-table-column prop="value" label="数值" width="80" />
        <el-table-column prop="level" label="预警级别" />
      </el-table>
    </div>

    <!-- 中下：实时监测图表 -->
    <div class="box small">
      <div class="box-header">实时监测趋势</div>
      <div ref="sensorChart" style="width: 100%; height: 100%"></div>
    </div>

    <!-- 右下：实时预警 -->
    <div class="box small">
      <div class="box-header">实时预警</div>
      <el-table ref="alertTableEl" :data="alertTableData" height="180" border>
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="type" label="类型" width="80" />
        <el-table-column prop="message" label="内容" />
      </el-table>
    </div>

    <!-- 最后一行：桥梁通知 -->
    <div class="box small">
      <div class="box-header">桥梁通知</div>
      <div class="box-body">
        <p>2025-05-28：今日共触发蓝色预警 2 次，黄色预警 1 次，未出现红色预警。</p>
        <p>请注意监测点 B 的应变变化，已连续三小时高于阈值。</p>
        <p>建议：检查隧道北口排水系统，防止积水影响。</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { defineComponent, onMounted, ref, nextTick } from 'vue'
import MainBoard3DModel from '@/pages/MainBoardPage/components/MainBoard3DModel.vue'
import MainBoard2DModel from '../MainBoard2DModel.vue'
import TunnelTraverse from '../TunnelTraverse.vue'

export default defineComponent({
  components: { MainBoard3DModel, MainBoard2DModel, TunnelTraverse },
  data() {
    return {
      viewMode: 'wireframe',
      selectedSensorId: null,
      alertTableData: [
        { time: '2025-05-20 14:23', type: '电气', message: '电压过高' },
        { time: '2025-05-20 15:47', type: '机械', message: '温度异常' },
        { time: '2025-05-20 16:05', type: '软件', message: '数据中断' },
        { time: '2025-05-20 16:05', type: '软件', message: '数据中断' },
        { time: '2025-05-20 16:05', type: '软件', message: '数据中断' },
        { time: '2025-05-20 16:05', type: '软件', message: '数据中断' },
        { time: '2025-05-20 16:05', type: '软件', message: '数据中断' },
      ],
      realtimeSensorTable: [],
      scrollTimer: null,
    }
  },
  computed: {
    currentComponent() {
      switch (this.viewMode) {
        case 'wireframe':
        case 'solid':
          return MainBoard3DModel
        case '2d':
          return MainBoard2DModel
        case 'tunnel':
        default:
          return TunnelTraverse
      }
    },
  },
  mounted() {
    this.initCharts()
    nextTick(() => this.startTableScroll())
  },
  beforeUnmount() {
    clearInterval(this.scrollTimer)
  },
  methods: {
    handleSensorClick(sensorId) {
      this.selectedSensorId = sensorId
      this.realtimeSensorTable = [
        { timestamp: '2025-05-28 14:10', value: 26.5, level: '正常' },
        { timestamp: '2025-05-28 14:20', value: 27.2, level: '蓝色预警' },
        { timestamp: '2025-05-28 14:30', value: 28.6, level: '黄色预警' },
      ]
      this.updateSensorChart([26.5, 27.2, 28.6])
    },
    updateSensorChart(values) {
      const chart = echarts.init(this.$refs.sensorChart)
      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['14:10', '14:20', '14:30'],
          axisLabel: { color: '#fff' },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#fff' },
        },
        series: [{ type: 'line', data: values }],
        backgroundColor: 'transparent',
      })
    },
    initCharts() {
      const alertStatsChart = echarts.init(this.$refs.alertStatsChart)
      alertStatsChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: 0, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie',
          radius: '65%',
          data: [
            { value: 50, name: '正常' },
            { value: 10, name: '蓝色预警' },
            { value: 6, name: '黄色预警' },
            { value: 3, name: '红色预警' },
          ],
        }],
        backgroundColor: 'transparent',
      })

      const sensorTypeChart = echarts.init(this.$refs.sensorTypeChart)
      sensorTypeChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: 0, textStyle: { color: '#fff' } },
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            { value: 12, name: '温湿度' },
            { value: 8, name: '应变' },
            { value: 5, name: '沉降' },
            { value: 4, name: '位移' },
          ],
        }],
        backgroundColor: 'transparent',
      })
    },
    startTableScroll() {
      this.scrollTimer = setInterval(() => {
        const tableEls = [this.$refs.realtimeSensorTableEl, this.$refs.alertTableEl]
        tableEls.forEach(table => {
          if (!table) return
          const wrapper = table.$el.querySelector('.el-table__body-wrapper')
          if (!wrapper) return
          if (wrapper.scrollHeight > wrapper.clientHeight) {
            const maxScroll = wrapper.scrollHeight - wrapper.clientHeight
            const nextScroll = wrapper.scrollTop >= maxScroll ? 0 : wrapper.scrollTop + 1
            wrapper.scrollTop = nextScroll
          }
        })
      }, 60)
    }
  },
})
</script>



<style scoped>
.main-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 20px;
  margin-top: 20px;
}
.box {
  position: relative;
  border-radius: 14px;
  padding: 10px 20px 20px;
  background: linear-gradient(135deg, rgba(18, 43, 77, 0.6), rgba(10, 31, 60, 0.7));
  backdrop-filter: blur(10px);
  color: #e0e9ff;
}
.box-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #fff;
}
.box-body p {
  margin: 0 0 5px;
}
.small {
  height: 275px;
}
.big {
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  height: 570px;
}
.el-table {
  background-color: rgba(18, 43, 77, 0.6);
  overflow: hidden;
  color: #e0e9ff;
  backdrop-filter: blur(6px);
  font-size: 14px;
  --el-table-header-bg-color: transparent !important;
  --el-table-bg-color: transparent !important;
  --el-table-tr-bg-color: transparent !important;
  --el-table-current-row-bg-color: transparent !important;
  --el-table-row-hover-bg-color: transparent !important;
  --el-table-expanded-cell-bg-color: transparent !important;
}

/* 表头背景 */
.el-table th {
  background-color: rgba(10, 31, 60, 0.8) !important;
  color: #ffffff !important;
  font-weight: bold;
}

/* 表格行背景 */
.el-table tr {
  background-color: transparent !important;
}

/* 鼠标悬浮高亮行 */
.el-table__body tr:hover > td {
  background-color: rgba(0, 191, 255, 0.1) !important;
}

/* 单元格边框颜色柔和 */
.el-table td,
.el-table th.is-leaf {
  border-color: rgba(255, 255, 255, 0.1);
}

/* tag 风格优化 */
.el-tag {
  background-color: #1a4d65;
  border: none;
  color: #e0f7ff;
}
</style>
