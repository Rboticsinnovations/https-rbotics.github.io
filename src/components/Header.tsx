import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoBg from '../assets/rbotics-logo-removebg.png';
import { useAuth } from '../context/AuthContext';
import { ALLOWED_CATEGORIES } from '../data/productsData';

interface HeaderProps {
    onLoginClick: () => void;
    onAdminClick: () => void;
    onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onAdminClick, onCartClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const { isLoggedIn, isAdmin, currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const cartKey = `rbotics_cart_${currentUser?.email || 'guest'}`;
    const [cartCount, setCartCount] = useState<number>(0);

    useEffect(() => {
        const updateCart = () => {
            try {
                const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                const total = cart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0);
                setCartCount(total);
            } catch {
                setCartCount(0);
            }
        };

        // Run immediately to load cart for this user
        updateCart();

        window.addEventListener('cart-updated', updateCart);
        return () => window.removeEventListener('cart-updated', updateCart);
    }, [cartKey]);

    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveLink(location.pathname);
            return;
        }

        const sections = ['home', 'services', 'about', 'contact'];
        const handleScroll = () => {
            const scrollPos = window.scrollY + 140;
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
    }, [location.pathname]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavClick = (hashOrPath: string) => {
        setIsOpen(false);
        if (hashOrPath.startsWith('#')) {
            if (location.pathname !== '/') {
                navigate('/' + hashOrPath);
            } else {
                const el = document.getElementById(hashOrPath.substring(1));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(hashOrPath);
        }
    };

    const navItems = [
        { label: 'Home', path: '#home' },
        { label: 'Products', path: '/products', isDropdown: true },
        { label: 'Services', path: '#services' },
        { label: 'About', path: '#about' },
        { label: 'Contact', path: '#contact' },
    ];

    return (
        <header className="fixed-top bg-white shadow-sm">
            <div className="container-fluid px-lg-5 py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <Link to="/" className="navbar-brand d-flex align-items-center me-4">
                        <img src={logoBg} alt="Rbotics Logo" style={{ height: '50px', objectFit: 'contain' }} />
                    </Link>

                    <div className="d-none d-lg-block mx-5" style={{ width: '250px' }}>
                        <div className="input-group bg-light rounded-pill px-3 py-1 border">
                            <span className="input-group-text bg-transparent border-0 text-muted"><i className="fas fa-search"></i></span>
                            <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search..." aria-label="Search" style={{ fontSize: '0.9rem' }} />
                        </div>
                    </div>

                    <nav className="d-none d-lg-flex gap-5 align-items-center fw-medium text-nowrap flex-grow-1 justify-content-center">
                        {navItems.map((item) => (
                            item.isDropdown ? (
                                <div className="dropdown" key={item.label}>
                                    <Link
                                        to={item.path}
                                        className={`text-decoration-none text-dark nav-link-custom ${activeLink === item.path ? 'active' : ''}`}
                                        onMouseEnter={(e) => {
                                            const dropdownMenu = e.currentTarget.nextElementSibling;
                                            if (dropdownMenu) dropdownMenu.classList.add('show');
                                        }}
                                        onMouseLeave={(e) => {
                                            const dropdownMenu = e.currentTarget.nextElementSibling;
                                            if (dropdownMenu) dropdownMenu.classList.remove('show');
                                        }}
                                        style={{ paddingBottom: '15px' }} // to keep hover active slightly below
                                    >
                                        {item.label} <i className="fas fa-chevron-down ms-1" style={{ fontSize: '0.7em' }}></i>
                                    </Link>
                                    <ul 
                                        className="dropdown-menu shadow-sm border-0 mt-0" 
                                        style={{ minWidth: '250px', top: '100%', left: '0' }}
                                        onMouseEnter={(e) => e.currentTarget.classList.add('show')}
                                        onMouseLeave={(e) => e.currentTarget.classList.remove('show')}
                                    >
                                        {ALLOWED_CATEGORIES.map(cat => (
                                            <li key={cat}>
                                                <Link className="dropdown-item py-2 text-wrap" to="/products" state={{ category: cat }}>
                                                    {cat}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <button
                                    key={item.label}
                                    onClick={() => handleNavClick(item.path)}
                                    className={`btn btn-link text-decoration-none text-dark nav-link-custom p-0 ${activeLink === item.path ? 'active' : ''}`}
                                >
                                    {item.label}
                                </button>
                            )
                        ))}
                    </nav>

                    <div className="d-flex align-items-center gap-3 ms-4">
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

                {isOpen && (
                    <div className="d-lg-none mt-3 border-top pt-3">
                        <div className="mb-3">
                            <div className="input-group bg-light rounded-pill px-3 py-1 border">
                                <span className="input-group-text bg-transparent border-0 text-muted"><i className="fas fa-search"></i></span>
                                <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search..." aria-label="Search" />
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-3 align-items-center">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleNavClick(item.path)}
                                    className={`btn btn-link text-decoration-none text-dark fw-bold ${activeLink === item.path ? 'text-primary' : ''}`}
                                >
                                    {item.label}
                                </button>
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
