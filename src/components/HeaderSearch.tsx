import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts, getProductsCatalog } from '../data/productsData';
import type { ProductItem } from '../data/productsData';

const MAX_SUGGESTIONS = 6;

interface HeaderSearchProps {
    /** Called after the user picks a result or submits (e.g. to close the mobile menu). */
    onDone?: () => void;
    autoFocus?: boolean;
}

/**
 * Header search box with live product suggestions.
 * - Typing shows matching products (name, brand, category, SKU…)
 * - Click / Enter on a suggestion opens that product
 * - Enter without a highlighted suggestion opens the full results page
 */
const HeaderSearch: React.FC<HeaderSearchProps> = ({ onDone, autoFocus }) => {
    const navigate = useNavigate();
    const listId = useId();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const [catalog, setCatalog] = useState<ProductItem[]>(getProductsCatalog);

    // Keep in sync with admin product edits
    useEffect(() => {
        const sync = () => setCatalog(getProductsCatalog());
        window.addEventListener('products-catalog-updated', sync);
        return () => window.removeEventListener('products-catalog-updated', sync);
    }, []);

    // Close when clicking outside
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const results = useMemo(() => searchProducts(query, catalog), [query, catalog]);
    const suggestions = results.slice(0, MAX_SUGGESTIONS);
    const trimmed = query.trim();

    const finish = () => {
        setOpen(false);
        setHighlight(-1);
        onDone?.();
    };

    const openProduct = (p: ProductItem) => {
        navigate('/products', { state: { productSku: p.sku } });
        setQuery('');
        finish();
    };

    const showAllResults = () => {
        if (!trimmed) return;
        navigate('/products', { state: { search: trimmed } });
        finish();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setHighlight(h => Math.min(h + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight(h => Math.max(h - 1, -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlight >= 0 && suggestions[highlight]) openProduct(suggestions[highlight]);
            else showAllResults();
        } else if (e.key === 'Escape') {
            setOpen(false);
            setHighlight(-1);
        }
    };

    const showDropdown = open && trimmed.length > 0;

    return (
        <div ref={wrapperRef} className="position-relative w-100">
            <div className="input-group bg-light rounded-pill px-3 py-1 border">
                <button
                    type="button"
                    className="input-group-text bg-transparent border-0 text-muted"
                    onClick={showAllResults}
                    aria-label="Search"
                >
                    <i className="fas fa-search"></i>
                </button>
                <input
                    type="search"
                    className="form-control bg-transparent border-0 shadow-none"
                    placeholder="Search products..."
                    aria-label="Search products"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-controls={listId}
                    aria-autocomplete="list"
                    autoFocus={autoFocus}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpen(true); setHighlight(-1); }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={onKeyDown}
                    style={{ fontSize: '0.9rem' }}
                />
            </div>

            {showDropdown && (
                <div
                    id={listId}
                    role="listbox"
                    className="position-absolute start-0 end-0 mt-2 bg-white border rounded-4 shadow overflow-hidden"
                    style={{ zIndex: 1060, minWidth: '300px' }}
                >
                    {suggestions.length === 0 ? (
                        <div className="px-3 py-3 small text-muted">
                            No products found for “{trimmed}”.
                        </div>
                    ) : (
                        <>
                            {suggestions.map((p, i) => (
                                <button
                                    key={p.sku}
                                    type="button"
                                    role="option"
                                    aria-selected={i === highlight}
                                    className={`d-flex align-items-center gap-3 w-100 text-start border-0 px-3 py-2 ${i === highlight ? 'bg-primary-subtle' : 'bg-white'}`}
                                    onMouseEnter={() => setHighlight(i)}
                                    onMouseDown={e => e.preventDefault()} // keep input focus
                                    onClick={() => openProduct(p)}
                                >
                                    <div className="flex-shrink-0 bg-light rounded-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                        {p.imageUrl
                                            ? <img src={p.imageUrl} alt="" style={{ maxWidth: 36, maxHeight: 36, objectFit: 'contain' }} />
                                            : <i className="fas fa-microchip text-primary opacity-75"></i>}
                                    </div>
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <div className="small fw-semibold text-dark text-truncate">{p.name}</div>
                                        <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>
                                            {p.subSubCategory || p.category}
                                        </div>
                                    </div>
                                    <div className="small fw-bold text-dark text-nowrap">₹{p.price.toLocaleString('en-IN')}</div>
                                </button>
                            ))}
                            <button
                                type="button"
                                className="w-100 border-0 border-top bg-light px-3 py-2 small fw-semibold text-primary text-start"
                                onMouseDown={e => e.preventDefault()}
                                onClick={showAllResults}
                            >
                                See all {results.length} result{results.length === 1 ? '' : 's'} for “{trimmed}”
                                <i className="fas fa-arrow-right ms-2"></i>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderSearch;
