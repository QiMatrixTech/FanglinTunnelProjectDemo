<template>
  <div ref="chart" class="chart-container" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ChartCard',
  props: {
    option: Object
  },
  data() {
    return {
      chartInstance: null,
      retryCount: 0
    }
  },
  mounted() {
    this.tryInitChart()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
    this.chartInstance?.dispose()
  },
  methods: {
    tryInitChart() {
      this.$nextTick(() => {
        const container = this.$refs.chart
        const height = container?.clientHeight

        console.log('🔍 chart container height:', height)

        if (!container || !height) {
          if (this.retryCount < 10) {
            this.retryCount++
            setTimeout(this.tryInitChart, 100)
          } else {
            console.warn('❌ Chart container still has no height after retries.')
          }
          return
        }

        this.chartInstance = echarts.init(container)
        if (this.option) {
          this.chartInstance.setOption(this.option)
        }
      })
    },
    resizeChart() {
      this.chartInstance?.resize()
    }
  },
  watch: {
    option: {
      deep: true,
      handler(newOption) {
        if (this.chartInstance) {
          this.chartInstance.setOption(newOption, true)
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
