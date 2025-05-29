<template>
  <div class="sensor-alerts">
    <el-card>
      <el-form :inline="true" label-width="100px" class="filter-form" @submit.prevent>
        <el-form-item label="记录仪类型">
          <el-select
            v-model="filter.collectorType"
            placeholder="请选择类型"
            clearable
            style="width: 180px"
          >
            <el-option v-for="item in collectorTypes" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="pagedData" border style="margin-top: 20px">
      <el-table-column prop="sensorName" label="传感器名称" />
      <el-table-column prop="collectorType" label="记录仪类型" />
      <el-table-column prop="alertType" label="预警类型" />
      <el-table-column prop="alertRank" label="预警等级" />
      <el-table-column prop="value" label="数值" />
      <el-table-column prop="timestamp" label="发生时间" />
      <el-table-column prop="solveTimestamp" label="处理时间" />
      <el-table-column prop="solveStaff" label="处理人" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="!scope.row.handled"
            size="small"
            type="danger"
            @click="markAsHandled(scope.row)"
          >
            处理
          </el-button>
          <span v-else style="color: #67c23a">已处理</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="filteredData.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="(val) => (currentPage = val)"
      style="margin-top: 20px; text-align: right"
    />
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'

// 模拟传感器预警数据
const alertData = reactive([
  /* 模拟多条数据，至少30条来测试分页效果 */
  ...Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    sensorName: `传感器${i + 1}`,
    collectorType: ['温湿度采集仪', '空气质量采集仪', '应变采集仪'][i % 3],
    alertType: ['温度超标', 'PM2.5超标', '应变异常'][i % 3],
    value: `${Math.floor(Math.random() * 100)}${i % 3 === 1 ? ' μg/m³' : i % 3 === 2 ? '%' : '℃'}`,
    timestamp: new Date(Date.now() - i * 60000).toISOString().slice(0, 19).replace('T', ' '),
    handled: i % 5 === 0,
    solveTimestamp: i % 5 === 0 ? new Date(Date.now() - i * 60000 + 300000).toISOString().slice(0, 19).replace('T', ' ') : '',
    solveStaff: i % 5 === 0 ? `处理人${i + 1}` : '',
    alertRank: ['蓝色', '黄色', '红色'][i % 3],
  })),
])

const filter = reactive({
  collectorType: '',
  dateRange: [],
})

const currentPage = ref(1)
const pageSize = ref(15)

const collectorTypes = ['温湿度采集仪', '空气质量采集仪', '应变采集仪']

// 筛选后的全部数据
const filteredData = computed(() => {
  return alertData.filter((item) => {
    const typeMatch = !filter.collectorType || item.collectorType === filter.collectorType
    const timeMatch =
      !filter.dateRange.length ||
      (new Date(item.timestamp) >= new Date(filter.dateRange[0]) &&
        new Date(item.timestamp) <= new Date(filter.dateRange[1]))
    return typeMatch && timeMatch
  })
})

// 当前页的数据
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

function applyFilter() {
  currentPage.value = 1
}

function resetFilter() {
  filter.collectorType = ''
  filter.dateRange = []
  currentPage.value = 1
}

function markAsHandled(row) {
  row.handled = true
}
</script>

<style scoped>
.sensor-alerts {
  padding: 20px;
  color: #fff;
}

.filter-form {
  margin-bottom: 20px;
}

.el-card {
  background-color: rgba(18, 43, 77, 0.8);
  border: none;
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
