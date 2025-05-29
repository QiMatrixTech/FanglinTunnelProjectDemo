<template>
  <div class="sensor-threshold-settings">
    <el-card>
      <el-form :inline="true" label-width="100px" class="filter-form" @submit.prevent>
        <el-form-item label="传感器类型">
          <el-select v-model="filter.sensorType" placeholder="请选择类型" clearable style="width: 200px">
            <el-option v-for="type in sensorTypes" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="applyFilter">筛选</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form>
    </el-card>

    <el-table :data="pagedData" border style="margin-top: 20px">
      <el-table-column prop="name" label="传感器名称" />
      <el-table-column prop="type" label="类型" />
      <el-table-column label="蓝色预警">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.thresholds.blue }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="黄色预警">
        <template #default="scope">
          <el-tag type="warning">{{ scope.row.thresholds.yellow }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="红色预警">
        <template #default="scope">
          <el-tag type="danger">{{ scope.row.thresholds.red }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editThreshold(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="filteredData.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="val => currentPage = val"
      style="margin-top: 20px; text-align: right"
    />

    <!-- 编辑阈值对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑阈值" width="400px">
      <el-form label-width="100px" :model="editForm">
        <el-form-item label="蓝色预警">
          <el-input-number v-model="editForm.thresholds.blue" :min="0" />
        </el-form-item>
        <el-form-item label="黄色预警">
          <el-input-number v-model="editForm.thresholds.yellow" :min="0" />
        </el-form-item>
        <el-form-item label="红色预警">
          <el-input-number v-model="editForm.thresholds.red" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveThreshold">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 模拟数据
const sensorData = reactive([
  { id: 1, name: '温湿度传感器 1', type: '温湿度', thresholds: { blue: 30, yellow: 35, red: 40 } },
  { id: 2, name: '空气质量传感器', type: '空气质量', thresholds: { blue: 80, yellow: 120, red: 200 } },
  { id: 3, name: '应变计 1', type: '结构应变', thresholds: { blue: 0.05, yellow: 0.08, red: 0.1 } },
  { id: 4, name: '温湿度传感器 2', type: '温湿度', thresholds: { blue: 28, yellow: 33, red: 38 } },
])

const sensorTypes = [...new Set(sensorData.map(s => s.type))]

const filter = reactive({
  sensorType: '',
})

const currentPage = ref(1)
const pageSize = ref(15)

const filteredData = computed(() => {
  return sensorData.filter(item => {
    return !filter.sensorType || item.type === filter.sensorType
  })
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const dialogVisible = ref(false)
const editForm = ref({
  id: null,
  thresholds: { blue: 0, yellow: 0, red: 0 },
})

function editThreshold(row) {
  editForm.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

function saveThreshold() {
  const index = sensorData.findIndex(item => item.id === editForm.value.id)
  if (index !== -1) {
    sensorData[index].thresholds = { ...editForm.value.thresholds }
  }
  dialogVisible.value = false
}

function applyFilter() {
  currentPage.value = 1
}

function resetFilter() {
  filter.sensorType = ''
  currentPage.value = 1
}
</script>

<style scoped>
.sensor-threshold-settings {
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
