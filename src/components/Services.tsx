import React from 'react';
import MotionWrapper from './MotionWrapper';

const Services: React.FC = () => {
    return (
        <section id="services" className="py-5 bg-light">
            <div className="container">
                <MotionWrapper direction="up">
                    <h2 className="text-center mb-5 text-primary fw-bold" style={{ letterSpacing: '2px' }}>OUR SERVICES</h2>
                </MotionWrapper>
                <div className="row g-4">
                    {/* Machining & Fabrication */}
                    <div className="col-md-4">
                        <MotionWrapper delay={0.2} className="h-100">
                            <div className="card h-100 shadow border-0 service-card text-center p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                                <div className="text-primary mb-3">
                                    <i className="fas fa-cogs fa-3x"></i>
                                </div>
                                <h4 className="card-title fw-bold">Machining & Custom Fabrication</h4>
                                <p className="card-text text-muted">
                                    Precision CNC machining and custom fabrication solutions tailored to your specific requirements. We turn your designs into robust reality.
                                </p>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* 3D Printing */}
                    <div className="col-md-4">
                        <MotionWrapper delay={0.4} className="h-100">
                            <div className="card h-100 shadow border-0 service-card text-center p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                                <div className="text-primary mb-3">
                                    <i className="fas fa-cube fa-3x"></i>
                                </div>
                                <h4 className="card-title fw-bold">3D Printing Services</h4>
                                <p className="card-text text-muted">
                                    High-quality rapid prototyping and additive manufacturing. From concept models to functional end-use parts.
                                </p>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* Carbon Fiber */}
                    <div className="col-md-4">
                        <MotionWrapper delay={0.6} className="h-100">
                            <div className="card h-100 shadow border-0 service-card text-center p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                                <div className="text-primary mb-3">
                                    <i className="fas fa-feather-alt fa-3x"></i>
                                </div>
                                <h4 className="card-title fw-bold">Custom Carbon Fiber Products</h4>
                                <p className="card-text text-muted">
                                    Lightweight and durable carbon fiber manufacturing services for high-performance applications.
                                </p>
                            </div>
                        </MotionWrapper>
                    </div>
                    {/* Design Assistance */}
                    <div className="col-md-4">
                        <MotionWrapper delay={0.3} className="h-100">
                            <div className="card h-100 shadow border-0 service-card text-center p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                                <div className="text-primary mb-3">
                                    <i className="fas fa-pencil-ruler fa-3x"></i>
                                </div>
                                <h4 className="card-title fw-bold">Design Assistance</h4>
                                <p className="card-text text-muted">
                                    Expert guidance in mechanical and electronic design to optimize your product for manufacturing and performance.
                                </p>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* PCB Designing */}
                    <div className="col-md-4">
                        <MotionWrapper delay={0.5} className="h-100">
                            <div className="card h-100 shadow border-0 service-card text-center p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                                <div className="text-primary mb-3">
                                    <i className="fas fa-microchip fa-3x"></i>
                                </div>
                                <h4 className="card-title fw-bold">PCB Designing</h4>
                                <p className="card-text text-muted">
                                    Professional PCB layout and design services, ensuring reliability and signal integrity for your electronics.
                                </p>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* Battery Packs */}
                    <div className="col-md-4">
                        <MotionWrapper delay={0.7} className="h-100">
                            <div className="card h-100 shadow border-0 service-card text-center p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                                <div className="text-primary mb-3">
                                    <i className="fas fa-battery-full fa-3x"></i>
                                </div>
                                <h4 className="card-title fw-bold">Li-ion Battery Packs</h4>
                                <p className="card-text text-muted">
                                    Custom Lithium-ion battery pack assembly for various applications, prioritizing safety and efficiency.
                                </p>
                            </div>
                        </MotionWrapper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
