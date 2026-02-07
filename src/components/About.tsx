import React from 'react';
import MotionWrapper from './MotionWrapper';

const About: React.FC = () => {
    return (
        <section id="about" className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <MotionWrapper direction="down">
                            <h2 className="text-center mb-5 text-primary fw-bold" style={{ letterSpacing: '2px' }}>ABOUT US</h2>
                        </MotionWrapper>

                        <div className="row align-items-center">
                            <div className="col-md-6 mb-4 mb-md-0">
                                <MotionWrapper direction="right">
                                    <h3 className="h4 fw-bold mb-3">Our Story</h3>
                                    <p className="text-muted">
                                        Rbotics Innovations started with a vision to revolutionize the robotics industry by making advanced technology accessible and adaptable. Our journey began with a small team of passionate engineers and has arrived at a leading hub for robotic solutions.
                                    </p>
                                    <p className="text-muted">
                                        We specialize in creating custom robotic platforms that serve a wide range of industries, from underwater exploration to aerial surveillance. Our commitment to quality and innovation drives everything we do.
                                    </p>
                                </MotionWrapper>
                            </div>
                            <div className="col-md-6">
                                <MotionWrapper direction="left" delay={0.3}>
                                    <div className="p-4 bg-light rounded shadow-sm border border-secondary border-opacity-25">
                                        <h4 className="fw-bold mb-3 text-primary">Why Choose Us?</h4>
                                        <ul className="list-unstyled">
                                            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Custom tailored solutions</li>
                                            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Cutting-edge technology</li>
                                            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> End-to-end manufacturing</li>
                                            <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Expert engineering support</li>
                                        </ul>
                                    </div>
                                </MotionWrapper>
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <MotionWrapper direction="up" delay={0.5}>
                                <p className="fst-italic fs-5 text-secondary">
                                    "Innovating the deep & sky" is not just our motto, it's our promise.
                                </p>
                            </MotionWrapper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
