import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import InboxPage from './pages/InboxPage';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="pt-24 pb-12 bg-slate-900 overflow-hidden relative border-t border-slate-800">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="container relative z-10">
                <div className="grid lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient text-white flex items-center justify-center rounded-xl shadow-lg ring-4 ring-rose-500/10 group-hover:scale-110 transition-transform">
                                <Heart fill="currentColor" size={24} />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white uppercase">Luminance</span>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed">Illuminate the path of those in need. Join our global community of change-makers today.</p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-500 transition-all">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-black text-white mb-8 uppercase tracking-widest">Our Projects</h4>
                        <ul className="space-y-4">
                            {['Rural Education', 'Medical Camps', 'Safe Water Initiative', 'Women Empowerment', 'Green Planet'].map(link => (
                                <li key={link}><a href="#" className="text-slate-400 hover:text-rose-500 font-medium transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-black text-white mb-8 uppercase tracking-widest">Resources</h4>
                        <ul className="space-y-4">
                            {['Annual Report', 'Impact Gallery', 'Transparency Policy', 'Donation Guide', 'Sponsorship'].map(link => (
                                <li key={link}><a href="#" className="text-slate-400 hover:text-rose-500 font-medium transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-black text-white mb-8 uppercase tracking-widest">Get In Touch</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform"><Mail size={18} /></div>
                                <p className="text-slate-400 font-medium">help@luminance.org</p>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform"><Phone size={18} /></div>
                                <p className="text-slate-400 font-medium">+1 (234) 567-890</p>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform"><MapPin size={18} /></div>
                                <p className="text-slate-400 font-medium">123 Charity Drive, NY</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-800 flex flex-col md:row items-center justify-between gap-6">
                    <p className="text-slate-500 text-sm font-medium">© 2026 Luminance NGO. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inbox" element={<InboxPage />} />
                {/* Placeholder routes */}
                <Route path="/mission" element={<Home />} />
                <Route path="/causes" element={<Home />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
