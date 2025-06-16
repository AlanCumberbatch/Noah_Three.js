import { useEffect, useRef, createContext, useContext, useState } from 'react'
import * as THREE from 'three'

// 创建 Three.js 上下文
export const ThreeContext = createContext<{
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
}>({
  scene: null,
  camera: null,
  renderer: null
})

interface ThreeContainerProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const ThreeContainer: React.FC<ThreeContainerProps> = ({
  children,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [threeState, setThreeState] = useState<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
  }>({
    scene: null,
    camera: null,
    renderer: null
  })

  useEffect(() => {
    if (!containerRef.current || threeState.scene) return

    // 创建场景
    const scene = new THREE.Scene()

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
    renderer.setClearColor(0x000000, 1)
    containerRef.current.appendChild(renderer.domElement)

    // 更新状态
    setThreeState({ scene, camera, renderer })

    // 处理窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // 渲染循环
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <ThreeContext.Provider value={threeState}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '100%', ...style }}
      >
        {children}
      </div>
    </ThreeContext.Provider>
  )
}

export default ThreeContainer