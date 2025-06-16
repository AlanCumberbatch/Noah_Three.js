import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './App.css'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 创建场景
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x1a1a1a)

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    cameraRef.current = camera
    camera.position.set(0, 0, 5)

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // 创建三角形
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 1, 0,    // 顶点
      -1, -1, 0,  // 左下
      1, -1, 0    // 右下
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.computeVertexNormals()

    // 创建双面材质
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 100,
      side: THREE.DoubleSide
    })

    // 创建三角形
    const triangle = new THREE.Mesh(geometry, material)
    scene.add(triangle)

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040, 1)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls; // 保存控制器引用
    controls.enableDamping = true; // 启用阻尼效果（惯性）
    controls.dampingFactor = 0.25; // 阻尼系数
    controls.enableZoom = true; // 允许缩放
    controls.enablePan = true; // 允许平移
    controls.enableRotate = true; // 允许旋转
    controls.autoRotate = false; // 禁用自动旋转
    controls.minDistance = 2; // 缩放的最近距离
    controls.maxDistance = 10; // 缩放的最远距离
    controls.rotateSpeed = 1.0; // 旋转速度
    controls.zoomSpeed = 1.0; // 缩放速度
    controls.panSpeed = 1.0; // 平移速度
    controls.target.set(0, 0, 0); // 设置控制器的目标点

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate)

      // 更新控制器
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      // 三角形旋转
      triangle.rotation.z += 0.01

      // 渲染场景
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    // 处理窗口大小变化
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
  )
}

export default App
