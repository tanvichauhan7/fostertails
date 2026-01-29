import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import BrowsePets from "./pages/BrowsePets"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<BrowsePets />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
