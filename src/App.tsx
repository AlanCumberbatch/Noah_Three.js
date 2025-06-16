import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function App() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return

    // 创建场景
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1) // 设置黑色背景
    mountRef.current.appendChild(renderer.domElement)

    // 创建三角形
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0.0, 1.0, 0.0,   // 顶点1
      -1.0, -1.0, 0.0, // 顶点2
      1.0, -1.0, 0.0   // 顶点3
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

    // 创建材质
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.FrontSide
    })

    // 创建网格
    const triangle = new THREE.Mesh(geometry, material)
    scene.add(triangle)

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate)

      // 清除之前的渲染
      renderer.clear()

      // 更新三角形旋转
      triangle.rotation.x += 0.01
      triangle.rotation.y += 0.01

      // 渲染场景
      renderer.render(scene, camera)
    }
    animate()

    // 处理窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
  )
}

export default App
