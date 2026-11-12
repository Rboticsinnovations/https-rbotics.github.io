import { useEffect } from 'react';
import { SITE_URL } from '../data/servicesData';

const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
};

/** Canonical URL for with "/" bub Pages serves them as folders. */
export const canonicalUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/$/, '')}/`);

/**
 * Update the page <title>, description, canonical and social tags when a route renders.
 * (Build time also writes these into each page's HTML — see vite.config.ts — so crawlers
 * that don't run JavaScript still get them.)
 */
export const usePageMeta = (title: string, description: string, path: string) => {
    useEffect(() => {
        const url = canonicalUrl(path);
        document.title = title;
        setMeta('meta[name="description"]', 'content', description);
        setMeta('link[rel="canonical"]', 'href', url);
        setMeta('meta[property="og:title"]', 'content', title);
        setMeta('meta[property="og:description"]', 'content', description);
        setMeta('meta[property="og:url"]', 'content', url);
        setMeta('meta[name="twitter:title"]', 'content', title);
        setMeta('meta[name="twitter:description"]', 'content', description);
    }, [title, description, path]);
};
