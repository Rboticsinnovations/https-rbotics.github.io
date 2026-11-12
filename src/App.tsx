import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import CartPage from './components/CartPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MotionConfig } from 'framer-motion';
import { ScrollManager, ScrollProgressBar, BackToTopButton } from './components/ScrollManager';
import { PUBLIC_PAGES } from './data/servicesData';
import { usePageMeta } from './hooks/usePageMeta';

function ProductsMeta() {
  const meta = pageMeta('/products');
  usePageMeta(meta.title, meta.description, '/products');
  return null;
}
import './index.css';

const pageMeta = (path: string) => PUBLIC_PAGES.find(p => p.path === path)!;

function Home() {
  const meta = pageMeta('/');
  usePageMeta(meta.title, meta.description, '/');
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Contact />
    </>
  );
}

function AppContent() {
  const { isLoggedIn, isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [pendingCartOpen, setPendingCartOpen] = useState(false);

  const handleLoginClick = () => {
    if (isLoggedIn) return;
    setShowLogin(true);
  };

  const handleAdminClick = () => {
    setShowAdmin(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
    setPendingCartOpen(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (pendingCartOpen) {
      setPendingCartOpen(false);
      setShowCart(true);
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      setPendingCartOpen(true);
      setShowLogin(true);
    } else {
      setShowCart(true);
    }
  };

  const handleRequestLoginForCart = () => {
    setPendingCartOpen(true);
    setShowLogin(true);
  };

  if (showAdmin && isAdmin) {
    return (
      <div>
        <button
          onClick={() => setShowAdmin(false)}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            zIndex: 2000,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            border: 'none', borderRadius: '50px',
            color: '#fff', padding: '0.75rem 1.5rem',
            cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Site
        </button>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollManager />
      <ScrollProgressBar />
      <Header
        onLoginClick={handleLoginClick}
        onAdminClick={handleAdminClick}
        onCartClick={handleCartClick}
      />
      
      <main className="flex-grow-1" style={{ marginTop: '76px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={
            <>
              <ProductsMeta />
              <Products
                onRequestLogin={handleRequestLoginForCart}
                onOpenCart={() => setShowCart(true)}
              />
            </>
          } />
          {/* Unknown URLs go to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <BackToTopButton />

      {/* Cart Modal / Page */}
      {showCart && (
        <CartPage onClose={() => setShowCart(false)} />
      )}

      {/* Login Modal */}
      {showLogin && !isLoggedIn && (
        <LoginPage onClose={handleLoginClose} onSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* Respect the OS "reduce motion" setting for every framer-motion animation */}
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </MotionConfig>
    </Router>
  );
}

export default App;
