import React from 'react';
import MotionWrapper from './MotionWrapper';
import { SERVICES } from '../data/servicesData';

const Services: React.FC = () => {
    return (
        <section id="services" className="py-5 bg-light">
            <div className="container">
                <MotionWrapper direction="up">
                    <h2 className="text-center mb-3 text-primary fw-bold" style={{ letterSpacing: '2px' }}>OUR SERVICES</h2>
                </MotionWrapper>

                {/* Visible summary of every service — this text is what search engines match against */}
                <MotionWrapper direction="up" delay={0.1}>
                    <p className="text-center text-muted mx-auto mb-5" style={{ maxWidth: '760px' }}>
                        RBOTICS Innovations in Vizianagaram, Andhra Pradesh offers <strong>3D printing services</strong>,{' '}
                        <strong>CNC machining &amp; custom fabrication</strong>, <strong>custom carbon fiber products</strong>,{' '}
                        <strong>PCB designing</strong>, <strong>design assistance</strong> and{' '}
                        <strong>custom Li-ion battery packs</strong> for robotics, drones and engineering projects.
                    </p>
                </MotionWrapper>

                <div className="row g-4">
                    {SERVICES.map((service, i) => (
                        <div className="col-md-4" key={service.id} id={service.id}>
                            <MotionWrapper delay={0.2 + (i % 3) * 0.2} className="h-100">
                                <div
                                    className="card h-100 shadow border-0 service-card text-center p-4"
                                    style={{ background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}
                                >
                                    <div className="text-primary mb-3">
                                        <i className={`fas ${service.icon} fa-3x`} aria-hidden="true"></i>
                                    </div>
                                    <h3 className="h4 card-title fw-bold">{service.name}</h3>
                                    <p className="card-text text-muted">{service.summary}</p>
                                </div>
                            </MotionWrapper>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
