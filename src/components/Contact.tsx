import React, { useState } from 'react';
import MotionWrapper from './MotionWrapper';

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    mobile: string;
    subject: string;
    message: string;
    submittedAt: string;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await new Promise(r => setTimeout(r, 700));

        const submission: ContactSubmission = {
            id: `contact-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            subject: formData.subject,
            message: formData.message,
            submittedAt: new Date().toISOString(),
        };

        const existing = localStorage.getItem('rbotics_contact_submissions');
        const all: ContactSubmission[] = existing ? JSON.parse(existing) : [];
        all.push(submission);
        localStorage.setItem('rbotics_contact_submissions', JSON.stringify(all));

        setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
        setSubmitted(true);
        setLoading(false);

        setTimeout(() => setSubmitted(false), 5000);
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
                                    <p className="text-muted mb-0"> Ayyakoneru east bund, Vizianagaram, Andhrapradesh, India, 535002</p>
                                </div>
                            </div>

                            <div className="d-flex mb-3 align-items-start">
                                <i className="fas fa-phone-alt text-primary mt-1 me-3 fs-5"></i>
                                <div>
                                    <h5 className="fw-bold mb-1">Phone Number</h5>
                                    <p className="text-muted mb-0">+91 9951256658</p>
                                </div>
                            </div>

                            <div className="d-flex mb-4 align-items-start">
                                <i className="fas fa-envelope text-primary mt-1 me-3 fs-5"></i>
                                <div>
                                    <h5 className="fw-bold mb-1">Email</h5>
                                    <p className="text-muted mb-0">santosh@rbotics.in</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h5 className="fw-bold mb-3">Follow Us</h5>
                                <div className="d-flex gap-3">
                                    <a href="#" className="btn btn-outline-primary rounded-circle" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#" className="btn btn-outline-primary rounded-circle" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                                    <a href="#" className="btn btn-outline-primary rounded-circle" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                                    <a 
                                        href="https://www.instagram.com/rbotics_innovations?stkn=MW80cGc2N3A4aWRkaQ==" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-outline-primary rounded-circle"
                                        aria-label="Instagram"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* Contact Form */}
                    <div className="col-md-7">
                        <MotionWrapper direction="left" delay={0.2}>
                            <div className="bg-white p-4 rounded shadow-sm">
                                {submitted && (
                                    <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                                        <i className="fas fa-check-circle fs-5"></i>
                                        <div>
                                            <strong>Message sent!</strong> Thank you for reaching out. We will get back to you soon.
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="contact-name" className="form-label">Name</label>
                                            <input
                                                type="text" className="form-control" id="contact-name"
                                                name="name" value={formData.name} onChange={handleChange} required
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="contact-email" className="form-label">Email</label>
                                            <input
                                                type="email" className="form-control" id="contact-email"
                                                name="email" value={formData.email} onChange={handleChange} required
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="contact-mobile" className="form-label">Mobile Number</label>
                                            <input
                                                type="tel" className="form-control" id="contact-mobile"
                                                name="mobile" value={formData.mobile} onChange={handleChange} required
                                                placeholder="+91 9876543210"
                                                pattern="[+]?[0-9\s\-]{7,15}"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="contact-subject" className="form-label">Subject</label>
                                            <input
                                                type="text" className="form-control" id="contact-subject"
                                                name="subject" value={formData.subject} onChange={handleChange} required
                                                placeholder="What's this about?"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="contact-message" className="form-label">Message</label>
                                            <textarea
                                                className="form-control" id="contact-message"
                                                name="message" value={formData.message} onChange={handleChange}
                                                rows={5} required placeholder="Write your message here..."
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className="btn btn-primary px-4 py-2"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending…</>
                                                ) : (
                                                    <><i className="fas fa-paper-plane me-2"></i>Send Message</>
                                                )}
                                            </button>
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
