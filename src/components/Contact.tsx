import React from 'react';
import MotionWrapper from './MotionWrapper';

const Contact: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! We will get back to you soon.");
    };

    return (
        <section id="contact" className="py-5 bg-light">
            <div className="container">
                <MotionWrapper direction="down">
                    <h2 className="text-center mb-5 text-primary fw-bold" style={{ letterSpacing: '2px' }}>CONTACT US</h2>
                </MotionWrapper>

                <div className="row g-5">
                    {/* Contact Info */}
                    <div className="col-md-5">
                        <MotionWrapper direction="right">
                            <h3 className="h4 fw-bold mb-4">Get in Touch</h3>
                            <p className="mb-4 text-muted">
                                We are ready to assist you with your next project. Reach out to us for quotes, consultations, or any inquiries.
                            </p>

                            <div className="d-flex mb-3 align-items-start">
                                <i className="fas fa-map-marker-alt text-primary mt-1 me-3 fs-5"></i>
                                <div>
                                    <h5 className="fw-bold mb-1">Address</h5>
                                    <p className="text-muted mb-0"> street, Tech City, India</p>
                                </div>
                            </div>

                            <div className="d-flex mb-3 align-items-start">
                                <i className="fas fa-phone-alt text-primary mt-1 me-3 fs-5"></i>
                                <div>
                                    <h5 className="fw-bold mb-1">Phone</h5>
                                    <p className="text-muted mb-0">+91 123 456 7890</p>
                                </div>
                            </div>

                            <div className="d-flex mb-4 align-items-start">
                                <i className="fas fa-envelope text-primary mt-1 me-3 fs-5"></i>
                                <div>
                                    <h5 className="fw-bold mb-1">Email</h5>
                                    <p className="text-muted mb-0">info@rboticsinnovations.com</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h5 className="fw-bold mb-3">Follow Us</h5>
                                <div className="d-flex gap-3">
                                    <a href="#" className="btn btn-outline-primary rounded-circle"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#" className="btn btn-outline-primary rounded-circle"><i className="fab fa-twitter"></i></a>
                                    <a href="#" className="btn btn-outline-primary rounded-circle"><i className="fab fa-linkedin-in"></i></a>
                                    <a href="#" className="btn btn-outline-primary rounded-circle"><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* Contact Form */}
                    <div className="col-md-7">
                        <MotionWrapper direction="left" delay={0.2}>
                            <div className="bg-white p-4 rounded shadow-sm">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="name" required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email" required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="subject" className="form-label">Subject</label>
                                            <input type="text" className="form-control" id="subject" required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="message" className="form-label">Message</label>
                                            <textarea className="form-control" id="message" rows={5} required></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary px-4 py-2">Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </MotionWrapper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
