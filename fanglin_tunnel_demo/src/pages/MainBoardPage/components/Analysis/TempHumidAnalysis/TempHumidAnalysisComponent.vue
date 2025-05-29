<template>
  <div class="temp-humidity-analysis">
    <el-card>
      <el-form :inline="true" label-width="100px">
        <el-form-item label="传感器">
          <el-select v-model="selectedSensor" placeholder="请选择传感器" style="width: 200px">
            <el-option v-for="sensor in sensors" :key="sensor.id" :label="sensor.name" :value="sensor.id" />
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
            <el-checkbox label="最大湿度" />
            <el-checkbox label="最小湿度" />
            <el-checkbox label="平均湿度" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="analyze">开始分析</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 温度分析 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <ChartCard title="温度分析" :option="temperatureChartOption" style="height: 300px;"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h3>温度数据</h3>
          <el-table :data="temperaturePagedTable" border>
            <el-table-column label="时间" prop="time" />
            <el-table-column v-for="key in temperatureMetrics" :key="key" :label="key" :prop="key" />
          </el-table>
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="temperatureTable.length"
            :page-size="pageSize"
            :current-page="temperaturePage"
            @current-change="val => temperaturePage = val"
            style="margin-top: 10px; text-align: right"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 湿度分析 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <ChartCard title="湿度分析" :option="humidityChartOption" style="height: 300px;"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h3>湿度数据</h3>
          <el-table :data="humidityPagedTable" border>
            <el-table-column label="时间" prop="time" />
            <el-table-column v-for="key in humidityMetrics" :key="key" :label="key" :prop="key" />
          </el-table>
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="humidityTable.length"
            :page-size="pageSize"
            :current-page="humidityPage"
            @current-change="val => humidityPage = val"
            style="margin-top: 10px; text-align: right"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChartCard from '@/components/CommonComponents/ChartCard.vue'
import { ElMessage } from 'element-plus'

// 模拟传感器列表
const sensors = [
  { id: 1, name: '温湿度传感器 1' },
  { id: 2, name: '温湿度传感器 2' },
]

const selectedSensor = ref(null)
const dateRange = ref([])
const granularity = ref('')
const selectedMetrics = ref([])

const temperatureMetrics = ref([])
const humidityMetrics = ref([])

const temperatureTable = ref([])
const humidityTable = ref([])

const temperatureChartOption = ref({})
const humidityChartOption = ref({})

const temperaturePage = ref(1)
const humidityPage = ref(1)
const pageSize = 5

const temperaturePagedTable = computed(() => {
  const start = (temperaturePage.value - 1) * pageSize
  return temperatureTable.value.slice(start, start + pageSize)
})

const humidityPagedTable = computed(() => {
  const start = (humidityPage.value - 1) * pageSize
  return humidityTable.value.slice(start, start + pageSize)
})

function analyze() {
  if (!selectedSensor.value || !dateRange.value.length || !granularity.value || !selectedMetrics.value.length) {
    return ElMessage.warning('请完整选择传感器、时间范围、统计周期和分析项')
  }

  const timestamps = Array.from({ length: 20 }, (_, i) => `2025-05-${String(i + 1).padStart(2, '0')}`)
  temperatureMetrics.value = selectedMetrics.value.filter(m => m.includes('温'))
  humidityMetrics.value = selectedMetrics.value.filter(m => m.includes('湿'))

  temperatureTable.value = timestamps.map(time => {
    const row = { time }
    temperatureMetrics.value.forEach(metric => {
      row[metric] = (Math.random() * 10 + 20).toFixed(1)
    })
    return row
  })

  humidityTable.value = timestamps.map(time => {
    const row = { time }
    humidityMetrics.value.forEach(metric => {
      row[metric] = (Math.random() * 20 + 50).toFixed(1)
    })
    return row
  })

  temperatureChartOption.value = {
    tooltip: { trigger: 'axis' },
    legend: { top: 'top' },
    xAxis: { type: 'category', data: timestamps },
    yAxis: { type: 'value' },
    series: temperatureMetrics.value.map(metric => ({
      name: metric,
      type: 'line',
      data: temperatureTable.value.map(row => row[metric]),
    })),
  }

  humidityChartOption.value = {
    tooltip: { trigger: 'axis' },
    legend: { top: 'top' },
    xAxis: { type: 'category', data: timestamps },
    yAxis: { type: 'value' },
    series: humidityMetrics.value.map(metric => ({
      name: metric,
      type: 'line',
      data: humidityTable.value.map(row => row[metric]),
    })),
  }
}
</script>

<style scoped>
.temp-humidity-analysis {
  padding: 20px;
  background-color: #0a1f3c;
  color: #e0e9ff;
  min-height: 100vh;
}

.el-card {
  background-color: rgba(18, 43, 77, 0.8);
  border: none;
  color: #e0e9ff;
  height: 100%;
}

.el-card h3 {
  color: #e0e9ff;
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
