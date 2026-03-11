import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Filter, CheckCircle, Trash2, Reply, Star, User, Clock, ArrowLeft, Heart, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const InboxPage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/messages`);
                const data = await response.json();
                if (data.success) {
                    // Filter for NGO related messages (those having hospitalId starting with default_ or containing NGO in name)
                    const ngoMessages = data.data.filter(msg => 
                        msg.hospitalName?.toLowerCase().includes('ngo') || 
                        msg.hospitalId?.startsWith('default_')
                    ).map(msg => ({
                        id: msg._id,
                        sender: msg.donorName,
                        email: msg.donorDetails?.email || 'N/A',
                        subject: msg.subject || "Compatibility Match",
                        summary: msg.message.substring(0, 100) + '...',
                        content: msg.message,
                        time: new Date(msg.createdAt).toLocaleString(),
                        unread: msg.status === 'Unread',
                        important: msg.hospitalName?.includes('Featured'),
                        avatar: msg.donorName?.charAt(0) || 'D',
                        donorDetails: msg.donorDetails,
                        recipientDetails: msg.recipientDetails,
                        recipientName: msg.recipientName
                    }));
                    setMessages(ngoMessages);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredMessages = messages.filter(m =>
        m.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-vh-100 bg-slate-50 pt-28 pb-10">
            <div className="container">
                <div className="flex items-center gap-4 mb-8">
                    <NavLink to="/" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-rose-600 hover:shadow-md transition-all">
                        <ArrowLeft size={18} />
                    </NavLink>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Inbox</h1>
                        <p className="text-slate-500 font-medium">Manage your community interactions</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[380px,1fr] gap-0 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 min-h-[700px]">
                    {/* Sidebar / List */}
                    <div className="border-r border-slate-100 flex flex-col h-full bg-white">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-rose-500 transition-all outline-none text-sm font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                {['All', 'Unread', 'Important'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {filteredMessages.map(message => (
                                <div
                                    key={message.id}
                                    onClick={() => setSelectedMessage(message)}
                                    className={`p-6 cursor-pointer border-b border-slate-50 transition-all relative hover:bg-slate-50 group ${selectedMessage?.id === message.id ? 'bg-rose-50/50' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${message.id % 2 === 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {message.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm truncate pr-4 ${message.unread ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                    {message.sender}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-tighter">
                                                    {message.time}
                                                </span>
                                            </div>
                                            <p className={`text-xs mb-1 truncate ${message.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                                                {message.subject}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate leading-tight">
                                                {message.summary}
                                            </p>
                                        </div>
                                    </div>
                                    {message.unread && (
                                        <div className="absolute right-6 bottom-6 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
                                    )}
                                    {message.important && (
                                        <Star size={12} fill="#fbbf24" className="absolute right-10 bottom-[22px] text-amber-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content View */}
                    <div className="flex flex-col h-full bg-slate-50/10">
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <motion.div
                                    key={selectedMessage.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col h-full"
                                >
                                    {/* Message Header */}
                                    <div className="p-8 pb-4 bg-white border-b border-slate-100">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-2xl shadow-inner">
                                                    {selectedMessage.avatar}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedMessage.sender}</h2>
                                                    <p className="text-sm font-medium text-slate-500">{selectedMessage.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Reply size={20} /></button>
                                                <button className="p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-2xl transition-all"><Star size={20} fill={selectedMessage.important ? 'currentColor' : 'none'} /></button>
                                                <button className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all"><CheckCircle size={20} /></button>
                                                <button className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-slate-800">{selectedMessage.subject}</h3>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                <Clock size={12} />
                                                {selectedMessage.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div className="flex-1 p-8 overflow-y-auto bg-white">
                                        <div className="max-w-3xl">
                                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                                                 {selectedMessage.content}
                                             </div>

                                             {selectedMessage.recipientDetails && (
                                                 <div className="mt-10 p-8 rounded-[2.5rem] bg-rose-50/50 border border-rose-100">
                                                     <div className="flex items-center gap-3 mb-6">
                                                         <div className="p-2 bg-rose-500 text-white rounded-lg shadow-lg shadow-rose-500/20">
                                                             <Activity size={18} />
                                                         </div>
                                                         <h4 className="text-lg font-black text-slate-900">Match Compatibility Breakdown</h4>
                                                     </div>

                                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                                         {Object.entries(selectedMessage.recipientDetails).filter(([key]) => key.startsWith('HLA_')).map(([key, value]) => (
                                                             <div key={key} className="p-4 bg-white rounded-2xl border border-rose-100/50 shadow-sm">
                                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key.replace('HLA_', '').replace('_', ' ')}</p>
                                                                 <p className="text-sm font-black text-rose-600">{value || '---'}</p>
                                                             </div>
                                                         ))}
                                                     </div>

                                                     <div className="grid md:grid-cols-2 gap-6">
                                                         <div className="p-5 bg-white rounded-2xl border border-rose-100/50">
                                                             <div className="flex items-center gap-3 mb-3">
                                                                 <User size={16} className="text-rose-500" />
                                                                 <span className="text-xs font-black text-slate-900 uppercase">Patient Profile</span>
                                                             </div>
                                                             <div className="space-y-1">
                                                                 <p className="text-sm font-bold text-slate-700">{selectedMessage.recipientName}</p>
                                                                 <p className="text-xs font-medium text-slate-500">Blood Group: {selectedMessage.recipientDetails.bloodGroup}</p>
                                                                 <p className="text-xs font-medium text-slate-500">Age: {selectedMessage.recipientDetails.age}</p>
                                                             </div>
                                                         </div>
                                                         <div className="p-5 bg-white rounded-2xl border border-rose-100/50">
                                                             <div className="flex items-center gap-3 mb-3">
                                                                 <Heart size={16} className="text-rose-500" />
                                                                 <span className="text-xs font-black text-slate-900 uppercase">Donor Profile</span>
                                                             </div>
                                                             <div className="space-y-1">
                                                                 <p className="text-sm font-bold text-slate-700">{selectedMessage.sender}</p>
                                                                 <p className="text-xs font-medium text-slate-500">Blood Group: {selectedMessage.donorDetails?.bloodGroup || 'N/A'}</p>
                                                                 <p className="text-xs font-medium text-slate-500">Age: {selectedMessage.donorDetails?.age || 'N/A'}</p>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             )}

                                            <div className="mt-12 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 border-dashed">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Reply</p>
                                                <textarea
                                                    placeholder="Type your message here..."
                                                    className="w-full bg-white rounded-2xl p-4 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-rose-500 transition-all outline-none min-h-[120px] text-sm font-medium shadow-inner"
                                                />
                                                <div className="flex justify-end mt-4">
                                                    <button className="px-8 py-3 bg-gradient text-white rounded-xl font-black shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all text-sm">
                                                        Send Response
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 shadow-xl shadow-rose-500/10">
                                        <Mail size={48} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Select a Message</h3>
                                    <p className="text-slate-500 font-medium max-w-sm">Choose an interaction from the sidebar to view details and respond to your community.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InboxPage;
