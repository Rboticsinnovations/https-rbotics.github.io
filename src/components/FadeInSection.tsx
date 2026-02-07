import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface FadeInSectionProps {
    children: React.ReactNode;
    delay?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = '0s' }) => {
    const [isVisible, domRef] = useScrollAnimation();
    return (
        <div
            ref={domRef}
            className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: delay }}
        >
            {children}
        </div>
    );
};

export default FadeInSection;
