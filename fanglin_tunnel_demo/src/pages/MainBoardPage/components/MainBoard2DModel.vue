<template>
  <div class="tunnel-container">
    <div
      class="tunnel-map"
      v-for="(section, index) in 2"
      :key="index"
    >
      <img src="/tunnel.png" alt="tunnel" class="tunnel-background" />
      <div
        v-for="sensor in sensors.filter(s => s.section === index)"
        :key="sensor.id"
        class="sensor-dot"
        :style="{
          left: sensor.x + 'px',
          top: scaleY(sensor.y) + 'px',
          backgroundColor: getColor(sensor.status),
        }"
        @click="$emit('sensor-click', sensor.id)"
      >
        <div class="tooltip">
          <strong>{{ sensor.name }}</strong><br />
          状态: {{ sensor.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TunnelOverview2D',
  data() {
    return {
      /**
       * 每张图原始大小为 1250 × 300 px，实际显示为 1250 × 210 px
       */
      sensors: [
        { id: 1, name: '温湿度A', section: 0, x: 200, y: 100, status: 'normal' },
        { id: 2, name: '应变B', section: 0, x: 600, y: 200, status: 'error' },
        { id: 3, name: '沉降C', section: 1, x: 400, y: 150, status: 'offline' },
        { id: 4, name: '应变D', section: 1, x: 900, y: 250, status: 'normal' },
      ],
    }
  },
  methods: {
    getColor(status) {
      return {
        normal: '#00ff88',
        error: '#ff4d4f',
        offline: '#999999',
      }[status] || '#ffffff'
    },
    scaleY(y) {
      const originalHeight = 300
      const currentHeight = 210
      return (y / originalHeight) * currentHeight
    },
  },
}
</script>

<style scoped>
.tunnel-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.tunnel-map {
  position: relative;
  width: 1250px;
  height: 210px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #000;
}

.tunnel-background {
  width: 100%;
  height: 100%;
  display: block;
}

.sensor-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

.sensor-dot .tooltip {
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  white-space: nowrap;
  display: none;
  z-index: 10;
}

.sensor-dot:hover .tooltip {
  display: block;
}
</style>
