import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">Community App</h3>
                        <p className="text-gray-400 text-sm">Connect, Share, Grow Together</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                        <div className="text-sm text-gray-400">
                            © {new Date().getFullYear()} Community App. All rights reserved.
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;