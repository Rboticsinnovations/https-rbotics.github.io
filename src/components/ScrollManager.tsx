import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

/**
 * Handles scrolling on navigation:
 * - "/#about" (e.g. clicking About from the Products page) scrolls to that section once it renders
 * - any other route change starts at the top of the page
 */
export const ScrollManager: React.FC = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            // 'instant' overrides the CSS smooth scrolling so a new page opens at the top immediately.
            window.scrollTo({ top: 0, behavior: 'instant' });
            return;
        }
        // The target section may not be mounted yet right after a route change — retry briefly.
        let tries = 0;
        const timer = window.setInterval(() => {
            const el = document.getElementById(hash.slice(1));
            if (el || ++tries > 20) {
                window.clearInterval(timer);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
        return () => window.clearInterval(timer);
    }, [pathname, hash]);

    return null;
};

/** Thin progress bar under the header showing how far the page is scrolled. */
export const ScrollProgressBar: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });
    return (
        <motion.div
            aria-hidden="true"
            style={{
                scaleX,
                transformOrigin: '0% 50%',
                position: 'fixed', top: 0, left: 0, right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                zIndex: 1100,
            }}
        />
    );
};

/** Floating button that appears after scrolling down and smoothly returns to the top. */
export const BackToTopButton: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    aria-label="Back to top"
                    title="Back to top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="back-to-top"
                >
                    <i className="fas fa-arrow-up"></i>
                </motion.button>
            )}
        </AnimatePresence>
    );
};
