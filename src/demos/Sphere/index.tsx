import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import ThreeContainer, { ThreeContext } from '../../components/ThreeContainer'
import { useContext } from 'react'
import './style.css'

const SphereDemo: React.FC = () => {
  const { scene } = useContext(ThreeContext)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const [rotationSpeed, setRotationSpeed] = useState(0.01)
  const [color, setColor] = useState('#00ff00')
  const [radius, setRadius] = useState(1)
  const [segments, setSegments] = useState(32)

  useEffect(() => {
    if (!scene) return

    // 创建球体
    const geometry = new THREE.SphereGeometry(radius, segments, segments)
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      shininess: 100,
      wireframe: false
    })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)
    sphereRef.current = sphere

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // 动画循环
    const animate = () => {
      if (!sphereRef.current) return
      requestAnimationFrame(animate)
      sphereRef.current.rotation.x += rotationSpeed
      sphereRef.current.rotation.y += rotationSpeed
    }
    animate()

    // 清理函数
    return () => {
      if (sphereRef.current) {
        scene.remove(sphereRef.current)
      }
      geometry.dispose()
      material.dispose()
    }
  }, [scene, color, rotationSpeed, radius, segments])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    if (sphereRef.current) {
      (sphereRef.current.material as THREE.MeshPhongMaterial).color.set(e.target.value)
    }
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotationSpeed(parseFloat(e.target.value))
  }

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseFloat(e.target.value))
  }

  const handleSegmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSegments(parseInt(e.target.value))
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
          <label>半径：</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={radius}
            onChange={handleRadiusChange}
          />
          <span>{radius.toFixed(1)}</span>
        </div>
        <div className="control-item">
          <label>分段数：</label>
          <input
            type="range"
            min="8"
            max="64"
            step="1"
            value={segments}
            onChange={handleSegmentsChange}
          />
          <span>{segments}</span>
        </div>
      </div>
    </ThreeContainer>
  )
}

export default SphereDemo