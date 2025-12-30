'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, StepForward, ArrowRight, Package } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            alert('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/20">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to your ZansMarket account</p>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition placeholder:text-gray-700"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-400">Password</label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition placeholder:text-gray-700"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-blue-500 hover:text-white transition transform active:scale-[0.98] flex items-center justify-center space-x-2 shadow-xl"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <StepForward className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-sm">
                            New Customer? {' '}
                            <Link href="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center space-x-4 grayscale opacity-30">
                    {/* Add social/trust icons if needed */}
                </div>
            </div>
        </div>
    );
}
