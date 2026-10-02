import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AuthUser } from '../context/AuthContext';
import { INITIAL_PRODUCTS, getInventory, restockProduct } from '../data/productsData';

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
    const [activeTab, setActiveTab] = useState<'users' | 'contacts' | 'orders' | 'inventory'>('users');

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
    const [inventory, setInventory] = useState(getInventory);
    const [restockInputs, setRestockInputs] = useState<Record<string, number>>({});

    const refreshData = () => {
        setUsers(getUsers());
        setContacts(getContacts());
        setOrders(getOrders());
        setInventory(getInventory());
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
    };

    const deleteContact = (id: string) => {
        const updated = contacts.filter(c => c.id !== id);
        localStorage.setItem('rbotics_contact_submissions', JSON.stringify(updated));
        setContacts(updated);
    };

    const statCard = (icon: string, label: string, value: number, color: string) => (
        <div style={{
            background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
            border: `1px solid ${color}33`,
            borderRadius: '16px',
            padding: '1.5rem',
            flex: 1,
            minWidth: '140px',
        }}>
            <div style={{
                width: '44px', height: '44px',
                background: `${color}22`,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem',
            }}>
                <i className={`fas ${icon}`} style={{ color, fontSize: '1.2rem' }}></i>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ color: '#e2e8f0', fontSize: '2rem', fontWeight: 700 }}>{value}</div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #060d1f 0%, #0d1a33 100%)',
            fontFamily: 'Roboto, sans-serif',
            paddingTop: '80px',
        }}>
            {/* Top bar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                background: 'rgba(6,13,31,0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(59,130,246,0.15)',
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
                    <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Montserrat, sans-serif' }}>
                        Rbotics Admin
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}>{currentUser?.name}</div>
                        <div style={{ color: '#3b82f6', fontSize: '0.75rem' }}>Administrator</div>
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
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.3)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>

            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Page Title */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'Montserrat, sans-serif', margin: 0 }}>
                        Dashboard Overview
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                        Monitor users and contact submissions in real-time.
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {statCard('fa-users', 'Total Users', users.length, '#3b82f6')}
                    {statCard('fa-shopping-cart', 'Customer Orders', orders.length, '#10b981')}
                    {statCard('fa-envelope', 'Contact Submissions', contacts.length, '#06b6d4')}
                    {statCard('fa-boxes', 'Catalog Products', INITIAL_PRODUCTS.length, '#8b5cf6')}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {(['users', 'contacts', 'orders', 'inventory'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.6rem 1.25rem',
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
                                tab === 'users' ? 'fa-users' :
                                tab === 'contacts' ? 'fa-envelope' :
                                tab === 'orders' ? 'fa-shopping-cart' : 'fa-boxes'
                            }`}></i>
                            {tab === 'users' ? `Users (${users.length})` :
                             tab === 'contacts' ? `Contacts (${contacts.length})` :
                             tab === 'orders' ? `Orders (${orders.length})` : `Inventory (${Object.keys(inventory).length})`}
                        </button>
                    ))}
                    <button
                        onClick={refreshData}
                        style={{
                            marginLeft: 'auto', padding: '0.6rem 1rem',
                            borderRadius: '10px', border: '1px solid rgba(99,179,237,0.2)',
                            background: 'transparent', color: '#64748b', cursor: 'pointer',
                            fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = '#93c5fd')}
                        onMouseOut={e => (e.currentTarget.style.color = '#64748b')}
                    >
                        <i className="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(99,179,237,0.1)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {users.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                                <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                                No registered users yet.
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
                                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
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
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{user.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem' }}>{user.email || <span style={{ color: '#475569' }}>—</span>}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                                    {user.mobile
                                                        ? <><i className="fas fa-mobile-alt" style={{ marginRight: '0.4rem', color: '#06b6d4', fontSize: '0.75rem' }}></i>{user.mobile}</>
                                                        : <span style={{ color: '#475569' }}>—</span>
                                                    }
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                                        background: 'rgba(34,197,94,0.15)',
                                                        color: '#86efac', border: '1px solid rgba(34,197,94,0.25)',
                                                    }}>User</span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                    {new Date(user.joinedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <button
                                                        onClick={() => { if (window.confirm(`Delete user ${user.name}?`)) deleteUser(user.id); }}
                                                        style={{
                                                            background: 'rgba(239,68,68,0.1)',
                                                            border: '1px solid rgba(239,68,68,0.25)',
                                                            color: '#f87171', borderRadius: '8px',
                                                            padding: '0.35rem 0.75rem', cursor: 'pointer',
                                                            fontSize: '0.8rem', transition: 'all 0.2s',
                                                        }}
                                                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.25)')}
                                                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
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

                {/* Contacts Table */}
                {activeTab === 'contacts' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(99,179,237,0.1)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {contacts.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                                <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                                No contact submissions yet.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(99,179,237,0.1)' }}>
                                            {['#', 'Name', 'Email', 'Mobile', 'Subject', 'Message', 'Date', 'Actions'].map(h => (
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
                                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>{i + 1}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#e2e8f0', fontWeight: 500 }}>{c.name}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem' }}>{c.email}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                                    <i className="fas fa-phone-alt" style={{ marginRight: '0.4rem', color: '#06b6d4', fontSize: '0.75rem' }}></i>
                                                    {c.mobile || <span style={{ color: '#475569' }}>—</span>}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: 'rgba(139,92,246,0.15)',
                                                        color: '#c4b5fd', borderRadius: '20px',
                                                        fontSize: '0.8rem', fontWeight: 500,
                                                        border: '1px solid rgba(139,92,246,0.25)',
                                                        whiteSpace: 'nowrap',
                                                    }}>{c.subject}</span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.85rem', maxWidth: '200px' }}>
                                                    <div title={c.message} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {c.message}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                    {new Date(c.submittedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <button
                                                        onClick={() => { if (window.confirm('Delete this submission?')) deleteContact(c.id); }}
                                                        style={{
                                                            background: 'rgba(239,68,68,0.1)',
                                                            border: '1px solid rgba(239,68,68,0.25)',
                                                            color: '#f87171', borderRadius: '8px',
                                                            padding: '0.35rem 0.75rem', cursor: 'pointer',
                                                            fontSize: '0.8rem', transition: 'all 0.2s',
                                                        }}
                                                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.25)')}
                                                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
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

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <h3 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                                Customer Orders ({orders.length})
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
                                Confirmed online orders with automatic real-time stock deductions
                            </p>
                        </div>
                        {orders.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                <i className="fas fa-shopping-cart" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block', opacity: 0.4 }}></i>
                                No customer orders placed yet.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            {['Order ID', 'Date', 'Customer', 'Items Purchased', 'Total', 'Payment', 'Status'].map(h => (
                                                <th key={h} style={{ padding: '0.875rem 1.25rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((o: any) => (
                                            <tr key={o.orderId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem' }}>
                                                    {o.orderId}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                                                    {o.date}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#e2e8f0', fontSize: '0.85rem' }}>
                                                    <div style={{ fontWeight: 600 }}>{o.customer?.name}</div>
                                                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{o.customer?.mobile} • {o.customer?.email}</div>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
                                                    {o.items?.map((it: any) => (
                                                        <div key={it.sku} style={{ marginBottom: '2px' }}>
                                                            <strong>{it.quantity}x</strong> {it.name} <span style={{ color: '#64748b' }}>(SKU: {it.sku})</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>
                                                    ₹{o.grandTotal?.toLocaleString('en-IN')}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
                                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
                                                        {o.paymentMethod}
                                                    </span>
                                                </td>
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

                {/* Inventory Management Tab */}
                {activeTab === 'inventory' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <h3 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                                Real-Time Warehouse Inventory
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
                                Live stock counts adjust immediately when orders are confirmed. Update quantities below to restock.
                            </p>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['SKU', 'Product Name', 'Category', 'Price', 'Live Stock', 'Status', 'Restock / Adjust'].map(h => (
                                            <th key={h} style={{ padding: '0.875rem 1.25rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {INITIAL_PRODUCTS.map(p => {
                                        const currentStock = inventory[p.sku] !== undefined ? inventory[p.sku] : p.initialStock;
                                        const isOutOfStock = currentStock <= 0;
                                        return (
                                            <tr key={p.sku} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                                    {p.sku}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>
                                                    {p.name}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                    {p.subSubCategory}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    ₹{p.price.toLocaleString('en-IN')}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', fontSize: '1rem', fontWeight: 700, color: isOutOfStock ? '#ef4444' : '#10b981' }}>
                                                    {currentStock} units
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{
                                                        padding: '0.2rem 0.6rem', borderRadius: '20px',
                                                        background: isOutOfStock ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                                                        color: isOutOfStock ? '#f87171' : '#34d399',
                                                        fontSize: '0.75rem', fontWeight: 600
                                                    }}>
                                                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            placeholder="New stock"
                                                            style={{
                                                                width: '90px', padding: '0.35rem 0.5rem',
                                                                background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
                                                                color: '#fff', borderRadius: '6px', fontSize: '0.8rem'
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
                                                                    setInventory(getInventory());
                                                                }
                                                            }}
                                                            style={{
                                                                padding: '0.35rem 0.75rem', background: '#3b82f6',
                                                                border: 'none', borderRadius: '6px', color: '#fff',
                                                                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                                                            }}
                                                        >
                                                            Set Stock
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
            </div>
        </div>
    );
};

export default AdminDashboard;
