<template>
  <div class="sensor-monitor-page">
    <el-card class="config-panel">
      <el-form :inline="true" label-width="100px">
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

    <!-- 积水监测模块 -->
    <el-card class="monitor-row">
      <div class="monitor-container">
        <div class="chart-container" ref="waterChartRef"></div>
        <div class="table-wrapper">
          <el-table :data="pagedWaterData" border :max-height="500">
            <el-table-column label="时间" prop="timestamp" />
            <el-table-column label="积水深度 (mm)" prop="value" />
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="5"
            :total="waterData.length"
            :current-page="currentWaterPage"
            @current-change="val => currentWaterPage = val"
            class="pagination-right"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'WaterDepthMonitor',
  setup() {
    const collectorList = ref([
      { id: 'c1', name: '采集仪 A' },
      { id: 'c2', name: '采集仪 B' },
    ])
    const sensorList = ref([
      { id: 's1', name: '传感器1' },
      { id: 's2', name: '传感器2' },
    ])
    const selectedCollector = ref(null)
    const selectedSensor = ref(null)
    const maxData = ref(100)

    const waterData = ref([])
    const currentWaterPage = ref(1)
    const pageSize = 5

    const waterChartRef = ref(null)
    let waterChartInstance = null

    const pagedWaterData = computed(() => {
      const start = (currentWaterPage.value - 1) * pageSize
      const end = start + pageSize
      return [...waterData.value].reverse().slice(start, end)
    })

    const updateChart = (chart, data, label) => {
      if (!chart) return
      chart.setOption({
        xAxis: {
          type: 'category',
          data: data.map(d => d.timestamp),
          axisLabel: { color: '#fff' },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#fff' },
        },
        series: [
          {
            data: data.map(d => d.value),
            type: 'line',
            name: label,
            smooth: true,
          },
        ],
        tooltip: { trigger: 'axis' },
        backgroundColor: 'transparent',
      })
    }

    const startMonitoring = () => {
      waterData.value = []
      clearInterval(window._sensorTimer)
      window._sensorTimer = setInterval(() => {
        const now = new Date().toLocaleTimeString()
        if (waterData.value.length >= maxData.value) waterData.value.shift()
        const randomDepth = +(Math.random() * 100).toFixed(1) // 模拟0~100mm的积水
        waterData.value.push({ timestamp: now, value: randomDepth })

        updateChart(waterChartInstance, waterData.value, '积水深度')
        currentWaterPage.value = 1
      }, 1000)
    }

    onMounted(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          if (waterChartRef.value && waterChartRef.value.clientWidth > 0) {
            waterChartInstance = echarts.init(waterChartRef.value)
            updateChart(waterChartInstance, waterData.value, '积水深度')
          }

          window.addEventListener('resize', () => {
            waterChartInstance?.resize()
          })
        })
      })
    })

    return {
      collectorList,
      sensorList,
      selectedCollector,
      selectedSensor,
      maxData,
      waterData,
      pagedWaterData,
      currentWaterPage,
      pageSize,
      startMonitoring,
      waterChartRef,
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
.monitor-row {
  background: rgba(18, 43, 77, 0.7);
  border-radius: 12px;
  margin-bottom: 20px;
  backdrop-filter: blur(6px);
  color: #fff;
}
.monitor-container {
  display: flex;
  gap: 20px;
}
.chart-container {
  flex: 1;
  height: 300px;
  min-width: 300px;
}
.table-wrapper {
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pagination-right {
  text-align: right;
  margin-top: 10px;
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
.el-table th {
  background-color: rgba(10, 31, 60, 0.8) !important;
  color: #ffffff !important;
  font-weight: bold;
}
.el-table tr {
  background-color: transparent !important;
}
.el-table__body tr:hover > td {
  background-color: rgba(0, 191, 255, 0.1) !important;
}
.el-table td,
.el-table th.is-leaf {
  border-color: rgba(255, 255, 255, 0.1);
}
.el-tag {
  background-color: #1a4d65;
  border: none;
  color: #e0f7ff;
}
</style>
