<template>
  <div class="sensor-manage-page">
    <el-row gutter="20">
      <!-- 左侧类型树 -->
      <el-col :span="6">
        <el-card shadow="hover" class="type-tree-card">
          <template #header>
            <div class="tree-header">
              <span>采集结构</span>
              <el-button type="primary" size="small" @click="addCollector">新增采集仪</el-button>
            </div>
          </template>
          <el-tree
            :data="collectorTree"
            node-key="id"
            :props="treeProps"
            @node-click="handleNodeClick"
            highlight-current
            accordion
          />
        </el-card>
      </el-col>

      <!-- 右侧信息展示 -->
      <el-col :span="18">
        <el-card v-if="currentCollector" class="collector-detail">
          <template #header>
            <div style="display: flex; justify-content: space-between">
              <span>采集仪信息</span>
              <el-button size="small" type="primary" @click="collectorDialogVisible = true">编辑</el-button>
            </div>
          </template>
          <p><strong>名称：</strong>{{ currentCollector.name }}</p>
          <p><strong>类型：</strong>{{ currentCollector.type }}</p>
          <p><strong>IP地址：</strong>{{ currentCollector.ip }}</p>
          <p><strong>MAC地址：</strong>{{ currentCollector.mac }}</p>
        </el-card>

        <el-card class="sensor-list" style="margin-top: 20px">
          <template #header>
            <div style="display: flex; justify-content: space-between">
              <span>传感器列表</span>
              <el-button size="small" type="primary" @click="sensorDialogVisible = true">新增传感器</el-button>
            </div>
          </template>
          <el-table :data="sensorList" border stripe>
            <el-table-column prop="name" label="传感器名称" />
            <el-table-column prop="channel" label="通道" />
            <el-table-column prop="position" label="位置（米）" />
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="value" label="当前值" />
            <el-table-column prop="status" label="状态" />
            <el-table-column label="操作" width="160">
              <template #default="scope">
                <el-button size="small" @click="editSensor(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteSensor(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 采集仪对话框 -->
    <el-dialog v-model="collectorDialogVisible" title="采集仪信息" width="400px">
      <el-form :model="collectorForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="collectorForm.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="collectorForm.type" />
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="collectorForm.ip" />
        </el-form-item>
        <el-form-item label="MAC地址">
          <el-input v-model="collectorForm.mac" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="collectorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCollector">保存</el-button>
      </template>
    </el-dialog>

    <!-- 传感器对话框 -->
    <el-dialog v-model="sensorDialogVisible" title="传感器信息" width="400px">
      <el-form :model="sensorForm" label-width="100px">
        <el-form-item label="传感器名称">
          <el-input v-model="sensorForm.name" />
        </el-form-item>
        <el-form-item label="通道">
          <el-input v-model="sensorForm.channel" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="sensorForm.unit" />
        </el-form-item>
        <el-form-item label="位置（米）">
          <el-input v-model="sensorForm.position" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="sensorForm.status">
            <el-option label="正常" value="正常" />
            <el-option label="异常" value="异常" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sensorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSensor">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SensorManagePage',
  data() {
    return {
      collectorTree: [
        {
          id: 'type-1',
          label: '温湿度采集',
          children: [
            {
              id: 'collector-1',
              label: '采集仪 A',
              name: '采集仪 A',
              type: '温湿度',
              ip: '192.168.1.10',
              mac: '00-14-22-01-23-45',
            },
          ],
        },
      ],
      treeProps: {
        label: 'label',
        children: 'children',
      },
      currentCollector: null,
      sensorList: [],
      collectorDialogVisible: false,
      sensorDialogVisible: false,
      collectorForm: {
        name: '',
        type: '',
        ip: '',
        mac: '',
      },
      sensorForm: {
        name: '',
        channel: '',
        unit: '',
        position: '',
        status: '正常',
      },
    }
  },
  methods: {
    handleNodeClick(node) {
      if (node.ip) {
        this.currentCollector = node
        this.sensorList = [
          {
            name: '温度传感器 1',
            channel: 1,
            unit: '℃',
            value: '23.5',
            position: 5,
            status: '正常',
          },
        ]
      }
    },
    addCollector() {
      this.collectorForm = { name: '', type: '', ip: '', mac: '' }
      this.collectorDialogVisible = true
    },
    editCollector(collector) {
      this.collectorForm = { ...collector }
      this.collectorDialogVisible = true
    },
    saveCollector() {
      console.log('保存采集仪:', this.collectorForm)
      this.collectorDialogVisible = false
    },
    addSensor() {
      this.sensorForm = { name: '', channel: '', unit: '', position: '', status: '正常' }
      this.sensorDialogVisible = true
    },
    editSensor(sensor) {
      this.sensorForm = { ...sensor }
      this.sensorDialogVisible = true
    },
    saveSensor() {
      console.log('保存传感器:', this.sensorForm)
      this.sensorDialogVisible = false
    },
    deleteSensor(sensor) {
      this.sensorList = this.sensorList.filter(s => s !== sensor)
    },
  },
}
</script>

<style scoped>
.sensor-manage-page {
  padding: 20px;
  color: #e0e9ff;
}
.type-tree-card,
.collector-detail,
.sensor-list {
  background: rgba(18, 43, 77, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(6px);
  color: #fff;
}
.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
