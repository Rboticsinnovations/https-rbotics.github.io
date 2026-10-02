import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AuthUser } from '../context/AuthContext';
import {
    ALLOWED_CATEGORIES,
    getProductsCatalog,
    getInventory,
    saveProduct,
    deleteProduct,
    restockProduct
} from '../data/productsData';
import type { AllowedCategory, ProductItem } from '../data/productsData';

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    mobile: string;
    subject: string;
    message: string;
    submittedAt: string;
}

const AdminDashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'products' | 'users' | 'contacts' | 'orders'>('products');

    const getUsers = (): AuthUser[] => {
        const stored = localStorage.getItem('rbotics_users');
        return stored ? JSON.parse(stored) : [];
    };

    const getContacts = (): ContactSubmission[] => {
        const stored = localStorage.getItem('rbotics_contact_submissions');
        return stored ? JSON.parse(stored) : [];
    };

    const getOrders = (): any[] => {
        try {
            return JSON.parse(localStorage.getItem('rbotics_orders') || '[]');
        } catch {
            return [];
        }
    };

    const [users, setUsers] = useState<AuthUser[]>(getUsers);
    const [contacts, setContacts] = useState<ContactSubmission[]>(getContacts);
    const [orders, setOrders] = useState<any[]>(getOrders);
    const [catalog, setCatalog] = useState<ProductItem[]>(getProductsCatalog);
    const [inventory, setInventory] = useState(getInventory);
    const [restockInputs, setRestockInputs] = useState<Record<string, number>>({});

    // Search and filter for products tab
    const [productSearch, setProductSearch] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

    // Edit / Create Product Modal state
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

    // Form inputs state for product modal
    const [formSku, setFormSku] = useState('');
    const [formName, setFormName] = useState('');
    const [formCategory, setFormCategory] = useState<AllowedCategory>('Batteries, Power Supply and Accessories');
    const [formSubCategory, setFormSubCategory] = useState('');
    const [formPrice, setFormPrice] = useState<number>(0);
    const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
    const [formStock, setFormStock] = useState<number>(0);
    const [formBrand, setFormBrand] = useState('Rbotics Innovations');
    const [formWarranty, setFormWarranty] = useState('15 Days Replacement Warranty against manufacturing defects.');
    const [formDatasheetUrl, setFormDatasheetUrl] = useState('');
    const [formImageUrl, setFormImageUrl] = useState('');
    const [formVoltage, setFormVoltage] = useState('');
    const [formCapacity, setFormCapacity] = useState('');
    const [formConnector, setFormConnector] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formFeatures, setFormFeatures] = useState('');

    const refreshData = () => {
        setUsers(getUsers());
        setContacts(getContacts());
        setOrders(getOrders());
        setCatalog(getProductsCatalog());
        setInventory(getInventory());
    };

    useEffect(() => {
        const handleSync = () => {
            setCatalog(getProductsCatalog());
            setInventory(getInventory());
        };
        window.addEventListener('products-catalog-updated', handleSync);
        window.addEventListener('inventory-updated', handleSync);
        return () => {
            window.removeEventListener('products-catalog-updated', handleSync);
            window.removeEventListener('inventory-updated', handleSync);
        };
    }, []);

    const showNotification = (msg: string) => {
        setNotificationMsg(msg);
        setTimeout(() => setNotificationMsg(null), 3500);
    };

    const handleOpenEditModal = (p: ProductItem) => {
        setIsCreatingNew(false);
        setEditingProduct(p);
        setFormSku(p.sku);
        setFormName(p.name);
        setFormCategory((ALLOWED_CATEGORIES.includes(p.category as any) ? p.category : 'Batteries, Power Supply and Accessories') as AllowedCategory);
        setFormSubCategory(p.subSubCategory || '');
        setFormPrice(p.price);
        setFormOriginalPrice(p.originalPrice);
        setFormStock(inventory[p.sku] !== undefined ? inventory[p.sku] : p.initialStock);
        setFormBrand(p.brand || 'Rbotics Innovations');
        setFormWarranty(p.warranty || '15 Days Replacement Warranty');
        setFormDatasheetUrl(p.datasheetUrl || '');
        setFormImageUrl(p.imageUrl || '');
        setFormVoltage(p.voltage || '');
        setFormCapacity(p.capacity || '');
        setFormConnector(p.connector || '');
        setFormDescription(p.description || '');
        setFormFeatures(p.features ? p.features.join('\n') : '');
    };

    const handleOpenAddModal = () => {
        setIsCreatingNew(true);
        const newSku = `RB-${Date.now().toString().slice(-6)}`;
        setEditingProduct({
            id: `prod-${Date.now()}`,
            sku: newSku,
            name: '',
            category: 'Batteries, Power Supply and Accessories',
            subSubCategory: 'Custom Equipment',
            price: 999,
            rating: 5.0,
            reviewsCount: 0,
            initialStock: 10,
            brand: 'Rbotics Innovations',
            description: '',
            features: [],
            packageIncludes: []
        });
        setFormSku(newSku);
        setFormName('');
        setFormCategory('Batteries, Power Supply and Accessories');
        setFormSubCategory('Standard');
        setFormPrice(999);
        setFormOriginalPrice(1299);
        setFormStock(15);
        setFormBrand('Rbotics Innovations');
        setFormWarranty('15 Days Replacement Warranty against manufacturing defects.');
        setFormDatasheetUrl('https://rbotics.in/datasheets/sample-spec.pdf');
        setFormImageUrl('');
        setFormVoltage('');
        setFormCapacity('');
        setFormConnector('');
        setFormDescription('Engineered high reliability component manufactured for robotics systems.');
        setFormFeatures('Industrial Grade Quality\nTested for High Performance');
    };

    const handleSaveProductModal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim() || !formSku.trim()) {
            alert('Please provide product name and SKU.');
            return;
        }

        const featuresArray = formFeatures
            .split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        const updated: ProductItem = {
            ...(editingProduct || {}),
            id: editingProduct?.id || `prod-${Date.now()}`,
            sku: formSku.trim(),
            name: formName.trim(),
            category: formCategory,
            subSubCategory: formSubCategory.trim() || formCategory,
            price: Number(formPrice),
            originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
            initialStock: Number(formStock),
            brand: formBrand.trim(),
            warranty: formWarranty.trim(),
            datasheetUrl: formDatasheetUrl.trim(),
            imageUrl: formImageUrl.trim(),
            voltage: formVoltage.trim() || undefined,
            capacity: formCapacity.trim() || undefined,
            connector: formConnector.trim() || undefined,
            description: formDescription.trim(),
            features: featuresArray,
            packageIncludes: editingProduct?.packageIncludes || [`1 x ${formName.trim()}`],
            rating: editingProduct?.rating || 5.0,
            reviewsCount: editingProduct?.reviewsCount || 0
        };

        saveProduct(updated);
        refreshData();
        setEditingProduct(null);
        showNotification(`Success: "${updated.name}" has been updated and synchronized across all user accounts!`);
    };

    const handleDeleteProduct = (p: ProductItem) => {
        if (window.confirm(`Are you sure you want to remove "${p.name}" (SKU: ${p.sku}) from the store catalog?`)) {
            deleteProduct(p.sku);
            refreshData();
            showNotification(`Product "${p.name}" removed from catalog.`);
        }
    };

    const deleteUser = (id: string) => {
        const updated = users.filter(u => u.id !== id);
        localStorage.setItem('rbotics_users', JSON.stringify(updated));

        const stored = localStorage.getItem('rbotics_users_with_pw');
        if (stored) {
            const withPw = JSON.parse(stored).filter((u: AuthUser) => u.id !== id);
            localStorage.setItem('rbotics_users_with_pw', JSON.stringify(withPw));
        }
        setUsers(updated);
        showNotification('User deleted from system.');
    };

    const deleteContact = (id: string) => {
        const updated = contacts.filter(c => c.id !== id);
        localStorage.setItem('rbotics_contact_submissions', JSON.stringify(updated));
        setContacts(updated);
        showNotification('Contact submission deleted.');
    };

    // Filtered products list for admin
    const filteredCatalog = catalog.filter(p => {
        if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
            return false;
        }
        if (productSearch) {
            const q = productSearch.toLowerCase();
            return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        }
        return true;
    });

    const statCard = (icon: string, label: string, value: number, color: string) => (
        <div style={{
            background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
            border: `1px solid ${color}33`,
            borderRadius: '16px',
            padding: '1.25rem',
            flex: 1,
            minWidth: '150px',
        }}>
            <div style={{
                width: '40px', height: '40px',
                background: `${color}22`,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem',
            }}>
                <i className={`fas ${icon}`} style={{ color, fontSize: '1.1rem' }}></i>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ color: '#e2e8f0', fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #060d1f 0%, #0d1a33 100%)',
            fontFamily: 'Roboto, sans-serif',
            paddingTop: '80px',
            paddingBottom: '80px'
        }}>
            {/* Notification Toast */}
            {notificationMsg && (
                <div style={{
                    position: 'fixed',
                    top: '90px',
                    right: '2rem',
                    zIndex: 3000,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                }}>
                    <i className="fas fa-check-circle fs-5"></i>
                    <span>{notificationMsg}</span>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                background: 'rgba(6,13,31,0.96)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(59,130,246,0.2)',
                padding: '0.85rem 2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                zIndex: 1000,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <i className="fas fa-shield-alt" style={{ color: '#fff', fontSize: '1rem' }}></i>
                    </div>
                    <div>
                        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Montserrat, sans-serif' }}>
                            Rbotics Admin Control
                        </span>
                        <span style={{ marginLeft: '8px', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                            Full Inventory & Store Access
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}>{currentUser?.name || 'Administrator'}</div>
                        <div style={{ color: '#3b82f6', fontSize: '0.75rem' }}>admin@rbotics.in</div>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171', borderRadius: '10px',
                            padding: '0.5rem 1rem', cursor: 'pointer',
                            fontSize: '0.875rem', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            transition: 'all 0.2s',
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>

            <div style={{ padding: '2rem', maxWidth: '1300px', margin: '0 auto' }}>
                {/* Dashboard Title */}
                <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'Montserrat, sans-serif', margin: 0 }}>
                            Admin Management & Monitoring
                        </h1>
                        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                            Modify product prices, stock, warranty, datasheets, and images. Real-time updates sync to all client accounts.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: '#fff', border: 'none', borderRadius: '10px',
                            padding: '0.65rem 1.25rem', fontWeight: 600, fontSize: '0.88rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.4)'
                        }}
                    >
                        <i className="fas fa-plus"></i> Add New Product
                    </button>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                    {statCard('fa-boxes-stacked', 'Catalog Products', catalog.length, '#3b82f6')}
                    {statCard('fa-layer-group', 'Active Categories', ALLOWED_CATEGORIES.length, '#8b5cf6')}
                    {statCard('fa-users', 'Registered Users', users.length, '#06b6d4')}
                    {statCard('fa-shopping-cart', 'Customer Orders', orders.length, '#10b981')}
                    {statCard('fa-envelope', 'Contact Inquiries', contacts.length, '#f59e0b')}
                </div>

                {/* Tabs Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {(['products', 'users', 'contacts', 'orders'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.65rem 1.25rem',
                                borderRadius: '10px', border: 'none', cursor: 'pointer',
                                fontWeight: 600, fontSize: '0.875rem',
                                background: activeTab === tab
                                    ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                                    : 'rgba(255,255,255,0.05)',
                                color: activeTab === tab ? '#fff' : '#64748b',
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}
                        >
                            <i className={`fas ${
                                tab === 'products' ? 'fa-boxes' :
                                tab === 'users' ? 'fa-users' :
                                tab === 'contacts' ? 'fa-envelope' : 'fa-shopping-cart'
                            }`}></i>
                            {tab === 'products' ? `Products & Inventory (${catalog.length})` :
                             tab === 'users' ? `Users List (${users.length})` :
                             tab === 'contacts' ? `Contact Submissions (${contacts.length})` : `Orders (${orders.length})`}
                        </button>
                    ))}
                    <button
                        onClick={refreshData}
                        style={{
                            marginLeft: 'auto', padding: '0.6rem 1rem',
                            borderRadius: '10px', border: '1px solid rgba(99,179,237,0.2)',
                            background: 'transparent', color: '#64748b', cursor: 'pointer',
                            fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                        }}
                    >
                        <i className="fas fa-sync-alt"></i> Refresh Data
                    </button>
                </div>

                {/* ============================================================== */}
                {/* TAB 1: PRODUCTS & INVENTORY MANAGER (EDIT PRICE, STOCK, ETC.) */}
                {/* ============================================================== */}
                {activeTab === 'products' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {/* Filter & Search Bar */}
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            flexWrap: 'wrap', gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <select
                                    style={{
                                        background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                        color: '#e2e8f0', borderRadius: '8px', padding: '0.5rem 0.85rem',
                                        fontSize: '0.85rem'
                                    }}
                                    value={selectedCategoryFilter}
                                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                >
                                    <option value="all">All 9 Allowed Categories</option>
                                    {ALLOWED_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Search by SKU, product name..."
                                        style={{
                                            background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                                            fontSize: '0.85rem', width: '280px'
                                        }}
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                    />
                                    <i className="fas fa-search" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.8rem' }}></i>
                                </div>
                            </div>

                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                Showing <strong>{filteredCatalog.length}</strong> of {catalog.length} products
                            </span>
                        </div>

                        {/* Products Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        {['SKU & Image', 'Product Name', 'Category', 'Price', 'Live Stock', 'Warranty & Datasheet', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCatalog.map(p => {
                                        const currentStock = inventory[p.sku] !== undefined ? inventory[p.sku] : p.initialStock;
                                        const isOutOfStock = currentStock <= 0;
                                        return (
                                            <tr key={p.sku} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                {/* SKU & Image */}
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '42px', height: '42px', borderRadius: '8px',
                                                            background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {p.imageUrl ? (
                                                                <img src={p.imageUrl} alt={p.sku} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            ) : (
                                                                <i className="fas fa-microchip text-primary" style={{ fontSize: '1.1rem' }}></i>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div style={{ color: '#93c5fd', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600 }}>{p.sku}</div>
                                                            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{p.brand}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Name */}
                                                <td style={{ padding: '1rem 1.25rem', color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem', maxWidth: '280px' }}>
                                                    <div style={{ whiteSpace: 'normal', lineHeight: '1.3' }}>{p.name}</div>
                                                </td>

                                                {/* Category */}
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{
                                                        padding: '0.2rem 0.6rem', borderRadius: '6px',
                                                        background: 'rgba(59,130,246,0.15)', color: '#93c5fd',
                                                        fontSize: '0.75rem', fontWeight: 500
                                                    }}>
                                                        {p.category}
                                                    </span>
                                                </td>

                                                {/* Price */}
                                                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}>
                                                    ₹{p.price.toLocaleString('en-IN')}
                                                    {p.originalPrice && p.originalPrice > p.price && (
                                                        <div style={{ fontSize: '0.72rem', color: '#64748b', textDecoration: 'line-through' }}>
                                                            ₹{p.originalPrice}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Live Stock & Quick Edit */}
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                                        <span style={{
                                                            fontSize: '0.95rem', fontWeight: 700,
                                                            color: isOutOfStock ? '#ef4444' : '#10b981'
                                                        }}>
                                                            {currentStock} units
                                                        </span>
                                                        <span style={{
                                                            padding: '0.15rem 0.5rem', borderRadius: '12px',
                                                            background: isOutOfStock ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                                                            color: isOutOfStock ? '#f87171' : '#34d399',
                                                            fontSize: '0.7rem', fontWeight: 600
                                                        }}>
                                                            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                                        </span>
                                                    </div>

                                                    {/* Quick stock adjust input */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            placeholder="Set qty"
                                                            style={{
                                                                width: '70px', padding: '0.25rem 0.4rem',
                                                                background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                                                color: '#fff', borderRadius: '6px', fontSize: '0.75rem'
                                                            }}
                                                            value={restockInputs[p.sku] !== undefined ? restockInputs[p.sku] : ''}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value, 10);
                                                                setRestockInputs({ ...restockInputs, [p.sku]: isNaN(val) ? 0 : val });
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const val = restockInputs[p.sku];
                                                                if (val !== undefined && val >= 0) {
                                                                    restockProduct(p.sku, val);
                                                                    refreshData();
                                                                    showNotification(`Stock for ${p.sku} updated to ${val} units.`);
                                                                }
                                                            }}
                                                            style={{
                                                                padding: '0.25rem 0.5rem', background: '#3b82f6',
                                                                border: 'none', borderRadius: '6px', color: '#fff',
                                                                fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
                                                            }}
                                                        >
                                                            Set
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Warranty & Datasheet */}
                                                <td style={{ padding: '1rem 1.25rem', fontSize: '0.78rem' }}>
                                                    <div style={{ color: '#cbd5e1', marginBottom: '0.2rem' }}>
                                                        <i className="fas fa-shield-alt text-success me-1"></i>
                                                        <span style={{ maxWidth: '160px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {p.warranty || '15 Days Warranty'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        {p.datasheetUrl ? (
                                                            <a href={p.datasheetUrl} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                                                                <i className="fas fa-file-pdf text-danger me-1"></i> View Datasheet
                                                            </a>
                                                        ) : (
                                                            <span style={{ color: '#64748b' }}>No datasheet set</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditModal(p)}
                                                            style={{
                                                                padding: '0.4rem 0.75rem', background: 'rgba(59,130,246,0.2)',
                                                                border: '1px solid rgba(59,130,246,0.4)', borderRadius: '6px',
                                                                color: '#93c5fd', fontSize: '0.75rem', fontWeight: 600,
                                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem'
                                                            }}
                                                            title="Edit product details, price, images, warranty, datasheet"
                                                        >
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteProduct(p)}
                                                            style={{
                                                                padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.15)',
                                                                border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px',
                                                                color: '#f87171', fontSize: '0.75rem', cursor: 'pointer'
                                                            }}
                                                            title="Delete product"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* TAB 2: USERS LIST                                              */}
                {/* ============================================================== */}
                {activeTab === 'users' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(99,179,237,0.1)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {users.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                                <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                                No registered users found.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.1)' }}>
                                            {['#', 'Name', 'Email', 'Mobile', 'Role', 'Joined', 'Actions'].map(h => (
                                                <th key={h} style={{
                                                    padding: '1rem 1.25rem', textAlign: 'left',
                                                    color: '#64748b', fontSize: '0.8rem',
                                                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, i) => (
                                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>{i + 1}</td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px',
                                                            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                                            borderRadius: '50%',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                                                            flexShrink: 0,
                                                        }}>
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem' }}>{user.email}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem' }}>{user.mobile || '—'}</td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem', borderRadius: '20px',
                                                        background: user.role === 'admin' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                                                        color: user.role === 'admin' ? '#f87171' : '#60a5fa',
                                                        fontSize: '0.75rem', fontWeight: 600,
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                    {new Date(user.joinedAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                    })}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            style={{
                                                                background: 'rgba(239,68,68,0.1)',
                                                                border: '1px solid rgba(239,68,68,0.25)',
                                                                color: '#f87171', borderRadius: '8px',
                                                                padding: '0.35rem 0.75rem', cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                            }}
                                                        >
                                                            <i className="fas fa-trash-alt"></i> Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================================== */}
                {/* TAB 3: CONTACT SUBMISSIONS                                     */}
                {/* ============================================================== */}
                {activeTab === 'contacts' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(99,179,237,0.1)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {contacts.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                                <i className="fas fa-envelope-open" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                                No contact submissions yet.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.1)' }}>
                                            {['#', 'Name', 'Email', 'Mobile', 'Subject', 'Message', 'Date', 'Action'].map(h => (
                                                <th key={h} style={{
                                                    padding: '1rem 1.25rem', textAlign: 'left',
                                                    color: '#64748b', fontSize: '0.8rem',
                                                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map((c, i) => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>{i + 1}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <a href={`mailto:${c.email}`} style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.875rem' }}>{c.email}</a>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem' }}>{c.mobile || '—'}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontSize: '0.875rem' }}>{c.subject}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.85rem', maxWidth: '240px' }}>{c.message}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                    {new Date(c.submittedAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                    })}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <button
                                                        onClick={() => deleteContact(c.id)}
                                                        style={{
                                                            background: 'rgba(239,68,68,0.1)',
                                                            border: '1px solid rgba(239,68,68,0.25)',
                                                            color: '#f87171', borderRadius: '8px',
                                                            padding: '0.35rem 0.75rem', cursor: 'pointer',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        <i className="fas fa-trash-alt"></i> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================================== */}
                {/* TAB 4: ORDERS MONITOR                                          */}
                {/* ============================================================== */}
                {activeTab === 'orders' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {orders.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                                <i className="fas fa-box-open" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                                No customer orders recorded yet.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            {['Order ID', 'Date', 'Customer', 'Items Ordered', 'Total', 'Payment', 'Status'].map(h => (
                                                <th key={h} style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.orderId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
                                                    {o.orderId}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>{o.date}</td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>{o.customer?.name}</div>
                                                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{o.customer?.email}</div>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                                    {o.items?.map((it: any, idx: number) => (
                                                        <div key={idx}>• {it.name} (x{it.quantity})</div>
                                                    ))}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#10b981', fontWeight: 700 }}>
                                                    ₹{o.grandTotal?.toLocaleString('en-IN')}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>{o.paymentMethod}</td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* EDIT / CREATE PRODUCT MODAL                                     */}
            {/* ============================================================== */}
            {editingProduct && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                        zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem'
                    }}
                >
                    <div
                        style={{
                            background: '#0f172a', border: '1px solid rgba(59,130,246,0.3)',
                            borderRadius: '20px', width: '100%', maxWidth: '850px', maxHeight: '90vh',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                                }}>
                                    <i className={`fas ${isCreatingNew ? 'fa-plus' : 'fa-edit'}`}></i>
                                </div>
                                <div>
                                    <h5 style={{ margin: 0, color: '#e2e8f0', fontWeight: 700 }}>
                                        {isCreatingNew ? 'Add New Store Product' : `Edit Product: ${editingProduct.sku}`}
                                    </h5>
                                    <small style={{ color: '#64748b' }}>
                                        All modifications update in real-time across all user sessions and accounts.
                                    </small>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                style={{
                                    background: 'transparent', border: 'none', color: '#94a3b8',
                                    fontSize: '1.25rem', cursor: 'pointer'
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleSaveProductModal} style={{ overflowY: 'auto', padding: '1.75rem' }}>
                            <div className="row g-3">
                                {/* SKU & Brand */}
                                <div className="col-md-6">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Product SKU *
                                    </label>
                                    <input
                                        type="text"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formSku}
                                        onChange={(e) => setFormSku(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Brand / Manufacturer *
                                    </label>
                                    <input
                                        type="text"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formBrand}
                                        onChange={(e) => setFormBrand(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Product Title */}
                                <div className="col-12">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Full Product Title *
                                    </label>
                                    <input
                                        type="text"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Category (Strictly Allowed 9) */}
                                <div className="col-md-6">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Category (Allowed Categories) *
                                    </label>
                                    <select
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value as AllowedCategory)}
                                        required
                                    >
                                        {ALLOWED_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcategory / Type */}
                                <div className="col-md-6">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Subcategory / Sub-pack Name
                                    </label>
                                    <input
                                        type="text"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formSubCategory}
                                        onChange={(e) => setFormSubCategory(e.target.value)}
                                    />
                                </div>

                                {/* Price, Original Price & Stock Entry */}
                                <div className="col-md-4">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Price (₹ incl. GST) *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formPrice}
                                        onChange={(e) => setFormPrice(Number(e.target.value))}
                                        required
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Original / Strike Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="Optional original price"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formOriginalPrice || ''}
                                        onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Live Stock Entry (Units) *
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#34d399', fontWeight: 700, borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formStock}
                                        onChange={(e) => setFormStock(Number(e.target.value))}
                                        required
                                    />
                                </div>

                                {/* Image URL with live preview */}
                                <div className="col-12">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Product Image URL (Live Web Link)
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <input
                                            type="url"
                                            placeholder="https://example.com/images/product.jpg"
                                            style={{
                                                flex: 1, background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                                color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                            }}
                                            value={formImageUrl}
                                            onChange={(e) => setFormImageUrl(e.target.value)}
                                        />
                                        {formImageUrl && (
                                            <div style={{
                                                width: '45px', height: '45px', borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden',
                                                background: '#fff', flexShrink: 0
                                            }}>
                                                <img src={formImageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                        )}
                                    </div>
                                    <small style={{ color: '#64748b' }}>
                                        If left blank, system generates an interactive SVG/hardware icon automatically.
                                    </small>
                                </div>

                                {/* Warranty & Datasheet URL (Requested additions) */}
                                <div className="col-md-6">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Warranty Coverage Policy *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 15 Days Replacement Warranty against defects"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formWarranty}
                                        onChange={(e) => setFormWarranty(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Datasheet PDF URL / Spec Link
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://rbotics.in/datasheets/spec.pdf"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formDatasheetUrl}
                                        onChange={(e) => setFormDatasheetUrl(e.target.value)}
                                    />
                                </div>

                                {/* Technical Specs (Voltage, Capacity, Connector) */}
                                <div className="col-md-4">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Nominal Voltage (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 3.7V / 11.1V"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formVoltage}
                                        onChange={(e) => setFormVoltage(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Capacity / Rating (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2600 mAh / 45A"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formCapacity}
                                        onChange={(e) => setFormCapacity(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Connector / Port (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. XT60 / JST-XH"
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formConnector}
                                        onChange={(e) => setFormConnector(e.target.value)}
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-12">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Key Features */}
                                <div className="col-12">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                                        Key Bullet Features (One per line)
                                    </label>
                                    <textarea
                                        rows={3}
                                        style={{
                                            width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem'
                                        }}
                                        value={formFeatures}
                                        onChange={(e) => setFormFeatures(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Modal Footer Buttons */}
                            <div style={{
                                marginTop: '1.75rem', paddingTop: '1.25rem',
                                borderTop: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    style={{
                                        padding: '0.6rem 1.25rem', background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                                        color: '#cbd5e1', fontSize: '0.875rem', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none', borderRadius: '8px',
                                        color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                                    }}
                                >
                                    <i className="fas fa-check"></i> Save & Sync to Store
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
