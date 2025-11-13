// src/components/common/ScrollToTopOnRouteChange.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that automatically scrolls to top when route changes
 * This fixes the issue where navigation keeps the scroll position
 */
const ScrollToTopOnRouteChange = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top instantly when route changes
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTopOnRouteChange;
