import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { PricingPage } from "./pages/PricingPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { TemplateCustomizePage } from "./pages/TemplateCustomizePage";
import { DashboardPage } from "./pages/DashboardPage";
import { OrdersPage } from "./pages/OrdersPage";
import AddOrderPage from "./pages/AddOrderPage";
import OrdersImportPage from "./pages/OrdersImportPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { SupportPage } from "./pages/SupportPage";
import LogoutPage from "./pages/LogoutPage";
import { MyShopPage } from "./pages/MyShopPage";
import ShopSettingsPage from "./pages/ShopSettingsPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeLanguageProvider } from "./context/ThemeLanguageContext";
import { TemplateSelectionProvider } from "./context/TemplateSelectionContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { ScrollToHash } from "./components/ScrollToHash";
import { SessionStatus } from "./components/SessionStatus";

// Loading component for protected routes
function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] animate-spin" />
        <p className="text-[#0A1A2F] dark:text-white font-semibold">Chargement...</p>
      </div>
    </div>
  );
}

// Routes wrapper that uses auth context
function AppRoutes() {
  const { isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/templates/:id/customize" element={<TemplateCustomizePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:slug" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Protected routes - require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/create"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <AddOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/import"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <OrdersImportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-shop"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <MyShopPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/settings"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <ShopSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-confirmation/:id"
        element={
          <ProtectedRoute fallback={<AuthLoading />}>
            <OrderConfirmationPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  console.log("🎨 App component rendering");
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <TemplateSelectionProvider>
          <Router>
            <ScrollToHash />
            <AppRoutes />
            <SessionStatus />
            <Toaster />
          </Router>
        </TemplateSelectionProvider>
      </AuthProvider>
    </ThemeLanguageProvider>
  );
}