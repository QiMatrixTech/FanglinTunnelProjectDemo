<template>
  <div class="structure-temp-analysis">
    <!-- 筛选条件 -->
    <el-card>
      <el-form :inline="true" label-width="100px">
        <el-form-item label="传感器">
          <el-select v-model="selectedSensor" placeholder="请选择传感器" style="width: 200px">
            <el-option
              v-for="sensor in sensors"
              :key="sensor.id"
              :label="sensor.name"
              :value="sensor.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="统计周期">
          <el-select v-model="granularity" placeholder="请选择粒度" style="width: 120px">
            <el-option label="小时" value="hour" />
            <el-option label="天" value="day" />
            <el-option label="周" value="week" />
            <el-option label="月" value="month" />
            <el-option label="年" value="year" />
          </el-select>
        </el-form-item>

        <el-form-item label="分析项">
          <el-checkbox-group v-model="selectedMetrics">
            <el-checkbox label="最高温度" />
            <el-checkbox label="最低温度" />
            <el-checkbox label="平均温度" />
            <el-checkbox label="温差" />
            <el-checkbox label="最大温度梯度" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="analyze">开始分析</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表 -->
    <el-card style="margin-top: 20px; height: 400px">
      <div ref="chartRef" class="chart-container" />
    </el-card>

    <!-- 表格 -->
    <el-card style="margin-top: 20px">
      <h3>结构温度数据</h3>
      <el-table :data="pagedTable" border>
        <el-table-column label="时间" prop="time" />
        <el-table-column
          v-for="metric in selectedMetrics"
          :key="metric"
          :label="metric"
          :prop="metric"
        />
      </el-table>
      <el-pagination
        background
        small
        layout="prev, pager, next"
        :total="tableData.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="(val) => (currentPage = val)"
        style="margin-top: 10px; text-align: right"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const sensors = [
  { id: 1, name: '结构温度传感器 A' },
  { id: 2, name: '结构温度传感器 B' },
]

const allMetrics = ['最高温度', '最低温度', '平均温度', '温差', '最大温度梯度']
const selectedMetrics = ref([])
const granularity = ref('')
const selectedSensor = ref(null)
const dateRange = ref([])
const tableData = ref([])
const chartRef = ref(null)
let chartInstance = null

const currentPage = ref(1)
const pageSize = 5

const pagedTable = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return tableData.value.slice(start, start + pageSize)
})

function initChart(option) {
  nextTick(() => {
    setTimeout(() => {
      const container = chartRef.value
      if (!container || container.clientHeight === 0 || container.clientWidth === 0) {
        console.warn('[ECharts] 容器尚未准备好，高度或宽度为 0')
        return
      }

      if (!chartInstance) {
        chartInstance = echarts.init(container)
        window.addEventListener('resize', () => chartInstance?.resize())
      }

      chartInstance.setOption(option)
    }, 50)
  })
}

function analyze() {
  if (!selectedSensor.value || !dateRange.value.length || !selectedMetrics.value.length) {
    return ElMessage.warning('请完整选择传感器、时间范围和分析项')
  }

  const timestamps = Array.from(
    { length: 20 },
    (_, i) => `2025-05-${String(i + 1).padStart(2, '0')}`,
  )

  tableData.value = timestamps.map((time) => {
    const row = { time }
    selectedMetrics.value.forEach((metric) => {
      row[metric] = (Math.random() * 10 + 20).toFixed(1)
    })
    return row
  })

  currentPage.value = 1

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { top: 'top' },
    xAxis: { type: 'category', data: timestamps },
    yAxis: { type: 'value' },
    series: selectedMetrics.value.map((metric) => ({
      name: metric,
      type: 'line',
      data: tableData.value.map((row) => row[metric]),
    })),
  }

  initChart(option)
}
</script>

<style scoped>
.structure-temp-analysis {
  padding: 20px;
  background-color: #0a1f3c;
  color: #e0e9ff;
  min-height: 100vh;
}

.el-card {
  background-color: rgba(18, 43, 77, 0.8);
  border: none;
  color: #e0e9ff;
}

.el-card h3 {
  color: #e0e9ff;
}

.chart-container {
  width: 100%;
  height: 400px;
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
