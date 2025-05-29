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

    <!-- 空气质量监测模块 -->
    <el-card class="monitor-row">
      <div class="monitor-container">
        <div class="chart-container" ref="airChartRef"></div>
        <div class="table-wrapper">
          <el-table :data="pagedAirData" border :max-height="500">
            <el-table-column label="时间" prop="timestamp" />
            <el-table-column label="PM2.5 (μg/m³)" prop="pm25" />
            <el-table-column label="PM10 (μg/m³)" prop="pm10" />
            <el-table-column label="CO₂ (ppm)" prop="co2" />
            <el-table-column label="TVOC (mg/m³)" prop="tvoc" />
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="5"
            :total="airData.length"
            :current-page="currentAirPage"
            @current-change="val => currentAirPage = val"
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
  name: 'AirQualityMonitor',
  setup() {
    const collectorList = ref([
      { id: 'c1', name: '采集仪 A' },
      { id: 'c2', name: '采集仪 B' },
    ])
    const sensorList = ref([
      { id: 's1', name: '空气传感器 A' },
      { id: 's2', name: '空气传感器 B' },
    ])
    const selectedCollector = ref(null)
    const selectedSensor = ref(null)
    const maxData = ref(100)

    const airData = ref([])
    const currentAirPage = ref(1)
    const pageSize = 5

    const airChartRef = ref(null)
    let airChartInstance = null

    const pagedAirData = computed(() => {
      const start = (currentAirPage.value - 1) * pageSize
      const end = start + pageSize
      return [...airData.value].reverse().slice(start, end)
    })

    const updateChart = (chart, data) => {
      if (!chart) return
      const timestamps = data.map(d => d.timestamp)
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['PM2.5', 'PM10', 'CO₂', 'TVOC'], textStyle: { color: '#fff' } },
        xAxis: {
          type: 'category',
          data: timestamps,
          axisLabel: { color: '#fff' },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#fff' },
        },
        series: [
          {
            name: 'PM2.5',
            data: data.map(d => d.pm25),
            type: 'line',
            smooth: true,
          },
          {
            name: 'PM10',
            data: data.map(d => d.pm10),
            type: 'line',
            smooth: true,
          },
          {
            name: 'CO₂',
            data: data.map(d => d.co2),
            type: 'line',
            smooth: true,
          },
          {
            name: 'TVOC',
            data: data.map(d => d.tvoc),
            type: 'line',
            smooth: true,
          },
        ],
        backgroundColor: 'transparent',
      })
    }

    const startMonitoring = () => {
      airData.value = []
      clearInterval(window._sensorTimer)
      window._sensorTimer = setInterval(() => {
        const now = new Date().toLocaleTimeString()
        if (airData.value.length >= maxData.value) airData.value.shift()
        airData.value.push({
          timestamp: now,
          pm25: +(Math.random() * 100).toFixed(1),
          pm10: +(Math.random() * 150).toFixed(1),
          co2: +(400 + Math.random() * 600).toFixed(0),
          tvoc: +(Math.random() * 2).toFixed(2),
        })

        updateChart(airChartInstance, airData.value)
        currentAirPage.value = 1
      }, 1000)
    }

    onMounted(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          if (airChartRef.value && airChartRef.value.clientWidth > 0) {
            airChartInstance = echarts.init(airChartRef.value)
            updateChart(airChartInstance, airData.value)
          }

          window.addEventListener('resize', () => {
            airChartInstance?.resize()
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
      airData,
      pagedAirData,
      currentAirPage,
      pageSize,
      startMonitoring,
      airChartRef,
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
</style>
