import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope,
    Heart,
    Activity,
    Shield,
    Clock,
    MapPin,
    Phone,
    Mail,
    User,
    Send,
    ChevronRight,
    Menu,
    X,
    Award,
    Users,
    Building,
    MessageSquare,
    Inbox,
    Trash2,
    CheckCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="glass-effect" style={{
            position: 'fixed',
            top: '1.5rem',
            left: '5%',
            right: '5%',
            height: '4.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 1000,
            margin: '0 auto',
            width: '90%',
            border: '1px solid var(--glass-border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    background: 'var(--gradient-1)',
                    padding: '0.6rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                }}>
                    <Stethoscope size={24} color="white" />
                </div>
                <span className="outfit" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                    Health<span className="text-gradient">First</span>
                </span>
            </div>

            <div className="desktop-menu" style={{ display: 'flex', gap: '2.5rem' }}>
                {['Home', 'About', 'Services', 'Doctors', 'Inbox'].map((item) => (
                    <motion.a
                        key={item}
                        href={`#${item.toLowerCase() === 'inbox' ? 'received-messages' : item.toLowerCase()}`}
                        whileHover={{ y: -2 }}
                        style={{
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            transition: 'var(--transition)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                    >
                        {item === 'Inbox' && <Inbox size={16} />}
                        {item}
                    </motion.a>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    background: 'var(--gradient-1)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    boxShadow: '0 10px 20px -5px rgba(14, 165, 233, 0.4)'
                }}
            >
                Book Appointment
            </motion.button>
        </nav>
    );
};

const Hero = () => (
    <section id="home" style={{
        paddingTop: '160px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        minHeight: '90vh'
    }}>
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                <Shield size={20} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Trusted for Generations</span>
            </div>
            <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 800 }}>
                Providing <span className="text-gradient">Premium</span> Healthcare for You.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
                Experience the future of medical treatment with our state-of-the-art facilities and world-class specialists dedicated to your well-being.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    style={{
                        background: 'var(--gradient-1)',
                        padding: '1.2rem 2.5rem',
                        borderRadius: '16px',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    Explore Services <ChevronRight size={20} />
                </motion.button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass-effect" style={{ padding: '0.8rem', borderRadius: '50%' }}>
                        <Activity color="var(--primary)" size={24} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>24/7</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Emergency Support</div>
                    </div>
                </div>
            </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ position: 'relative' }}
        >
            <div style={{
                width: '100%',
                height: '600px',
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <img src="/hero.png" alt="Hospital Interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="glass-effect"
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    right: '-2rem',
                    padding: '1.5rem',
                    width: '220px'
                }}
            >
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Successful Surgeries</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>15,000+</div>
                <div style={{ marginTop: '0.5rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ width: '85%', height: '100%', background: 'var(--gradient-1)', borderRadius: '2px' }}></div>
                </div>
            </motion.div>
        </motion.div>
    </section>
);

const Services = () => {
    const services = [
        { title: 'Cardiology', icon: <Heart size={32} />, desc: 'Expert care for your heart with advanced diagnostics.' },
        { title: 'Neurology', icon: <Activity size={32} />, desc: 'Comprehensive treatment for neurological disorders.' },
        { title: 'Emergency', icon: <Clock size={32} />, desc: 'Rapid response critical care available 24 hours a day.' },
        { title: 'Modern Labs', icon: <Building size={32} />, desc: 'Accurate and fast results from our high-tech laboratories.' },
    ];

    return (
        <section id="services">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Specialized <span className="text-gradient">Services</span></h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    We provide a wide range of medical services with a focus on precision and patient comfort.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {services.map((service, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10, borderColor: 'var(--primary)' }}
                        className="glass-effect"
                        style={{ padding: '3rem 2rem', border: '1px solid var(--glass-border)', transition: 'var(--transition)' }}
                    >
                        <div style={{
                            background: 'rgba(14, 165, 233, 0.1)',
                            width: '64px',
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '16px',
                            color: 'var(--primary)',
                            marginBottom: '1.5rem'
                        }}>
                            {service.icon}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{service.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{service.desc}</p>
                        <a href="#" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            Learn More <ChevronRight size={18} />
                        </a>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const Message = ({ onMessageReceived }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newMessage = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            time: new Date().toLocaleTimeString()
        };

        onMessageReceived(newMessage);

        toast.success('Message Received! We will contact you soon.', {
            duration: 4000,
            position: 'bottom-center',
            style: {
                background: '#0ea5e9',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 600
            }
        });
        e.target.reset();
    };

    return (
        <section id="message">
            <div className="glass-effect" style={{
                padding: '4rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gap: '4rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Send a <span className="text-gradient">Message</span></h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        Have questions or want to book an appointment? Send us a message and our team will get back to you shortly.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {[
                            { icon: <Phone />, text: '+1 (555) 000-1234', label: 'Call us' },
                            { icon: <Mail />, text: 'contact@healthfirst.com', label: 'Email us' },
                            { icon: <MapPin />, text: '123 Medical Plaza, New York, NY', label: 'Visit us' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    color: 'var(--primary)',
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '0.8rem',
                                    borderRadius: '12px'
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                                    <div style={{ fontWeight: 600 }}>{item.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                            <input
                                required
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                            <input
                                required
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subject</label>
                        <select name="subject" style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: 'white',
                            outline: 'none'
                        }}>
                            <option>General Inquiry</option>
                            <option>Appointment Request</option>
                            <option>Feedback</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
                        <textarea
                            required
                            name="message"
                            rows="5"
                            placeholder="Your message here..."
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                padding: '1rem',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                resize: 'none'
                            }}
                        ></textarea>
                    </div>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, background: 'var(--gradient-hover)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'var(--gradient-1)',
                            padding: '1.2rem',
                            borderRadius: '12px',
                            color: 'white',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            marginTop: '1rem',
                            boxShadow: '0 10px 20px -5px rgba(14, 165, 233, 0.4)'
                        }}
                    >
                        Send Message <Send size={20} />
                    </motion.button>
                </form>
            </div>
        </section>
    );
};

const MessageModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
                background: 'rgba(2, 6, 23, 0.85)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: '#0f172a',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '3rem',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'var(--text-secondary)', background: 'transparent' }}
                >
                    <X size={24} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--gradient-1)', padding: '0.8rem', borderRadius: '12px', color: 'white' }}>
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Match <span className="text-gradient">Details</span></h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Received on {message.time}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
                    {/* Patient Section */}
                    <div className="glass-effect" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={18} /> Patient Information
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                                <span style={{ fontWeight: 600 }}>{message.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Blood Group:</span>
                                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{message.recipientDetails?.bloodGroup || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Age:</span>
                                <span style={{ fontWeight: 600 }}>{message.recipientDetails?.age || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Donor Section */}
                    <div className="glass-effect" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Heart size={18} /> Donor Information
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                                <span style={{ fontWeight: 600 }}>{message.donor}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Blood Group:</span>
                                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{message.donorDetails?.bloodGroup || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Contact:</span>
                                <span style={{ fontWeight: 600 }}>{message.donorDetails?.phone || 'Restricted'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HLA Typing Details */}
                <div className="glass-effect" style={{ padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Activity size={20} /> HLA Matching Breakdown
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                        {Object.entries(message.recipientDetails || {}).filter(([key]) => key.startsWith('HLA_')).map(([key, value]) => (
                            <div key={key} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                    {key.replace('HLA_', '').replace('_', ' ')}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>{value || '---'}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', fontWeight: 600, textAlign: 'center' }}>
                        {message.message}
                    </div>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{ background: 'var(--gradient-1)', padding: '1rem 3rem', borderRadius: '12px', color: 'white', fontWeight: 700, fontSize: '1rem' }}
                    >
                        Close Details
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ReceivedMessages = ({ messages, onDelete, onSelect }) => {
    return (
        <section id="received-messages" style={{ padding: '100px 5%' }}>
            <div className="glass-effect" style={{ padding: '3rem', borderRadius: '24px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    borderBottom: '1px solid var(--glass-border)',
                    paddingBottom: '2rem'
                }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hospital <span className="text-gradient">Inbox</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>You have {messages.length} incoming inquiries from patients.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="glass-effect" style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                            Real-time Portal
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <AnimatePresence mode="popLayout">
                        {messages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    padding: '5rem 2rem',
                                    textAlign: 'center',
                                    color: 'var(--text-secondary)',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '16px',
                                    border: '1px dashed var(--glass-border)'
                                }}
                            >
                                <Inbox size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>No messages yet</div>
                                <p style={{ fontSize: '0.9rem' }}>Patient inquiries will appear here as soon as they are sent.</p>
                            </motion.div>
                        ) : (
                            messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-effect"
                                    style={{
                                        padding: '1.5rem',
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr auto',
                                        gap: '1.5rem',
                                        alignItems: 'center',
                                        transition: 'var(--transition)',
                                        borderColor: 'rgba(255,255,255,0.05)',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => onSelect(msg)}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                                >
                                    <div style={{
                                        background: 'var(--gradient-1)',
                                        width: '48px', height: '48px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: '12px', color: 'white'
                                    }}>
                                        <User size={24} />
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.3rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{msg.name}</span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                background: 'rgba(14, 165, 233, 0.1)',
                                                color: 'var(--primary)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '100px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}>
                                                {msg.subject}
                                            </span>
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{msg.email}</div>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{msg.message}</p>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{msg.time}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button style={{ color: 'var(--text-secondary)', background: 'transparent' }} title="Mark as Read">
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                style={{ color: 'var(--accent)', background: 'transparent' }}
                                                title="Delete"
                                                onClick={() => onDelete(msg.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="glass-effect" style={{
        marginTop: '5rem',
        padding: '4rem 5%',
        borderTop: '1px solid var(--glass-border)',
        borderRadius: '0'
    }}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '4rem',
            marginBottom: '4rem'
        }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Stethoscope size={24} color="var(--primary)" />
                    <span className="outfit" style={{ fontSize: '1.4rem', fontWeight: 700 }}>HealthFirst</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Leading the way in medical excellence, trusted care, and premium patient experiences.
                </p>
            </div>
            <div>
                <h4 className="outfit" style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <a href="#">Find a Doctor</a>
                    <a href="#">Health Services</a>
                    <a href="#">Online Bill Pay</a>
                    <a href="#">Patient Portal</a>
                </div>
            </div>
            <div>
                <h4 className="outfit" style={{ marginBottom: '1.5rem' }}>Specialties</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <a href="#">Cardiology</a>
                    <a href="#">Neurology</a>
                    <a href="#">Pediatrics</a>
                    <a href="#">Oncology</a>
                </div>
            </div>
            <div>
                <h4 className="outfit" style={{ marginBottom: '1.5rem' }}>Newsletter</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>Subscribe to get latest health tips and news.</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            color: 'white',
                            width: '100%'
                        }}
                    />
                    <button style={{ background: 'var(--primary)', padding: '0.8rem', borderRadius: '8px', color: 'white' }}>
                        Join
                    </button>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            © 2026 HealthFirst Hospital. All rights reserved.
        </div>
    </footer>
);

export default function App() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const API_BASE_URL = "http://localhost:5000";

    // Fetch messages from backend
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/messages/all`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    // Filter: Only show messages meant for hospitals (not NGO/Default partners)
                    const hospitalMessages = data.filter(msg => 
                        !msg.hospitalName?.toLowerCase().includes('ngo') && 
                        !msg.hospitalId?.startsWith('default_')
                    );

                    // Map backend data to local message format
                    const formatted = hospitalMessages.map(msg => ({
                        id: msg._id,
                        name: msg.recipientName,
                        email: msg.donorDetails?.email || 'N/A',
                        subject: "Match Found",
                        message: msg.message,
                        time: new Date(msg.createdAt).toLocaleString(),
                        donor: msg.donorName,
                        donorDetails: msg.donorDetails,
                        recipientDetails: msg.recipientDetails
                    }));
                    setMessages(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
                toast.error("Failed to connect to backend server.");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        // Poll every 10 seconds for new matches
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleNewMessage = async (msg) => {
        // This is for the manual contact form in the hospital website
        try {
            const response = await fetch(`${API_BASE_URL}/api/messages/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hospitalName: "HealthFirst Hospital", // Hardcoded for this demo
                    recipientName: msg.name,
                    donorName: "General Inquiry",
                    message: msg.message,
                    donorDetails: { email: msg.email }
                })
            });
            const result = await response.json();
            if (result.data) {
                const newMsg = {
                    id: result.data._id,
                    name: result.data.recipientName,
                    email: result.data.donorDetails?.email,
                    subject: "Inquiry",
                    message: result.data.message,
                    time: new Date(result.data.createdAt).toLocaleString()
                };
                setMessages(prev => [newMsg, ...prev]);
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/messages/${id}`, { method: 'DELETE' });
            setMessages(prev => prev.filter(m => m.id !== id));
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Toaster />
            <Navbar />
            <Hero />
            <Services />
            <Message onMessageReceived={handleNewMessage} />
            <ReceivedMessages
                messages={messages}
                onDelete={handleDeleteMessage}
                onSelect={setSelectedMessage}
            />

            <AnimatePresence>
                {selectedMessage && (
                    <MessageModal
                        message={selectedMessage}
                        onClose={() => setSelectedMessage(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />

            {/* Floating Message Icon */}
            <motion.a
                href="#message"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 999,
                    background: 'var(--gradient-1)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 15px 35px -10px rgba(14, 165, 233, 0.5)',
                    cursor: 'pointer'
                }}
            >
                <MessageSquare size={28} />
            </motion.a>
        </div>
    );
}
