import "./App.css";
import Navbar from "../components/layout/navbar/Navbar";
import Footer from "../components/layout/footer/Footer";
import HomePage from "../components/homepage/HomePage";
import { Route, Routes } from "react-router-dom";
import ActiveAccountPage from "../pages/ActiveAccountPage";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/active/:email/:activationCode" element={<ActiveAccountPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
