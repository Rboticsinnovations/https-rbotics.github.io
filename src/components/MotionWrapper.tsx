import React, { useRef } from 'react';
import { motion, useInView, type UseInViewOptions } from 'framer-motion';

interface MotionWrapperProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    className?: string;
    viewport?: UseInViewOptions;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
    children,
    delay = 0,
    direction = 'up',
    duration = 0.8,
    className = '',
    viewport = { once: true, amount: 0.1 }
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport);

    const getVariants = () => {
        switch (direction) {
            case 'up':
                return {
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                };
            case 'down':
                return {
                    hidden: { opacity: 0, y: -50 },
                    visible: { opacity: 1, y: 0 }
                };
            case 'left':
                return {
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'right':
                return {
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'none':
            default:
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                };
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={getVariants()}
            transition={{ duration, delay, type: "spring", bounce: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default MotionWrapper;
