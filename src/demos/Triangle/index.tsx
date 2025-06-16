import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ThreeContainer, { ThreeContext } from '../../components/ThreeContainer'
import { useContext } from 'react'
import './style.css'

const TriangleDemo: React.FC = () => {
  const { scene, camera, renderer } = useContext(ThreeContext)
  const triangleRef = useRef<THREE.Mesh | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const [isVisible, setIsVisible] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(0.01)
  const [color, setColor] = useState('#00ff00')
  const [size, setSize] = useState(1)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    if (!scene || !camera || !renderer) return

    // 清理之前的三角形
    if (triangleRef.current) {
      scene.remove(triangleRef.current)
      triangleRef.current.geometry.dispose()
      if (Array.isArray(triangleRef.current.material)) {
        triangleRef.current.material.forEach(material => material.dispose())
      } else {
        triangleRef.current.material.dispose()
      }
    }

    // 创建三角形
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 1, 0,    // 顶点
      -1, -1, 0,  // 左下
      1, -1, 0    // 右下
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.computeVertexNormals()

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      shininess: 100,
      wireframe: false,
      side: THREE.DoubleSide
    })

    const triangle = new THREE.Mesh(geometry, material)
    triangle.scale.set(size, size, size)
    triangle.visible = isVisible
    scene.add(triangle)
    triangleRef.current = triangle

    // 调整相机位置
    camera.position.z = 3

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // 添加点击事件监听
    const handleClick = (event: MouseEvent) => {
      if (!renderer || !camera || !triangleRef.current) return

      // 计算鼠标在归一化设备坐标中的位置
      const rect = renderer.domElement.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // 更新射线
      raycasterRef.current.setFromCamera(mouseRef.current, camera)

      // 检测射线与三角形的交点
      const intersects = raycasterRef.current.intersectObject(triangleRef.current)

      // 更新调试信息
      setDebugInfo(`
        鼠标位置: (${mouseRef.current.x.toFixed(2)}, ${mouseRef.current.y.toFixed(2)})
        射线起点: (${raycasterRef.current.ray.origin.x.toFixed(2)}, ${raycasterRef.current.ray.origin.y.toFixed(2)}, ${raycasterRef.current.ray.origin.z.toFixed(2)})
        射线方向: (${raycasterRef.current.ray.direction.x.toFixed(2)}, ${raycasterRef.current.ray.direction.y.toFixed(2)}, ${raycasterRef.current.ray.direction.z.toFixed(2)})
        交点数量: ${intersects.length}
      `)

      if (intersects.length > 0) {
        const newVisibility = !triangleRef.current.visible
        triangleRef.current.visible = newVisibility
        setIsVisible(newVisibility)
        // 点击时改变颜色
        (triangleRef.current.material as THREE.MeshPhongMaterial).color.setHex(0xff0000)
        setTimeout(() => {
          if (triangleRef.current) {
            (triangleRef.current.material as THREE.MeshPhongMaterial).color.set(color)
          }
        }, 200)
      }
    }

    renderer.domElement.addEventListener('click', handleClick)

    // 动画循环
    const animate = () => {
      if (!triangleRef.current || !controlsRef.current) return
      requestAnimationFrame(animate)
      triangleRef.current.rotation.z += rotationSpeed
      controlsRef.current.update()
    }
    animate()

    // 清理函数
    return () => {
      renderer.domElement.removeEventListener('click', handleClick)
      if (triangleRef.current) {
        scene.remove(triangleRef.current)
        triangleRef.current.geometry.dispose()
        if (Array.isArray(triangleRef.current.material)) {
          triangleRef.current.material.forEach(material => material.dispose())
        } else {
          triangleRef.current.material.dispose()
        }
      }
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
    }
  }, [scene, camera, renderer, color, rotationSpeed, size])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    if (triangleRef.current) {
      (triangleRef.current.material as THREE.MeshPhongMaterial).color.set(e.target.value)
    }
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotationSpeed(parseFloat(e.target.value))
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseFloat(e.target.value))
  }

  return (
    <ThreeContainer>
      <div className="control-panel">
        <div className="control-item">
          <label>颜色：</label>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
          />
        </div>
        <div className="control-item">
          <label>旋转速度：</label>
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.001"
            value={rotationSpeed}
            onChange={handleSpeedChange}
          />
          <span>{rotationSpeed.toFixed(3)}</span>
        </div>
        <div className="control-item">
          <label>大小：</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={size}
            onChange={handleSizeChange}
          />
          <span>{size.toFixed(1)}</span>
        </div>
        <div className="control-item">
          <label>状态：</label>
          <span>{isVisible ? '显示' : '隐藏'}</span>
        </div>
        <div className="debug-info">
          <pre>{debugInfo}</pre>
        </div>
      </div>
    </ThreeContainer>
  )
}

export default TriangleDemo