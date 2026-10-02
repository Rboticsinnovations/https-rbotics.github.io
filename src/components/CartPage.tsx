import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProductStock, deductStock } from '../data/productsData';
import { BatteryVisual } from './BatteryVisual';

export interface CartItem {
    id: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
}

interface CartPageProps {
    onClose: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ onClose }) => {
    const { currentUser } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('rbotics_cart') || '[]');
        } catch {
            return [];
        }
    });

    const [shippingDetails, setShippingDetails] = useState({
        name: currentUser?.name || '',
        mobile: currentUser?.mobile || '',
        email: currentUser?.email || '',
        address: 'Plot 42, Tech Park Road',
        city: 'Vizianagaram',
        state: 'Andhra Pradesh',
        pincode: '535002'
    });

    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
    const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [stockError, setStockError] = useState<string | null>(null);

    const updateQuantity = (sku: string, delta: number) => {
        const available = getProductStock(sku);
        const updated = cartItems.map(item => {
            if (item.sku === sku) {
                const newQty = item.quantity + delta;
                if (newQty < 1) return null;
                if (newQty > available && available > 0) {
                    setStockError(`Only ${available} units available in stock for ${item.name}`);
                    setTimeout(() => setStockError(null), 3000);
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean) as CartItem[];

        setCartItems(updated);
        localStorage.setItem('rbotics_cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const removeItem = (sku: string) => {
        const updated = cartItems.filter(item => item.sku !== sku);
        setCartItems(updated);
        localStorage.setItem('rbotics_cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const gst = Math.round(subtotal * 0.18);
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 60;
    const grandTotal = subtotal + gst + shipping;

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setStockError(null);

        if (cartItems.length === 0) {
            setStockError('Your cart is empty.');
            return;
        }

        // Validate stock for all items
        for (const item of cartItems) {
            const available = getProductStock(item.sku);
            if (available < item.quantity) {
                setStockError(`Insufficient stock for "${item.name}". Only ${available} available.`);
                return;
            }
        }

        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));

        // Deduct from real stock inventory!
        cartItems.forEach(item => {
            deductStock(item.sku, item.quantity);
        });

        const newOrder = {
            orderId: `RB-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            items: [...cartItems],
            customer: {
                name: shippingDetails.name,
                mobile: shippingDetails.mobile,
                email: shippingDetails.email,
                address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}`
            },
            paymentMethod: paymentMethod.toUpperCase(),
            subtotal,
            gst,
            shipping,
            grandTotal,
            status: 'Confirmed'
        };

        // Save order to localStorage
        try {
            const existingOrders = JSON.parse(localStorage.getItem('rbotics_orders') || '[]');
            existingOrders.unshift(newOrder);
            localStorage.setItem('rbotics_orders', JSON.stringify(existingOrders));
        } catch {
            // ignore
        }

        // Clear cart
        localStorage.removeItem('rbotics_cart');
        setCartItems([]);
        window.dispatchEvent(new Event('cart-updated'));

        setSubmitting(false);
        setOrderConfirmed(newOrder);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                zIndex: 3500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                overflowY: 'auto'
            }}
        >
            <div
                className="bg-white rounded-4 shadow-2xl overflow-hidden w-100"
                style={{
                    maxWidth: '1050px',
                    maxHeight: '92vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff'
                            }}
                        >
                            <i className="fas fa-shopping-cart fs-5"></i>
                        </div>
                        <div>
                            <h4 className="fw-bold mb-0 text-dark">Your Shopping Cart</h4>
                            <span className="text-muted small">
                                {orderConfirmed ? 'Order Confirmation' : `${cartItems.length} item(s) selected`}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto" style={{ flex: 1 }}>
                    {orderConfirmed ? (
                        /* Order Success Receipt Screen */
                        <div className="text-center py-4">
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#dcfce7',
                                    color: '#16a34a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.5rem',
                                    margin: '0 auto 1.5rem auto'
                                }}
                            >
                                <i className="fas fa-check"></i>
                            </div>
                            <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill mb-2 fw-semibold">
                                Real-Time Stock Updated (-{orderConfirmed.items.reduce((s: number, i: any) => s + i.quantity, 0)} units deducted)
                            </span>
                            <h3 className="fw-bold text-dark mb-1">Order Confirmed Successfully!</h3>
                            <p className="text-muted small mb-4">
                                Order ID: <strong className="text-primary">{orderConfirmed.orderId}</strong> • Placed on {orderConfirmed.date}
                            </p>

                            <div className="card border-0 bg-light rounded-4 p-4 text-start mx-auto mb-4" style={{ maxWidth: '650px' }}>
                                <h6 className="fw-bold mb-3 text-dark">Order Summary</h6>
                                {orderConfirmed.items.map((it: any) => (
                                    <div key={it.sku} className="d-flex justify-content-between py-2 border-bottom small">
                                        <div>
                                            <span className="fw-semibold text-dark">{it.name}</span>
                                            <span className="text-muted ms-2">x {it.quantity}</span>
                                        </div>
                                        <div className="fw-bold text-dark">
                                            ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-3">
                                    <div className="d-flex justify-content-between small text-muted mb-1">
                                        <span>Subtotal</span>
                                        <span>₹{orderConfirmed.subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="d-flex justify-content-between small text-muted mb-1">
                                        <span>GST (18% Included)</span>
                                        <span>₹{orderConfirmed.gst.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="d-flex justify-content-between small text-muted mb-2">
                                        <span>Delivery Charges</span>
                                        <span>{orderConfirmed.shipping === 0 ? 'FREE' : `₹${orderConfirmed.shipping}`}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold fs-5 text-dark border-top pt-2">
                                        <span>Grand Total</span>
                                        <span className="text-primary">₹{orderConfirmed.grandTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-white rounded-3 border small">
                                    <div className="fw-semibold text-dark mb-1">Delivery Address:</div>
                                    <div className="text-muted">{orderConfirmed.customer.name} ({orderConfirmed.customer.mobile})</div>
                                    <div className="text-muted">{orderConfirmed.customer.address}</div>
                                    <div className="text-muted mt-1">Payment Method: <strong>{orderConfirmed.paymentMethod}</strong></div>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary px-5 py-2 rounded-pill fw-bold"
                                onClick={onClose}
                            >
                                <i className="fas fa-arrow-left me-2"></i> Continue Shopping
                            </button>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-shopping-bag fa-4x text-muted mb-3 opacity-50"></i>
                            <h4 className="fw-bold text-dark">Your cart is currently empty</h4>
                            <p className="text-muted small">Explore our Lithium-ion batteries and robotics hardware to add products.</p>
                            <button
                                className="btn btn-primary rounded-pill px-4 py-2 mt-2 fw-semibold"
                                onClick={onClose}
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {/* Left: Cart Items List */}
                            <div className="col-lg-7">
                                {stockError && (
                                    <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2">
                                        <i className="fas fa-exclamation-triangle"></i>
                                        <span>{stockError}</span>
                                    </div>
                                )}

                                <div className="d-flex flex-column gap-3">
                                    {cartItems.map((item) => {
                                        const liveStock = getProductStock(item.sku);
                                        return (
                                            <div
                                                key={item.sku}
                                                className="p-3 rounded-4 border bg-white shadow-sm d-flex gap-3 align-items-center justify-content-between"
                                            >
                                                <div className="d-flex gap-3 align-items-center" style={{ flex: 1 }}>
                                                    <div
                                                        style={{
                                                            width: '64px',
                                                            height: '64px',
                                                            background: '#f8fafc',
                                                            borderRadius: '12px',
                                                            border: '1px solid #e2e8f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <BatteryVisual type="1cell" width={56} height={46} />
                                                    </div>
                                                    <div>
                                                        <h6 className="fw-bold text-dark mb-1 small" style={{ lineHeight: '1.3' }}>
                                                            {item.name}
                                                        </h6>
                                                        <div className="d-flex align-items-center gap-2 small">
                                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>SKU: {item.sku}</span>
                                                            <span className="text-primary fw-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                                            <span className={`badge ${liveStock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.68rem' }}>
                                                                {liveStock > 0 ? `${liveStock} in stock` : 'Out of stock'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls & Delete */}
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-link text-dark p-0 text-decoration-none"
                                                            style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            onClick={() => updateQuantity(item.sku, -1)}
                                                        >
                                                            <i className="fas fa-minus small"></i>
                                                        </button>
                                                        <span className="mx-2 fw-bold text-dark small" style={{ minWidth: '18px', textAlign: 'center' }}>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-link text-dark p-0 text-decoration-none"
                                                            style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            onClick={() => updateQuantity(item.sku, 1)}
                                                            disabled={item.quantity >= liveStock}
                                                        >
                                                            <i className="fas fa-plus small"></i>
                                                        </button>
                                                    </div>

                                                    <div className="fw-bold text-dark small" style={{ minWidth: '70px', textAlign: 'right' }}>
                                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-danger p-1"
                                                        onClick={() => removeItem(item.sku)}
                                                        title="Remove item"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 p-3 bg-light rounded-4 border small">
                                    <div className="d-flex align-items-center gap-2 text-success fw-semibold mb-1">
                                        <i className="fas fa-shield-alt"></i>
                                        <span>Real-Time Inventory Integration</span>
                                    </div>
                                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                        Upon order confirmation, stock is immediately deducted from the warehouse inventory system.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Checkout & Shipping Form */}
                            <div className="col-lg-5">
                                <form onSubmit={handleConfirmOrder} className="card border-0 bg-light rounded-4 p-4 shadow-sm">
                                    <h6 className="fw-bold text-dark mb-3">Shipping & Checkout</h6>

                                    <div className="mb-2">
                                        <label className="form-label text-muted small mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={shippingDetails.name}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="row g-2 mb-2">
                                        <div className="col-6">
                                            <label className="form-label text-muted small mb-1">Mobile</label>
                                            <input
                                                type="tel"
                                                className="form-control form-control-sm"
                                                value={shippingDetails.mobile}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, mobile: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label text-muted small mb-1">Pincode</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={shippingDetails.pincode}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label text-muted small mb-1">Delivery Address</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={shippingDetails.address}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <label className="form-label text-muted small mb-1">City</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={shippingDetails.city}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label text-muted small mb-1">State</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={shippingDetails.state}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="mb-3">
                                        <label className="form-label text-muted small mb-1 fw-bold">Payment Method</label>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className={`btn btn-sm rounded-3 flex-grow-1 ${paymentMethod === 'cod' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                                                onClick={() => setPaymentMethod('cod')}
                                            >
                                                <i className="fas fa-money-bill-wave me-1"></i> COD
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn btn-sm rounded-3 flex-grow-1 ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                                                onClick={() => setPaymentMethod('upi')}
                                            >
                                                <i className="fas fa-qrcode me-1"></i> UPI
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn btn-sm rounded-3 flex-grow-1 ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                                                onClick={() => setPaymentMethod('card')}
                                            >
                                                <i className="fas fa-credit-card me-1"></i> Card
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pricing breakdown */}
                                    <div className="border-top pt-2 mb-3 small">
                                        <div className="d-flex justify-content-between text-muted py-1">
                                            <span>Subtotal</span>
                                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between text-muted py-1">
                                            <span>GST (18% included)</span>
                                            <span>₹{gst.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between text-muted py-1">
                                            <span>Shipping</span>
                                            <span>{shipping === 0 ? <span className="text-success fw-bold">FREE</span> : `₹${shipping}`}</span>
                                        </div>
                                        <div className="d-flex justify-content-between fw-bold text-dark fs-5 pt-2 border-top">
                                            <span>Total Amount</span>
                                            <span className="text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success py-2.5 rounded-pill fw-bold w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                                        disabled={submitting || cartItems.length === 0}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span> Processing & Deducting Stock…
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-lock"></i> Confirm Order (Minus from Stock)
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
