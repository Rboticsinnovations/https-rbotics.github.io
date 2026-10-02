import React, { useState, useEffect } from 'react';
import logoBg from '../assets/rbotics-logo-removebg.png';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    onLoginClick: () => void;
    onAdminClick: () => void;
    onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onAdminClick, onCartClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('#home');
    const { isLoggedIn, isAdmin, currentUser, logout } = useAuth();
    const [cartCount, setCartCount] = useState<number>(() => {
        try {
            const cart = JSON.parse(localStorage.getItem('rbotics_cart') || '[]');
            return cart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0);
        } catch {
            return 0;
        }
    });

    // Real-time cart synchronization
    useEffect(() => {
        const updateCart = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('rbotics_cart') || '[]');
                const total = cart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0);
                setCartCount(total);
            } catch {
                setCartCount(0);
            }
        };

        window.addEventListener('cart-updated', updateCart);
        return () => window.removeEventListener('cart-updated', updateCart);
    }, []);

    // Scrollspy: automatically highlight nav links as user scrolls
    useEffect(() => {
        const sections = ['home', 'products', 'services', 'about', 'contact'];
        const handleScroll = () => {
            const scrollPos = window.scrollY + 140; // offset for fixed navbar
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPos >= top) {
                        setActiveLink(`#${sections[i]}`);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavClick = (hash: string) => {
        setActiveLink(hash);
        setIsOpen(false);
    };

    return (
        <header className="fixed-top bg-white shadow-sm">
            <div className="container-fluid px-lg-5 py-2">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Logo Section */}
                    <a href="#home" className="navbar-brand d-flex align-items-center me-4" onClick={() => handleNavClick('#home')}>
                        <img src={logoBg} alt="Rbotics Logo" style={{ height: '50px', objectFit: 'contain' }} />
                    </a>

                    {/* Search Bar - Hidden on small screens */}
                    <div className="d-none d-lg-block mx-5" style={{ width: '250px' }}>
                        <div className="input-group bg-light rounded-pill px-3 py-1 border">
                            <span className="input-group-text bg-transparent border-0 text-muted"><i className="fas fa-search"></i></span>
                            <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search..." aria-label="Search" style={{ fontSize: '0.9rem' }} />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="d-none d-lg-flex gap-5 align-items-center fw-medium text-nowrap flex-grow-1 justify-content-center">
                        {['#home', '#products', '#services', '#about', '#contact'].map((hash) => (
                            <a
                                key={hash}
                                href={hash}
                                className={`text-decoration-none text-dark nav-link-custom ${activeLink === hash ? 'active' : ''}`}
                                onClick={() => handleNavClick(hash)}
                            >
                                {hash.replace('#', '').charAt(0).toUpperCase() + hash.slice(2)}
                            </a>
                        ))}
                    </nav>

                    {/* Icons Section */}
                    <div className="d-flex align-items-center gap-3 ms-4">
                        {/* Admin Dashboard Link */}
                        {isAdmin && (
                            <button
                                onClick={onAdminClick}
                                title="Admin Dashboard"
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                    border: 'none', borderRadius: '8px',
                                    padding: '0.4rem 0.85rem',
                                    color: '#fff', cursor: 'pointer',
                                    fontSize: '0.8rem', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                }}
                            >
                                <i className="fas fa-shield-alt"></i>
                                <span className="d-none d-xl-inline">Dashboard</span>
                            </button>
                        )}

                        {/* User Profile / Login */}
                        {isLoggedIn ? (
                            <div className="dropdown">
                                <button
                                    className="btn p-0 border-0 d-flex align-items-center gap-2"
                                    id="userDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ background: 'none' }}
                                >
                                    <div style={{
                                        width: '36px', height: '36px',
                                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                                    }}>
                                        {currentUser?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown" style={{ minWidth: '180px' }}>
                                    <li><span className="dropdown-item-text fw-bold text-dark small">{currentUser?.name}</span></li>
                                    <li><span className="dropdown-item-text text-muted small">{currentUser?.email}</span></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    {isAdmin && (
                                        <li>
                                            <button className="dropdown-item" onClick={onAdminClick}>
                                                <i className="fas fa-shield-alt me-2 text-primary"></i> Admin Dashboard
                                            </button>
                                        </li>
                                    )}
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={logout}>
                                            <i className="fas fa-sign-out-alt me-2"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="text-dark text-decoration-none btn p-0 border-0"
                                style={{ background: 'none' }}
                                title="Login / Register"
                            >
                                <i className="fas fa-user fs-4"></i>
                            </button>
                        )}

                        {/* Cart */}
                        <button
                            type="button"
                            onClick={onCartClick}
                            className="btn p-0 border-0 text-dark position-relative"
                            title="Shopping Cart"
                            style={{ background: 'none' }}
                        >
                            <i className="fas fa-shopping-cart fs-4"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem', padding: '0.35em 0.5em' }}>
                                {cartCount}
                            </span>
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            className="navbar-toggler d-lg-none border-0 ms-2"
                            type="button"
                            onClick={toggleMenu}
                            aria-label="Toggle navigation"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} fs-3`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="d-lg-none mt-3 border-top pt-3">
                        <div className="mb-3">
                            <div className="input-group bg-light rounded-pill px-3 py-1 border">
                                <span className="input-group-text bg-transparent border-0 text-muted"><i className="fas fa-search"></i></span>
                                <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search..." aria-label="Search" />
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-3 align-items-center">
                            {['#home', '#products', '#services', '#about', '#contact'].map((hash) => (
                                <a
                                    key={hash}
                                    href={hash}
                                    className={`text-decoration-none text-dark fw-bold ${activeLink === hash ? 'text-primary' : ''}`}
                                    onClick={() => handleNavClick(hash)}
                                >
                                    {hash.replace('#', '').charAt(0).toUpperCase() + hash.slice(2)}
                                </a>
                            ))}
                            <button className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2" onClick={() => { onCartClick(); setIsOpen(false); }}>
                                <i className="fas fa-shopping-cart"></i> Cart ({cartCount})
                            </button>
                            {!isLoggedIn && (
                                <button className="btn btn-primary btn-sm" onClick={() => { onLoginClick(); setIsOpen(false); }}>
                                    <i className="fas fa-user me-2"></i> Login / Register
                                </button>
                            )}
                            {isLoggedIn && (
                                <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                                </button>
                            )}
                            {isAdmin && (
                                <button className="btn btn-outline-primary btn-sm" onClick={() => { onAdminClick(); setIsOpen(false); }}>
                                    <i className="fas fa-shield-alt me-2"></i> Admin Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
