import "./App.css";
import Navbar from "../components/layout/navbar/Navbar";
import Footer from "../components/layout/footer/Footer";
import HomePage from "../components/homepage/HomePage";
import { Route, Routes } from "react-router-dom";
import ActiveAccountPage from "../pages/ActiveAccountPage";
import BestSellerPage from "../pages/bestseller/BestSellerPage";
import FlashSalePage from "../pages/flashsale/FlashSalePage";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/best-sellers" element={<BestSellerPage />} />
          <Route path="/active/:email/:activationCode" element={<ActiveAccountPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
