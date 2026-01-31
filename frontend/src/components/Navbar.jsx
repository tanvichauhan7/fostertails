import { Link } from "react-router-dom"
import "./Navbar.css"

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>🐾 FosterTails</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/pets">Browse Pets</Link>
      </div>
    </nav>
  )
}
<Link to="/ngos">NGOs</Link>

export default Navbar
