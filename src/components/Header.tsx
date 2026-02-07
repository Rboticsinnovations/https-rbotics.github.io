import React, { useState } from 'react';
import logoBg from '../assets/rbotics-logo-removebg.png';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('#home'); // Default active link

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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

                    {/* Search Bar - Hidden on small screens, visible on large - Reduced Width */}
                    <div className="d-none d-lg-block mx-5" style={{ width: '250px' }}>
                        <div className="input-group bg-light rounded-pill px-3 py-1 border">
                            <span className="input-group-text bg-transparent border-0 text-muted"><i className="fas fa-search"></i></span>
                            <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search..." aria-label="Search" style={{ fontSize: '0.9rem' }} />
                        </div>
                    </div>

                    {/* Desktop Navigation - Added Gap */}
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
                    <div className="d-flex align-items-center gap-4 ms-4">
                        {/* User Profile */}
                        <a href="#" className="text-dark text-decoration-none">
                            <i className="fas fa-user fs-4"></i>
                        </a>

                        {/* Cart */}
                        <a href="#" className="text-dark text-decoration-none position-relative">
                            <i className="fas fa-shopping-cart fs-4"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem', padding: '0.35em 0.5em' }}>
                                0
                            </span>
                        </a>

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
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
