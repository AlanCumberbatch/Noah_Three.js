import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ThreeContainer, { ThreeContext } from '../../components/ThreeContainer'
import { useContext } from 'react'
import './style.css'

const TorusDemo: React.FC = () => {
  const { scene, camera, renderer } = useContext(ThreeContext)
  const torusRef = useRef<THREE.Mesh | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const [rotationSpeed, setRotationSpeed] = useState(0.01)
  const [color, setColor] = useState('#00ff00')
  const [radius, setRadius] = useState(1)
  const [tube, setTube] = useState(0.3)
  const [radialSegments, setRadialSegments] = useState(16)
  const [tubularSegments, setTubularSegments] = useState(32)

  useEffect(() => {
    if (!scene || !camera || !renderer) return

    // 清理之前的环面
    if (torusRef.current) {
      scene.remove(torusRef.current)
      torusRef.current.geometry.dispose()
      if (Array.isArray(torusRef.current.material)) {
        torusRef.current.material.forEach(material => material.dispose())
      } else {
        torusRef.current.material.dispose()
      }
    }

    // 创建环面
    const geometry = new THREE.TorusGeometry(
      radius,
      tube,
      radialSegments,
      tubularSegments
    )
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      shininess: 100,
      wireframe: false
    })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)
    torusRef.current = torus

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

    // 动画循环
    const animate = () => {
      if (!torusRef.current || !controlsRef.current) return
      requestAnimationFrame(animate)
      torusRef.current.rotation.x += rotationSpeed
      torusRef.current.rotation.y += rotationSpeed
      controlsRef.current.update()
    }
    animate()

    // 清理函数
    return () => {
      if (torusRef.current) {
        scene.remove(torusRef.current)
        torusRef.current.geometry.dispose()
        if (Array.isArray(torusRef.current.material)) {
          torusRef.current.material.forEach(material => material.dispose())
        } else {
          torusRef.current.material.dispose()
        }
      }
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
    }
  }, [scene, camera, renderer, color, rotationSpeed, radius, tube, radialSegments, tubularSegments])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    if (torusRef.current) {
      (torusRef.current.material as THREE.MeshPhongMaterial).color.set(e.target.value)
    }
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotationSpeed(parseFloat(e.target.value))
  }

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseFloat(e.target.value))
  }

  const handleTubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTube(parseFloat(e.target.value))
  }

  const handleRadialSegmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadialSegments(parseInt(e.target.value))
  }

  const handleTubularSegmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTubularSegments(parseInt(e.target.value))
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
            min="0.5"
            max="2"
            step="0.1"
            value={radius}
            onChange={handleRadiusChange}
          />
          <span>{radius.toFixed(1)}</span>
        </div>
        <div className="control-item">
          <label>管道半径：</label>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.1"
            value={tube}
            onChange={handleTubeChange}
          />
          <span>{tube.toFixed(1)}</span>
        </div>
        <div className="control-item">
          <label>径向分段：</label>
          <input
            type="range"
            min="8"
            max="32"
            step="1"
            value={radialSegments}
            onChange={handleRadialSegmentsChange}
          />
          <span>{radialSegments}</span>
        </div>
        <div className="control-item">
          <label>管道分段：</label>
          <input
            type="range"
            min="8"
            max="64"
            step="1"
            value={tubularSegments}
            onChange={handleTubularSegmentsChange}
          />
          <span>{tubularSegments}</span>
        </div>
      </div>
    </ThreeContainer>
  )
}

export default TorusDemo