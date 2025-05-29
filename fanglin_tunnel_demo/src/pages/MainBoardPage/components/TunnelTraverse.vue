<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  mode: { type: String, default: 'wireframe' }, // 模型显示模式
  pathName: {
    type: String,
    default: 'FamilyInstance_常规模型_MS1道路结构层_<368006_MS1道路结构层<',
  }, // 'MS1道路结构层' 或 'NS1道路'
})

const container = ref(null)
let scene, camera, renderer, controls, mixer
let clock = new THREE.Clock()
let viewLight
let modelGroup = new THREE.Group()
let animationId = null

const getPathPointsFromTwoMeshes = (meshA, meshB, count = 200) => {
  if (!meshA || !meshB) return []

  meshA.updateMatrixWorld(true)
  meshB.updateMatrixWorld(true)

  const boxA = new THREE.Box3().setFromObject(meshA)
  const boxB = new THREE.Box3().setFromObject(meshB)

  const mergedBox = boxA.union(boxB)
  const center = new THREE.Vector3()
  mergedBox.getCenter(center)

  const start = new THREE.Vector3(mergedBox.min.x, center.y - 10, center.z)
  const end = new THREE.Vector3(mergedBox.max.x, center.y - 10, center.z)

  const points = []
  for (let i = 0; i <= count; i++) {
    const t = i / count
    points.push(new THREE.Vector3().lerpVectors(start, end, t))
  }
  return points
}

const traverseTunnel = (points) => {
  let t = 0
  const total = points.length - 1

  const move = () => {
    const index = Math.floor(t)
    if (index >= total) {
      t = 0 // ✅ 重置 t，实现循环播放
    }

    const current = points[index]
    const next = points[index + 1]
    const lookDir = next.clone().sub(current).normalize()

    camera.position.copy(current)
    camera.lookAt(current.clone().add(lookDir))

    // ✅ 更新视角光源位置与目标
    viewLight.position.copy(camera.position)
    viewLight.target.position.copy(camera.position.clone().add(lookDir))

    t += 0.05
    renderer.render(scene, camera)
    animationId = requestAnimationFrame(move)
  }

  move()
}

const loadModelAndAnimate = (gltf) => {
  scene.add(modelGroup)
  modelGroup.clear()

  const includeNames = [props.pathName]
  if (props.pathName.includes('MS1道路结构层')) {
    includeNames.push('MS1-MS12')
  }

  let ms12Mesh = null
  let roadMesh = null
  modelGroup.clear()
  scene.add(modelGroup)
  gltf.scene.traverse((child) => {
    const applyWireframe = (mesh) => {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => {
          mat.wireframe = props.mode === 'wireframe'
        })
      } else {
        mesh.material.wireframe = props.mode === 'wireframe'
      }
    }

    if (child.isMesh && child.name.includes('MS1-MS12')) {
      ms12Mesh = child.clone()
      applyWireframe(ms12Mesh)
      modelGroup.add(ms12Mesh)
    } else if (child.isMesh && child.name.includes('MS1道路结构层')) {
      roadMesh = child.clone()
      applyWireframe(roadMesh)
      modelGroup.add(roadMesh)
    }
  })
  const centerModelGroup = (group) => {
    const box = new THREE.Box3().setFromObject(group)
    const center = new THREE.Vector3()
    box.getCenter(center)
    group.position.sub(center) // 将模型中心平移到原点
  }
  modelGroup.rotation.set(-Math.PI / 2, 0, 0)
  adjustCameraToFit(modelGroup, 0.6)
  centerModelGroup(modelGroup)
  scene.add(modelGroup)

  const pathPoints = getPathPointsFromTwoMeshes(ms12Mesh, roadMesh)
  traverseTunnel(pathPoints)
}
const adjustCameraToFit = (group, zoomFactor = 0.6) => {
  const box = new THREE.Box3().setFromObject(group)
  const size = new THREE.Vector3()
  box.getSize(size)

  const center = new THREE.Vector3()
  box.getCenter(center)

  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = camera.fov * (Math.PI / 180)
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))

  // 🚀 缩小倍数，让摄像机更近（视角更“放大”）
  cameraZ *= zoomFactor

  camera.position.set(center.x, center.y, cameraZ)
  camera.lookAt(center)
}

onMounted(() => {
  nextTick(() => {
    const width = container.value.clientWidth
    const height = container.value.clientHeight

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 5000)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    container.value.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enabled = false

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1))
    scene.add(new THREE.DirectionalLight(0xffffff, 0.8))
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(100, 200, 100)
    scene.add(dirLight)
    viewLight = new THREE.DirectionalLight(0xffffff, 1)
    viewLight.position.copy(camera.position)
    viewLight.target.position.set(0, 0, 0)
    scene.add(viewLight)
    scene.add(viewLight.target)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    loader.load('/models/text2.gltf', loadModelAndAnimate, undefined, console.error)

    window.addEventListener('resize', () => {
      const width = container.value.clientWidth
      const height = container.value.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    })
  })
})

watch(
  () => props.pathName,
  () => {
    if (animationId) cancelAnimationFrame(animationId)
    scene.remove(modelGroup)
    modelGroup.clear()

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    loader.load('/models/text2.gltf', loadModelAndAnimate, undefined, console.error)
  },
)
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>
