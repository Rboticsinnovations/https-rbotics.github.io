import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
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
import './index.css';

function AppContent() {
  const { isLoggedIn, isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [pendingCartOpen, setPendingCartOpen] = useState(false);

  const handleLoginClick = () => {
    if (isLoggedIn) return; // Already logged in, do nothing
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

  // Show admin dashboard as a full page overlay
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
      <Header
        onLoginClick={handleLoginClick}
        onAdminClick={handleAdminClick}
        onCartClick={handleCartClick}
      />
      <Hero />
      <main>
        <Products
          onRequestLogin={handleRequestLoginForCart}
          onOpenCart={() => setShowCart(true)}
        />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
