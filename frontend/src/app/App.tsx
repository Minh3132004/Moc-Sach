import "./App.css";
import Navbar from "../components/layout/navbar/Navbar";
import Footer from "../components/layout/footer/Footer";
import HomePage from "../components/homepage/HomePage";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HomePage />
      </main>
      <Footer />
    </>
  );
}

export default App;
