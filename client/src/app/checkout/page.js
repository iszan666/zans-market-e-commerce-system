'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { MapPin, CreditCard, Receipt, Lock, ChevronRight, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cartItems, clearCart, subtotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [loading, setLoading] = useState(false);

    const itemsPrice = subtotal;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const placeOrderHandler = async () => {
        setLoading(true);
        try {
            const order = {
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            };

            const { data } = await api.post('/orders', order);
            clearCart();
            router.push(`/order/${data._id}`);
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <Link href="/cart" className="inline-flex items-center text-gray-400 hover:text-white transition group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Cart
            </Link>

            <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                    <Receipt className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Checkout</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Section */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center mb-8">
                            <MapPin className="w-6 h-6 mr-3 text-blue-400" />
                            <h2 className="text-2xl font-bold text-white">Shipping Information</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-500 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                                    placeholder="123 Main St"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                                    placeholder="New York"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                                    placeholder="10001"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-500 mb-2">Country</label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                                    placeholder="United States"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center mb-8">
                            <CreditCard className="w-6 h-6 mr-3 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4">
                                    <Package className="text-black w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Stripe / Credit Card</p>
                                    <p className="text-gray-500 text-xs">Secure encrypted payment</p>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full border-4 border-blue-500 bg-white"></div>
                        </div>
                    </div>
                </div>

                {/* Summary Column */}
                <div className="space-y-8">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl sticky top-24">
                        <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Grand Total</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-white">${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span className="text-white">${shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax (15%)</span>
                                <span className="text-white">${taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-3xl font-black text-white border-t border-white/10 pt-6 mt-4">
                                <span>Total</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">${totalPrice}</span>
                            </div>
                        </div>

                        <button
                            onClick={placeOrderHandler}
                            disabled={cartItems.length === 0 || loading}
                            className="w-full bg-white text-black font-extrabold py-5 rounded-2xl hover:bg-purple-600 hover:text-white transition transform active:scale-95 flex items-center justify-center shadow-xl shadow-purple-500/10 group mb-6"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                            ) : (
                                <>
                                    <span>Place Order</span>
                                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center text-gray-500 text-xs text-center px-4">
                            <Lock className="w-3 h-3 mr-2" />
                            Your transaction is secured by ZansMarket SSL Encryption
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
