import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Mail, Home, Info, BookOpen, Layers, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', icon: <Home size={20} />, path: '/' },
        { name: 'Mission', icon: <Info size={20} />, path: '/mission' },
        { name: 'Causes', icon: <Layers size={20} />, path: '/causes' },
        { name: 'Inbox', icon: <Mail size={20} />, path: '/inbox' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 glass shadow-lg' : 'py-6 bg-transparent'}`}>
            <div className="container flex justify-between items-center">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient text-white flex items-center justify-center rounded-xl shadow-lg ring-4 ring-rose-500/20 group-hover:scale-110 transition-transform">
                        <Heart fill="currentColor" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gradient">Luminance NGO</span>
                </NavLink>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `relative flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-rose-600' : 'text-slate-600 hover:text-rose-500'}`
                            }
                        >
                            {link.icon}
                            {link.name}
                            {link.badge && (
                                <span className="absolute -top-1 -right-4 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                                    {link.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                    <button className="bg-gradient text-white px-6 py-2.5 rounded-full font-semibold shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wide">
                        Donate Now
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-slate-200 overflow-hidden"
                    >
                        <div className="container py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`
                                    }
                                >
                                    {link.icon}
                                    {link.name}
                                    {link.badge && <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-xs flex items-center justify-center rounded-full">{link.badge}</span>}
                                </NavLink>
                            ))}
                            <button className="w-full bg-gradient text-white p-4 rounded-xl font-semibold mt-2">
                                Donate Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
