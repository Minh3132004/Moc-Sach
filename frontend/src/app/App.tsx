import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/navbar/Navbar";
import Footer from "../components/layout/footer/Footer";
import HomePage from "../components/homepage/HomePage";
import FlashSalePage from "../pages/flashsale/FlashSalePage";
import BestSellerPage from "../pages/bestseller/BestSellerPage";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/best-sellers" element={<BestSellerPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
