import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { PricingPage } from "./pages/PricingPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { SupportPage } from "./pages/SupportPage";
import { AuthProvider } from "./context/AuthContext";
import { ThemeLanguageProvider } from "./context/ThemeLanguageContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  console.log("🎨 App component rendering");
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeLanguageProvider>
  );
}