<template>
  <div class="dashboard-container">
    <el-container>
      <el-header class="el-header">
        <div class="header-left">
          <h1 class="title">机场大道下穿洋浦大街桥隧道监测看板</h1>
        </div>
        <div class="header-right">
          <span class="time">{{ currentTime }}</span>
          <el-avatar :size="32" src="/avatar.png" style="margin: 0 10px" />
          <span class="username">管理员</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="el-aside">
          <el-menu :default-active="$route.path" router class="el-menu" unique-opened>
            <el-menu-item index="/">首页</el-menu-item>

            <el-sub-menu index="/monitor">
              <template #title>设备监控</template>
              <el-menu-item index="/monitor/temp">温湿度监测</el-menu-item>
              <el-menu-item index="/monitor/structure-temp">结构温度监测</el-menu-item>
              <el-menu-item index="/monitor/air">空气质量监测</el-menu-item>
              <el-menu-item index="/monitor/strain">结构应变监测</el-menu-item>
              <el-menu-item index="/monitor/water">积水监测</el-menu-item>
              <el-menu-item index="/monitor/expansion">变形缝位移监测</el-menu-item>
              <el-menu-item index="/monitor/settlement">节段沉降监测</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/alerts">
              <template #title>预警记录</template>
              <el-menu-item index="/alerts/sensor-value">数值预警</el-menu-item>
              <el-menu-item index="/alerts/sensor-onoffline">设备预警</el-menu-item>
              <el-menu-item index="/alerts/sensor-threshold-settings">传感器阈值设置</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/analysis"> 
              <template #title>数据分析</template>
              <el-menu-item index="/analysis/temp">温湿度分析</el-menu-item>
              <el-menu-item index="/analysis/structure-temp">结构温度分析</el-menu-item>
              <el-menu-item index="/analysis/air">空气质量分析</el-menu-item>
              <el-menu-item index="/analysis/strain">结构应变分析</el-menu-item>
              <el-menu-item index="/analysis/water">积水分析</el-menu-item>
              <el-menu-item index="/analysis/expansion">变形缝位移分析</el-menu-item>
              <el-menu-item index="/analysis/settlement">节段沉降分析</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/sensors">传感器管理</el-menu-item>

            <el-sub-menu index="/user">
              <template #title>用户管理</template>
              <el-menu-item index="/user/list">用户列表</el-menu-item>
              <el-menu-item index="/user/roles">角色管理</el-menu-item>
              <el-menu-item index="/user/permissions">权限设置</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/settings">
              <template #title>系统设置</template>
              <el-menu-item index="/settings/homesetting">首页配置</el-menu-item>
              <el-menu-item index="/settings/logs">日志管理</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/logout">退出</el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MainPageComponent from '../components/MainPage/MainPageComponent.vue'

export default {
  components: { MainPageComponent },
  data() {
    return {
      activeMenu: '1',
      currentComponent: 'MainPageComponent',
      currentTime: '',
    }
  },
  mounted() {
    this.updateTime()
    this._timeTimer = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    clearInterval(this._timeTimer)
  },
  methods: {
    handleMenuSelect(index) {
      this.activeMenu = index
      const map = {
        1: 'MainPageComponent',
        // 后续可映射更多组件名
      }
      this.currentComponent = map[index] || 'MainPageComponent'
    },
    updateTime() {
      const now = new Date()
      const yyyy = now.getFullYear()
      const MM = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      this.currentTime = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
    },
  },
}
</script>

<style scoped>
.dashboard-container {
  background-color: #0a1f3c;
  color: #fff;
  min-height: 100vh;
}

.el-header {
  background-color: #122b4d;
  color: #ffffff;
  text-align: center;
  font-size: 48px;
  padding: 10px 0;
  height: 100px;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.header-left {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.header-right {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #e0e9ff;
}
.el-aside {
  background-color: transparent;
  padding-top: 20px;
  overflow-y: scroll;
  max-height: 900px;
}

.el-menu {
  background: rgba(18, 43, 77, 0.6);
  border-right: none;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 10px;
  font-style: initial;
  --el-menu-bg-color: rgba(18, 43, 77, 0.6);
  --el-menu-text-color: #e0e9ff;
  --el-menu-item-font-size: 16px;
}

.el-menu-item,
.el-sub-menu__title {
  color: #e0e9ff;
  border-radius: 8px;
  margin-bottom: 5px;
  font-style: initial;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.el-menu-item.is-active {
  background: linear-gradient(135deg, #1e90ff 0%, #00bfff 100%);
  color: #ffffff;
  box-shadow: 0 0 8px rgba(0, 191, 255, 0.5);
  font-weight: bold;
  border-radius: 8px;
}

.el-sub-menu .el-menu-item {
  background-color: rgba(18, 43, 77, 0.6);
  font-style: initial;
}

.title {
  font-size: 48px;
  font-weight: bold;
}

.main-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 20px;
  margin-top: 20px;
}

/* 设置每个模块样式 */
.box {
  position: relative;
  border-radius: 14px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(18, 43, 77, 0.6), rgba(10, 31, 60, 0.7));
  backdrop-filter: blur(10px);
  color: #e0e9ff;
}

/* 控制大小 */
.small {
  height: 275px;
}

.big {
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  height: 570px;
}
:root {
  --el-menu-text-color: #e0e9ff !important;
  --el-menu-bg-color: rgba(18, 43, 77, 0.6) !important;
}
</style>
