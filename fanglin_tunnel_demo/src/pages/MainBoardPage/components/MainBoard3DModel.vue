<template>
  <div class="three-wrapper">
    <div ref="container" class="three-container" @mousemove="onMouseMove"></div>
    <div
      class="tooltip"
      v-show="hoverInfo.visible"
      :style="{ left: hoverInfo.x + 'px', top: hoverInfo.y + 'px' }"
    >
      <div>
        <strong>{{ hoverInfo.name }}</strong>
      </div>
      <div>状态: {{ hoverInfo.status }}</div>
      <div>数值: {{ hoverInfo.value }}</div>
      <div>预警级别: {{ hoverInfo.level }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick, reactive } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  mode: { type: String, default: 'wireframe' },
})

const container = ref(null)
let scene, camera, renderer, controls, modelGroup
let flyThrough = false
let flyProgress = 0
let flyStart = new THREE.Vector3()
let flyEnd = new THREE.Vector3()

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const sensorObjects = []

const hoverInfo = reactive({
  visible: false,
  x: 0,
  y: 0,
  name: '',
  status: '',
  value: '',
  level: '',
})

const sensorList = [
  {
    id: 1,
    name: '温湿度A',
    status: 'normal',
    value: '23.5℃ / 60%',
    level: '正常',
  },
  {
    id: 2,
    name: '应变B',
    status: 'error',
    value: '2.3 mm',
    level: '严重',
  },
  {
    id: 3,
    name: '沉降C',
    status: 'offline',
    value: '无数据',
    level: '离线',
  },
]

const getStatusColor = (status) =>
  ({
    normal: 0x00ff88,
    error: 0xff4d4f,
    offline: 0x999999,
  })[status] || 0xffffff

const attachSensors = (center) => {
  sensorList.forEach((sensor, i) => {
    const offset = new THREE.Vector3((i - 1) * 20, 0, 0)
    const sensorPos = center.clone().add(offset)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 32),
      new THREE.MeshBasicMaterial({ color: getStatusColor(sensor.status) }),
    )
    sphere.position.copy(sensorPos)
    sphere.userData = sensor
    modelGroup.add(sphere)
    sensorObjects.push(sphere)
  })
}

const initScene = (gltf) => {
  modelGroup = new THREE.Group()

  gltf.scene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      let obj
      if (props.mode === 'wireframe') {
        const edges = new THREE.EdgesGeometry(child.geometry)
        obj = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
      } else {
        obj = child.clone()
        obj.material = child.material.clone()
      }

      obj.position.copy(child.position)
      obj.rotation.copy(child.rotation)
      obj.scale.copy(child.scale)
      modelGroup.add(obj)
    }
  })

  scene.add(modelGroup)

  const box = new THREE.Box3().setFromObject(modelGroup)
  const center = new THREE.Vector3()
  box.getCenter(center)

  modelGroup.position.sub(center)
  modelGroup.rotation.x = -Math.PI / 2

  attachSensors(new THREE.Vector3(0, 10, 0)) // 放在模型中心附近

  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z)
  const distance = maxDim * 0.7
  const isoDir = new THREE.Vector3(1, 1, 1).normalize()

  camera.position.copy(isoDir.multiplyScalar(distance))
  camera.lookAt(0, 0, 0)
  controls.target.set(0, 0, 0)
  controls.update()
}

const onMouseMove = (event) => {
  container.value.addEventListener('click', (event) => {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(sensorObjects)

  if (intersects.length > 0) {
    const sensor = intersects[0].object.userData
    emit('sensor-click', sensor.id)
  }
})
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(sensorObjects)

  if (intersects.length > 0) {
    const sensor = intersects[0].object.userData
    hoverInfo.visible = true
    hoverInfo.name = sensor.name
    hoverInfo.status = sensor.status
    hoverInfo.value = sensor.value
    hoverInfo.level = sensor.level
    hoverInfo.x = event.offsetX + 10
    hoverInfo.y = event.offsetY + 10
  } else {
    hoverInfo.visible = false
  }
}
const emit = defineEmits(['sensor-click'])


onMounted(() => {
  nextTick(() => {
    const width = container.value.clientWidth
    const height = container.value.clientHeight

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0) // 透明背景
    renderer.setSize(width, height)
    container.value.appendChild(renderer.domElement)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
    scene.add(hemiLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)
    scene.add(new THREE.AmbientLight(0x404040))

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/models/text2.gltf',
      (gltf) => initScene(gltf),
      undefined,
      (error) => console.error('模型加载失败:', error),
    )

    const animate = () => {
      requestAnimationFrame(animate)
      if (flyThrough) {
        flyProgress += 0.002
        if (flyProgress >= 1) {
          flyProgress = 1
          flyThrough = false
        }
        const pos = new THREE.Vector3().lerpVectors(flyStart, flyEnd, flyProgress)
        camera.position.copy(pos)
        camera.lookAt(0, 0, 0)
      }
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
  })
})

watch(
  () => props.mode,
  () => {
    if (!modelGroup || !scene) return
    scene.remove(modelGroup)
    modelGroup.clear()
    sensorObjects.length = 0

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/models/text2.gltf',
      (gltf) => initScene(gltf),
      undefined,
      (error) => console.error('重新加载模型失败:', error),
    )
  },
)
</script>

<style scoped>
.three-wrapper {
  position: relative;
}
.three-container {
  width: 100%;
  height: 500px;
  background-color: transparent;
  position: relative;
}
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}
</style>
