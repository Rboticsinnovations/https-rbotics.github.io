import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_PRODUCTS, getProductStock } from '../data/productsData';
import type { ProductItem } from '../data/productsData';
import { BatteryVisual } from './BatteryVisual';

interface ProductsProps {
    onRequestLogin: () => void;
    onOpenCart: () => void;
}

// Sidebar categories matching Image 1
const ALL_CATEGORIES = [
    'SmartElex',
    'SimpliFly',
    'Electronic Components',
    '3D Printers and Parts',
    'Drone Parts',
    'Development Boards',
    'Batteries, Power Supply and Accessories',
    'Sensors',
    'Motors | Drivers | Pumps | Actuators',
    'IoT and Wireless Modules',
    'Electronic Modules and Displays',
    'Mechanical Parts, Measurement & Workbench Tools',
    'DIY and Maker Kits',
    'Electric Vehicle Parts',
    'Prototyping Services',
    'Refurbished and Partial'
];

// Multi-chemistry battery subcategories matching Image 2
const MULTI_CHEM_SUBCATS = [
    {
        id: 'li-ion',
        title: 'Lithium Ion (Li-ion) Battery Pack',
        visualType: '1cell' as const,
        clickable: true
    },
    {
        id: 'lipo',
        title: 'Lithium Polymer (Lipo) Battery Pack',
        visualType: 'lipo' as const,
        clickable: false
    },
    {
        id: 'lfp',
        title: 'Lithium Iron Phosphate (LFP) Battery Pack',
        visualType: 'lfp' as const,
        clickable: false
    },
    {
        id: 'cylindrical',
        title: 'Rechargable Cylindrical And Prismatic Battery Cell',
        visualType: 'cylindrical' as const,
        clickable: false
    },
    {
        id: 'rechargeable',
        title: 'Rechargeable And Non Rechargeable Batteries',
        visualType: 'general' as const,
        clickable: false
    },
    {
        id: 'plc',
        title: 'CNC And PLC Machine Battery',
        visualType: 'plc' as const,
        clickable: false
    }
];

// Sub-subcategories for Li-ion matching Image 3
const LI_ION_PACK_TYPES = [
    {
        id: '1-cell',
        title: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        visualType: '1cell' as const,
        subSubName: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)'
    },
    {
        id: '2-cell',
        title: '2 Cell Li-Ion Battery Pack (7.4V~8.4V)',
        visualType: '2cell' as const,
        subSubName: '2 Cell Li-Ion Battery Pack (7.4V~8.4V)'
    },
    {
        id: '3-cell',
        title: '3 Cell 12V Li-Ion Battery Pack (11.1V~12.6V)',
        visualType: '3cell' as const,
        subSubName: '3 Cell 12V Li-Ion Battery Pack (11.1V~12.6V)'
    },
    {
        id: '4-cell',
        title: '4 Cell 15V Li-Ion Battery Pack (14.8V~16.8V)',
        visualType: '4cell' as const,
        subSubName: '4 Cell 15V Li-Ion Battery Pack (14.8V~16.8V)'
    },
    {
        id: 'custom',
        title: 'Custom Battery Pack',
        visualType: 'custom' as const,
        subSubName: 'Custom Battery Pack'
    },
    {
        id: '5-7-cell',
        title: '5 ~ 7 Cell Li-Ion Battery Pack',
        visualType: '6cell' as const,
        subSubName: '5 ~ 7 Cell Li-Ion Battery Pack'
    }
];

type ViewStage = 'category_hub' | 'subcat_hub' | 'product_list' | 'product_detail';

const Products: React.FC<ProductsProps> = ({ onRequestLogin, onOpenCart }) => {
    const { isLoggedIn } = useAuth();

    // Navigation state
    const [currentStage, setCurrentStage] = useState<ViewStage>('category_hub');
    const [selectedCategory, setSelectedCategory] = useState<string>('Batteries, Power Supply and Accessories');
    const [selectedSubCat, setSelectedSubCat] = useState<string>('Lithium Ion (Li-ion) Battery Pack');
    const [selectedSubSubCat, setSelectedSubSubCat] = useState<string>('1 Cell Li-Ion Battery Pack (3.6V~4.2V)');
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

    // Inventory refresh trigger
    const [inventoryNonce, setInventoryNonce] = useState(0);

    // Detail view state
    const [detailQty, setDetailQty] = useState(1);
    const [pincode, setPincode] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
    const [includeAddon, setIncludeAddon] = useState(false);
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'warranty' | 'reviews'>('desc');
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);

    // Listing filters (Image 4)
    const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
    const [capacityFilter, setCapacityFilter] = useState<string[]>([]);
    const [voltageFilter, setVoltageFilter] = useState<string[]>([]);
    const [portFilter, setPortFilter] = useState<string[]>([]);
    const [bmsFilter, setBmsFilter] = useState<'all' | 'yes' | 'no'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'latest' | 'price_low' | 'price_high'>('latest');

    // Toast
    const [toast, setToast] = useState<string | null>(null);

    // Listen for inventory updates
    useEffect(() => {
        const handleInventoryChange = () => setInventoryNonce(n => n + 1);
        window.addEventListener('inventory-updated', handleInventoryChange);
        return () => window.removeEventListener('inventory-updated', handleInventoryChange);
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    // Filtered products for listing
    const filteredProducts = INITIAL_PRODUCTS.filter(p => {
        if (p.subSubCategory !== selectedSubSubCat) return false;

        const liveStock = getProductStock(p.sku);
        if (stockFilter === 'in_stock' && liveStock <= 0) return false;
        if (stockFilter === 'out_of_stock' && liveStock > 0) return false;

        if (capacityFilter.length > 0 && !capacityFilter.some(c => p.capacity.includes(c))) return false;
        if (voltageFilter.length > 0 && !voltageFilter.some(v => p.voltage.includes(v))) return false;
        if (portFilter.length > 0 && !portFilter.some(pt => p.connector.includes(pt))) return false;

        if (bmsFilter === 'yes' && !p.hasBms) return false;
        if (bmsFilter === 'no' && p.hasBms) return false;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(q) || p.sku.includes(q) || p.description.toLowerCase().includes(q);
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        return 0;
    });

    const handleAddToCart = (product: ProductItem, qty: number = 1, e?: React.MouseEvent) => {
        e?.stopPropagation();
        const liveStock = getProductStock(product.sku);

        if (liveStock <= 0) {
            showToast(`Sorry, "${product.name}" is currently Out of Stock.`);
            return;
        }

        try {
            const cart = JSON.parse(localStorage.getItem('rbotics_cart') || '[]');
            const existingIndex = cart.findIndex((i: { sku: string }) => i.sku === product.sku);
            const currentInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
            const newTotalQty = currentInCart + qty;

            if (newTotalQty > liveStock) {
                showToast(`Cannot add more than ${liveStock} units (already ${currentInCart} in cart).`);
                return;
            }

            if (existingIndex >= 0) {
                cart[existingIndex].quantity = newTotalQty;
            } else {
                cart.push({
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    price: product.price,
                    quantity: qty,
                    category: product.category
                });
            }

            if (includeAddon && currentStage === 'product_detail') {
                const addonSku = '8899221';
                const addonIndex = cart.findIndex((i: { sku: string }) => i.sku === addonSku);
                if (addonIndex >= 0) {
                    cart[addonIndex].quantity += 1;
                } else {
                    cart.push({
                        id: 'cellmeter-8',
                        sku: addonSku,
                        name: 'Cellmeter 8 Multi-Functional Digital Power Servo Tester',
                        price: 939,
                        quantity: 1,
                        category: 'Accessories'
                    });
                }
            }

            localStorage.setItem('rbotics_cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cart-updated'));

            // Check login requirement:
            // "if it is already login cart page should open if account is not login for open cart login should ask then show cart"
            if (isLoggedIn) {
                onOpenCart();
            } else {
                showToast(`Added to cart! Please sign in to view your cart & checkout.`);
                onRequestLogin();
            }
        } catch {
            // fallback
        }
    };

    const handleCheckPincode = (e: React.FormEvent) => {
        e.preventDefault();
        if (pincode.length === 6 && /^\d+$/.test(pincode)) {
            setPincodeStatus(`Available! Standard delivery to ${pincode} in 2-3 business days.`);
        } else {
            setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
        }
    };

    return (
        <section id="products" className="py-5 bg-white position-relative" style={{ minHeight: '800px' }}>
            {/* Global notification toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 4000,
                    background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                    color: '#fff',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '50px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                    border: '1px solid rgba(129,140,248,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    animation: 'fadeIn 0.3s ease-in-out'
                }}>
                    <i className="fas fa-info-circle text-warning fs-5"></i>
                    <span className="fw-semibold small">{toast}</span>
                </div>
            )}

            <div className="container">
                {/* Dynamic Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb small bg-light p-2.5 rounded-3 border">
                        <li className="breadcrumb-item">
                            <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none text-muted small fw-semibold"
                                onClick={() => {
                                    setCurrentStage('category_hub');
                                    setSelectedProduct(null);
                                }}
                            >
                                <i className="fas fa-home me-1"></i> Home
                            </button>
                        </li>
                        <li className="breadcrumb-item text-muted">Shop</li>
                        <li className="breadcrumb-item">
                            <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none text-muted small fw-semibold"
                                onClick={() => {
                                    setCurrentStage('category_hub');
                                    setSelectedProduct(null);
                                }}
                            >
                                {selectedCategory}
                            </button>
                        </li>

                        {(currentStage === 'subcat_hub' || currentStage === 'product_list' || currentStage === 'product_detail') && (
                            <li className="breadcrumb-item">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none text-muted small fw-semibold"
                                    onClick={() => {
                                        setCurrentStage('category_hub');
                                        setSelectedProduct(null);
                                    }}
                                >
                                    Multi-Chemistry Batteries
                                </button>
                            </li>
                        )}

                        {(currentStage === 'subcat_hub' || currentStage === 'product_list' || currentStage === 'product_detail') && (
                            <li className="breadcrumb-item">
                                <button
                                    type="button"
                                    className={`btn btn-link p-0 text-decoration-none small fw-semibold ${currentStage === 'subcat_hub' ? 'text-primary active' : 'text-muted'}`}
                                    onClick={() => {
                                        setCurrentStage('subcat_hub');
                                        setSelectedProduct(null);
                                    }}
                                >
                                    {selectedSubCat}
                                </button>
                            </li>
                        )}

                        {(currentStage === 'product_list' || currentStage === 'product_detail') && (
                            <li className="breadcrumb-item">
                                <button
                                    type="button"
                                    className={`btn btn-link p-0 text-decoration-none small fw-semibold ${currentStage === 'product_list' ? 'text-primary active' : 'text-muted'}`}
                                    onClick={() => {
                                        setCurrentStage('product_list');
                                        setSelectedProduct(null);
                                    }}
                                >
                                    {selectedSubSubCat}
                                </button>
                            </li>
                        )}

                        {currentStage === 'product_detail' && selectedProduct && (
                            <li className="breadcrumb-item text-primary active fw-bold text-truncate" style={{ maxWidth: '280px' }}>
                                {selectedProduct.name}
                            </li>
                        )}
                    </ol>
                </nav>

                {/* ================================================================ */}
                {/* STAGE 1: CATEGORY HUB (Matches Image 1 & Image 2)                */}
                {/* ================================================================ */}
                {currentStage === 'category_hub' && (
                    <div className="row g-4">
                        {/* Left Column: Sidebar matching Image 1 */}
                        <div className="col-lg-3 col-md-4">
                            <div className="card border rounded-4 shadow-sm overflow-hidden sticky-top" style={{ top: '80px', zIndex: 10 }}>
                                <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2 fw-bold text-dark">
                                        <i className="fas fa-bars"></i>
                                        <span>All Categories</span>
                                    </div>
                                    <i className="fas fa-chevron-down text-muted small"></i>
                                </div>
                                <div className="list-group list-group-flush small" style={{ maxHeight: '650px', overflowY: 'auto' }}>
                                    {ALL_CATEGORIES.map(cat => {
                                        const isSelected = selectedCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                }}
                                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2.5 px-3 border-0 ${
                                                    isSelected ? 'bg-primary-subtle text-primary fw-bold' : 'text-dark'
                                                }`}
                                                style={{ fontSize: '0.85rem' }}
                                            >
                                                <span>{cat}</span>
                                                <i className="fas fa-chevron-right text-muted small" style={{ fontSize: '0.65rem' }}></i>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Multi-Chemistry Batteries Hub matching Image 2 */}
                        <div className="col-lg-9 col-md-8">
                            <div className="mb-4">
                                <h2 className="fw-bold text-dark display-6 mb-3">Multi-Chemistry Batteries</h2>
                                <p className="text-muted leading-relaxed" style={{ fontSize: '0.95rem' }}>
                                    Find the perfect power solution with our wide range of <strong>Multi-Chemistry Batteries</strong>, tailored to meet every application—from consumer electronics to industrial systems. Explore India’s most diverse collection featuring:
                                </p>
                                <ul className="text-muted small ps-3 mb-3 leading-loose">
                                    <li><strong>Lithium Polymer (Li-Po) Batteries</strong> – Lightweight, high-power packs ideal for RC models, drones, and compact electronics.</li>
                                    <li><strong>Lithium-Ion (Li-Ion) Batteries</strong> – Rechargeable, energy-dense, and reliable for everything from gadgets to portable power banks.</li>
                                    <li><strong>Lithium Iron Phosphate (LiFePO4) Batteries</strong> – Long-life, high-safety batteries perfect for solar setups, EVs, and energy storage systems.</li>
                                    <li><strong>Non-Rechargeable Batteries & Coin Cells</strong> – Long-lasting primary cells for watches, remotes, medical devices, and more.</li>
                                    <li><strong>CNC & PLC Machine Batteries</strong> – Specially designed to ensure uninterrupted memory backup and system performance.</li>
                                    <li><strong>Drone Batteries</strong> – High-discharge, lightweight batteries built for maximum flight time and performance.</li>
                                </ul>
                                <p className="text-muted small">
                                    From compact wearables to high-power industrial machines, we offer <strong>customizable solutions</strong> to suit your voltage, capacity, and form factor needs. Power your innovations with quality you can trust—and more options being added every day to match your requirements.
                                </p>
                            </div>

                            {/* 6 Subcategory Cards matching Image 2 */}
                            <div className="row g-3">
                                {MULTI_CHEM_SUBCATS.map(sub => (
                                    <div key={sub.id} className="col-md-6 col-xl-4">
                                        <div
                                            className="card h-100 border-0 rounded-4 shadow-sm p-3 text-center transition-all"
                                            style={{
                                                cursor: sub.clickable ? 'pointer' : 'default',
                                                background: '#ffffff',
                                                transition: 'all 0.25s ease'
                                            }}
                                            onClick={() => {
                                                if (sub.clickable) {
                                                    setSelectedSubCat(sub.title);
                                                    setCurrentStage('subcat_hub');
                                                } else {
                                                    showToast(`Viewing collection: ${sub.title}`);
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                if (sub.clickable) {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (sub.clickable) {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                                }
                                            }}
                                        >
                                            {/* Soft purple/blue gradient box matching Image 2 */}
                                            <div
                                                className="rounded-4 py-4 d-flex align-items-center justify-content-center mb-3"
                                                style={{
                                                    background: 'linear-gradient(135deg, #7c7eff 0%, #6366f1 100%)',
                                                    minHeight: '140px'
                                                }}
                                            >
                                                <BatteryVisual type={sub.visualType} width={130} height={95} />
                                            </div>
                                            <h6 className="fw-bold text-dark mb-0 small" style={{ lineHeight: '1.4' }}>
                                                {sub.title}
                                            </h6>
                                            {sub.clickable && (
                                                <span className="badge bg-primary text-white rounded-pill mt-2 py-1 px-2.5 small align-self-center">
                                                    Explore Packs <i className="fas fa-arrow-right ms-1"></i>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================ */}
                {/* STAGE 2: SUB-CATEGORY HUB (Matches Image 3)                      */}
                {/* ================================================================ */}
                {currentStage === 'subcat_hub' && (
                    <div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2 className="fw-bold text-dark display-6 mb-0">Lithium Ion (Li-Ion) Battery Pack</h2>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm rounded-pill"
                                    onClick={() => setCurrentStage('category_hub')}
                                >
                                    <i className="fas fa-arrow-left me-1"></i> Back to Multi-Chemistry
                                </button>
                            </div>
                            <p className="text-muted leading-relaxed" style={{ fontSize: '0.92rem' }}>
                                A <strong>lithium-ion battery</strong> or <strong>Li-ion battery</strong> (abbreviated as LIB) is a type of rechargeable battery. Lithium-ion batteries are commonly used for portable electronics and electric vehicles. The batteries have a high energy density, no memory effect (other than LFP cells), and low self-discharge. Discover our extensive range of Lithium Ion Battery Packs, designed to provide reliable and long-lasting power for a wide range of applications. Available in configurations ranging from <strong>1 cell to 13 cells</strong>, our battery packs offer flexibility and compatibility for various devices and projects. Whether you need a compact single-cell pack for portable electronics or a high-capacity multi-cell pack for RC vehicles or robotics, our <strong>Lithium Ion Battery Pack</strong> provides the power and reliability you need. We at Rbotics have the best lithium-ion batteries in various capacities, voltages, and sizes, and at the best price. Scroll down to see more.
                            </p>
                        </div>

                        {/* 6 Sub-pack Cards matching Image 3 */}
                        <div className="row g-4">
                            {LI_ION_PACK_TYPES.map(pack => (
                                <div key={pack.id} className="col-md-6 col-lg-4">
                                    <div
                                        className="card h-100 border-0 rounded-4 shadow-sm p-3 text-center transition-all"
                                        style={{
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                            transition: 'all 0.25s ease'
                                        }}
                                        onClick={() => {
                                            setSelectedSubSubCat(pack.subSubName);
                                            setCurrentStage('product_list');
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 14px 28px rgba(0,0,0,0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                        }}
                                    >
                                        <div
                                            className="rounded-4 py-4 d-flex align-items-center justify-content-center mb-3"
                                            style={{
                                                background: 'linear-gradient(135deg, #7c7eff 0%, #6366f1 100%)',
                                                minHeight: '145px'
                                            }}
                                        >
                                            <BatteryVisual type={pack.visualType} width={135} height={100} />
                                        </div>
                                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.35' }}>
                                            {pack.title}
                                        </h6>
                                        <span className="text-primary fw-semibold small">
                                            View Products & Stock <i className="fas fa-chevron-right ms-1"></i>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ================================================================ */}
                {/* STAGE 3: PRODUCT LISTING WITH FILTERS (Matches Image 4)          */}
                {/* ================================================================ */}
                {currentStage === 'product_list' && (
                    <div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h3 className="fw-bold text-dark mb-0">{selectedSubSubCat}</h3>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm rounded-pill"
                                    onClick={() => setCurrentStage('subcat_hub')}
                                >
                                    <i className="fas fa-arrow-left me-1"></i> Back to Li-Ion Packs
                                </button>
                            </div>
                            <p className="text-muted small leading-relaxed">
                                Discover our wide range of 18650 lithium-ion batteries, featuring trusted and high-performance options from renowned brands. These industry-leading names are celebrated for their exceptional quality, reliability, and performance, making them ideal for a variety of applications.
                            </p>
                        </div>

                        {/* Filter Bar Box matching Image 4 */}
                        <div className="card border rounded-4 shadow-sm p-4 mb-4 bg-light">
                            <h6 className="fw-bold text-dark mb-3">
                                <i className="fas fa-filter me-2 text-primary"></i>Filter
                            </h6>
                            <div className="d-flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                                {/* Common Attributes */}
                                <div className="card p-3 border bg-white rounded-3 shadow-none" style={{ minWidth: '170px' }}>
                                    <div className="text-muted fw-bold small text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>STOCKING OPTIONS</div>
                                    <div className="form-check small mb-1">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="stockOpt"
                                            id="stock-all"
                                            checked={stockFilter === 'all'}
                                            onChange={() => setStockFilter('all')}
                                        />
                                        <label className="form-check-label" htmlFor="stock-all">All Items</label>
                                    </div>
                                    <div className="form-check small mb-1">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="stockOpt"
                                            id="stock-in"
                                            checked={stockFilter === 'in_stock'}
                                            onChange={() => setStockFilter('in_stock')}
                                        />
                                        <label className="form-check-label" htmlFor="stock-in">In stock</label>
                                    </div>
                                    <div className="form-check small">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="stockOpt"
                                            id="stock-out"
                                            checked={stockFilter === 'out_of_stock'}
                                            onChange={() => setStockFilter('out_of_stock')}
                                        />
                                        <label className="form-check-label" htmlFor="stock-out">Out of stock</label>
                                    </div>
                                </div>

                                {/* Filter by Charge Voltage */}
                                <div className="card p-3 border bg-white rounded-3 shadow-none" style={{ minWidth: '170px' }}>
                                    <div className="text-muted fw-bold small text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>CHARGE VOLTAGE(V)</div>
                                    <div className="form-check small">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="cv-42"
                                            checked={voltageFilter.includes('3.7V')}
                                            onChange={(e) => {
                                                if (e.target.checked) setVoltageFilter([...voltageFilter, '3.7V']);
                                                else setVoltageFilter(voltageFilter.filter(v => v !== '3.7V'));
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="cv-42">4.2V Max (3.7V)</label>
                                    </div>
                                </div>

                                {/* Filter by Discharge Port */}
                                <div className="card p-3 border bg-white rounded-3 shadow-none" style={{ minWidth: '190px' }}>
                                    <div className="text-muted fw-bold small text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>DISCHARGE PORT</div>
                                    <div className="form-check small mb-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="dp-open"
                                            checked={portFilter.includes('JST')}
                                            onChange={(e) => {
                                                if (e.target.checked) setPortFilter([...portFilter, 'JST']);
                                                else setPortFilter(portFilter.filter(p => p !== 'JST'));
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="dp-open">2-Pin JST-XH</label>
                                    </div>
                                    <div className="form-check small">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="dp-bec"
                                            checked={portFilter.includes('BEC')}
                                            onChange={(e) => {
                                                if (e.target.checked) setPortFilter([...portFilter, 'BEC']);
                                                else setPortFilter(portFilter.filter(p => p !== 'BEC'));
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="dp-bec">2-Pin JST RCY BEC</label>
                                    </div>
                                </div>

                                {/* Filter by Nominal Capacity */}
                                <div className="card p-3 border bg-white rounded-3 shadow-none" style={{ minWidth: '180px' }}>
                                    <div className="text-muted fw-bold small text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>CAPACITY (mAh)</div>
                                    {['2000', '2200', '2500', '2600', '5000'].map(cap => (
                                        <div key={cap} className="form-check small mb-1">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`cap-${cap}`}
                                                checked={capacityFilter.includes(cap)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setCapacityFilter([...capacityFilter, cap]);
                                                    else setCapacityFilter(capacityFilter.filter(c => c !== cap));
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`cap-${cap}`}>{cap} mAh</label>
                                        </div>
                                    ))}
                                </div>

                                {/* Filter by BMS */}
                                <div className="card p-3 border bg-white rounded-3 shadow-none" style={{ minWidth: '160px' }}>
                                    <div className="text-muted fw-bold small text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>BMS (Y/N)</div>
                                    <div className="form-check small mb-1">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="bmsOpt"
                                            id="bms-all"
                                            checked={bmsFilter === 'all'}
                                            onChange={() => setBmsFilter('all')}
                                        />
                                        <label className="form-check-label" htmlFor="bms-all">All</label>
                                    </div>
                                    <div className="form-check small mb-1">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="bmsOpt"
                                            id="bms-yes"
                                            checked={bmsFilter === 'yes'}
                                            onChange={() => setBmsFilter('yes')}
                                        />
                                        <label className="form-check-label" htmlFor="bms-yes">Yes (with BMS)</label>
                                    </div>
                                    <div className="form-check small">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="bmsOpt"
                                            id="bms-no"
                                            checked={bmsFilter === 'no'}
                                            onChange={() => setBmsFilter('no')}
                                        />
                                        <label className="form-check-label" htmlFor="bms-no">No (Standard)</label>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Action bar */}
                            <div className="mt-3 pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <div className="input-group" style={{ maxWidth: '420px' }}>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search products in this category..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm text-white px-4 fw-semibold"
                                        style={{ background: '#312e81' }}
                                    >
                                        Search
                                    </button>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-muted small">Showing {filteredProducts.length} items</span>
                                    <select
                                        className="form-select form-select-sm"
                                        style={{ width: '180px' }}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                    >
                                        <option value="latest">Sort by Latest</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid matching Image 4 */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-battery-empty fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">No products match current filter criteria.</h5>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm rounded-pill mt-2"
                                    onClick={() => {
                                        setStockFilter('all');
                                        setCapacityFilter([]);
                                        setVoltageFilter([]);
                                        setPortFilter([]);
                                        setBmsFilter('all');
                                        setSearchQuery('');
                                    }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {filteredProducts.map(p => {
                                    const liveStock = getProductStock(p.sku);
                                    const isOutOfStock = liveStock <= 0;
                                    return (
                                        <div key={p.sku} className="col-md-6 col-lg-4 col-xl" style={{ minWidth: '220px' }}>
                                            <div
                                                className="card h-100 border rounded-4 shadow-sm p-3 position-relative d-flex flex-column"
                                                style={{
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    background: '#ffffff'
                                                }}
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setCurrentStage('product_detail');
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                                }}
                                            >
                                                {/* Header category text */}
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                                                        {selectedSubSubCat}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-muted p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            showToast(`Saved to wishlist: ${p.name}`);
                                                        }}
                                                    >
                                                        <i className="far fa-heart"></i>
                                                    </button>
                                                </div>

                                                {/* Out of Stock diagonal badge if stock <= 0 (matching Image 4) */}
                                                {isOutOfStock && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '25px',
                                                            right: '-25px',
                                                            background: '#ef4444',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.65rem',
                                                            padding: '2px 30px',
                                                            transform: 'rotate(45deg)',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                                            zIndex: 5
                                                        }}
                                                    >
                                                        Out of Stock
                                                    </div>
                                                )}

                                                {/* Product Visual */}
                                                <div className="py-3 text-center d-flex align-items-center justify-content-center">
                                                    <BatteryVisual type="1cell" width={140} height={100} />
                                                </div>

                                                {/* Product Info */}
                                                <div className="d-flex flex-column flex-grow-1">
                                                    <h6 className="fw-bold text-dark small mb-1" style={{ minHeight: '2.8rem', lineHeight: '1.3' }}>
                                                        {p.name}
                                                    </h6>
                                                    <div className="text-muted small mb-1" style={{ fontSize: '0.72rem' }}>
                                                        SKU: {p.sku}
                                                    </div>

                                                    <div className="d-flex align-items-center gap-1 text-warning small mb-2" style={{ fontSize: '0.75rem' }}>
                                                        <i className="fas fa-star text-warning"></i>
                                                        <i className="fas fa-star text-warning"></i>
                                                        <i className="fas fa-star text-warning"></i>
                                                        <i className="fas fa-star text-warning"></i>
                                                        <i className="fas fa-star text-warning"></i>
                                                        <span className="text-muted ms-1">({p.reviewsCount})</span>
                                                    </div>

                                                    {/* Real stock indicator */}
                                                    <div className="mb-2">
                                                        {liveStock > 0 ? (
                                                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.7rem' }}>
                                                                <i className="fas fa-check-circle me-1"></i>In Stock ({liveStock} units)
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill" style={{ fontSize: '0.7rem' }}>
                                                                <i className="fas fa-times-circle me-1"></i>Out of Stock (0 units)
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="fw-bold fs-5 text-dark mb-3 mt-auto">
                                                        ₹ {p.price} <span className="text-muted fw-normal" style={{ fontSize: '0.7rem' }}>(incl. GST)</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary btn-sm rounded-pill fw-semibold py-1.5 w-100 d-flex align-items-center justify-content-center gap-2"
                                                        style={{ borderColor: '#4f46e5', color: '#4f46e5' }}
                                                        disabled={isOutOfStock}
                                                        onClick={(e) => handleAddToCart(p, 1, e)}
                                                    >
                                                        <i className="fas fa-shopping-cart"></i> {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ================================================================ */}
                {/* STAGE 4: PRODUCT DETAIL PAGE (Matches Image 5)                   */}
                {/* ================================================================ */}
                {currentStage === 'product_detail' && selectedProduct && (
                    <div>
                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-link text-primary p-0 text-decoration-none small fw-semibold"
                                onClick={() => setCurrentStage('product_list')}
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back to product catalog
                            </button>
                        </div>

                        <div className="row g-5 mb-5">
                            {/* Left Column: Product Gallery & Delivery Checker */}
                            <div className="col-lg-6">
                                <div className="card border rounded-4 shadow-sm p-4 text-center bg-white mb-3">
                                    <div className="d-flex align-items-center justify-content-center py-4" style={{ minHeight: '320px' }}>
                                        <BatteryVisual type="1cell" width={280} height={200} />
                                    </div>
                                    {/* Thumbnails */}
                                    <div className="d-flex justify-content-center gap-3 pt-3 border-top">
                                        {[0, 1].map((idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setSelectedThumbnail(idx)}
                                                className={`btn p-1 rounded-3 border ${selectedThumbnail === idx ? 'border-primary' : 'border-secondary-subtle'}`}
                                                style={{ width: '60px', height: '60px', background: '#f8fafc' }}
                                            >
                                                <BatteryVisual type="1cell" width={50} height={40} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pincode Checker */}
                                <div className="card border rounded-4 shadow-sm p-3 bg-light">
                                    <form onSubmit={handleCheckPincode} className="d-flex gap-2 align-items-center">
                                        <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
                                            <i className="fas fa-map-marker-alt text-danger"></i>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Enter 6-digit pincode"
                                                value={pincode}
                                                maxLength={6}
                                                onChange={(e) => setPincode(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-sm text-white px-3 fw-semibold" style={{ background: '#312e81' }}>
                                            Check
                                        </button>
                                    </form>
                                    {pincodeStatus && (
                                        <div className="small mt-2 text-success fw-medium">
                                            <i className="fas fa-shipping-fast me-1"></i> {pincodeStatus}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Title, Price, Real Stock, Specs, Actions */}
                            <div className="col-lg-6">
                                <span className="text-muted small">{selectedSubSubCat}</span>
                                <h3 className="fw-bold text-dark mt-1 mb-2">{selectedProduct.name}</h3>

                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <div className="text-warning small">
                                        <i className="fas fa-star text-warning"></i>
                                        <i className="fas fa-star text-warning"></i>
                                        <i className="fas fa-star text-warning"></i>
                                        <i className="fas fa-star text-warning"></i>
                                        <i className="fas fa-star text-warning"></i>
                                    </div>
                                    <span className="text-muted small">({selectedProduct.reviewsCount} customer review)</span>
                                </div>

                                <div className="text-muted small mb-2">SKU: <strong className="text-dark">{selectedProduct.sku}</strong></div>

                                <div className="d-flex align-items-baseline gap-2 mb-2">
                                    <span className="fs-2 fw-bold text-dark">₹{selectedProduct.price}.00</span>
                                    <span className="text-muted small">(incl. GST)</span>
                                </div>

                                <div className="text-muted small mb-3">
                                    Purchase this product now and earn <strong className="text-primary">3 RobuPoints!</strong>
                                </div>

                                {/* Real Stock Indicator */}
                                {(() => {
                                    const liveStock = getProductStock(selectedProduct.sku);
                                    return (
                                        <div className="mb-3">
                                            <span className="small text-muted me-2">Availability:</span>
                                            {liveStock > 0 ? (
                                                <span className="badge bg-success text-white px-3 py-1.5 rounded-pill fw-semibold">
                                                    <i className="fas fa-check me-1"></i> In Stock ({liveStock} units available)
                                                </span>
                                            ) : (
                                                <span className="badge bg-danger text-white px-3 py-1.5 rounded-pill fw-semibold">
                                                    <i className="fas fa-times me-1"></i> Out of Stock (0 units)
                                                </span>
                                            )}
                                        </div>
                                    );
                                })()}

                                <div className="alert alert-light border small text-muted mb-3 py-2">
                                    For bulk orders or B2B inquiries, email us: <strong className="text-dark">sales@rbotics.in</strong>
                                </div>

                                {/* Key Specifications list */}
                                <ol className="small text-muted ps-3 mb-3 leading-relaxed">
                                    <li>Nominal Voltage (V): <strong>{selectedProduct.voltage}</strong></li>
                                    <li>Nominal Capacity (mAh): <strong>{selectedProduct.capacity}</strong></li>
                                    <li>Discharge Current: <strong>{selectedProduct.dischargeRate}</strong></li>
                                    <li>Charge Connector: <strong>{selectedProduct.connector}</strong></li>
                                </ol>

                                <div className="row g-2 small text-muted mb-4 border-top pt-2">
                                    <div className="col-4">Brand: <strong className="text-dark">{selectedProduct.brand}</strong></div>
                                    <div className="col-8">Category: <strong className="text-dark">{selectedSubSubCat}</strong></div>
                                </div>

                                {/* Quantity, Add to Cart & Buy Now */}
                                {(() => {
                                    const liveStock = getProductStock(selectedProduct.sku);
                                    const isOutOfStock = liveStock <= 0;
                                    return (
                                        <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
                                            {/* Quantity selector */}
                                            <div className="d-flex align-items-center border rounded-pill px-3 py-1.5 bg-light me-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link text-dark p-0 text-decoration-none"
                                                    onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                                                    disabled={isOutOfStock}
                                                >
                                                    <i className="fas fa-minus small"></i>
                                                </button>
                                                <span className="mx-3 fw-bold text-dark small" style={{ minWidth: '20px', textAlign: 'center' }}>
                                                    {isOutOfStock ? 0 : detailQty}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link text-dark p-0 text-decoration-none"
                                                    onClick={() => setDetailQty(Math.min(liveStock, detailQty + 1))}
                                                    disabled={isOutOfStock || detailQty >= liveStock}
                                                >
                                                    <i className="fas fa-plus small"></i>
                                                </button>
                                            </div>

                                            {/* Wishlist button */}
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary rounded-circle"
                                                style={{ width: '42px', height: '42px' }}
                                                onClick={() => showToast(`Added ${selectedProduct.name} to wishlist.`)}
                                            >
                                                <i className="far fa-heart"></i>
                                            </button>

                                            {/* Add to Cart button */}
                                            <button
                                                type="button"
                                                className="btn px-4 py-2.5 rounded-pill fw-bold text-white shadow-sm d-flex align-items-center gap-2"
                                                style={{ background: '#4f46e5' }}
                                                disabled={isOutOfStock}
                                                onClick={(e) => handleAddToCart(selectedProduct, detailQty, e)}
                                            >
                                                <i className="fas fa-shopping-cart"></i> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                            </button>

                                            {/* Buy Now button */}
                                            <button
                                                type="button"
                                                className="btn px-4 py-2.5 rounded-pill fw-bold text-white shadow-sm d-flex align-items-center gap-2"
                                                style={{ background: '#f97316' }}
                                                disabled={isOutOfStock}
                                                onClick={(e) => {
                                                    handleAddToCart(selectedProduct, detailQty, e);
                                                }}
                                            >
                                                <i className="fas fa-bolt"></i> Buy Now
                                            </button>
                                        </div>
                                    );
                                })()}

                                {/* Value Propositions bar matching Image 5 */}
                                <div className="row g-2 text-center small text-muted border-top border-bottom py-3 mb-4">
                                    <div className="col">
                                        <i className="fas fa-box-open d-block mb-1 text-primary"></i>
                                        <span>Bulk Order?</span>
                                    </div>
                                    <div className="col">
                                        <i className="fas fa-headset d-block mb-1 text-primary"></i>
                                        <span>Need Support?</span>
                                    </div>
                                    <div className="col">
                                        <i className="fas fa-shield-alt d-block mb-1 text-success"></i>
                                        <span>15 Days Warranty</span>
                                    </div>
                                    <div className="col">
                                        <i className="fas fa-truck d-block mb-1 text-primary"></i>
                                        <span>Free Delivery &gt;₹999</span>
                                    </div>
                                    <div className="col">
                                        <i className="fas fa-money-bill-wave d-block mb-1 text-success"></i>
                                        <span>Cash on Delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add-on product row matching Image 5 */}
                        <div className="card border rounded-4 shadow-sm p-3 mb-5 bg-white">
                            <h6 className="fw-bold text-dark mb-3">Select below products to add together</h6>
                            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border">
                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input ms-2"
                                        checked={includeAddon}
                                        onChange={(e) => setIncludeAddon(e.target.checked)}
                                    />
                                    <div style={{ width: '50px', height: '40px' }}>
                                        <BatteryVisual type="cellmeter" width={50} height={38} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold text-dark mb-0 small">Cellmeter 8 Multi-Functional Digital Power Servo Tester</h6>
                                        <span className="badge bg-success-subtle text-success small" style={{ fontSize: '0.68rem' }}>In Stock</span>
                                    </div>
                                </div>
                                <div className="text-end me-2">
                                    <span className="fw-bold text-dark">₹ 939</span>
                                    <span className="text-muted small ms-1">(incl. GST)</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabbed detail section matching Image 5 */}
                        <div className="card border rounded-4 shadow-sm p-4 bg-white mb-4">
                            <ul className="nav nav-tabs border-bottom mb-4">
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link fw-bold ${activeTab === 'desc' ? 'active text-primary' : 'text-muted'}`}
                                        onClick={() => setActiveTab('desc')}
                                    >
                                        Description
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link fw-bold ${activeTab === 'specs' ? 'active text-primary' : 'text-muted'}`}
                                        onClick={() => setActiveTab('specs')}
                                    >
                                        Specification
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link fw-bold ${activeTab === 'warranty' ? 'active text-primary' : 'text-muted'}`}
                                        onClick={() => setActiveTab('warranty')}
                                    >
                                        Warranty
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link fw-bold ${activeTab === 'reviews' ? 'active text-primary' : 'text-muted'}`}
                                        onClick={() => setActiveTab('reviews')}
                                    >
                                        Reviews ({selectedProduct.reviewsCount})
                                    </button>
                                </li>
                            </ul>

                            <div className="tab-content small leading-relaxed text-muted">
                                {activeTab === 'desc' && (
                                    <div>
                                        <p>{selectedProduct.description}</p>
                                        <h6 className="fw-bold text-dark mt-3 mb-2">Features:</h6>
                                        <ul className="ps-3 mb-3">
                                            {selectedProduct.features.map((f, i) => (
                                                <li key={i}>{f}</li>
                                            ))}
                                        </ul>
                                        <h6 className="fw-bold text-dark mt-3 mb-2">Package Includes:</h6>
                                        <ul className="ps-3">
                                            {selectedProduct.packageIncludes.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <div className="table-responsive">
                                        <table className="table table-sm table-striped">
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold text-dark" style={{ width: '35%' }}>Nominal Voltage</td>
                                                    <td>{selectedProduct.voltage}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold text-dark">Nominal Capacity</td>
                                                    <td>{selectedProduct.capacity}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold text-dark">Discharge Rate</td>
                                                    <td>{selectedProduct.dischargeRate}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold text-dark">Connector Type</td>
                                                    <td>{selectedProduct.connector}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold text-dark">Integrated BMS</td>
                                                    <td>{selectedProduct.hasBms ? 'Yes' : 'No'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold text-dark">Weight</td>
                                                    <td>{selectedProduct.weight}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'warranty' && (
                                    <div>
                                        <h6 className="fw-bold text-dark">15 Days Replacement Warranty</h6>
                                        <p>
                                            This battery pack is covered under Rbotics standard 15-day replacement policy against manufacturing defects and cell imbalance out of the box.
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div>
                                        <p>No reviews yet for this SKU. Be the first to review!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Products;
