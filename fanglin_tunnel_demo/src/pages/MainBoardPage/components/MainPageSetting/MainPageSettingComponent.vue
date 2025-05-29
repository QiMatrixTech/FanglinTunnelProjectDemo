<template>
  <div class="config-page">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0"><h2>首页内容配置</h2></el-col>
      <el-col :span="12" :offset="0">
        <div style="text-align: right; margin-top: 20px">
          <el-button type="primary" @click="saveConfig">保存配置</el-button>
        </div></el-col
      >
    </el-row>

    <el-form :model="configData" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(card, index) in configData.cards" :key="index">
          <el-card shadow="hover" class="config-card">
            <div slot="header">区域 {{ index + 1 }} 配置</div>

            <el-form-item label="模块标题">
              <el-input v-model="card.title" placeholder="例如：结构温度趋势" />
            </el-form-item>

            <el-form-item label="传感器/数据源">
              <el-select v-model="card.sensorId" placeholder="选择传感器">
                <el-option
                  v-for="sensor in sensorList"
                  :key="sensor.id"
                  :label="sensor.name"
                  :value="sensor.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="图表类型">
              <el-select v-model="card.chartType" placeholder="选择类型">
                <el-option label="折线图" value="line" />
                <el-option label="饼图" value="pie" />
                <el-option label="仪表盘" value="gauge" />
              </el-select>
            </el-form-item>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sensorList: [
        { id: 'temp1', name: '温度传感器 A' },
        { id: 'strain2', name: '应变传感器 B' },
        { id: 'humidity3', name: '湿度传感器 C' },
        // ...来自后端接口
      ],
      configData: {
        cards: Array.from({ length: 8 }, (_, i) => ({
          title: `模块 ${i + 1}`,
          sensorId: '',
          chartType: '',
        })),
      },
    }
  },
  methods: {
    saveConfig() {
      // TODO: 发送到后端，或本地存储
      console.log('保存配置:', this.configData)
      this.$message.success('配置已保存')
    },
  },
}
</script>

<style scoped>
.config-page {
  padding: 20px;
  color: #e0e9ff;
}
.config-card {
  background-color: rgba(18, 43, 77, 0.6);
  border-radius: 10px;
  color: #fff;
}
.el-input {
    --el-input-bg-color: rgba(10, 31, 60, 0.7) !important;
}
.el-select {
    --el-select-bg-color: rgba(10, 31, 60, 0.7) !important;
}
</style>
