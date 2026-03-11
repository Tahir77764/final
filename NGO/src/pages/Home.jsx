import React from 'react';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Target, Zap, Waves, TreePine, GraduationCap, Stethoscope } from 'lucide-react';

const Causes = () => {
    const causes = [
        { title: 'Rural Education', icon: <GraduationCap size={40} />, color: 'bg-indigo-50 text-indigo-600', desc: 'Providing quality education to children in remote villages through mobile schools.' },
        { title: 'Healthcare Access', icon: <Stethoscope size={40} />, color: 'bg-rose-50 text-rose-600', desc: 'Building clinics and providing basic healthcare services to underprivileged families.' },
        { title: 'Clean Water', icon: <Waves size={40} />, color: 'bg-emerald-50 text-emerald-600', desc: 'Installing solar-powered water purification systems in drought-affected areas.' },
        { title: 'Environment', icon: <TreePine size={40} />, color: 'bg-amber-50 text-amber-600', desc: 'Focusing on community forests and restorative agriculture projects for a greener planet.' }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest shadow-sm mb-6"
                    >
                        Our Impact Areas
                    </motion.div>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tightest">Causes We <span className="text-rose-600">Champion</span></h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto mt-6">We focus on long-term, sustainable solutions that address the root causes of poverty and inequality.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {causes.map((cause, i) => (
                        <motion.div
                            key={cause.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] transition-all duration-500"
                        >
                            <div className={`w-20 h-20 rounded-[2rem] ${cause.color} flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                {cause.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{cause.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{cause.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Mission = () => {
    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative rounded-[4rem] mx-4 mb-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#e11d4830,transparent)]" />
            <div className="container relative z-10 flex flex-col lg:flex-row gap-20 items-center">
                <div className="flex-1 space-y-10">
                    <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/10 text-rose-400 text-xs font-black uppercase tracking-widest">
                        Our Mission
                    </div>
                    <h2 className="text-5xl lg:text-8xl font-black tracking-tightest">Fueling <span className="text-rose-500">Dreams</span> with Global Actions.</h2>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">We believe that every human being deserves the right to shine. Our mission is to illuminate the path for those in the shadows of society through direct action and global advocacy.</p>
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500"><Target size={24} /></div>
                            <div><h4 className="font-black text-lg">Goal-Oriented</h4><p className="text-slate-500 text-sm">Targeted impact projects.</p></div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500"><Shield size={24} /></div>
                            <div><h4 className="font-black text-lg">Transparent</h4><p className="text-slate-500 text-sm">100% funds tracking.</p></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full lg:w-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="h-[280px] rounded-[3rem] bg-rose-500/20 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="mission" />
                            </div>
                            <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                                <h4 className="text-rose-500 text-4xl font-black">2026</h4>
                                <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm mt-1">Sustainability Vision</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-12">
                            <div className="p-8 rounded-[3rem] bg-rose-600 border border-white/10 shadow-2xl shadow-rose-600/30">
                                <Zap size={40} fill="white" className="mb-4" />
                                <h4 className="text-white text-3xl font-black">Fast Response</h4>
                                <p className="text-rose-100 text-sm font-medium mt-2 leading-tight">Emergency aid delivery within 24 hours.</p>
                            </div>
                            <div className="h-[280px] rounded-[3rem] bg-rose-500/20 overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="mission" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Home = () => {
    return (
        <div className="overflow-x-hidden">
            <Hero />
            <Causes />
            <Mission />
            {/* Newsletter */}
            <section className="py-24 container">
                <div className="bg-rose-500 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-400 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] opacity-30 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 max-w-xl text-center lg:text-left">
                        <h2 className="text-4xl lg:text-7xl font-black text-white leading-tightest">Stay Updated with Our Journey.</h2>
                        <p className="text-rose-100 text-lg font-medium mt-6">Subscribe to our monthly newsletter to see where your contributions are making a difference.</p>
                    </div>
                    <div className="relative z-10 w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input type="email" placeholder="Your email address" className="px-8 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-rose-200 focus:outline-none focus:ring-2 focus:ring-white transition-all w-full lg:w-[400px]" />
                            <button className="px-10 py-5 bg-white text-rose-600 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">Join Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
