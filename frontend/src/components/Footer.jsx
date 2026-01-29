import { Link } from 'react-router-dom';
import { FaPaw, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FaPaw className="text-orange-500" />
                            <span className="font-bold text-white">FosterTails</span>
                        </div>
                        <p className="text-sm">Connecting strays with loving homes</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-3 text-sm">Links</h4>
                        <div className="space-y-2 text-sm">
                            <div><Link to="/" className="hover:text-white">Home</Link></div>
                            <div><Link to="/pets" className="hover:text-white">Browse Pets</Link></div>
                            <div><Link to="/ngos" className="hover:text-white">NGOs</Link></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-3 text-sm">Support</h4>
                        <div className="space-y-2 text-sm">
                            <div><Link to="/contact" className="hover:text-white">Contact</Link></div>
                            <div><Link to="/faq" className="hover:text-white">FAQ</Link></div>
                            <div><Link to="/privacy" className="hover:text-white">Privacy</Link></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-3 text-sm">Legal</h4>
                        <div className="space-y-2 text-sm">
                            <div><Link to="/terms" className="hover:text-white">Terms</Link></div>
                            <div><Link to="/about" className="hover:text-white">About</Link></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 text-center text-sm">
                    <p className="flex items-center justify-center gap-1">
                        © 2026 FosterTails. Made with <FaHeart className="text-red-500 text-xs" /> for animals
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;