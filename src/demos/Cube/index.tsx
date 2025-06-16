import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import ThreeContainer, { ThreeContext } from '../../components/ThreeContainer'
import { useContext } from 'react'
import './style.css'

const CubeDemo: React.FC = () => {
  const { scene } = useContext(ThreeContext)
  const cubeRef = useRef<THREE.Mesh | null>(null)
  const [rotationSpeed, setRotationSpeed] = useState(0.01)
  const [color, setColor] = useState('#00ff00')

  useEffect(() => {
    if (!scene) return

    // 创建立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      shininess: 100,
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    cubeRef.current = cube

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // 动画循环
    const animate = () => {
      if (!cubeRef.current) return
      requestAnimationFrame(animate)
      cubeRef.current.rotation.x += rotationSpeed
      cubeRef.current.rotation.y += rotationSpeed
    }
    animate()

    // 清理函数
    return () => {
      if (cubeRef.current) {
        scene.remove(cubeRef.current)
      }
      geometry.dispose()
      material.dispose()
    }
  }, [scene, color, rotationSpeed])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    if (cubeRef.current) {
      (cubeRef.current.material as THREE.MeshPhongMaterial).color.set(e.target.value)
    }
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotationSpeed(parseFloat(e.target.value))
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
      </div>
    </ThreeContainer>
  )
}

export default CubeDemo