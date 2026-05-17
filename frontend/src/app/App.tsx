import "./App.css";
import Navbar from "../components/layout/navbar/Navbar";
import Footer from "../components/layout/footer/Footer";
import HomePage from "../components/homepage/HomePage";
import { Route, Routes, useLocation } from "react-router-dom";
import ActiveAccountPage from "../pages/activeaccount/ActiveAccountPage";
import BestSellerPage from "../pages/bestseller/BestSellerPage";
import FlashSalePage from "../pages/flashsale/FlashSalePage";
import AllBooksPage from "../pages/allbooks/AllBooksPage";
import BookDetailPage from "../pages/book/BookDetailPage";
import CartPage from "../pages/cart/CartPage";
import AccountLayout from "../pages/account/AccountLayout";
import AccountOverviewPage from "../pages/account/components/AccountOverviewPage/AccountOverviewPage";
import AccountOrdersPage from "../pages/account/components/AccountOrdersPage/AccountOrdersPage";
import AccountFavoritesPage from "../pages/account/components/AccountFavoritesPage/AccountFavoritesPage";
import AccountVouchersPage from "../pages/account/components/AccountVouchersPage/AccountVouchersPage";

// Admin imports
import AdminLayout from "../pages/admin/AdminLayout";
import UserManagementPage from "../pages/admin/UserManagement/UserManagement";

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/best-sellers" element={<BestSellerPage />} />
          <Route path="/books" element={<AllBooksPage />} />
          <Route path="/books/:idBook" element={<BookDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route element={<AccountLayout />}>
            <Route path="/account" element={<AccountOverviewPage />} />
            <Route path="/order/history" element={<AccountOrdersPage />} />
            <Route path="/wishlist" element={<AccountFavoritesPage />} />
            <Route path="/voucher" element={<AccountVouchersPage />} />
          </Route>
          <Route path="/active/:email/:activationCode" element={<ActiveAccountPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<UserManagementPage />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </>
  );
}

export default App;
