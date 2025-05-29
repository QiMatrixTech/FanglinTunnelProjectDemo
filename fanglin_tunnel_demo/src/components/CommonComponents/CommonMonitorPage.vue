<template>
  <div class="sensor-monitor-page">
    <el-card class="config-panel">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="采集仪">
          <el-select v-model="selectedCollector" placeholder="选择采集仪" style="width: 180px">
            <el-option
              v-for="item in collectorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="传感器">
          <el-select v-model="selectedSensor" placeholder="选择传感器" style="width: 180px">
            <el-option
              v-for="item in sensorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="最大数据量">
          <el-input-number v-model="maxData" :min="10" :max="1000" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="startMonitoring">开始监测</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="chart-panel">
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <el-card class="table-panel">
      <el-table :data="pagedData" border>
        <el-table-column label="时间" prop="timestamp" />
        <el-table-column label="数值" prop="value" />
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="realtimeData.length"
        v-model:current-page="currentPage"
        style="text-align: right; margin-top: 10px"
      />
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'SensorMonitorPage',
  setup() {
    const collectorList = ref([
      { id: 'c1', name: '采集仪 A' },
      { id: 'c2', name: '采集仪 B' },
    ])
    const sensorList = ref([
      { id: 's1', name: '温湿度1' },
      { id: 's2', name: '温湿度2' },
    ])

    const selectedCollector = ref(null)
    const selectedSensor = ref(null)
    const maxData = ref(100)

    const realtimeData = ref([])
    const currentPage = ref(1)
    const pageSize = 10

    const chartRef = ref(null)
    let chartInstance = null

    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      return realtimeData.value.slice(start, start + pageSize)
    })

    const initChart = () => {
      chartInstance = echarts.init(chartRef.value)
      updateChart()
    }

    const updateChart = () => {
      chartInstance.setOption({
        xAxis: {
          type: 'category',
          data: realtimeData.value.map(d => d.timestamp),
          axisLabel: { color: '#fff' },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#fff' },
        },
        series: [
          {
            data: realtimeData.value.map(d => d.value),
            type: 'line',
            smooth: true,
          },
        ],
        tooltip: { trigger: 'axis' },
        backgroundColor: 'transparent',
      })
    }

    const startMonitoring = () => {
      realtimeData.value = []
      clearInterval(window._sensorTimer)
      window._sensorTimer = setInterval(() => {
        if (realtimeData.value.length >= maxData.value) {
          realtimeData.value.shift()
        }
        realtimeData.value.push({
          timestamp: new Date().toLocaleTimeString(),
          value: Math.random() * 100,
        })
        updateChart()
      }, 1000)
    }

    onMounted(() => {
      initChart()
    })

    return {
      collectorList,
      sensorList,
      selectedCollector,
      selectedSensor,
      maxData,
      realtimeData,
      pagedData,
      currentPage,
      pageSize,
      startMonitoring,
      chartRef,
    }
  },
}
</script>

<style scoped>
.sensor-monitor-page {
  padding: 20px;
  color: #e0e9ff;
}
.config-panel,
.chart-panel,
.table-panel {
  background: rgba(18, 43, 77, 0.7);
  border-radius: 12px;
  margin-bottom: 20px;
  backdrop-filter: blur(6px);
  color: #fff;
}
.chart-container {
  width: 100%;
  height: 400px;
}
.el-dialog {
  background: #1c2b4a;
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
