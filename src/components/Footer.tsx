import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} Rbotics Innovations. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
