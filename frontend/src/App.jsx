import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BrowsePets from "./pages/BrowsePets";
import NGOs from "./pages/NGOs";   // ✅ NEW

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<BrowsePets />} />
        <Route path="/ngos" element={<NGOs />} />   {/* ✅ NEW */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
