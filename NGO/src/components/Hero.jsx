import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Play } from 'lucide-react';

import heroImg from '../assets/hero.png';

const Hero = () => {
    return (
        <section className="relative min-vh-100 flex items-center pt-32 pb-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold uppercase tracking-wider shadow-sm"
                        >
                            <Heart size={14} fill="currentColor" />
                            <span>Change Starts With You</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl lg:text-8xl font-black leading-[1.05] text-slate-900 tracking-tight"
                        >
                            Building a <span className="text-rose-600">Brighter</span> Future Together
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed"
                        >
                            Join our mission to empower underprivileged communities through education, healthcare, and sustainable development. Your support creates a ripple effect of hope.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            <button className="px-10 py-5 bg-gradient text-white rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-1 transition-all group">
                                Support Our Mission
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="flex items-center gap-4 text-slate-900 font-bold hover:text-rose-600 transition-colors py-4">
                                <span className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white group-hover:border-rose-300 shadow-sm">
                                    <Play size={20} fill="currentColor" />
                                </span>
                                See Our Impact
                            </button>
                        </motion.div>

                        {/* Stats Summary */}
                        <div className="flex items-center gap-12 pt-8 border-t border-slate-100">
                            <div>
                                <h4 className="text-3xl font-black text-slate-900">12K+</h4>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Lives Impacted</p>
                            </div>
                            <div className="w-px h-12 bg-slate-200" />
                            <div>
                                <h4 className="text-3xl font-black text-slate-900">50+</h4>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Global Projects</p>
                            </div>
                            <div className="w-px h-12 bg-slate-200" />
                            <div>
                                <h4 className="text-3xl font-black text-slate-900">$2.4M</h4>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Funds Raised</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ type: 'spring', damping: 20, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] transform rotate-2 hover:rotate-0 transition-all duration-700">
                            <img
                                src={heroImg}
                                alt="NGO impact"
                                className="w-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>

                        {/* Floating Card */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            className="absolute -bottom-8 -left-8 glass p-6 rounded-3xl shadow-xl z-20 max-w-[280px]"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                                    98%
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 leading-tight">Project Success</h5>
                                    <p className="text-xs text-slate-500">Verified by transparency labs</p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="w-[98%] h-full bg-emerald-500 rounded-full" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
