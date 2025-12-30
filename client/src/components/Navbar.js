'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    return (
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hover:opacity-80 transition">
                    <Package className="w-8 h-8 text-blue-500" />
                    <span>ZansMarket</span>
                </Link>

                <div className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/cart" className="group flex items-center space-x-1 text-gray-300 hover:text-white transition relative">
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg transform scale-100 animate-pulse">
                                    {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:block">Cart</span>
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-6">
                            {user.isAdmin && (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href="/admin/dashboard"
                                        className="hidden md:inline-block px-4 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 transition text-xs uppercase tracking-wider font-semibold backdrop-blur-sm"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/admin/products"
                                        className="hidden md:inline-block px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-blue-300 hover:text-blue-200 transition text-xs uppercase tracking-wider font-semibold backdrop-blur-sm"
                                    >
                                        Products
                                    </Link>
                                    <Link
                                        href="/admin/users"
                                        className="hidden md:inline-block px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-purple-300 hover:text-purple-200 transition text-xs uppercase tracking-wider font-semibold backdrop-blur-sm"
                                    >
                                        Users
                                    </Link>
                                    <Link
                                        href="/admin/orders"
                                        className="hidden md:inline-block px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-pink-300 hover:text-pink-200 transition text-xs uppercase tracking-wider font-semibold backdrop-blur-sm"
                                    >
                                        Orders
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 text-gray-300">
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline-block">{user.name}</span>
                            </div>

                            <button
                                onClick={logout}
                                className="flex items-center space-x-1 text-red-500 hover:text-red-400 transition ml-2"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition font-semibold">
                            <User className="w-4 h-4" />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
