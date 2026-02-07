import React from 'react';
import { motion } from 'framer-motion';
import MotionWrapper from './MotionWrapper';
import heroBg from '../assets/backgroung-img.jpeg';

const Hero: React.FC = () => {
    return (
        <section id="home" className="d-flex align-items-center justify-content-center text-center text-white position-relative overflow-hidden" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBg})`, // Slightly darker overlay for better text contrast
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: 'calc(100vh - 56px)',
            marginTop: '56px'
        }}>
            {/* Animated Drone (Left to Right) */}
            <motion.div
                initial={{ x: '-10vw', y: '20vh', opacity: 0 }}
                animate={{
                    x: ['-10vw', '110vw'],
                    y: ['20vh', '25vh', '15vh', '20vh'], // Wave motion
                }}
                transition={{
                    x: { duration: 15, repeat: Infinity, ease: "linear" },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.5, delay: 0.5 }
                }}
                className="position-absolute"
                style={{ top: 0, left: 0, zIndex: 1 }}
            >
                <i className="fas fa-helicopter fs-1 text-white-50" style={{ transform: 'rotate(15deg) scale(1.5)' }}></i>
            </motion.div>

            {/* Animated ROV/Robot (Right to Left) */}
            <motion.div
                initial={{ x: '110vw', y: '60vh', opacity: 0 }}
                animate={{
                    x: ['110vw', '-10vw'],
                    y: ['60vh', '65vh', '55vh', '60vh']
                }}
                transition={{
                    x: { duration: 20, repeat: Infinity, ease: "linear", delay: 2 },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.5, delay: 2.5 }
                }}
                className="position-absolute"
                style={{ top: 0, left: 0, zIndex: 1 }}
            >
                <i className="fas fa-robot fs-1 text-white-50" style={{ transform: 'scale(1.5)' }}></i>
            </motion.div>

            {/* Animated Plane/Drone 2 (Top Left to Bottom Right Diagonal) */}
            <motion.div
                initial={{ x: '-10vw', y: '-10vh', opacity: 0 }}
                animate={{
                    x: ['-10vw', '110vw'],
                    y: ['-10vh', '110vh']
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5
                }}
                className="position-absolute"
                style={{ top: 0, left: 0, zIndex: 1 }}
            >
                <i className="fas fa-plane-up fs-2 text-white-50" style={{ transform: 'rotate(45deg)' }}></i>
            </motion.div>


            <div className="container position-relative" style={{ zIndex: 2 }}>
                <MotionWrapper direction="down" duration={1}>
                    <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: 'Cinzel, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        Explore more. Build smarter. Move anywhere.
                    </h1>
                </MotionWrapper>
                <MotionWrapper direction="up" delay={0.3} duration={1}>
                    <p className="lead fs-3 mb-5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Advanced Robotics Solutions for Modern Challenges
                    </p>
                </MotionWrapper>

                <MotionWrapper delay={0.6} direction="up">
                    <a href="#products" className="btn btn-outline-light btn-lg rounded-pill px-5 py-2 fw-bold shadow-sm" style={{ borderWidth: '2px', letterSpacing: '1px' }}>
                        DISCOVER OUR TECH
                    </a>
                </MotionWrapper>
            </div>

            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 2 }}>
                <div className="scroll-indicator animate-bounce">
                    <i className="fas fa-chevron-down fs-2 text-white"></i>
                </div>
            </div>
        </section>
    );
};

export default Hero;
