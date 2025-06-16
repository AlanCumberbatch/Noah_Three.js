import { Link } from 'react-router-dom'
import './style.css'

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/triangle">三角形</Link>
        </li>
        <li>
          <Link to="/cube">立方体</Link>
        </li>
        <li>
          <Link to="/sphere">球体</Link>
        </li>
        <li>
          <Link to="/torus">环面</Link>
        </li>
        {/* 后续可以添加更多导航项 */}
      </ul>
    </nav>
  )
}

export default Navigation