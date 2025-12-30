'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || !user.isAdmin) {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-2 border-blue-500/20 border-t-blue-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-blue-400 animate-pulse" />
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-1">Verifying Credentials</h2>
                    <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Securing Admin Environment</p>
                </div>
            </div>
        );
    }

    if (!user || !user.isAdmin) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div className="p-4 rounded-3xl bg-red-500/10 text-red-500">
                    <ShieldAlert className="w-12 h-12" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-white mb-2">Access Denied</h2>
                    <p className="text-gray-500 max-w-xs mx-auto">You do not have the required permissions to access this area. Redirecting you home...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8 flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/50">
                <ShieldCheck className="w-3 h-3" />
                <span>Encrypted Admin Session Active</span>
            </div>
            {children}
        </motion.div>
    );
}
